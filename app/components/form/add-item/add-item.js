import template from './add-item.html';
let css = ``;
let AddItem={
    data:{
        css: css.replace(/(\n)/g, '')
    },
    template:template,
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        this.el.on('click','span',function(){
            $(this).parent().parent().remove();
        }).on('click','add',function(){
            if($('.addValue').val()!=''){
                $('.result').append('<tr><td>'+$('.addValue').val()+'<span class="ui-del">X</span></td></tr>');
            }
        }).on('click','.save',function(){
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key,
                data: {
                    data: '传递过去'
                }
            })
        });
    }
}
export default AddItem