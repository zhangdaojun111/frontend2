/**
 * Created by Yunxuan Yan on 2017/9/4.
 */

export const Storage = {
    SECTION:{
        FORM:'form',
        DATAGRID:'datagrid',
        WORKFLOW:'workflow',
        FRAMEWORK:'framework',
        BI:'BI'
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
        if(window.localStorage[section]==undefined){
            obj = {};
        } else {
            obj = JSON.parse(window.localStorage[section]);
        }
        obj[itemTag]=item;
        window.localStorage[section] = JSON.stringify(obj);
    },

    /**
     *
     * @param itemTag 对象标签
     * @param section 所属部分
     */
    getItemAndDelete:function(itemTag,section){
        let obj = JSON.parse(window.localStorage[section]);
        let item = obj[itemTag];
        delete obj[itemTag];
        window.localStorage[section] = JSON.stringify(obj);
        return item;
    },

    /**
     *
     * @param itemTag 对象标签
     * @param section 所属部分
     */
    getItem:function (itemTag,section){
        return JSON.parse(window.localStorage[section])[itemTag];
    },

    /**
     *
     * @param itemTag 对象标签
     * @param section 所属部分
     */
    deleteItem:function (itemTag,section) {
        let obj = JSON.parse(window.localStorage[section]);
        for(let key of Object.keys(obj)){
            if(key.indexOf(itemTag)>=0){
                delete obj[key];
            }
        }
        window.localStorage[section] = JSON.stringify(obj);
    },

    /**
     * 所有section中的缓存
     */
    clearAll:function () {
        for(let value of Object.values(Storage.SECTION)){
            delete window.localStorage[value];
        }
    }
}
