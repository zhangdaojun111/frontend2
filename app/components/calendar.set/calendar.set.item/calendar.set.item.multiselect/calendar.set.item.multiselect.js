/**
 * Created by lipengfei.
 * 下拉多选搜索（已删除）
 */
import Component from "../../../../lib/component";
import template from './calendar.set.item.multiselect.html';
import './calendar.set.item.multiselect.scss';

import {CalendarService} from '../../../../services/calendar/calendar.service';
import {PMAPI} from '../../../../lib/postmsg';
import Mediator from '../../../../lib/mediator';
let config = {
    template: template,
    data: {
        data_list:[],
    },
    actions: {
        onInput: function (input) {
            let value = input.val();
            if (value === '') {
                this.el.find('li').show();
            } else {
                this.el.find('li').hide();
                this.el.find(`li[data-name*=${value}]`).show();
            }
            this.actions.clearValue();
        },
    },
    afterRender: function () {
        let that = this;
        that.el.on("click",".head-select",function(){
            event.stopPropagation();
            {
                if($(this).next('.select-multi-content').is(":hidden")){
                    $(".select-multi-content").hide();
                    $(this).next().show();
                }else{
                    $(".select-multi-content").hide();
                }
            }
        });
        that.el.on("click",".select-multi-content",function(){
            event.stopPropagation();
        }).on("click","li",function () {
            let all_content = $(this).parent().parent().parent().prev().find("input");
            let all_content_value = all_content.val();
            all_content_value = all_content_value.split(",");
            let content_item = $(this).children("div").find(".content-item").html();
            if($(this).children("div").find("input").is(".checkbox_all_checked")){
                $(this).children("div").find("input").removeClass("checkbox_all_checked");
                all_content_value.splice(all_content_value.indexOf(content_item),1)
            } else{
                $(this).children("div").find("input").addClass("checkbox_all_checked");
                all_content_value.push(content_item);
            }
            all_content.val(all_content_value);
        }).on("click",".checked-all-content",function(){
            let all_content = $(this).parent().parent().prev().find("input");
            let all_content_value = all_content.val();
            all_content_value = all_content_value.split(",");
            all_content_value = [];
            if($(this).prev("input").is(".checkbox_all_checked")){
                $(this).prev("input").removeClass("checkbox_all_checked");
                $(this).parent().next(".search-data").find("input").removeClass("checkbox_all_checked");
            } else{
                $(this).prev("input").addClass("checkbox_all_checked");
                $(this).parent().next(".search-data").find("input").addClass("checkbox_all_checked");
                $(this).parent().next(".search-data").find(".content-item").each(function(){
                    all_content_value.push($(this).html());
                });
            }
        }).on('input', '.select-search-content', _.debounce(function () {
            that.actions.onInput($(this));
        }, 1000));

        $(document).click(function(){
            that.el.find(".select-multi-content").hide();
        })

    }
};
class CalendarSetItemMulitSelect extends Component {
    constructor(data) {
        config.data.data_list = data;
        super(config);
    }
}
export default CalendarSetItemMulitSelect;