import URL from './url';
import component from '../lib/component';

/**
 * 父级页面，需要根据key来保存消息来源iframe或component的对象和打开的iframe或component的dom
 * @type json
 */
let dialogHash = {};

/**
 * 子级页面，需要根据key缓存一个promise的resolve方法，当收到数据时
 * 直接调用该resolve，让对外的promise更新状态
 * @type json
 */
let dialogWaitHash = {};

/**
 * 订阅消息
 * @type json
 */
let subscriber = {};

/**
 * postmessage的消息类型枚举类
 * @type {{open_IframeDialog: string, closedialog: string, recievedata: string, openComponentDialog: string}}
 */
export const PMENUM = {
    open_iframe_dialog: '0',
    close_dialog: '1',
    recieve_data: '2',
    open_component_dialog: '3',
    iframe_active: '4',
    iframe_silent: '5'
}


/**
 * 本系统所有postmessage的消息体规范如下
 * {
 *    type: '',     消息类型，必须，字符串类型
 *    key:  '',     消息的标志符，（部分消息类型必须有）字符串类型
 *    data: {},     消息所带的数据，可有可无，json格式
 * }
 */
window.addEventListener('message', function(event) {

    let data = event.data;

    if (data.type !== undefined) {

        // 如果有订阅，先触发订阅的回调函数
        subscriber[data.type] && subscriber[data.type](data);

        // 以下内容需要重新梳理逻辑，重构以下
        switch (data.type){
            case PMENUM.open_component_dialog:
                let elementDiv =$('<div></div>');
                dialogHash[data.key] = {
                    iframe: event.source,
                    element: elementDiv.appendTo(document.body)
                };
                let compConf = PMAPI.deserializeComponent(data.component);
                let comp = new class extends component{
                    constructor(){super(compConf);}
                };
                comp['key']=data.key;
                comp.render(elementDiv);
                dialogHash[data.key].element.dialog(data.frame);
                break;
            case PMENUM.open_iframe_dialog:
                let url = URL.getUrl(data.url, {key: data.key});
                let element = $(`<iframe src="${url}">`);
                dialogHash[data.key] = {
                    iframe: event.source,
                    element: element.appendTo(document.body)
                };
                dialogHash[data.key].element.dialog(data.frame);
                break;
            case PMENUM.close_dialog:
                dialogHash[data.key].element.dialog('destroy').remove();
                PMAPI.sendToChild(dialogHash[data.key].iframe,{
                    type: PMENUM.recieve_data,
                    key: data.key,
                    data: data.data
                });
                delete dialogHash[data.key];
                break;
            case PMENUM.recieve_data:
                dialogWaitHash[data.key](data.data);
                delete dialogWaitHash[data.key];
                break;
            default:
                console.log('postmsg listener: unsupported message');
        }
    }

    // 没找到type的消息一概不处理

});


export const PMAPI = {
    /**
     * 生成key的counter的起点
     * @type {number}
     */
    starter:new Date().getTime(),

    /**
     * 内部方法，生成一个唯一的key，作为标志
     * @return {string}
     */
    _getKey:function() {
        return 'iframedialog-' + PMAPI.starter++;
    },

    /**
     * 自定义订阅postmessage的消息
     * 在外部的使用方式为：
     * PMAPI.subscribe(PMENUM.setiframestatus, (data) => {})
     * @param channel
     * @param callback
     */
    subscribe: function(channel, callback) {
        subscriber[channel] = callback;
    },

    /**
     * 将消息发送给调用的父组件
     * @param data
     */
    sendToParent: function(data) {
        window.parent.postMessage(data, location.origin);
    },

    /**
     * 将消息发送给指定的iframe
     * @param iframe
     * @param msg
     */
    sendToChild: function(iframe, msg) {
        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg,location.origin);
        }
    },

    /**
     * 根据url，在父级打开一个iframe的弹出框
     * @param url
     * @frame 对话框设置，包括大小，标题等，例：{
     *          width: 500,
     *          height: 200,
     *          title: 'Iframe页面'
     *      }
     * @return Promise
     */
    openDialogByIframe: function(url,frame) {
        return new Promise(function(resolve) {
            let key = PMAPI._getKey();
            dialogWaitHash[key] = resolve;
            PMAPI.sendToParent({
                type: PMENUM.open_iframe_dialog,
                key: key,
                url: url,
                frame:frame
            });
        });
    },

    /**
     * 传入组件配置，然后在父级生成一个该组件配置的组件
     * 然后用dialog弹出,该方法性能优于iframe方式，较简单的弹出框用此方法
     * 注意：该组件配置必须为简单组件，所有用到的变量必须为内部变量
     * @param componentConfig 简单组件的配置
     * @frame 对话框设置，包括大小，标题等，例：{
     *          width: 500,
     *          height: 200,
     *          title: '组件页面'
     *      }
     */
    openDialogByComponent: function(componentConfig,frame) {
        return new Promise(function(resolve) {
            let key = PMAPI._getKey();
            console.log(key);
            dialogWaitHash[key] = resolve;
            window.parent.postMessage({
                type: PMENUM.open_component_dialog,
                key: key,
                component: PMAPI.serializeComponent(componentConfig),
                frame:frame
            }, location.origin);
        });
    },

    /**
     * 将组件配置转化为字符串
     * @param componentConfig ComponentConfig，注意该配置中的function不能使用配置外部的其他方法和常量
     * @returns string
     */
    serializeComponent: function(componentConfig) {
        if (typeof componentConfig === 'number'
            || typeof componentConfig === 'boolean'){
            return '' + componentConfig;
        }else if (typeof componentConfig === 'string'){
            return '"' + componentConfig + '"';
        } else if (componentConfig instanceof Function){
            let str = String(componentConfig);
            let source = PMAPI._removeAllComments(str.substring(str.indexOf('{')+1,str.lastIndexOf('}')));
            return '{"Function":"'+str.substring(str.indexOf('function ')+9,str.indexOf('('))+'", '
                +'"Arguments":"'+str.substring(str.indexOf('(')+1,str.indexOf(')')) +'", '
                +'"Source":"'+source.replace(/\n/g,'').replace(/\"/g,"'")+'"}';
        } else if (Array.isArray(componentConfig)) {
            if (componentConfig[0] === undefined){
                return '[]';
            } else {
                let arrVals = [];
                componentConfig.forEach(function (el) {
                    arrVals.push(PMAPI.serializeComponent(el));
                });
                return '[' + arrVals + ']';
            }
        } else if (componentConfig instanceof Object) {
            let objKeys = Object.keys(componentConfig);
            let arrOfKeyVals = [];
            objKeys.forEach((key)=> {
                if(componentConfig[key]==undefined){
                    return;
                }
                arrOfKeyVals.push('"' + key + '":'+PMAPI.serializeComponent(componentConfig[key]));
            });
            return '{' + arrOfKeyVals + '}';
        }
    },

    /**
     * 反序列化组件配置, 直接根据配置字符串，直接返回一个组件
     * @param componentString 由searializeComponent序列化过的一个componentConfig字符串
     * @return ComponentConfig
     */
    deserializeComponent(componentString) {
        let obj = JSON.parse(componentString);
        PMAPI._createFuncs(obj);
        return obj;
    },

    /**
     * 内部方法：从JSON中遍历找出所有function配置，生成对应function
     * @param obj 待转换为componentConfig的JSON
     */
    _createFuncs(obj){
        let keys = Object.keys(obj);
        keys.forEach(key=>{
            if(obj[key]['Function']){
                let args = obj[key]['Arguments']||"";
                let source = obj[key]['Source'];
                let fstr = "function "+obj[key]['Function']+"("+args+"){"+source+"}";
                let f= new Function("return "+fstr)();
                obj[key]=f;
            } else if(obj[key] instanceof Object){
                PMAPI._createFuncs(obj[key]);
            }
        })
    },
    /**
     * 内部方法：用于去除源代码中的所有注释
     * @param str 方法源代码
     * @returns {*}去除了所有注释的源代码
     */
    _removeAllComments(str){
        let start = str.indexOf('//');
        if(start == -1){
            return str;
        }
        let end = str.indexOf('\n',start);
        return PMAPI._removeAllComments(str.replace(str.substring(start,end),''));
    }

}

