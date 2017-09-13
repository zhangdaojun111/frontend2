import template from './dialog.edit.html';

let css =`
.msg{
  height: 94px;
  padding: 20px 20px 20px 0;
}
.msg-border .inp-val{
      width: 90%;
      border: none;
      outline: none;
      font-size: 14px;
      margin-left: 20px;
      border-bottom: 2px solid #00bcd4;
}
.msg-border .lab{
    display:block;
    margin-left:20px;
    margin-bottom:10px;
}
.msg-border .error-tip{
        color: red;
        font-size: 16px;
        margin-top: 10px;
        padding-left: 20px;
        display:none;
 }
.btns{
  text-align: right;
  padding: 0 20px;
  font-size: 14px;
 }
.btns .cancel{
    outline: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    width: 88px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 2px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
     background-color: #f1f1f1;
    color: #333;
    margin-right: 10px;
  }
  .btns .ok{
    outline: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    width: 88px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 2px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    background-color: #2e8ded;
    color: #ffffff;
    margin-right: 10px;
  }
`;
export let config = {
    template:template,
    data: {
        css:css.replace(/(\n)/g, ''),
    },
    actions: {},
    afterRender() {
        //添加样式
        $(`<style>${this.data.css}</style>`).appendTo(this.el);
        this.el.on('click','.ok',()=>{
            this.data.name = this.el.find('.inp-val').val();
            if(this.el.find('.inp-val').val() === ""){
                this.el.find('.error-tip').show();
                return ;
            }
            let data = {
                folder_id:'',
                parent_table_id:'',
                id: this.data.view ? this.data.view.id :'',
                name: this.data.name,
            };
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key,
                data: data
            });

        }).on('click','.cancel',()=>{
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key,
                data: {}
            });
        })
    },
    binds:[
        {

        }
    ],
    beforeDestory: function () {
    }
};