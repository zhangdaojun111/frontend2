import template from './add-item.html';
let css = ``;
css = css.replace(/(\n)/g, '')
let AddItem = {
    template: template.replace(/\"/g, '\''),
    data: {
        text:'',
        newItems:[],
    },
    actions:{
        //查找是否重复
        hasExistInOriginal(addItemContent) {
            let isExist = false;
            for(let key in this.data.originalOptions) {
                if(this.data.originalOptions[key]["label"] == addItemContent){
                    isExist = true;
                }
            }
            return isExist;
        },
        //删除添加选项
        deleteItem($this){
            for(let i = 0,len = this.data.newItems.length;i < len;i++){
                if(this.data.newItems[i] == $this.val()){
                    this.data.newItems.splice(i,1);
                }
            }
            $this.parent().parent().remove();
        },
        //添加新选项
        addItem(){
            let val=this.el.find('.addValue').val();
            if (val != '') {
                if(!this.actions.hasExistInOriginal(val)){
                    this.data.newItems.push(val);
                    this.el.find('.result').append(`<tr><td>${val}<span class=ui-del>X</span></td></tr>`);
                    this.el.find('.addValue').val('');
                }
            }
        },
        //保存新选项
        saveItems(){
            HTTP.postImmediately({url:'/add_select_item/',data:{
                field_id: this.data.data["id"],
                content_list: JSON.stringify(this.data.newItems)
            }}).then(res=>{
                if(res.success == 1){
                    PMAPI.sendToParent({
                        type: PMENUM.close_dialog,
                        key: this.key,
                        data: {
                            newItems:res['data'],
                        }
                    })
                }
            });
        }
    },
    afterRender(){
        let _this=this;
        this.el.on('click','.ui-del',function(){//此处不能用箭头函数 会造成this指针丢失
            _this.actions.deleteItem($(this));
        }).on('click', '.add',()=>{
            this.actions.addItem();
        }).on('click', '.save',()=> {
            this.actions.saveItems();
        })
    },
}
export default AddItem