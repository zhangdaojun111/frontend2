/**
 * Created by zj on 2017/8/12.
 */
//import {GetMenu} from "../../components/calendar/testData/menu"
import {HTTP} from "../../lib/http"
import Mediator from '../../lib/mediator';

const menuUrl = 'get_menu';
const columnListUrl = 'get_column_list';
const systemBuildInFieldUrl = 'get_system_buildin_field';
const emailSettingUrl = 'get_email_settings';
const resetCalendarUrl = 'calendar_mgr/reset_calendar';


export const CodeEnum = {
    SUCCESS: 200,
};

export const CalendarSetService = {
    menu: [],

    getMenu: function () {
        let res = HTTP.get(menuUrl).then(res => {
            if(res['success'] === 1) {
                this.menu = res['menuList'];
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;

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
                console.log(res);
                Mediator.emit('CalendarSetService: getColumnList', res['rows']);
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    //获得日历提醒字段数据
    getCalendarPeople: function( tableId ){
        let params = {
            table_id: tableId,
        };

        let res = HTTP.get(systemBuildInFieldUrl, params).then(res => {
            console.log(res);
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    getEmailSetting: function(){
        let res = HTTP.get(emailSettingUrl).then(res => {
            console.log(res);
            if(res['success'] === 1) {
                return res;
            } else {
                alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    resetCalendar: function(table_id,param_list){
        let params = {
            table_id: table_id,
            param_list: JSON.stringify(param_list),
        };

        let res = HTTP.post(resetCalendarUrl, params).then(res => {
            console.log(res);
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                //alert('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    }
};