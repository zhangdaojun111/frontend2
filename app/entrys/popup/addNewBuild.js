import FormEntry from '../form';


function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

$(document).ready(function(){
    let table_id=GetQueryString('table_id');
    let key=GetQueryString('key');
    let isAddBuild=GetQueryString('isAddBuild');
    let id=GetQueryString('id');
    FormEntry.createForm({
        table_id:table_id,
        seqId:'yudeping',
        el:$('body'),
        is_view:0,
        real_id:'',
        key:key,
        isAddBuild:isAddBuild,
        id:id
    })
});