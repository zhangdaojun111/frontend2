import URL from './url';
import component from '../lib/component';
import {HTTP} from './http';
import './jquery-ui.dialog';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

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
    iframe_silent: '5',
    table_invalid: '6',              // 表格数据失效
    on_the_way_invalid: '7',         // 在途数据失效
    data_invalid: '11',
    open_iframe_params: '8',
    get_param_from_root: '9',        // 来自子框架的消息，需要获取iframe的参数
    send_param_to_iframe: '10',       // 来组主框架的消息，向iframe发送参数
}

/**
 * 本系统所有postmessage的消息体规范如下
 * {
 *    type: '',     消息类型，必须，字符串类型
 *    key:  '',     消息的标志符，（部分消息类型必须有）字符串类型
 *    data: {},     消息所带的数据，可有可无，json格式
 * }
 */
window.addEventListener('message', function (event) {

    let data = event.data;

    if (data.type !== undefined) {

        // 如果有订阅，先触发订阅的回调函数
        subscriber[data.type] && subscriber[data.type](data);

        // 以下内容需要重新梳理逻辑，重构以下
        switch (data.type) {
            case PMENUM.open_component_dialog:
                let elementDiv = $('<div></div>');
                dialogHash[data.key] = {
                    iframe: event.source,
                    element: elementDiv.appendTo(document.body)
                };
                let compConf = PMAPI.deserializeComponent(data.component);
                let comp = new class extends component {
                    constructor() {
                        super(compConf);
                    }
                };
                comp['key'] = data.key;
                comp.render(elementDiv);
                dialogHash[data.key].comp = comp;
                dialogHash[data.key].element.erdsDialog(_.defaultsDeep(data.frame, {
                    modal: true,
                    close: function () {
                        if (dialogHash[data.key]) {
                            PMAPI.sendToParent({
                                type: PMENUM.close_dialog,
                                key: data.key,
                                data: {
                                    onlyclose: true
                                }
                            });
                        }
                    }
                }));
                break;
            case PMENUM.open_iframe_dialog:
                let url = URL.getUrl(data.url, {key: data.key});
                let element = $(`<iframe data-key="${data.key}" src="${url}">`);
                // 向新打开的iframe内传递参数
                let params = data.params || {};
                dialogHash[data.key] = {
                    iframe: event.source,
                    element: element.appendTo(document.body),
                    params: params
                };
                element.one('load', () => {
                    PMAPI.sendToChild(element[0], {
                        type: PMENUM.open_iframe_params,
                        data: params
                    });
                });
                dialogHash[data.key].element.erdsDialog(_.defaultsDeep(data.frame, {
                    modal: true,
                    maxable: true,
                    close: function () {
                        if (dialogHash[data.key]) {
                            PMAPI.sendToParent({
                                type: PMENUM.close_dialog,
                                key: data.key,
                                data: {
                                    onlyclose: true
                                }
                            });
                        }
                    }
                }));
                break;
            case PMENUM.close_dialog:
                dialogHash[data.key].element.erdsDialog('destroy').remove();
                if (dialogHash[data.key].comp) {
                    dialogHash[data.key].comp.destroySelf();
                }
                if (dialogHash[data.key].element) {
                    dialogHash[data.key].element.remove();
                }
                PMAPI.sendToChild(dialogHash[data.key].iframe, {
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

            case PMENUM.get_param_from_root:
                PMAPI.sendToChild(dialogHash[data.key].element[0], {
                    type: PMENUM.send_param_to_iframe,
                    data: dialogHash[data.key].params
                });
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
    starter: new Date().getTime(),

    /**
     * 内部方法，生成一个唯一的key，作为标志
     * @return {string}
     */
    _getKey: function () {
        return 'iframedialog-' + PMAPI.starter++;
    },

    /**
     * 自定义订阅postmessage的消息
     * 在外部的使用方式为：
     * PMAPI.subscribe(PMENUM.setiframestatus, (data) => {})
     * @param channel
     * @param callback
     */
    subscribe: function (channel, callback) {
        subscriber[channel] = callback;
    },

    /**
     * 向主框架发消息，拉取iframe的参数
     * @param key
     * @returns {Promise}
     */
    getIframeParams: function (key) {
        let resolve = null;
        let promise = new Promise((_resolve) => {
            resolve = _resolve;
        });
        PMAPI.sendToParent({
            type: PMENUM.get_param_from_root,
            key: key
        });
        PMAPI.subscribe(PMENUM.send_param_to_iframe, (data) => {
            resolve(data);
        });
        return promise;
    },

    /**
     * 给主框架发消息，关闭弹出框，并将数据传递给调用方
     * @param key
     * @param data
     */
    closeIframeDialog: function (key, data) {
        PMAPI.sendToParent({
            type: PMENUM.close_dialog,
            key: key,
            data: data
        })
    },

    /**
     * 获取根框架的window
     * @returns {*}
     */
    getRoot: function () {
        function func(win) {
            if (win.parent === win) {
                return win;
            } else {
                return func(win.parent);
            }
        }

        return func(window);
    },

    /**
     * 将消息发送给调用的父组件
     * @param data
     */
    sendToParent: function (data) {
        this.getRoot().postMessage(data, location.origin);
        return this;
    },

    /**
     * 将消息发送给指定的iframe
     * @param iframe
     * @param msg
     */
    sendToChild: function (iframe, msg) {
        if (iframe.postMessage) {
            iframe.postMessage(msg, location.origin);
        }
        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg, location.origin);
        }
        return this;
    },

    /**
     * 将消息发送给所有的子框架
     * @param msg
     * @returns {PMAPI}
     */
    sendToAllChildren: function(msg) {
        for(let i = 0; i < window.frames.length; i++){
            this.sendToChild(window.frames[i], msg);
        }
        return this;
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
    openDialogByIframe: function (url, frame, params) {
        return new Promise(function (resolve) {
            let key = PMAPI._getKey();
            dialogWaitHash[key] = resolve;
            PMAPI.sendToParent({
                type: PMENUM.open_iframe_dialog,
                key: key,
                url: url,
                frame: frame,
                params: params
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
    openDialogByComponent: function (componentConfig, frame) {
        return new Promise(function (resolve) {
            let key = PMAPI._getKey();
            dialogWaitHash[key] = resolve;
            window.parent.postMessage({
                type: PMENUM.open_component_dialog,
                key: key,
                component: PMAPI.serializeComponent(componentConfig),
                frame: frame
            }, location.origin);
        });
    },

    /**
     * 将组件配置转化为字符串
     * @param componentConfig ComponentConfig，注意该配置中的function不能使用配置外部的其他方法和常量
     * @returns string
     */
    serializeComponent: function (componentConfig, key) {
        if (typeof componentConfig === 'number'
            || typeof componentConfig === 'boolean') {
            return '' + componentConfig;
        } else if (typeof componentConfig === 'string') {
            return '"' + componentConfig + '"';
        } else if (componentConfig instanceof Function) {
            let str = String(componentConfig);
            let source = PMAPI._removeAllComments(str.substring(str.indexOf('{') + 1, str.lastIndexOf('}')));
            //str.substring(str.indexOf('function ')+9,str.indexOf('('))
            let func = `{"Function":"${key}", "Arguments":"${str.substring(str.indexOf('(') + 1, str.indexOf(')'))}", "Source": "${source.replace(/\n/g, '').replace(/\"/g, "'")}"}`
            return func;
        } else if (Array.isArray(componentConfig)) {
            if (componentConfig[0] === undefined) {
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
            objKeys.forEach((key) => {
                if (componentConfig[key] == undefined) {
                    return;
                }
                arrOfKeyVals.push('"' + key + '":' + PMAPI.serializeComponent(componentConfig[key], key));
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
        keys.forEach(key => {
            if (obj[key]['Function']) {
                let args = obj[key]['Arguments'] || "";
                let source = obj[key]['Source'];
                let fstr = "function " + obj[key]['Function'] + "(" + args + "){" + source + "}";
                let f = new Function('$', '_', 'PMAPI', 'PMENUM', 'HTTP', 'Quill', "return " + fstr)($, _, PMAPI, PMENUM, HTTP, Quill);
                obj[key] = f;
            } else if (obj[key] instanceof Object) {
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
        if (start == -1) {
            return str;
        }
        let end = str.indexOf('\n', start);
        return PMAPI._removeAllComments(str.replace(str.substring(start, end), ''));
    }

}

