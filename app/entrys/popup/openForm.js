import FormEntry from '../form';
$(document).ready(function() {
    let el=$('<div style="width:100%;height:100%"></div>').prependTo('body');
    console.log('window');
    console.log(window.config);
    let config=Object.assign({},window.config,{el:el});
    FormEntry.createForm(config);
});