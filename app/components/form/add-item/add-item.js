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
        formatParams:function(params) {
            let result = [];
            for(let k in params){
                if(typeof(params[k]) == 'object'){
                    result.push(k + '=' + JSON.stringify(params[k]));
                }else{
                    result.push(k + '=' + params[k]);
                }
            }
            return result.join('&')
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
            console.log('111111');
            console.log(HTTP);
            // async function addItem(json){
            //     let data=_this.actions.formatParams(json);
            //     return await HTTP.postImmediately({url:'/add_select_item/',data:data});
            // }
            // console.log('111111');
            // let res=addItem({
            //     field_id: _this.data.data["id"],
            //     content_list: JSON.stringify(_this.data.newItems)
            // })
            // console.log(res);
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