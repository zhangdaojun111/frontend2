import Component from '../../../lib/component';
import template from './editor.html';
import './editor.scss';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import Mediator from '../../../lib/mediator';

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
    actions: {
        publishMessage: function () {
            this.data.value = this.quill.root.innerHTML;
            Mediator.publish('form:changeValue:' + this.data.tableId, this.data);
        }
    },
    afterRender: function () {
        let editorDom = this.el.find('.content .editor');
        this.quill = new Quill(editorDom[0], {
            modules: {
                toolbar: toolbarOption,
            },
            readOnly: this.data.is_view == 1,
            theme: 'snow'
        });
        this.quill.on('text-change', _.debounce(() => {
            this.actions.publishMessage();
        }, 1000));
    },
    beforeDestory: function () {
        this.quill = null;
    }
};

class EditorControl extends Component {
    constructor(data) {
        super(config, data);
    }
}

export default EditorControl;
