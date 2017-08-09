/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../lib/component";
import template from './calendar.set.html';
import './calendar.set.scss';

import CalendarSetItem from './calendar.set.item/calendar.set.item';
import {CalendarService} from '../../services/calendar/calendar.service';
import {dataTableService} from '../../services/dataGrid/data-table.service';

import {PMAPI} from '../../lib/postmsg';

let config = {
    template: template,
    data: {
        colorInfoFields: {},
        filedHead: {},
        dropdownForCalendarChange: [],
    },
    actions: {
    },
    afterRender: function() {
        this.el.css({width: '100%'});
        dataTableService.getColumnList({table_id: window.config.table_id}).then(res => {
            console.log(res);
            this.data.filedHead = res['rows'];
            this.data.dropdownForCalendarChange = [{label:'',value:''}];
            for( let d of this.data.filedHead ){
                if( d.dtype === '4' && ( d.dinput_type === '6' || d.dinput_type === '7' ) ){
                    this.data.dropdownForCalendarChange.push({
                        label:d['name'],
                        value:d['id']
                    })
                }
            }
            console.log(this.data.dropdownForCalendarChange);
        });

        CalendarService.getCalendarTableById({table_id:window.config.table_id, isSelected: 1}).then(res => {
            console.log('res', res);
            this.data.colorInfoFields = res;
            res['rows'].forEach(setItem => {
                this.append(new CalendarSetItem(setItem), this.el.find('.set-items'));
            })
        });


        // CalendarService.getReplace(window.config.table_id).then(res => {
        //     if(res.error!=''){
        //         throw res.error;
        //     }
        //     for(let key in res.data){
        //         let obj={
        //             label:res.data[key].dname,
        //             value:res.data[key].field_id
        //         };
        //         this.replaceDropDown.push(obj);
        //     }
        //     if(param['rows'].length === 0){
        //         for(let i = 0 ;i < this.rowTitle.length;i++){
        //             this.allRows.push({
        //                 isSelected:false,
        //                 is_show_at_home_page:false,
        //                 name:this.rowTitle[i].name,
        //                 field_id:this.rowTitle[i].id,
        //                 color:"#000000",
        //                 selectedOpts:[],
        //                 selectedRepresents:'',
        //                 selectedEnums:'',
        //                 email: this.rowTitle[i]['email'],
        //                 sms: this.rowTitle[i]['sms']
        //             })
        //         }
        //     }else {
        //         for(let singleSetting of param['rows']){
        //             this.allRows.push({
        //                 isSelected:singleSetting['isSelected']||false,
        //                 is_show_at_home_page:singleSetting['is_show_at_home_page']==1?true:false,
        //                 color:singleSetting['color'],
        //                 field_id:singleSetting['field_id'],
        //                 name:singleSetting['field_id'],
        //                 id:singleSetting['id']||"",
        //                 selectedOpts:singleSetting['selectedOpts'],
        //                 selectedRepresents:singleSetting['selectedRepresents'][0],
        //                 selectedEnums:singleSetting['selectedEnums'][0],
        //                 email: singleSetting['email'],
        //                 sms: singleSetting['sms'],
        //                 key_field_id:singleSetting['key_field_id']
        //             })
        //         }
        //     }
        // })
    }
};

class CalendarSet extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSet;