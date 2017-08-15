import expertSearch from '../../components/dataGrid/data-table-toolbar/expert-search/expert-search'
$(document).ready(function(){
    let epSearch = new expertSearch();
    epSearch.render($('#expertSearch'));
})