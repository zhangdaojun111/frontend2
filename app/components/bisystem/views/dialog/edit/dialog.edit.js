import {BiBaseComponent} from '../../../bi.base.component';

import template from './dialog.edit.html';
import {ViewsService} from "../../../../../services/bisystem/views.service";
import Mediator from '../../../../../lib/mediator';

let css =`
.msg{
  height: 94px;
  padding: 20px 20px 20px 0;
    input{
      width: 90%;
      border: none;
      outline: none;
      font-size: 14px;
      margin-left: 20px;
      border-bottom: 2px solid #00bcd4;
    }
}
.btns{
  text-align: right;
  padding: 0 20px;
  font-size: 14px;}
.btns .btn{
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
  }
.btns .cancel{
    background-color: #f1f1f1;
    color: #333;
    margin-right: 10px;
  }
.btns .ok{
    background-color: #2e8ded;
    color: #ffffff;
  }
`;
export let config = {
    template:template,
    data: {
        name:""
    },
    actions: {
        close() {

        }
    },
    afterRender() {
        this.el.on('click','.ok',()=>{
            this.data.name = this.el.find('.inp-val').val();
            let data = {
                id: '',
                name: this.data.name,
            };
            console.log(Mediator);
            //Mediator.publish('bi:views:add',data);
            // ViewsService.getItemName(data).then(res => {
            //
            // });
        });
    },
    beforeDestory: function () {
        // alert('hello 我要销毁了');
    }
};

// class DialogEditComponent extends BiBaseComponent{
//     constructor() {
//         super(config);
//     }
// }
//
// export const dialogEditSetting = {
//     el: null,
//     show: function() {
//         let component = new DialogEditComponent();
//         this.el = $('<div id="dialog-create">').appendTo(document.body);
//         component.render(this.el);
//         this.el.dialog({
//             title: '编辑视图',
//             width: 348,
//             height: 217,
//             modal: true,
//             close: function() {
//                 $(this).dialog('destroy');
//                 component.destroySelf();
//             }
//         });
//     },
//     hide: function () {
//         this.el.dialog('close');
//     }
// }