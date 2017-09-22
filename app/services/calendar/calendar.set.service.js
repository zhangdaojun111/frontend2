/**
 * Created by zj on 2017/8/12.
 */
//import {GetMenu} from "../../components/calendar/testData/menu"
import {HTTP} from "../../lib/http"
import Mediator from '../../lib/mediator';
import MSG from '../../lib/msgbox';

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

    /**
     * 获取可进行设置的表
     * @returns {undefined|void|Promise.<TResult>}
     */
    getMenu: function () {
        let res = HTTP.get(menuUrl).then(res => {
            if(res['success'] === 1) {
                this.menu = res['menuList'];
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;

    },

    /**
     * 搜索过滤
     * @param filter
     * @param subMenu
     * @returns {Promise.<{menu: Array, isFilter: boolean, subMenu: Array}>}
     */
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

    /**
     * 获取表头数据
     * @param tableId
     * @returns {undefined|void|Promise.<TResult>}
     */
    getColumnList: function (tableId) {
        let params = {
            table_id: tableId,
        };

        let res = HTTP.get(columnListUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                Mediator.emit('CalendarSetService: getColumnList', res['rows']);
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 获取设置的人员信息
     * @param tableId
     * @returns {undefined|void|Promise.<TResult>}
     */
    getCalendarPeople: function( tableId ){
        let params = {
            table_id: tableId,
        };
        let res = HTTP.get(systemBuildInFieldUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 获取默认邮件发送地址
     * @returns {undefined|void|Promise.<TResult>}
     */
    getEmailSetting: function(){
        let res = HTTP.get(emailSettingUrl).then(res => {
            if(res['success'] === 1) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    },

    /**
     * 重置日历设置
     * @param table_id
     * @param param_list
     * @returns {undefined|void|Promise.<TResult>}
     */
    resetCalendar: function(table_id,param_list){
        let params = {
            table_id: table_id,
            param_list: JSON.stringify(param_list),
        };

        let res = HTTP.post(resetCalendarUrl, params).then(res => {
            if(res['code'] === CodeEnum.SUCCESS) {
                return res;
            } else {
                MSG.showTips('获取数据失败');
            }
        });
        HTTP.flush();
        return res;
    }
};