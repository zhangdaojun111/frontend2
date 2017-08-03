import Component from '../../../lib/component';
import template from './editor.html';
import './editor.scss';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
let config = {
    template: template,
    data: {},
    actions: {},
    afterRender: function () {
        let editorDom = this.el.find('.content .editor');
        this.quill = new Quill(editorDom[0], {
            theme: 'snow'
        });
    }
};

class EditorControl extends Component {
    constructor(data){
        console.log(data);
        super(config, data);
    }
}

export {EditorControl};
