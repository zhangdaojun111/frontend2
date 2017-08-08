import Component from "../../../lib/component";
import template from './right-content.html';
import './right-content.scss';
import RightContentWorkFlow from './right.content.workflowcontent/right.content.workflowcontent';
import Mediator from '../../../lib/mediator';
import {CalendarService} from '../../../services/calendar/calendar.service';
let contentStatus1 = 0;
let contentStatus2 = 0;
let config = {
    template: template,
	data:{
	},
    actions: {
        test:function (i){
			i.show(300);
		},
        changeWolkFlowHeight:function(g){
			g.height("44%");
			contentStatus1 = 0;
		},
        contentHide1:function(temp1,temp2){
			if(contentStatus1 == 1){
                temp1.animate({height:"44%"},"fast");
				setTimeout(function(){config.actions.test(temp2)},200);
				contentStatus1 = 0;
				contentStatus2 = 0;
			}
			else if(contentStatus1 == 0){
                temp1.show();
                temp1.animate({height:"87%"},"fast");
                config.actions.changeWolkFlowHeight(temp2);
                temp2.hide();
				contentStatus1 = 1;
				contentStatus2 = 0;
			}
		},
        contentHide2:function(temp1,temp2){
			if(contentStatus2 == 1){
                temp2.animate({height:"44%"},350);
                temp1.show(350);
                temp1.animate({height:"44%"});
				contentStatus2 = 0;
				contentStatus1 = 0;
			}
			else if(contentStatus2 == 0){
                temp2.show();
                temp2.animate({height:"87%"});
                config.actions.changeWolkFlowHeight(temp1);
                temp1.height("10px;");
                temp1.hide(350);
				contentStatus1 = 0;
				contentStatus2 = 1;
			}
		},
    },
    afterRender: function() {
        this.el.css({"height":"100%","width":"100%"});
        let data = {from_date: "2017-05-01", to_date: "2017-05-31"};
        CalendarService.getWorkflowRecords(data).then(res => {
            console.log('res', res);
        });
		let worlkflow = [{"name": "王云峰 【Sarah审批的工作流】新建（普通）",'record_progress':"20%",'table_id':"59802e0105b1e5e0ed6d9b60"},{"name": "王云峰 【Sarah审批的工作流】新建（普通）",'record_progress':"30%",'table_id':"54_qCvzfx6SaPB34vAUa6ZpfB"}];
		worlkflow.forEach((row) =>{
			this.append(new RightContentWorkFlow(row), this.el.find('.item-content-2'));
		});
        this.el.on("click",".item-title-1",()=>{
            let temp1 = this.el.find(".item-content-1");
            let temp2 = this.el.find(".item-content-2");
            config.actions.contentHide1(temp1,temp2);
            console.log($(this));
        }).on("click",".item-title-2",()=>{
            let temp1 = this.el.find(".item-content-1");
            let temp2 = this.el.find(".item-content-2");
            config.actions.contentHide2(temp1,temp2);
        });
    }
};

class Rightcontent extends Component {
    constructor() {
        super(config);
    }
}

$(function(){

    
});
export default Rightcontent;