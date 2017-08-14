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
import {UserInfoService} from '../../services/main/userInfoService';
import MSG from '../../lib/msgbox';

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

        //收信人
        recipients: [],
        recipients_per: [],

        //抄送人
        copypeople: [],

        //发信箱数据
        emailAddressList: [],

        //默认选择的
        emailAddress: '',
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
            this.actions.makeRows(this.data.initAllRows);
        },
        makeRows: function(param){
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
                        rowTitle: this.data.rowTitle[index],

                        recipients: this.data.recipients,
                        recipients_per: this.data.recipients_per,
                        copypeople: this.data.copypeople,
                        emailAddressList: this.data.emailAddressList,
                        emailAddress: this.data.emailAddress,
                    }), this.el.find('.set-items'));
                })
            }).catch(err=>{
                console.log('error',err);
            });
        },
        representChange: function(a,a_selectedRepresent){
            if( a_selectedRepresent === '' ){
                return;
            }
            if(a.selectedOpts.indexOf(a_selectedRepresent) === -1){
                a.selectedOpts.push(a_selectedRepresent);
            }
        },

        despReset: function(tableId){
            this.data.tableId=tableId;
            MSG.alert("确定要重置吗？重置后会清空所有设置").then(res => {
                if(res['confirm']) {

                    this.actions.reset(tableId);
                }
            });
        },

        reset: function(tableId){
            for(let a of this.data.allRows){
                a['isSelected']=false;
                a['is_show_at_home_page']=false;
                a['color']="#000000";
                a['selectedOpts']=[];
                a['selectedRepresents'] = [];
                a['selectedEnums'] = [];
                a['email']= {
                    receiver: [],
                    cc_receiver: [],
                    email_id: this.data.emailAddress,
                    remind_time: '',
                    email_status: 0
                };
                a['sms'] = {
                    receiver: [],
                    cc_receiver: [],
                    remind_time: '',
                    sms_status: 0
                };
            }

            for(let eachRow of this.data.allRows){
                if(eachRow['isSelected'] === false){
                    eachRow['isSelected']=0;
                }else if(eachRow['isSelected'] === true){
                    eachRow['isSelected']=1;
                }
            }
            CalendarSetService.resetCalendar(tableId,this.data.allRows).then(res=>{

                if(res['succ'] === "1"){
                    MSG.showTips('重置成功');
                    this.data.isEdit=false;
                    //this.saveStatus.emit( res['success'] === "1" );
                    setTimeout( ()=>{
                        CalendarSetService.getColumnList(this.data.tableId)
                    },100 )
                }else  if(res['succ'] === 0){
                    MSG.showTips('重置失敗');
                    //MSG.alert(res['error']);
                    // this.saveStatus.emit( res['success'] === "0" );
                }
            });
        },

        getColumnListData: function (tableId) {
            CalendarSetService.getColumnList(tableId).then(res => {

                this.data.filedHead = res['rows'];
                CalendarService.getCalendarTableById(tableId).then(res => {
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
                CalendarSetService.getCalendarPeople(tableId).then(res => {
                    this.data.recipients = [];
                    for( let data of res['rows'] ){
                        if( data['type'] && data['type'] === 'email' ){
                            this.data.recipients.push( { name:data.dname,id:data.id } )
                        }else {
                            this.data.recipients.push( { name:data.dname,id:data.id } )
                            this.data.recipients_per.push( { name:data.dname,id:data.id } )
                        }
                    }
                    console.log(this.data.recipients, this.data.recipients_per);
                });
                UserInfoService.getAllUsersInfo().then(user => {
                    this.data.copypeople = [];
                    for( let data of user.rows ){
                        this.data.copypeople.push( {name:data.name,id:data.id} );
                    }
                    console.log(this.data.copypeople);
                });

                CalendarSetService.getEmailSetting().then(res => {
                    this.data.emailAddressList = [];
                    for(let x in res['data']){
                        this.data.emailAddressList.push({
                            name:res['data'][x]['host']+'('+res['data'][x]['user']+')',
                            id:res['data'][x]['id']?res['data'][x]['id']:''
                        });
                        if(res['data'][x]['is_default'] === 1){
                            this.data.emailAddress = res['data'][x]['id'];
                        }
                    }
                    console.log(this.data.emailAddressList, this.data.emailAddress);
                });

            });
        }
    },
    afterRender: function() {
        this.el.css({width: '100%'});
        this.el.find('iframe').css("width","100%");
        let _this = this;
        Mediator.on('calendar-set-left:calendar-set', data => {
            console.log(_this);
            _this.actions.getColumnListData(data.table_id);
        });
        this.el.on("click",".editor-btn", function() {
            _this.el.find(".hide-btns").css("visibility","visible");
            $(this).addClass("disabled");
            $(this).next('span').addClass("disabled");
            Mediator.emit('calendar-set:editor',{data:1});
            $(this).attr('disabled', 'true')
        }).on("click",".cancel-btn", () => {
            _this.el.find(".hide-btns").css("visibility","hidden");
            _this.el.find(".set-btn").removeClass("disabled");
            Mediator.emit('calendar-set:editor',{data:-1});
        }).on('click', '.reset-btn', () => {
            _this.actions.despReset(this.data.tableId);
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