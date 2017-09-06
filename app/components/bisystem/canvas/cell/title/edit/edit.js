import template from './edit.html';
import Mediator from "../../../../../../lib/mediator";

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
        view:"",
        css:css.replace(/(\n)/g, ''),
        toolbarOptions:[],
        editor:null,
    },
    actions: {
        /**
         * 新建文本编译器
         */
        newEditor() {
            this.data.toolbarOptions = [
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'font': [] }],
                ['bold', 'italic', 'underline'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link','image','code-block'],
                ['clean']

            ];
            this.data.editor = new Quill('#editor', {
                modules: {
                    toolbar: this.data.toolbarOptions
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
                    field_id: this.data.view.field_id,
                    content: this.data.editor.getText(),
                    table_id : this.data.view.table_id,
                    row_id: this.data.view.row_id,
                };

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
        // Mediator.on('edit:title',(data) =>{
        //     console.log(data);
        // });
        $(`<style>${this.data.css}</style>`).appendTo(this.el);
    },
    firstAfterRender() {
        this.actions.newEditor();
        this.data.editor.container.firstChild.innerHTML = this.data.view.content;
        // quill.container.firstChild.innerHTML = this.data.view['edits']['0'];
        // document.querySelector(".ql-editor").innerHTML = this.data.view;
    }
};