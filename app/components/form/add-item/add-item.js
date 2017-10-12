/**
 *@author yudeping
 *枚举选项快捷添加
 */

import template from './add-item.html';
let css = `
    .add-wrap{
        width:100%;
        height:100%;
        display:flex;
        flex-direction:column;
    }
    .add-wrap .response{
        flex:1 1 auto;
    }
    .add-wrap .add-table{
        width: 96%;
        margin: 10px auto;
        border: 1px solid #ddd;
        padding: 5px;
        display: flex;
        flex-direction: column;
    }
    .add-wrap .add-table .add-new{
        flex:0 0 40px;
    }
    .add-wrap .add-table .add-new .add{
        border:1px solid #ddd;
        height:20px;
        line-height:20px;
        width:56px;
        border-radius:5px;
        background:#fff;
        cursor: pointer;
        outline-style: none;
    }
    .add-wrap .add-table .add-new .content{
        display:flex;
        align-items: center;
        padding-left:20px;
    }
    .add-wrap .add-table .add-new .addValue{
        border:1px solid #ddd;
        height:18px;
        line-height:18px;
        width:160px;
        margin-right:20px;
    }
    .add-wrap .add-table .add-item{
        flex:1 1 auto;
        display: flex;
        flex-direction: column;
    }
    .add-wrap .add-table .add-item .item-wrap{
        flex:1 1 50%;
    }
    .add-wrap .save{
        height:40px;
        cursor: pointer;
    }
    .add-wrap .flex-wrap{
        display: flex;
        border-top:1px solid #ddd;
        background:rgba(250, 250, 250, 1);
    }
    .add-wrap .flex-wrap .label{
        flex:0 0 264px;
        background: #fff;
    }
    .add-wrap .flex-wrap .content{
        flex:1 1 auto;
        background: rgba(250, 250, 250, 1);
        text-indent:10px;
    }
    .add-wrap .item-wrap .content , .add-wrap .item-wrap .label{
        padding-top:5px;
    }
    .add-wrap .flex-wrap .content .item{
        background-color: rgba(242, 242, 242, 1);
        margin:0 5px 5px 5px;
        text-indent:10px;
        height:16px;
        line-height:16px;
    }
    .add-wrap .add-new{
        line-height:40px;
    }
    .add-wrap .save{
        background:rgba(0, 136, 255, 1);
        color:#fff;
        width:91px;
        flex:0 0 30px;
        line-height:30px;
        border-radius:5px;
        border: 1px;
        margin-bottom: 15px;
        margin-left: calc(100% - 110px);
    }
    .ui-del{
        float: right;
        color: red;
        cursor: pointer;
    }

`;
let AddItem = {
    template: template.replace(/(\")/g, '\''),
    data: {
        text:'',
        newItems:[],
        css:css.replace(/(\n)/g, '')
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
            if(this.data.newItems.indexOf(addItemContent) != -1){
                isExist=true;
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
            $this.parent().remove();
        },
        //添加新选项
        addItem(){
            let val=this.el.find('.addValue').val();
            if (val != '') {
                if(!this.actions.hasExistInOriginal(val)){
                    this.data.newItems.push(val);
                    this.el.find('.result').append(`<div class=item>${val}<span class=ui-del>X</span></div>`);
                    this.el.find('.addValue').val('');
                }
            }
        },
        //保存新选项
        saveItems(){
            HTTP.postImmediately({url:'/add_select_item/',data:{
                field_id: this.data.fieldId,
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
    binds:[{
        event:'click',
        selector:'.add',
        callback:function(){
            this.actions.addItem();
        }
    },{
        event:'click',
        selector:'.save',
        callback:function(){
            this.actions.saveItems();
        }
    }],
    afterRender(){
        let _this=this;
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        this.el.on('click','.ui-del',function(){
            _this.actions.deleteItem($(this));
        })
    },
    beforeDestory: function () {
        this.data.style.remove();
    }
}
export default AddItem