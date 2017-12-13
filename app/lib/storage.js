/**
 * Created by Yunxuan Yan on 2017/9/4.
 */

/**
 * 本工具会在main页初始化的时候清除跟SECTION和IFRAME相关的缓存，在Iframe退出时清除和本Iframe相关的缓存
 * @type {{SECTION: {FORM: string, DATAGRID: string, WORKFLOW: string, FRAMEWORK: string, BI: string}, iframe_key: string, init: (function(*)), setItem: Storage.setItem, getItemAndDelete: Storage.getItemAndDelete, getItem: Storage.getItem, deleteItem: Storage.deleteItem, clear: Storage.clear, clearAll: Storage.clearAll}}
 */
export const Storage = {
    SECTION:{
        FORM:'form',
        DATAGRID:'datagrid',
        WORKFLOW:'workflow',
        FRAMEWORK:'framework',
        BI:'BI'
    },

    init(key){
        Storage['iframe_key'] = key;
    },

    /**
     *
     * @param item 待存的对象，必须是可序列化（JSON.stringify）的
     * @param itemTag 该对象对应的标签
     * @param section 所属部分
     */
    setItem:function(item,itemTag,section){
        if(Object.values(Storage.SECTION).indexOf(section) == -1){
            console.log('storage：不支持的section');
            return;
        }
        let obj;
        if(window.localStorage[Storage['iframe_key']]==undefined){
            obj = {};
        } else {
            obj = JSON.parse(window.localStorage[Storage['iframe_key']]);
        }
        obj[section]=obj[section]||{};
        obj[section][itemTag]=item;
        window.localStorage[Storage['iframe_key']] = JSON.stringify(obj);
    },

    /**
     *
     * @param itemTag 对象标签
     * @param section 所属部分
     */
    getItemAndDelete:function(itemTag,section){
        let obj = JSON.parse(window.localStorage[Storage['iframe_key']]);
        let item = obj[section][itemTag];
        delete obj[section][itemTag];
        window.localStorage[Storage['iframe_key']] = JSON.stringify(obj);
        return item;
    },

    /**
     *
     * @param itemTag 对象标签
     * @param section 所属部分
     */
    getItem:function (itemTag,section){
        if(window.localStorage[Storage['iframe_key']]){
            let obj = JSON.parse(window.localStorage[Storage['iframe_key']])[section];
            if(obj == undefined){
                return null;
            }
            return obj[itemTag];
        }
        return null;
    },

    /**
     *
     * @param itemTag 对象标签
     * @param section 所属部分
     */
    deleteItem:function (itemTag,section) {
        if(!window.localStorage[Storage['iframe_key']]){
            return;
        }
        let obj = JSON.parse(window.localStorage[Storage['iframe_key']]);
        for(let key of Object.keys(obj[section])){
            if(key.indexOf(itemTag)>=0){
                delete obj[section][key];
            }
        }
        window.localStorage[Storage['iframe_key']] = JSON.stringify(obj);
    },

    /**
     * 清除指定iframe中的缓存
     * @param key iframe的key
     */
    clear:function (key) {
        delete window.localStorage[key];
    },

    /**
     * 清楚所有section的缓存
     *
     */
    clearAll:function () {
        for(let key of Object.keys(window.localStorage)){
            if(key.indexOf('password_info')!=-1){
                continue;
            }
            if(key.indexOf('iframedialog')!=-1 || key == 'null' || key == 'undefined'){
                delete window.localStorage[key];
            } else {
                for(let section of Object.values(Storage.SECTION)){
                    if(key.indexOf(section)!=-1){
                        delete window.localStorage[key];
                    }
                }
            }
        }
    }
}
