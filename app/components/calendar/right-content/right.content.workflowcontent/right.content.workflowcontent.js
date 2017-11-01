/**
 * Created by lipengfei.
 * 工作流进度展示
 */
import Component from "../../../../lib/component";
import template from './right.content.workflowcontent.html';
import './right.content.workflowcontent.scss';
import Mediator from '../../../../lib/mediator';
import {PMAPI} from '../../../../lib/postmsg';

let config = {

    template: template,
    data: {},
    actions: {
        toPercent: function (point) {
            let str = Number(point * 100).toFixed(1);
            str += "%";
            return str;
        },
        /**
         * 加载工作进度
         */
        showfirst() {
            let record_progress = this.actions.toPercent(this.data['record_progress']);
            this.el.find(".workflow-schedule").css({"width": record_progress});
            this.el.find(".workflow-content-title").attr("title",this.data.name);
        },
        /**
         * 打开与我相关工作
         */
        openMyWork: function () {
            PMAPI.openDialogByIframe(
                `/wf/approval/?record_id=${this.data['id']}&form_id=${this.data['form_id']}&table_id=${this.data['table_id']}&flow_id=${this.data['flow_id']}`,
                {
                    width: "100%",
                    height: '900',
                    modal: true,
                    customSize: true,
                }).then(data => {
                Mediator.emit('Calendar: tool', {toolMethod: 'refreshData'});
            })
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.workflow-content',
            callback: function () {
                this.actions.openMyWork();
            }
        },
    ],
    afterRender: function () {
        this.el.css("width", "100%");
        this.actions.showfirst();
    },
};

class RightContentWorkFlow extends Component {
    constructor(data,newConfig) {
        config.data = data;
        super($.extend(true,{},config,newConfig));
    }
}

export default RightContentWorkFlow;