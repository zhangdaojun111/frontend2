import template from './approval-opinion.html'
// import Mediator from "../../../lib/mediator";

let css=`
    .workflow-alertbox{
        height: 100%;
    }
    .workflow-alertbox .workflow-icon-record2{
        width:16px;
        height: 16px;
        display: block;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAAAU0lEQVQ4y2P8//8/AyWAiYFCwAJjMHYykOSU/+UMjCgGIAsSAsiWUc8LuGzA5XS8BhDrFfp4gZBrBt4L9I9GggYwdjL8JzsMSNXMwMDAwEhpdgYAolEcoJPZbJgAAAAASUVORK5CYII=);
    }
    .workflow-alertbox .workflow-box-l{
        height: 30px;
        border-bottom: 1px solid #e4e4e4;
        margin-bottom: 10px;
        line-height: 30px;
        font-weight: 700;
        font-size: 14px;
        padding:0 10px;
    }
    .workflow-alertbox .workflow-box-l .tit{
        display: flex;
        align-items:center;
    }
    .workflow-alertbox .workflow-box-r{
        display: flex;
        justify-content: center;
    }
    .workflow-alertbox .workflow-box-r .approve-textarea{
        width: 100%;
        padding: 10px;
    }
    .workflow-alertbox .workflow-btn{
       text-align: right;
    }
    .workflow-alertbox .workflow-btn button{
        width: 100px;
        height: 30px;
        font-size: 12px;
        background: #0088ff;
        color: #fff;
        border: 0 none;
        outline: none;
        border-radius: 3px;
        cursor: pointer;
        margin-right: 10px;
    }
    .workflow-alertbox #comment{
        border: 1px solid #e4e4e4;
        height: 165px;
        resize: none;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
    }
    
`;

let approvalOpinion = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
    },
    binds:[
        {
            event: 'click',
            selector: '.J_sure',
            callback: function (event) {
                this.actions.determine();
                window.parent.postMessage({
                    type: '1',
                    key: this.key,
                    data: {
                        determine:true,
                        key: this.key,
                        comment: this.data.comment,
                    }
                }, location.origin);
            }
        },
        {
            event:'click',
            selector:'.J_cancel',
            callback:function (event) {
                window.parent.postMessage({
                    type:'1',
                    key:this.key,
                    data: {
                        determine:false,
                    }
                }, location.origin);
            }
        },
    ],
    actions:{
        determine(){
            this.data.comment = this.el.find('#comment').val();
        }
    },
    afterRender(){

        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
    },
    beforeDestory(){
        this.data.style.remove();
    },
}
export default approvalOpinion;