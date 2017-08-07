import Component from '../../../lib/component';
import template from './workflow-seal.html';
import './workflow-seal.scss';


import Mediator from '../../../lib/mediator';


let config = {
    template: template,
    data: {
        // "file_ids": ["5987de19c3ec2134050ee679", "5987de3244543b4d1226c977", "5987fe3e8e368f5747b1722c"]
    },
    actions: {
        addImg(e){
            let imgFile = this.el.find('.J_add')[0].files[0];
            //    console.log(imgFile.name);
            if(/\.(png|PNG)$/.test(imgFile.name)){
                if(imgFile){
                    let FR = new FileReader();
                    FR.onload = function (event){
                        var imgstr = event.target.result;
                        Mediator.publish("workflow:seal",imgstr);
                        Mediator.publish("workflow:getStamp");
                    };
                    FR.readAsDataURL(imgFile);
                }
            }
        },
        changeImg(msg){
            this.el.find(".J_ul-img").empty();
            let len = msg.file_ids.length;
            let html = " ";
            for (let i=0;i<len;i++){
                html += "<li class='li-img'><span>X</span><img src='/../download_attachment/?file_id="+msg.file_ids[i]+"&download={{this}}' class='add-img'/></li>";
            }
            this.el.find('.J_ul-img').html(html);
        },
        dragimg(e){
            let imgLeft = $(e.target).offset().left;
            let imgTop = $(e.target).offset().top;
            console.log(imgLeft);
            this.el.find(".signatureMock").css('visibility','visible');
            $('#place-form').css({'z-index':'101'});
            this.el.find(".J_dragimg").css({
                "left":imgLeft,
                "top":imgTop
            })
        }
    },
    afterRender: function() {
        this.el.on('change','.J_add',(e)=>{
            this.actions.addImg(e);
        }),
            this.el.on('click','.add-img',(e)=>{
                this.actions.dragimg(e);
            })
        $('.dragimg').draggable({
            // snap:true,
        });
        Mediator.subscribe('workflow:changeImg',(msg)=>{
            console.log(msg.file_ids);
            this.actions.changeImg(msg);
        })
    },
    beforeDestory: function(){

    }
}

class WorkflowSeal extends Component{
    constructor (data){
        super(config,data);
    }
}

export default {
    showheader(data){
        let component = new WorkflowSeal(data);
        let el = $('#workflow-seal');
        component.render(el);
    },
};
