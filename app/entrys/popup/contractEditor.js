import contractEditor from '../../components/form/contract-control/contract-editor/contract-editor'
$(document).ready(function(){
    let conEditor = new contractEditor();
    conEditor.render($('#contractEditor'));
})
