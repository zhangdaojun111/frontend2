/**
 * Created by zj on 2017/8/12.
 */
//import {GetMenu} from "../../components/calendar/testData/menu"
import {HTTP} from "../../lib/http"
//import {columnList2926} from "../../components/calendar/testData/2926table-column-list"


const menuUrl = 'get_menu'
const columnListUrl = 'get_column_list';


export const CodeEnum = {
    SUCCESS: 200,
};

export const CalendarSetService = {
    menu: [],

    getMenu: function () {
        let res = HTTP.get(menuUrl).then(res => {
            if(res['success'] === 1) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;

        // const res = new Promise((resolve) => {
        //     resolve(GetMenu);
        // });
        // this.menu = GetMenu['menuList'];
        // return res;
    },
    filterMenu: function (filter, subMenu) {
        let result = [];
        let subResult = [];
        let isFilter = false;
        if( filter !== "" ){
            result = this.startFilter( filter , this.menu );
            subResult = this.startFilter( filter , subMenu);
            isFilter = true;
        }else {
            result = this.menu;
            isFilter = false;
            subResult = subMenu;
        }
        return Promise.resolve( {"menu": result , "isFilter": isFilter , "subMenu":subResult} )
    },

    startFilter: function( filter , treeData ){
        let list = [];
        for( let data of treeData ){
            let items = [];
            if( data.items ){
                if( data.label.indexOf(filter) !== -1 || data.name_py.indexOf(filter) !== -1 ){
                    list.push( { company_name: data.company_name, folder_id: data.folder_id, id: data.id, items: data.items,label: data.label, name_py: data.name_py, namespace: data.namespace, table_id: data.table_id,ts_name: data.ts_name } );
                    // return list;
                    continue;
                }
                items = this.startFilter( filter,data.items );
                if( items.length !== 0 ){
                    list.push( { company_name: data.company_name, folder_id: data.folder_id, id: data.id, items: items,label: data.label, name_py: data.name_py, namespace: data.namespace, table_id: data.table_id,ts_name: data.ts_name } );
                }
            }else{
                if( data.label.indexOf(filter) !== -1||data.name_py.indexOf(filter) !== -1 ){
                    list.push( { company_name: data.company_name, folder_id: data.folder_id, id: data.id,label: data.label, name_py: data.name_py, namespace: data.namespace, table_id: data.table_id,ts_name: data.ts_name } );
                }
            }
        }
        return list;
    },

    getColumnList: function (tableId) {
        let params = {
            table_id: tableId,
        };

        let res = HTTP.get(columnListUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
        // const res = new Promise((resolve) => {
        //     resolve(columnList2926);
        // });
        // return res;
    }
};