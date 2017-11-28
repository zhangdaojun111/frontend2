/**
 * Created by lipengfei.
 * 日历树选择
 */
import Component from "../../../../lib/component";
import template from './leftContent.SelectLabel.html';
import './leftContent.SelectLabel.scss';
import {CalendarToolService} from '../../../../services/calendar/calendar.tool.service';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import {dgcService} from '../../../../services/dataGrid/data-table-control.service';
import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data: {
        dataitem: [],              //日历树数据
        cancel_fields: [],         //取消选中数组
        rows: [],
        items: [],                 //日历树中filedID
    },
    actions: {

        /**
         *加载子checkbox选中状态
         */
        loadDataHtml: function (data) {
            data.items.forEach((items) => {
                let filed_id = "#select-children-" + items.field_id;
                if (this.data.cancel_fields.indexOf(items.field_id) !== -1) {
                    this.el.find(filed_id).addClass("unchecked");
                }
                let color = CalendarToolService.handleColorRGB(items.color, 1);
                this.el.find(filed_id).css({backgroundColor: color});
            });
        },

        /**
         *隐藏子checkbox
         */
        selectLabelShow: function (temp) {
            if (!temp.hasClass('hide-check-group')) {
                temp.addClass("hide-check-group").closest(".calendar-select-table").nextAll('.checkbox-group').hide();
            }
            else {
                temp.removeClass("hide-check-group").closest(".calendar-select-table").nextAll('.checkbox-group').show();
            }
        },

        /**
         *父checkbox发生选择
         */
        selectHead: function (temp) {
            if (temp.is(".label-select-all-checked")) {
                this.events.checkbox({type: 'unshowData', staus: true, data: this.data.items});
                temp.removeClass("label-select-all-checked");
                this.el.find(".select-label-children").addClass('unchecked');
                this.events.checkbox({type: 'remind-checkbox', data: -1});
            } else {
                this.events.checkbox({type: 'unshowData', staus: false, data: this.data.items});
                temp.addClass("label-select-all-checked");
                this.el.find(".select-label-children").removeClass('unchecked');
                let isAllGroupChecked = true;
                this.el.parent().find(".label-select-all-show").each(function () {
                    if (!$(this).is('.label-select-all-checked')) {
                        isAllGroupChecked = false;
                    }
                });
                if (isAllGroupChecked) {
                    this.events.checkbox({type: 'remind-checkbox', data: 1});
                }
            }
        },

        /**
         *子checkbox发生选择
         */
        selectLabelChildren: function (temp) {
            let dataItem = [];
            dataItem[0] = temp.attr("id").split("-")[2];
            if (temp.is(".unchecked")) {
                this.events.checkbox({type: 'unshowData', staus: false, data: dataItem});
                temp.removeClass('unchecked');
                let isAllChecked = true;
                this.el.find(".select-label-children").each(function () {
                    if ($(this).is('.unchecked')) {
                        isAllChecked = false;
                        return false;
                    }
                });
                if (isAllChecked) {
                    this.el.find(".select-head").addClass('label-select-all-checked');
                    let isAllGroupChecked = true;
                    this.el.parent().find('.select-head').each(function () {
                        if (!$(this).is('.label-select-all-checked')) {
                            isAllGroupChecked = false;
                        }
                    });
                    if (isAllGroupChecked) {
                        this.events.checkbox({type: 'remind-checkbox', data: 1});
                    }
                }
            }
            else {
                this.events.checkbox({type: 'unshowData', staus: true, data: dataItem});
                temp.addClass('unchecked');
                this.el.find(".select-head").removeClass('label-select-all-checked');
                this.events.checkbox({type: 'remind-checkbox', data: -1});
            }
        },

        /**
         *页面判断隐藏项和父checkbox的状态
         */
        showFirst: function () {
            let IsChecked = true;
            let items_Id = this.data.dataitem.items.map((item) => {
                return item.field_id;
            });
            this.data.items = items_Id;
            for (let i = 0; i < items_Id.length; i++) {
                if (this.data.cancel_fields.indexOf(items_Id[i]) !== -1) {
                    IsChecked = false;
                    break;
                }
                IsChecked = true;
            }
            if (IsChecked) {
                this.el.find(".select-head").addClass("label-select-all-checked");
            }
            this.actions.loadDataHtml(this.data.dataitem);
        },

        /**
         *常用功能查询
         * 参数：日历树ID,searchValue
         */
        goSearch: function (table_id, searchValue) {
            let temp;
            for (let d of this.data.rows) {
                if (d.table_id === table_id) {
                    temp = d;
                }
            }
            temp.searchValue = searchValue;
            let obj = {};
            for (let d of this.data.rows) {
                if (d.searchValue !== '0') {
                    let val = d.searchValue;
                    for (let search of d.query_params) {
                        if (val === search.id.toString()) {
                            obj[d.table_id] = dgcService.translateAdvancedQuery(JSON.parse(search.queryParams));
                        }
                    }
                }
            }
            Mediator.emit('CalendarSelected: Search', obj);
        },

        /**
         *隐藏日历树
         */
        hide_group: function () {
            this.el.find(".select-head").removeClass("label-select-all-show");
            this.events.checkbox({type: 'unshowData', staus: true, data: this.data.items});
            this.events.checkbox({type: 'hideData', data: this.data.dataitem});
            this.destroySelf();
        },
    },
    events: {},
    binds: [
        {
            event: 'mouseleave',
            selector: '.float-button-group',
            callback: function () {
                this.el.find(".float-button-group").hide();
                this.el.find(".search-function").css("display", "none");
            }
        },
        {
            event: 'click',
            selector: '.float-button-group-show',
            callback: function () {
                this.el.find(".float-button-group").css({
                    "display": "block",
                    "top": this.el.find(".float-button-group-show").offset().top - 80
                });
            }
        },
        {
            event: 'click',
            selector: '.select-head',
            callback: function (context) {
                this.actions.selectHead($(context));
            }
        },
        {
            event: 'click',
            selector: '.select-label-children',
            callback: function (context) {
                this.actions.selectLabelChildren($(context));
            }
        },
        {
            event: 'mouseover',
            selector: '.hide-span-function',
            callback: function () {
                event.stopPropagation();
                this.el.find(".search-function").show();
            }
        },
        {
            event: 'mouseover',
            selector: '.hide-type-group',
            callback: function () {
                this.el.find(".search-function").css("display", "none");
            }
        },
        {
            event: 'mouseover',
            selector: '.float-button-group',
            callback: function () {
                event.stopPropagation();
                this.el.find(".float-button-group").show();
            }
        },
        {
            event: 'click',
            selector: '.search-function-children',
            callback: function (context) {
                this.actions.goSearch(this.data.dataitem.table_id, $(context).attr("class").split(" ")[1]);
            }
        },
        {
            event: 'click',
            selector: '.select-label-show',
            callback: function (context) {
                this.actions.selectLabelShow($(context));
            }
        },
        {
            event: 'click',
            selector: '.hide-type-group',
            callback: function () {
                this.actions.hide_group();
            }
        },
        {
            event:'mouseleave',
            selector:'.float-button-group-hide',
            callback:function () {
                this.el.find(".float-button-group").hide();
                this.el.find(".search-function").css("display", "none");
            }
        }
    ],

    afterRender: function () {
        // Mediator.on('Calendar: showLoading', data => {
        //     if(data === 1){
        //         this.cancelEvents();
        //     }else{
        //         this.bindEvents();
        //     }
        // });
    },
    firstAfterRender: function () {
        this.actions.showFirst();
    },
};

class LeftContentSelect extends Component {
    constructor(data, cancel_fields, hide_item_table, rows, event,newConfig) {
        config.data.dataitem = data;
        config.data.dataitem.searchValue = 0;
        config.data.cancel_fields = cancel_fields;
        config.data.rows = rows;
        config.events.checkbox = event;
        super(config,$.extend(true,{},config,newConfig));
    }

}

export default LeftContentSelect;