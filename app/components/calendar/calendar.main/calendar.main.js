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

import {CalendarService} from '../../../services/calendar/calendar.service';
import {PMAPI} from '../../../lib/postmsg';
import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    data: {
        HeadList: [ '星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
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
        isWorkflowDataReady: false,

        workflow_approve_data: [],
        is_approve_workflow: false,

        workflow_approving_data: [],
        is_approving_workflow: false,

        workflow_focus_data: [],
        is_focus_workflow: false,

        isShowWorkflowData: true,
    },
    actions: {
        getDayNumOfMonth: function ( year , month ) {
            month++;
            let d = new Date( year , month , 0 );
            return d.getDate();
        },
        getWeekByDay: function( year, month, day ){
            let d = new Date( year, month, day );
            return d.getDay();
        },
        addOneDay: function( oldDay ){
            let oMyTime = new Date( oldDay ).getTime();
            oMyTime = oMyTime + 24*60*60*1000;
            let nweTime = new Date(oMyTime);
            let year = nweTime.getFullYear(),
                month = nweTime.getMonth(),
                day = nweTime.getDate(),
                week = nweTime.getDay();
            return year+'-'+this.actions.addZero(month+1)+'-'+this.actions.addZero(day);
        },
        addZero: function( num ){
            return ( num < 10 ) ? ( "0" + num ) : num;
        },
        colorRgb: function(str, opcity){
            let sColor = str.toLowerCase();
            if(sColor){
                if(sColor.length === 4){
                    let sColorNew = "#";
                    for(let i=1; i<4; i+=1){
                        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                let sColorChange = [];
                for(let i=1; i<7; i+=2){
                    sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
                }
                return "rgba(" + sColorChange.join(",")+","+opcity + ")";
            }else{
                return sColor;
            }
        },

        refresh: function () {
            this.el.find('.calendar-main-content').empty();
            if(this.data.calendarContent !== 'schedule') {

            } else {
                this.actions.makeScheduleData(this.data.from_date, this.data.to_date);
            }
        },

        getWorkflowData: function () {
            CalendarService.getWorkflowRecords( {type: 5,'from_date':this.data.from_date,'to_date':this.data.to_date} ).then( res=>{//approve
                this.data.workflow_approve_data = res.rows;
                this.data.is_approve_workflow = true;
                this.actions.getWorkflowDataTogether();
            });
            CalendarService.getWorkflowRecords( {type: 2,'from_date':this.data.from_date,'to_date':this.data.to_date} ).then( res=>{//approving
                this.data.workflow_approving_data = res.rows;
                this.data.is_approving_workflow = true;
                this.actions.getWorkflowDataTogether();
            });
            CalendarService.getWorkflowRecords( {type: 6,'from_date':this.data.from_date,'to_date':this.data.to_date} ).then( res=>{//focus
                this.data.workflow_focus_data = res.rows;
                this.data.is_focus_workflow = true;
                this.actions.getWorkflowDataTogether();
            });
        },
        getWorkflowDataTogether: function () {
            if( this.data.is_approve_workflow && this.data.is_approving_workflow && this.data.is_focus_workflow ){
                let arr = [];
                try{
                    arr = this.data.workflow_approve_data.concat( this.data.workflow_approving_data );
                    arr = arr.concat( this.data.workflow_focus_data );
                }catch(e){}
                this.data.workflowData = arr;
                this.actions.monthDataTogether();
            }
        },

        getCalendarData: function (data,type){
            // if(this.data.isShowWorkflowData) {
            //     this.actions.getWorkflowData();
            // }
            this.actions.getWorkflowData();
            CalendarService.getCalendarData(data).then( res=>{
                this.data.date2settings = res['date2csids'];
                this.data.calendarSettings = res['id2data'];
                this.data.tableid2name = res['tableid2name'];
                this.data.fieldInfos = res['field_infos']
                if(type === 'month') {
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

            // else if( this.data.calendarContent === 'schedule' ){
            //     for( let day of this.scheduleDataList ){
            //         for( let d of day['data'] ){
            //             if( d.type === 1 && this.data.isShowArr.indexOf( d.fieldId ) === -1 && d.isShow ){
            //                 i++;
            //             }else if( d.type === 2 ){
            //                 j++;
            //             }else if( d.type === 3 && d.isShow && this.data.isShowArr.indexOf('approve') === -1 ){
            //                 w++;
            //             }else if( d.type === 4 && d.isShow && this.data.isShowArr.indexOf('mission') === -1 ){
            //                 m++;
            //             }
            //         }
            //     }
            // }
            this.data.remindCount = i;
            this.data.workflowCount = w;
            this.el.find('.remind-num').html(this.data.remindCount);
            this.el.find('.approval-num').html(this.data.workflowCount);
            // if( this.firstFlash ){
            //     setTimeout( ()=>{
            //         this.isShowLoading = false;
            //         this.firstFlash = false;
            //         this.cd.markForCheck();
            //     },1000 )
            // }else {
            //     this.isShowLoading = false;
            //     $('.ui-dialog-content').css( 'overflow','auto' );
            //     this.cd.markForCheck();
            // }
            // this.returnWidthHeight();
        },

        createMonthCalendar: function (y,m){
            Mediator.emit('CalendarMain: date',{from_date: this.data.from_date, to_date: this.data.to_date});
            let monthDayNum = this.actions.getDayNumOfMonth( y , m ),
                firstDayWeek = this.actions.getWeekByDay( y , m , 1 );
            let endNum = ( monthDayNum + firstDayWeek ) > 35 ? 42 : 35;
            let startNum = 1 - firstDayWeek;

            //组成数据
            this.data.monthDataList.length = 0;
            let arr = [];
            for( let i=1; i<=42 ;i++ ){
                let obj = {};
                obj['data'] = [];
                if( startNum<1 || startNum>monthDayNum){
                    obj['isPartOfMonth'] = false;
                }else {
                    let dateTime = y + "-" + this.actions.addZero( m + 1 ) + "-" + this.actions.addZero( startNum );
                    obj['isToday'] = dateTime === this.data.todayStr ? true : false;
                    obj['dataTime'] = dateTime;
                    obj['dayNum'] = startNum;
                    obj['week'] = arr.length;
                    obj['year'] = y;
                    obj['month'] = m;
                    // obj['isSelect'] = ( this.chooseDate == dateTime ) ? true : false;
                    obj['isPartOfMonth'] = true;
                }
                startNum++;
                arr.push( obj );
                if( i % 7 === 0 && i >= 7 ){
                    this.data.monthDataList.push( { "weekList": arr } );
                    arr  =[];
                }
            }
            let pre_m = m,
                pre_y = y;
            if( pre_m === 0 ){
                pre_y = pre_y-1;
                pre_m = 11;
            }else {
                pre_m = pre_m - 1;
            }
            let prevMonthNum = this.actions.getDayNumOfMonth( pre_y , pre_m );
            for( let i=6 ;i>=0; i-- ){
                let day = this.data.monthDataList[0]['weekList'][i];
                if( !day['isPartOfMonth'] ){
                    day['dayNum'] = prevMonthNum;
                    day['week'] = 6-i;
                    day['year'] = pre_y;
                    day['month'] = pre_m;
                    day['dataTime'] = pre_y + "-" + this.actions.addZero( pre_m + 1 ) + "-" + this.actions.addZero( prevMonthNum );
                    prevMonthNum--;
                }
            }

            let next_m = m,
                next_y = y;
            if( next_m === 11 ){
                next_y = next_y + 1;
                next_m = 0;
            }else {
                next_m = next_m + 1;
            }

            let j = 1;
            for( let i = 0;i<=6;i++ ){
                let day = this.data.monthDataList[4]['weekList'][i];
                if( !day['isPartOfMonth'] ){
                    day['dayNum'] = j;
                    day['week'] = i;
                    day['year'] = next_y;
                    day['month'] = next_m;
                    day['dataTime'] = next_y + "-" + this.actions.addZero( next_m + 1 ) + "-" + this.actions.addZero( j );
                    j++;
                }
            }
            for( let i = 0;i<=6;i++ ){
                let day = this.data.monthDataList[5]['weekList'][i];
                if( !day['isPartOfMonth'] ){
                    day['dayNum'] = j;
                    day['year'] = next_y;
                    day['month'] = next_m;
                    day['dataTime'] = next_y + "-" + this.actions.addZero( next_m + 1 ) + "-" + this.actions.addZero( j );
                    j++;
                }
            }

            this.data.from_date = this.data.monthDataList[0]['weekList'][0]['dataTime'];
            this.data.to_date = this.data.monthDataList[5]['weekList'][6]['dataTime'];
            this.actions.getCalendarData({from_date: this.data.from_date, to_date: this.data.to_date, cancel_fields: this.data.cancel_fields},'month');
        },


        createWeekCalendar: function (){
            console.log(this.data.selectData);
            this.data.chooseDate = this.data.selectData.y + "-" + this.actions.addZero( this.data.selectData.m + 1 ) + "-" + this.actions.addZero( this.data.selectData.d );
            this.data.weekDataList = [];
            let weekData = [];
            for( let data of this.data.monthDataList ){
                for( let d of data['weekList'] ){
                    if( d['dataTime'] === this.data.chooseDate ){
                        weekData = data['weekList'];
                        break;
                    }
                }
            }
            // let arrHead = [{time:'',isTime:true,isHead: true}];
            let arrHead = [];
            for( let d of weekData ){
                arrHead.push( {time:d.dataTime,isTime:false,isHead: true} );
            }

            this.data.weekDataList.push( arrHead );
            this.data.weekDataList.push( weekData );

            if(arrHead.length !== 0) {
                this.data.selectedDateShow = arrHead[0]['time'] + ' -- ' + arrHead[6]['time'];
                $('.nowDate').html(this.data.selectedDateShow);

                this.data.from_date = arrHead[0]['time'];
                this.data.to_date = arrHead[6]['time'];
            }

        },

        createDayCalendar: function(){
            this.data.dayDataList = [];
            let date = this.data.selectData.y + "-" + this.actions.addZero( this.data.selectData.m + 1 ) + "-" + this.actions.addZero( this.data.selectData.d );
            for( let data of this.data.monthDataList ){
                for( let d of data['weekList'] ){
                    if( d.dataTime === date ){
                        this.data.dayDataList.push( d );
                        break;
                    }
                }
            }
            this.data.selectedDateShow = this.data.selectData.y + "年" + ( this.data.selectData.m + 1 ) + "月" + this.data.selectData.d + "日 （"+ this.data.HeadList[this.data.selectData.w] +"）";
            $('.nowDate').html(this.data.selectedDateShow);
            this.data.from_date = date;
            this.data.to_date = date;
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
            let slect = this.data.selectData['y'] + "-" + this.actions.addZero( this.data.selectData.m + 1 ) + "-" + this.actions.addZero( this.data.selectData['d']);
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

            this.data.chooseDate = year + "-" + this.actions.addZero( month ) + "-" + this.actions.addZero( day );

            this.actions.createWeekCalendar();
        },

        changeDay: function (lr) {
            let oldDate = this.data.selectData.y+'-'+this.actions.addZero(this.data.selectData.m+1)+'-'+this.actions.addZero(this.data.selectData.d);
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
            // this.data.selectedDateShow = year + '年' + month + '月' + day + '日' + ' ';
            // $('.nowDate').html(this.data.selectedDateShow);
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

                    if( setDetail.type === 0 ){
                        arrData['tableId'] = setDetail.table_id;
                        arrData['time'] = set.date;
                        arrData['setId'] = set.id;
                        arrData['dfield'] = setDetail.dfield;
                        arrData['color'] = this.actions.colorRgb( setDetail.color , 0.5 );
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
                            color: this.actions.colorRgb( '#64A6EF' , 0.5 ),
                            srcColor: '#64A6EF',
                            isDrag:0,
                            isShow: true,
                            type: 3
                        } )
                    }
                }
            }


            day['dateLength'] = day['data'].length || 0;
            //console.log(day);
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
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});

        let oDate = new Date(),
            year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate(),
            week = oDate.getDay();
        this.data.today = Object.assign({}, {'y': year, 'm':month, 'd':day, 'w':week});
        this.data.selectData = this.data.today;
        this.data.todayStr = year + "-" + this.actions.addZero( month + 1 ) + "-" + this.actions.addZero( day );
        this.data.chooseDate = year + "-" + this.actions.addZero( month + 1 ) + "-" + this.actions.addZero( day );
        this.data.selectedDateShow = year+'年'+(month+1) +'月';
        this.el.find('.nowDate').html(this.data.selectedDateShow);
        this.actions.createMonthCalendar(year, month);

        this.el.on('click', '#monthView', () => {
            this.actions.changeMainView('month');
        }).on('click', '#weekView', () => {
            this.actions.changeMainView('week');
        }).on('click', '#dayView', () => {
            this.actions.changeMainView('day');
        }).on('click', '.pre-date', () => {
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
        }).on('click', '.next-date', () => {
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
        }).on('click', '#refresh', () => {
            if(this.data.calendarContent) {
                this.actions.createMonthCalendar(this.data.selectData.y, this.data.selectData.m);
            }
            this.actions.changeMainView(this.data.calendarContent);
            //this.actions.getCalendarData({from_date: this.data.from_date, to_date: this.data.to_date},this.data.calendarContent);
        }).on('click', '#schedule', () => {
            this.data.calendarContent = 'schedule';
            this.el.find('.calendar-main-content').empty();
            this.actions.makeScheduleData(this.data.from_date, this.data.to_date);
        }).on('click', '#export', () => {
            let component = new CalendarExport();
            let el = $('<div>').appendTo(document.body);
            component.render(el);
            el.dialog({
                title: '导出',
                width: '350',
                height: '150',
                background: '#ddd',
                close: function() {
                    $(this).dialog('destroy');
                    component.destroySelf();
                }
            });
        }).on('click', '#todayView', () => {
            this.data.selectData = this.data.today;
            this.actions.changeMainView('day');
        });
        Mediator.on('calendar-left:leftSelectedDate',data => {
            let y = Number(data['year']),
                m = Number(data['month']),
                d = Number(data['day']),
                w = this.actions.getWeekByDay( y , m-1 , d );
            this.data.chooseDate = y + "-" + this.actions.addZero( m ) + "-" + this.actions.addZero( d );
            this.data.selectData = Object.assign({}, {'y': y, 'm':m-1, 'd':d, 'w':w});
            if(this.data.calendarContent === 'month') {
                this.data.selectedDateShow = y +'年'+ m +'月';
                $('.nowDate').html(this.data.selectedDateShow);
                this.actions.changeMainView('month');
            } else if(this.data.calendarContent === 'week') {
                this.actions.changeMainView('week');
            } else if(this.data.calendarContent === 'day') {
                this.actions.changeMainView('day');
            }
        });
        let that = this;

        Mediator.on('calendarSchedule: date', data => {
            that.actions.getCalendarData(data,'schedule');
            that.data.scheduleStart = data.from_date;
            that.data.scheduleEnd = data.to_date;
        });

        // CalendarService.CalendarMsgMediator.subscribe('unshowData', data => {
        //     console.log(data);
        // })
        Mediator.on('calendar-left:unshowData', data => {
            if(data['data']) {
                console.log(data['data']);
                this.data.isShowArr = data['data'];
                let arr = ['approve','remind'];
                let arr_1 = [];
                for( let a of this.data.isShowArr ){
                    if( arr.indexOf( a ) === -1 ){
                        arr_1.push( a );
                    }
                }
                this.data.cancel_fields = arr_1;
                console.log(this.data.cancel_fields);
                if(this.data.calendarContent === 'month') {
                    this.actions.createMonthCalendar(this.data.selectData.y, this.data.selectData.m);
                }
                this.actions.changeMainView(this.data.calendarContent);
            }
        });
        Mediator.on('calendar-left: approve', data => {
            this.data.isShowWorkflowData = data;
            console.log(this.data.isShowWorkflowData);
            if(this.data.calendarContent === 'month') {
                this.actions.createMonthCalendar(this.data.selectData.y, this.data.selectData.m);
            }
            this.actions.changeMainView(this.data.calendarContent);
        })

    }
};

class CalendarMain extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarMain;