import Component from '../../../lib/component';
import template from './editor.html';
import './editor.scss';
import Quill from 'quill';
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

let config = {
    template: template,
    data: {},
    actions: {},
    afterRender: function () {
        let editorDom = this.el.find('.content .editor');
        this.quill = new Quill(editorDom[0], {
            modules: {
                formula: true,
                syntax: true,
                toolbar: toolbarOption,
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'
        });
    }
};

class EditorControl extends Component {
    constructor(data) {
        console.log(data);
        super(config, data);
    }
}

export {EditorControl};
