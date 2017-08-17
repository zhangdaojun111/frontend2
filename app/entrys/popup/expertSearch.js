import expertSearch from '../../components/dataGrid/data-table-toolbar/expert-search/expert-search'
$(document).ready(function(){
    console.log(window.config.key)
    let obj = {
        key: window.config.key
    }
    let epSearch = new expertSearch(obj);
    epSearch.render($('#expertSearch'));
})