import template from './add-item.html';
let css = ``;
css = css.replace(/(\n)/g, '')
let AddItem = {
    template: template.replace(/\"/g, '\''),
    data: {
        text:'哈哈',
        newItems:[],
    },
    actions:{
        hasExistInOriginal:function(addItemContent) {
            let isExist = false;
            for(let key in this.data.originalOptions) {
                if(this.data.originalOptions[key]["label"] == addItemContent){
                    isExist = true;
                }
            }
            return isExist;
        },
    },
    firstAfterRender:function(){
        let _this=this;
        this.el.on('click','span',function(){
            for(let i = 0,len = _this.data.newItems.length;i < len;i++){
                if(_this.data.newItems.items[i] == $(this).val()){
                    _this.data.newItems.splice(i,1);
                }
            }
            $(this).parent().parent().remove();
        }).on('click', '.add', function () {
            let val=_this.el.find('.addValue').val();
            if (val != '') {
                console.log(_this.actions.hasExistInOriginal(val));
                if(!_this.actions.hasExistInOriginal(val)){
                    _this.data.newItems.push(val);
                    _this.el.find('.result').append(`<tr><td>${val}<span class=ui-del>X</span></td></tr>`);
                    _this.el.find('.addValue').val('');
                }
            }
        }).on('click', '.save', function () {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: _this.key,
                data: {
                    newItems:_this.data.newItems
                }
            })
        });
    },
}
export default AddItem