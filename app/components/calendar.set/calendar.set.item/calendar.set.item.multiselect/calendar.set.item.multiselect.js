import Component from "../../../../lib/component";
import template from './calendar.set.item.multiselect.html';
import './calendar.set.item.multiselect.scss';

let config = {
    template: template,
    data: {
        data_list:[],
    },
    actions: {
        addli_html:function(that,item){
            let strhtml  = "";
            strhtml = "<li class=\"search-item\"><div class=\"search-content-item\">" +
                "<input type=\"checkbox\" id='"+item.id+"' class=\"chk_1 chk_remind \" checked /><label for=\"checkbox_all\"></label>" +
                "<label class=\"content-item\">"+item.name+"</label></div></li>";
            return strhtml;
        }
    },
    afterRender: function () {
        let that = this;
        let li_strhtml = "";
        this.data.data_list.forEach(item =>{
            li_strhtml += that.actions.addli_html(that,item)
        });
        that.el.find(".search-items").html("");
        that.el.find(".search-items").html(li_strhtml);
        that.el.on("click",".head-select",function(){
            event.stopPropagation();
            {
                if(!$(this).next('.select-multi-content').is(":hidden")){
                    $(".select-multi-content").hide();
                }else{
                    $(".select-multi-content").hide();
                    $(this).next().show();
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
                $(this).parent().next(".search-data").find("input").addClass("checkbox_all_checked")
                $(this).parent().next(".search-data").find(".content-item").each(function(){
                    all_content_value.push($(this).html());
                });
            }
            all_content.val(all_content_value);
        });
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