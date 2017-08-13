/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../lib/component";
import template from './calendar.set.html';
import './calendar.set.scss';

import CalendarSetItem from './calendar.set.item/calendar.set.item';
import Mediator from '../../lib/mediator';
import {CalendarService} from "../../services/calendar/calendar.service"
import {CalendarSetService} from "../../services/calendar/calendar.set.service"

import {PMAPI} from '../../lib/postmsg';

let config = {
    template: template,
    data: {
        tableId: '',
        colorInfoFields: {},
        filedHead: {},
        allRows: [],
        rowTitle: [],
        initAllRows: [],
        dropdown: [],
        dropdownForRes: [],
        replaceDropDown: [],
        dropdownForCalendarChange: [],
        isConfigField: false,
        isEdit: false,
    },
    actions: {
        getMultiSelectDropdown: function(){
            let res = this.data.filedHead;
            this.data.dropdown = [];
            this.data.dropdownForRes = [{id:'',name:''}];
            for(let columenListIndex in res){
                let item = res[columenListIndex];
                if(item['dinput_type'] === "3"|| item['dinput_type'] === "5" || item["real_type"] === "3" || item["real_type"] === "5" ){
                    this.data.rowTitle.push(item);
                }

                if( res[columenListIndex]["field"] !== "_id" ){
                    this.data.dropdown.push({
                        name:res[columenListIndex]['name'],
                        id:res[columenListIndex]['id']
                    });
                    this.data.dropdownForRes.push({
                        name:res[columenListIndex]['name'],
                        id:res[columenListIndex]['id']
                    })
                }
            }
            this.actions.getSetting(this.data.tableId);
        },
        getSetting: function(tableid){
            let res = this.data.colorInfoFields;
            this.data.initAllRows = [];
            this.data.initAllRows = res;
            //this.actions.makeRows(this.data.initAllRows);
        },
        makeRows: function(param){
            console.log(param);
            this.data.allRows = [];
            CalendarService.getReplace(this.data.tableId).then(res => {
                if(res.error !== ''){
                    throw res.error;
                }
                for(let key in res.data){
                    let obj={
                        name: res.data[key].dname,
                        id: res.data[key].field_id
                    };
                    this.data.replaceDropDown.push(obj);
                }
                if(param['rows'].length === 0){
                    for(let i = 0 ;i < this.data.rowTitle.length;i++){
                        this.data.allRows.push({
                            isSelected: false,
                            is_show_at_home_page: false,
                            name: this.data.rowTitle[i].name,
                            field_id: this.data.rowTitle[i].id,
                            color: "#000000",
                            selectedOpts: [],
                            selectedRepresents: '',
                            selectedEnums: '',
                            email: this.data.rowTitle[i]['email'],
                            sms: this.data.rowTitle[i]['sms'],
                        })
                    }
                }else {
                    for(let singleSetting of param['rows']){
                        this.data.allRows.push({
                            isSelected: singleSetting['isSelected']||false,
                            is_show_at_home_page: singleSetting['is_show_at_home_page'] === 1 ? true : false,
                            color: singleSetting['color'],
                            field_id: singleSetting['field_id'],
                            name: singleSetting['field_id'],
                            id: singleSetting['id']||"",
                            selectedOpts: singleSetting['selectedOpts'],
                            selectedRepresents: singleSetting['selectedRepresents'][0],
                            selectedEnums: singleSetting['selectedEnums'][0],
                            email: singleSetting['email'],
                            sms: singleSetting['sms'],
                            key_field_id: singleSetting['key_field_id'],
                        })
                    }
                }
                this.data.allRows.forEach((row, index) => {
                    if(this.data.rowTitle[index]['id'] && this.data.rowTitle[index]['dtype'] === '8' && this.data.replaceDropDown.length !== 0){
                        this.data.isConfigField = true;
                    }
                    this.append(new CalendarSetItem({
                        rowData: row,
                        dropdown: this.data.dropdown,
                        dropdownForRes: this.data.dropdownForRes,
                        dropdownForCalendarChange: this.data.dropdownForCalendarChange,
                        replaceDropDown: this.data.replaceDropDown,
                        isConfigField: this.data.isConfigField,
                        rowTitle: this.data.rowTitle,
                    }), this.el.find('.set-items'));
                })
            }).catch(err=>{
                console.log('error',err);
            });
        }
    },
    afterRender: function() {
        this.el.css({width: '100%'});
        // this.data.tableId = window.config.table_id;
        this.el.find('iframe').css("width","100%");
        console.log(this.data.tableId);
        CalendarSetService.getColumnList(this.data.tableId).then(res => {
            console.log(res);
            this.data.filedHead = res['rows'];
            CalendarService.getCalendarTableById(this.data.tableId).then(res => {
                this.data.colorInfoFields = res;
                this.data.dropdownForCalendarChange = [{id:'',name:''}];
                for( let d of this.data.filedHead ){
                    if( d.dtype === '4' && ( d.dinput_type === '6' || d.dinput_type === '7' ) ){
                        this.data.dropdownForCalendarChange.push({
                            name: d['name'],
                            id: d['id']
                        })
                    }
                }
                this.actions.getMultiSelectDropdown();
            });

        });
        let that = this;
        this.el.on("click",".editor-btn", function() {
            console.log(0);
            that.el.find(".hide-btns").css("visibility","visible");
            $(this).addClass("disabled");
            $(this).next('span').addClass("disabled");
            Mediator.emit('calendar-set:editor',{data:1});
            $(this).attr('disabled', 'true')
        }).on("click",".cancel-btn", () => {
            that.el.find(".hide-btns").css("visibility","hidden");
            that.el.find(".set-btn").removeClass("disabled");
            Mediator.emit('calendar-set:editor',{data:-1});
        }).on('click', '.set-btn', () => {

        });

    }
};

class CalendarSet extends Component {
    constructor(data) {
        config.data.tableId = data;
        super(config);
    }
}

export default CalendarSet;