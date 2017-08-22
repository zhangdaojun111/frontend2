/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../../lib/component";
import template from './calendar.main.html';
import './calendar.main.scss';

import CalendarMonth from './calendar.month/calendar.month';
import CalendarWeek from './calendar.week/calendar.week';
import CalendarDay from './calendar.day/calendar.day';
import CalendarSchedule from './calendar.schedule/calendar.schedule';
import CalendarExport from './calendar.export/calendar.export';
import RightContentWorkFlow from '../right-content/right.content.workflowcontent/right.content.workflowcontent';

import {CalendarService} from '../../../services/calendar/calendar.service';
import {PMAPI} from '../../../lib/postmsg';
import Mediator from '../../../lib/mediator';
import {CalendarWorkflowData} from './calendar.workflow/calendar.workflow';
import {CalendarTimeService, CalendarToolService, CalendarHandleDataService} from '../../../services/calendar/calendar.tool.service';

let config = {
    template: template,
    data: {
        calendarMonthComponent: {},
        calendarWeekComponent: {},
        calendarDayComponent: {},

        headList: [ '星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
        chooseDate: '',

        monthDataList: [],
        weekDataList: [],
        dayDataList: [],

        todayStr: '',
        calendarContent: 'month',
        selectData: {},
        selectedDateShow: '',
        today: {},

        from_date: '',
        to_date: '',

        workflowCount: 0,
        missionCount: 0,
        remindCount: 0,
        isShowArr: [],

        cancel_fields: [],

        // 时间对应的日历设置
        date2settings: {},

        // 对应的日历设置数据
        calendarSettings: {},

        // 表id对应的表名
        tableid2name: {},

        // 字段id对应字段信息
        fieldInfos: {},

        searchText: '',

        scheduleStart: '',
        scheduleEnd: '',
        scheduleDataList: [],

        workflowData: [],
        isWorkflowDataReady: true,

        isShowWorkflowData: true,
    },
    actions: {
        addOneDay: function( oldDay ){
            let oMyTime = new Date( oldDay ).getTime();
            oMyTime = oMyTime + 24*60*60*1000;
            let nweTime = new Date(oMyTime);
            let year = nweTime.getFullYear(),
                month = nweTime.getMonth(),
                day = nweTime.getDate(),
                week = nweTime.getDay();
            return CalendarTimeService.formatDate(year,month,day);
        },
        search: function( key ){
            this.data.searchText = key;
            if( this.data.calendarContent === 'schedule' ){
                this.actions.getCalendarData({
                    from_date: this.data.from_date,
                    to_date: this.data.to_date,
                    cancel_fields: JSON.stringify(this.data.cancel_fields)
                });
            }else {
                this.actions.getCalendarData({
                    from_date: this.data.from_date,
                    to_date: this.data.to_date,
                    cancel_fields: JSON.stringify(this.data.cancel_fields)
                },'calendar');
                // setTimeout(() => {
                //     console.log(this.data.monthDataList);
                // },500)
                // this.actions.monthDataTogether();
                // this.actions.getDataCount();
            }
        },

        getCalendarData: function (data,type){
            CalendarService.getCalendarData(data).then( res=>{
                this.data.date2settings = res['date2csids'];
                this.data.calendarSettings = res['id2data'];
                this.data.tableid2name = res['tableid2name'];
                this.data.fieldInfos = res['field_infos']
                if(type === 'calendar') {
                    this.actions.monthDataTogether();
                }else {
                    this.actions.makeScheduleData(data.from_date, data.to_date);
                }
                this.actions.getDataCount();
            });
        },

        getDataCount: function (){
            let i = 0;
            let j = 0;
            let w = 0;
            let m = 0;
            if( this.data.calendarContent === 'month' ){
                for( let data of this.data.monthDataList ){
                    for( let day of data['weekList'] ){
                        for( let d of day['data'] ){
                            if( d.type === 1 && this.data.isShowArr.indexOf( d.fieldId ) === -1 && d.isShow ){
                                i++;
                            }else if( d.type === 2 ){
                                j++;
                            }else if( d.type === 3 && d.isShow && this.data.isShowArr.indexOf('approve') === -1 ){
                                w++;
                            }else if( d.type === 4 && d.isShow && this.data.isShowArr.indexOf('mission') === -1 ){
                                m++;
                            }
                        }
                    }
                }
            }else if( this.data.calendarContent === 'week' ){
                if( this.data.weekDataList.length === 2 ){
                    for( let day of this.data.weekDataList[1] ){
                        for( let d of day['data'] ){
                            if( d.type === 1 && this.data.isShowArr.indexOf( d.fieldId ) === -1 && d.isShow ){
                                i++;
                            }else if( d.type === 2 ){
                                j++;
                            }else if( d.type === 3 && d.isShow && this.data.isShowArr.indexOf('approve') === -1 ){
                                w++;
                            }else if( d.type === 4 && d.isShow && this.data.isShowArr.indexOf('mission') === -1 ){
                                m++;
                            }
                        }
                    }
                }
            }else if( this.data.calendarContent === 'day' ){
                for( let d of this.data.dayDataList[0]['data'] ){
                    if( d.type === 1 && this.data.isShowArr.indexOf( d.fieldId ) === -1 && d.isShow ){
                        i++;
                    }else if( d.type === 2 ){
                        j++;
                    }else if( d.type === 3 && d.isShow && this.data.isShowArr.indexOf('approve') === -1 ){
                        w++;
                    }else if( d.type === 4 && d.isShow && this.data.isShowArr.indexOf('mission') === -1 ){
                        m++;
                    }
                }
            }

            else if( this.data.calendarContent === 'schedule' ){
                for( let day of this.data.scheduleDataList ){
                    for( let d of day['data'] ){
                        if( d.type === 1 && this.data.isShowArr.indexOf( d.fieldId ) === -1 && d.isShow ){
                            i++;
                        }else if( d.type === 2 ){
                            j++;
                        }else if( d.type === 3 && d.isShow && this.data.isShowArr.indexOf('approve') === -1 ){
                            w++;
                        }else if( d.type === 4 && d.isShow && this.data.isShowArr.indexOf('mission') === -1 ){
                            m++;
                        }
                    }
                }
            }
            this.data.remindCount = i;
            this.data.workflowCount = w;
            console.log(this.data.remindCount);
            $('body').find('.remind-num').html(this.data.remindCount);
            $('body').find('.approval-num').html(this.data.workflowCount);

        },

        createMonthCalendar: function (y,m){
            this.data.monthDataList = CalendarHandleDataService.createMonthCalendar(y,m, this.data.todayStr);
            this.data.from_date = this.data.monthDataList[0]['weekList'][0]['dataTime'];
            this.data.to_date = this.data.monthDataList[5]['weekList'][6]['dataTime'];

            if(this.data.calendarContent === 'month') {
                CalendarWorkflowData.getWorkflowData(this.data.from_date, this.data.to_date);
                this.actions.getCalendarData({
                    from_date: this.data.from_date,
                    to_date: this.data.to_date,
                    cancel_fields: JSON.stringify(this.data.cancel_fields)
                },'calendar');
                Mediator.emit('CalendarWorkflowData: changeWorkflowData', {from_date: this.data.from_date, to_date: this.data.to_date});
            }
        },

        createWeekCalendar: function (){
            this.data.weekDataList = CalendarHandleDataService.createWeekCalendar(this.data.selectData);
            if(this.data.weekDataList[0].length !== 0) {
                this.data.selectedDateShow = this.data.weekDataList[0][0]['time'] + ' -- ' + this.data.weekDataList[0][6]['time'];
                $('.nowDate').html(this.data.selectedDateShow);
                this.data.from_date = this.data.weekDataList[0][0]['time'];
                this.data.to_date = this.data.weekDataList[0][6]['time'];
            }

            if(this.data.calendarContent === 'week') {
                CalendarWorkflowData.getWorkflowData(this.data.from_date, this.data.to_date);
                this.actions.getCalendarData({
                    from_date: this.data.from_date,
                    to_date: this.data.to_date,
                    cancel_fields: JSON.stringify(this.data.cancel_fields)
                },'calendar');
            }
        },

        createDayCalendar: function(){
            this.data.dayDataList = [];
            let date = CalendarTimeService.formatDate(this.data.selectData.y, this.data.selectData.m, this.data.selectData.d);
            for( let data of this.data.monthDataList ){
                for( let d of data['weekList'] ){
                    if( d.dataTime === date ){
                        this.data.dayDataList.push( d );
                        break;
                    }
                }
            }
            this.data.selectedDateShow = this.data.selectData.y + "年" + ( this.data.selectData.m + 1 ) + "月" + this.data.selectData.d + "日 （"+ this.data.headList[this.data.selectData.w] +"）";
            $('.nowDate').html(this.data.selectedDateShow);
            this.data.from_date = date;
            this.data.to_date = date;
            if(this.data.calendarContent === 'day') {
                CalendarWorkflowData.getWorkflowData(this.data.from_date, this.data.to_date);
                this.actions.getCalendarData({
                    from_date: this.data.from_date,
                    to_date: this.data.to_date,
                    cancel_fields: JSON.stringify(this.data.cancel_fields)
                },'calendar');
                Mediator.emit(
                    'CalendarWorkflowData: changeWorkflowData',
                    {from_date: this.data.from_date,
                        to_date: this.data.to_date
                    });
            }
            console.log(this.data.dayDataList);
        },

        makeScheduleData: function (startDate, endDate) {
            this.data.scheduleStart = startDate;
            this.data.scheduleEnd = endDate;
            this.data.scheduleDataList = [];
            for( let s_date = this.data.scheduleStart;s_date <= this.data.scheduleEnd; s_date = this.actions.addOneDay( s_date ) ){
                let day = {dataTime: s_date};
                this.actions.getDayData(day);
                this.data.scheduleDataList.push(day);
            }
            console.log(this.data.scheduleDataList);
            this.el.find('.calendar-main-content').empty();
            this.append(new CalendarSchedule({startDate: startDate, endDate: endDate, scheduleDataList: this.data.scheduleDataList}), this.el.find(".calendar-main-content"));
        },

        changeMonth: function (lr) {
            let y = this.data.selectData['y'];
            let m = this.data.selectData['m'];
            if( m > 0 && lr === 'l' ){
                this.data.selectData['m'] = m - 1;
            }
            if( m === 0 && lr === 'l' ){
                this.data.selectData['y'] = y - 1;
                this.data.selectData.m = 11;
            }
            if( m < 11 && lr === 'r' ){
                this.data.selectData['m'] = m + 1;
            }
            if( m === 11 && lr === 'r' ){
                this.data.selectData['y'] = y + 1;
                this.data.selectData['m'] = 0;
            }

            if(lr === 'l') {
                this.data.selectedDateShow = y +'年'+ m +'月';
                $('.nowDate').html(this.data.selectedDateShow);
                this.actions.createMonthCalendar(y, m-1);
            } else if (lr === 'r') {
                this.data.selectedDateShow = y +'年'+ (m+2) +'月';
                $('.nowDate').html(this.data.selectedDateShow);
                this.actions.createMonthCalendar(y, m+1);
            }
        },

        changeWeek: function (lr) {
            let slect = CalendarTimeService.formatDate(this.data.selectData.y, this.data.selectData.m, this.data.selectData.d);
            let oldWeekDay = new Date(slect).getTime();
            if( lr === 'l' ){
                oldWeekDay = oldWeekDay-7*24*60*60*1000;
            }else if( lr === 'r' ){
                oldWeekDay = oldWeekDay+7*24*60*60*1000;
            }
            let nweTime = new Date(oldWeekDay);
            let year = nweTime.getFullYear(),
                month = nweTime.getMonth(),
                day = nweTime.getDate(),
                week = nweTime.getDay();
            this.data.selectData = {'y':year, 'm':month, 'd':day, 'w':week};

            this.data.chooseDate = CalendarTimeService.formatDate(year,month-1,day);

            //this.actions.createWeekCalendar();
        },

        changeDay: function (lr) {
            let oldDate = CalendarTimeService.formatDate(this.data.selectData.y, this.data.selectData.m, this.data.selectData.d);
            let oldMyTime = new Date(oldDate).getTime();
            if( lr === 'l' ){
                oldMyTime = oldMyTime - 24*60*60*1000;
            }else if( lr === 'r' ) {
                oldMyTime = oldMyTime + 24*60*60*1000;
            }
            let nweTime = new Date(oldMyTime);
            let year = nweTime.getFullYear(),
                month = nweTime.getMonth(),
                day = nweTime.getDate(),
                week = nweTime.getDay();
            this.data.selectData = {'y':year, 'm':month, 'd':day, 'w':week};
        },

        changeMainView: function (type) {
            this.data.calendarContent = type;
            this.el.find('.calendar-main-content').empty();
            if(type === 'month') {
                this.data.selectedDateShow = this.data.selectData.y +'年'+ ( this.data.selectData.m + 1 )  +'月';
                $('.nowDate').html(this.data.selectedDateShow);
                this.append(new CalendarMonth(this.data.monthDataList), this.el.find(".calendar-main-content"));
            } else if (type === 'week') {
                this.actions.createMonthCalendar(this.data.selectData.y, this.data.selectData.m);
                this.actions.createWeekCalendar();
                this.append(new CalendarWeek(this.data.weekDataList), this.el.find(".calendar-main-content"));
                Mediator.emit('CalendarMain: date',{from_date: this.data.from_date, to_date: this.data.to_date});
            } else if (type === 'day') {
                this.actions.createMonthCalendar(this.data.selectData.y, this.data.selectData.m);
                this.actions.createDayCalendar();
                this.append(new CalendarDay(this.data.dayDataList), this.el.find(".calendar-main-content"));
                Mediator.emit('CalendarMain: date',{from_date: this.data.from_date, to_date: this.data.to_date});
            }
            // if(this.data.calendarContent !== 'month') {
            //     Mediator.emit('CalendarWorkflowData: changeWorkflowData', {from_date: this.data.from_date, to_date: this.data.to_date});
            // }
        },

        getDayData: function (day) {
            //获取当日包含的设置
            let calendarDate = [];
            for( let date in this.data.date2settings ){
                if( date.indexOf( day['dataTime'] ) !== -1 ){
                    for( let d of this.data.date2settings[date] ){
                        let i = 0;
                        for( let c of calendarDate ){
                            if( c.id === d ){
                                i++
                            }
                        }
                        if( i === 0 ){
                            calendarDate.push( { id:d,date:day.dataTime } );
                        }
                    }
                }
            }
            day['data'] = [];
            for( let set of calendarDate ){
                let setDetail = this.data.calendarSettings[set.id];
                // debugger;
                for( let select of setDetail['selectedOpts_data'] ){

                    if( select[setDetail['field_id']].indexOf(day.dataTime) === -1 ){
                        continue;
                    }

                    let arrData = {};
                    if(setDetail.is_drag === 1) {
                        console.log(setDetail);
                    }

                    if( setDetail.type === 0 ){
                        arrData['tableId'] = setDetail.table_id;
                        arrData['time'] = set.date;
                        arrData['setId'] = set.id;
                        arrData['dfield'] = setDetail.dfield;
                        arrData['color'] = CalendarToolService.handleColorRGB( setDetail.color , 0.5 );
                        arrData['isDrag'] = setDetail.is_drag;
                        arrData['real_ids'] = JSON.stringify( setDetail.real_ids );
                        arrData['real_id'] = JSON.stringify( [select._id] );
                        arrData['tableName'] = this.data.tableid2name[setDetail.table_id];
                        arrData['fieldId'] = setDetail.field_id;
                        arrData['fieldName'] = this.data.fieldInfos[setDetail.field_id]['dname'];
                        arrData['type'] = 1;
                        arrData['isShow'] = this.data.searchText === '' ? true : false;

                        let selectFieldId = '';
                        if( setDetail['selectedEnums']&&setDetail['selectedEnums'][0]&&setDetail['selectedEnums'][0]!=='' ){
                            selectFieldId = setDetail['selectedEnums'][0];
                            arrData['selectOption'] = [];
                            arrData['selectOption'] = setDetail['selectedEnums_options'][selectFieldId] || [];
                            arrData['selectFieldId'] = selectFieldId;
                            arrData['selectField'] = this.data.fieldInfos[selectFieldId]?this.data.fieldInfos[selectFieldId].dfield : '';
                            arrData['selectFieldName'] = this.data.fieldInfos[selectFieldId]?this.data.fieldInfos[selectFieldId].dname : '';
                            arrData['isSetSelect'] = true;
                        }else {
                            arrData['isSetSelect'] = false;
                        }

                        //循环里面每一个小的数据
                        let data2show = [];
                        let everyData = [];
                        for( let key in select ){
                            if( key === '_id' || ( !this.data.fieldInfos[key] ) ){
                                continue;
                            }
                            everyData.push( {
                                fieldId: key,
                                _id: select['_id'],
                                fieldName: this.data.fieldInfos[key]['dname'] || '',
                                fieldValue: select[key] || ''
                            } )
                        }
                        for( let d of everyData ){
                            if( !arrData['isShow'] && this.data.searchText !== '' && ( d.fieldName.indexOf( this.data.searchText ) !== -1 || d.fieldValue.toString().indexOf( this.data.searchText ) !== -1 ) ){
                                arrData['isShow'] = true;
                                break;
                            }
                        }

                        data2show.push( everyData );
                        arrData['data2show'] = data2show;



                        //循环里面每一个小的数据
                        let data3show = [];
                        let select_3 = setDetail['selectedRepresents_data'][setDetail['selectedOpts_data'].indexOf(select)];
                        let everyData_3 = [];
                        for( let key in select_3 ){
                            if( key === '_id' || ( !this.data.fieldInfos[key] ) ){
                                continue;
                            }
                            everyData_3.push( {
                                fieldId: key,
                                _id: select_3['_id'],
                                fieldName: this.data.fieldInfos[key]['dname'] || '',
                                fieldValue: select_3[key] || ''
                            } );
                            if( selectFieldId !== '' ){
                                everyData_3[0]['selectValue'] = '';
                                for( let s of setDetail['selectedEnums_data'] ){
                                    if( s._id === select_3['_id'] ){
                                        let selectLabel = s[selectFieldId];
                                        for( let o of arrData['selectOption'] ){
                                            if( o.label === selectLabel ){
                                                everyData_3[0]['selectValue'] = o.value;
                                                everyData_3[0]['selectLabel'] = selectLabel;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        for( let d of everyData_3 ){
                            if( !arrData['isShow'] && this.data.searchText !== '' && ( d.fieldName.indexOf( this.data.searchText ) !== -1 || d.fieldValue.toString().indexOf( this.data.searchText ) !== -1 ) ){
                                arrData['isShow'] = true;
                                break;
                            }
                        }
                        data3show.push( everyData_3 );
                        arrData['data3show'] = data3show;
                        day['data'].push( arrData );

                    }

                }
            }
            // 工作流数据

            if(this.data.isShowWorkflowData) {
                for( let d of this.data.workflowData ){
                    if( d['create_time'].indexOf( day.dataTime ) !== -1 ){
                        day['data'].push( {
                            data: d,
                            color: CalendarToolService.handleColorRGB( '#64A6EF' , 0.5 ),
                            srcColor: '#64A6EF',
                            isDrag:0,
                            isShow: true,
                            type: 3
                        } )
                    }
                }
            }
            day['dateLength'] = day['data'].length || 0;
        },

        monthDataTogether: function (){
            for( let week of this.data.monthDataList ){
                for( let day of week['weekList'] ){
                    this.actions.getDayData(day);
                }
            }

            this.el.find('.calendar-main-content').empty();
            if(this.data.calendarContent === 'month') {
                this.append(new CalendarMonth(this.data.monthDataList), this.el.find(".calendar-main-content"));
            } else if(this.data.calendarContent === 'week') {
                this.append(new CalendarWeek(this.data.weekDataList), this.el.find(".calendar-main-content"));
            } else if(this.data.calendarContent === 'day') {
                this.append(new CalendarDay(this.data.dayDataList), this.el.find(".calendar-main-content"));
            }
        },

        workflowMission: function(){
            if( this.data.isWorkflowDataReady ){
                this.actions.monthDataTogether();
            }
        }
    },
    firstAfterRender: function () {
        let year = CalendarTimeService.getYear(),
            month = CalendarTimeService.getMonth(),
            week = CalendarTimeService.getWeek(),
            day = CalendarTimeService.getDay();
        this.data.today = Object.assign({}, {'y': year, 'm':month, 'd':day, 'w':week});
        this.actions.createMonthCalendar(year, month);

        this.data.selectData = this.data.today;
        this.data.todayStr = CalendarTimeService.formatDate(year, month, day);
        this.data.chooseDate = CalendarTimeService.formatDate(year, month, day);
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});

        Mediator.on('CalendarWorkflowData: workflowData', data => {
            this.data.workflowData = data;
            this.data.isWorkflowDataReady = true;
            this.actions.workflowMission();
        });

        Mediator.on('Calendar: changeMainView', data => {
            this.data.calendarContent = data.calendarContent;
            if(data.calendarContent === 'month') {
                this.actions.createMonthCalendar(this.data.selectData.y, this.data.selectData.m);
                this.actions.changeMainView(this.data.calendarContent);
            }else {
                if(this.data.calendarContent === 'today') {
                    this.data.selectData = this.data.today;
                    this.data.calendarContent = 'day';
                    this.actions.changeMainView(this.data.calendarContent);
                } else if(this.data.calendarContent === 'schedule') {
                    this.el.find('.calendar-main-content').empty();
                    this.actions.getCalendarData({
                        from_date: this.data.from_date,
                        to_date: this.data.to_date,
                        cancel_fields: JSON.stringify(this.data.cancel_fields)
                    });
                    //this.actions.makeScheduleData(this.data.from_date, this.data.to_date);
                }else {
                    this.actions.changeMainView(this.data.calendarContent);
                }
            }
        });

        Mediator.on('Calendar: tool', data => {
            if(data.toolMethod === 'refresh') {
                if(this.data.calendarContent !== 'schedule') {
                    this.actions.getCalendarData({
                        from_date: this.data.from_date,
                        to_date: this.data.to_date,
                        cancel_fields: JSON.stringify(this.data.cancel_fields)
                    },'calendar');
                } else {
                    this.actions.getCalendarData({
                        from_date: this.data.from_date,
                        to_date: this.data.to_date,
                        cancel_fields: JSON.stringify(this.data.cancel_fields)
                    });
                }

            }else if(data.toolMethod === 'export') {
                PMAPI.openDialogByComponent(CalendarExport, {
                    width: '350',
                    height: '150',
                    title: '导出',
                }).then(data => {
                    console.log(data);
                });
            }

        });

        Mediator.on('Calendar: changeDate', data => {
            if(data === 'pre') {
                if(this.data.calendarContent === 'month') {
                    this.actions.changeMonth('l');
                    this.actions.changeMainView('month');
                } else if (this.data.calendarContent === 'week') {
                    this.actions.changeWeek('l');
                    this.actions.changeMainView('week');
                } else if (this.data.calendarContent === 'day') {
                    this.actions.changeDay('l');
                    this.actions.changeMainView('day');
                }
            } else {
                if(this.data.calendarContent === 'month') {
                    this.actions.changeMonth('r');
                    this.actions.changeMainView('month');
                } else if (this.data.calendarContent === 'week') {
                    this.actions.changeWeek('r');
                    this.actions.changeMainView('week');
                } else if (this.data.calendarContent === 'day') {
                    this.actions.changeDay('r');
                    this.actions.changeMainView('day');
                }
            }
        });

        let that = this;
        Mediator.on('calendarSchedule: date', data => {

            that.actions.getCalendarData({
                from_date: data.from_date,
                to_date: data.to_date,
                cancel_fields: JSON.stringify(this.data.cancel_fields)
            },'schedule');
            that.data.scheduleStart = data.from_date;
            that.data.scheduleEnd = data.to_date;
        });

        Mediator.on('calendar-left:unshowData', data => {
            if(data['data']) {
                this.data.isShowArr = data['data'];
                let arr = ['approve','remind'];
                let arr_1 = [];
                for( let a of this.data.isShowArr ){
                    if( arr.indexOf( a ) === -1 ){
                        arr_1.push( a );
                    }
                }
                this.data.cancel_fields = arr_1;

                if(this.data.calendarContent !== 'schedule') {
                    let json = {
                        from_date: this.data.from_date,
                        to_date: this.data.to_date,
                        cancel_fields: JSON.stringify(this.data.cancel_fields),
                    };
                    this.actions.getCalendarData(json, 'calendar');
                } else {
                    let json = {
                        from_date: that.data.scheduleStart,
                        to_date: that.data.scheduleEnd,
                        cancel_fields: JSON.stringify(this.data.cancel_fields),
                    };
                    this.actions.getCalendarData(json);
                }
            }
        });
        Mediator.on('calendar-left:approveData', data => {
            if(data.data) {
                this.data.isShowWorkflowData = true;
            }else {
                this.data.isShowWorkflowData = false;
            }
        });

        Mediator.on('Calendar: globalSearch', data => {
            if(data !== '') {
                this.actions.search(data);
            } else {
                this.data.searchText = '';
            }
        });

        Mediator.on('CalendarSelected: Search', data => {
            if(data) {
                let json = {
                    from_date:this.data.from_date,
                    to_date:this.data.to_date,
                    tableid2filter:JSON.stringify(data),
                    cancel_fields: JSON.stringify(this.data.cancel_fields),
                };
                if(this.data.calendarContent !== 'schedule') {
                    this.actions.getCalendarData(json, 'calendar');
                } else {
                    this.actions.getCalendarData(json);
                }

            }
        });

        Mediator.on('CalendarRemindTask: changeData', data => {
            let params = data;
            console.log(params);
            params['from_date'] = this.data.from_date;
            params['to_date'] = this.data.to_date;
            params['cancel_fields'] = JSON.stringify(this.data.cancel_fields);
            console.log(params);
            CalendarService.getCalendarDrag(params).then(res => {
                console.log(res);
                this.data.date2settings = res['calendar_data']['date2csids'];
                this.data.calendarSettings = res['calendar_data']['id2data'];
                this.data.tableid2name = res['calendar_data']['tableid2name'];
                this.data.fieldInfos = res['calendar_data']['field_infos'];
                if(this.data.calendarContent !== 'schedule') {
                    this.actions.monthDataTogether();
                }else {
                    this.actions.makeScheduleData(data.from_date, data.to_date);
                }
                this.actions.getDataCount();
            })
        });

        Mediator.on('CalendarDrag: dragRemind', data => {
            data['from_date'] = this.data.from_date;
            data['to_date'] = this.data.to_date;
            data['cancel_fields'] = JSON.stringify(this.data.cancel_fields);
            CalendarService.getCalendarDrag(data).then(res => {
                console.log(res);
            })
        });

    },
    beforeDestory: function () {
        Mediator.removeAll('CalendarWorkflowData: workflowData');
        Mediator.removeAll('Calendar: changeMainView');
        Mediator.removeAll('Calendar: tool');
        Mediator.removeAll('Calendar: changeDate');
        Mediator.removeAll('calendarSchedule: date');
        Mediator.removeAll('calendar-left: unshowData');
        Mediator.removeAll('calendar-left: approve');
        Mediator.removeAll('Calendar: globalSearch');
        Mediator.removeAll('CalendarSelected: Search');
        Mediator.removeAll('CalendarRemindTask: changeData');
        Mediator.removeAll('CalendarDrag: dragRemind');
    }
};

class CalendarMain extends Component {
    constructor(data) {
        config.data.cancel_fields = data;
        super(config);
    }
}

export default CalendarMain;