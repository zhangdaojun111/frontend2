/**
 * Created by zj on 2017/7/27.
 */
import Component from "../../../../lib/component";
import template from './calendar.month.html';
import './calendar.month.scss';

import CalendarTableHeader from '../calendar.subcomponent/calendar.table.header/calendar.table.header';
import CalendarTableBody from './calendar.table.body/calendar.table.body';
import TableGrid from '../calendar.subcomponent/calendar.table.grid/calendar.table.grid';

let config = {
    template: template,
    data: {
        HeadList: [
            {itemTitle:'星期日'},
            {itemTitle:'星期一'},
            {itemTitle:'星期二'},
            {itemTitle:'星期三'},
            {itemTitle:'星期四'},
            {itemTitle:'星期五'},
            {itemTitle:'星期六'},
        ],
        monthBodyDataList: [],
    },
    actions: {

    },
    afterRender: function() {
        this.data.fromDate = this.data.monthBodyDataList[0]['weekList'][0]['dataTime'];
        this.el.css({"height":"100%","width":"100%"});
        this.append(new CalendarTableHeader({headTitle: this.data.HeadList, type:'month'}), this.el.find('.month-head'));
        this.data.monthBodyDataList.forEach((item,index) => {
            this.append(new CalendarTableBody({item,index}), this.el.find('.month-body'));
        });
        let temp;
        // this.el.find(".task-item").parent().draggable({
        //     start:function(){
        //         // temp = $(this);
        //         // $(this).css({'width':$(this).parent().width()});
        //         //$(this).hide();
        //         // event.clientY
        //     },
        //     // cancel: "",
        //     revert: "invalid",
        //     parent:this.el.find(".month-body"),
        //     connectToSortable: $( ".task-list" ),
        //     // containment: "document",
        //     // helper: "clone",
        //     cursor: "move",
        //     helper:function(){
        //         $(this).css("index-z","2048");
        //         console.log($(this));
        //         return $(this);
        //         // "<div><div class='task-item' style='width:"+$(this).parent().width() +"px'>"+ $(this).html()+"</div></div>";
        //     },
        //
        // });
        // console.log(this.el.find('div.task-list'));
        // this.el.find(".task-list").droppable({
        //     accept: $(".task-item"),
        //     activeClass: "",
        //     drop: function(event, ui) {
        //         $(this).mouseup(function(){
        //             console.log($(this),ui.draggable);
        //         })
        //     },
        //     deactivate( event, ui ){
        //         // console.log("!!!!!!");
        //     }
        // });
        // this.el.find( ".task-list" ).sortable({
        //     revert: true
        // });
        // this.el.find(".task-item").disableSelection();

    }
};

class CalendarMonth extends Component {
    constructor(data) {
        config.data.monthBodyDataList = data;
        super(config);
    }
}

export default CalendarMonth;