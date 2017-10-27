import Component from '../../../lib/component';
import template from './approval-opinion.html'
// import Mediator from "../../../lib/mediator";
import './approval-opinion.scss';
import {PMAPI} from '../../../lib/postmsg'
import AttachmentControl from "../../form/attachment-control/attachment-control";


let config = {
    template: template,
    data: {
        // css: css.replace(/(\n)/g, ''),
        fileList: [],
    },
    binds:[
        {
            event: 'click',
            selector: '.J_sure',
            callback: function (event) {
                this.actions.determine();
                console.log(this.data.fileList);
                PMAPI.sendToParent({
                    type: '1',
                    key: window.config.key,
                    data: {
                        determine:true,
                        key: this.key,
                        comment: this.data.comment,
                        attachment: this.data.fileList
                    }
                })
            }
        },
        {
            event:'click',
            selector:'.J_cancel',
            callback:function (event) {
                PMAPI.sendToParent({
                    type: '1',
                    key: window.config.key,
                    data: {
                        determine: false,
                    }
                })
            }
        },
    ],
    actions:{
        determine(){
            this.data.comment = this.el.find('#comment').val();
        }
    },
    afterRender(){
        let json = {
            value: [],
            dinput_type: '9',
        };
        let changeValue = (res) => {
            console.log(res.value);
            this.data.fileList = res.value;
            console.log(this.data.fileList);
        };
        let attachmentControl = new AttachmentControl(json, {changeValue: changeValue});
        this.append(attachmentControl, this.el.find('.workflow-attachment-box'));
    },
    beforeDestory(){
        this.data.style.remove();
    },
};

class approvalOpinion extends Component{
    constructor(data,newConfig){
        config.data = data;
        super($.extend(true,{},config,newConfig));
    }
}
export default approvalOpinion;