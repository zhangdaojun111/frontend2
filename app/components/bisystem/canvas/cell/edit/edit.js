import template from './edit.html';
import Mediator from "../../../../../lib/mediator";

let css =`
    #editor{
        height: 300px;
    }
    .editor-btn{
        padding:10px 0;
    }
    .editor-btn button{
        margin-right:15px;
        outline:none;
        border:none;
        text-align:center;
        line-height:28px;
        width:60px;
        height:28px;
        color:#ffffff;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2);
        cursor:pointer;
    }
    .editor-btn .editor-btn-save{
        float:right;
        background:#3b8cff;
    }
    .editor-btn .editor-btn-cancel{
        float:right;
        color:#666;
        background:#fafafa;
    }
`;
export let config = {
    template:template,
    data: {
        css:css.replace(/(\n)/g, ''),
    },
    actions: {
        /**
         * 新建文本编译器
         */
        newEditor() {
            let toolbarOptions = [
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'font': [] }],
                ['bold', 'italic', 'underline'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link','image','code-block'],
                ['clean']

            ];
            let editor = new Quill('#editor', {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow',
            });
        }

    },
    binds:[
        {
            event:'click',
            selector:'.editor-btn-save',
            callback: function () {
                let data = {
                    name:''
                };
                data.name = this.data.name;
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key: this.key,
                    data: data
                });
            }
        },
        {
            event:'click',
            selector:'.editor-btn-cancel',
            callback: function () {
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key: this.key,
                    data: {}
                });
            }
        }
    ],
    afterRender() {
        //添加样式
        $(`<style>${this.data.css}</style>`).appendTo(this.el);
    },
    firstAfterRender() {
        this.actions.newEditor();
    }
};