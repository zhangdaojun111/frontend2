/**
 *@author yudeping
 *快捷添加内置选项入口
 */

import FormEntry from '../form';
$(document).ready(function(){
    let config=window.config;
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