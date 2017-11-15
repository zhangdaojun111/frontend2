import Component from '../../../lib/component';
import template from './approval-opinion.html'
// import Mediator from "../../../lib/mediator";
import './approval-opinion.scss';
import {PMAPI} from '../../../lib/postmsg'
import AttachmentControl from "../../form/attachment-control/attachment-control";
import msgbox from '../../../lib/msgbox';

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
                let attachmentQueueItemComps = this.data.attachmentControl.data['attachmentQueueItemComps'];
                let uploadingState;
                for(let k in Array.of(attachmentQueueItemComps) ){
                    for(let key in Array.of(attachmentQueueItemComps)[k]){
                        uploadingState=Array.of(attachmentQueueItemComps)[k][key]['data']['_controlItem']['uploadingState']
                    }
                }
                if(uploadingState && uploadingState == 'on'){
                    msgbox.alert('上传未完成');
                }else{
                    this.actions.determine();
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
            this.data.fileList = res.value;
        };
        let attachmentControl = new AttachmentControl(json, {changeValue: changeValue});
        this.append(attachmentControl, this.el.find('.workflow-attachment-box'));
        this.data.attachmentControl=attachmentControl
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