/**
 *@author yudeping
 *富文本弹窗
 */

import template from './quill-alert.html';
let css = ``;
css = css.replace(/(\n)/g, '');
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

let QuillAlert = {
    template: template.replace(/(\")/g, '\''),
    data:{
        value:'',
    },
    afterRender(){
        let editorDom = this.el.find('.content .editor');
        this.data.quill = new Quill(editorDom[0], {
            modules: {
                toolbar: toolbarOption,
            },
            readOnly: true,
            theme: 'snow'
        });
    },
    beforeDestory(){
        this.data.quill = null;
    }
}
export default QuillAlert