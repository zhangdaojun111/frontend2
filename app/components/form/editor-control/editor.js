import Component from '../../../lib/component';
import template from './editor.html';
import './editor.scss';
import Quill from 'quill';
import { ImageDrop } from './quill-image-drop';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

let toolbarOption = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['link', 'image'],
    ['blockquote', 'code-block'],
    [{'align': []}],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    // [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    // [{'font': []}],


    // ['clean']

];

Quill.register('modules/imageDrop', ImageDrop);

let config = {
    template: template,
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data)
            }
        },
    ],
    data: {},
    actions: {
        publishMessage: function () {
            this.data.value = this.quill.root.innerHTML;
            this.events.changeValue(this.data);
        }
    },
    afterRender: function () {
        let editorDom = this.el.find('.content .editor');
        this.quill = new Quill(editorDom[0], {
            modules: {
                toolbar: toolbarOption,
                imageDrop: true
            },
            readOnly: this.data.is_view == 1,
            theme: 'snow'
        });
        if(this.data.value){
            this.quill.pasteHTML(this.data.value);
        }
        if (this.data.is_view) {
            this.el.find('.wrap').attr('title', this.data.value.replace(/<.*?>/ig,""))
        }
        if(this.data.history && !this.data.isApproval){
            this.el.find('.ui-history').css('visibility','visible');
        }
        this.quill.on('text-change', _.debounce(() => {
            this.actions.publishMessage();
        }, 1000));
    },
    beforeDestory: function () {
        this.quill = null;
    }
};

let EditorControl = Component.extend(config)
export default EditorControl;
