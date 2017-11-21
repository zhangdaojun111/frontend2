import template from './carousel.html';
import Mediator from '../../../../../lib/mediator';

let css =`
.msg{
  height: 94px;
  padding: 20px 20px 0 0;
  box-sizing:border-box;
}
.carousel-time,.operate-time{
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
.error-tip-1,.error-tip-2{
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
    actions: {
        saveCarousel:function () {
            this.data.carousel = this.el.find('.carousel-time').val();
            this.data.operate = this.el.find('.operate-time').val();
            if(this.data.carousel === ""){
                this.el.find('.error-tip-1').show();
                return ;
            }
            if(this.data.operate === ""){
                this.el.find('.error-tip-2').show();
                return ;
            }

            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key,
                data: {'carousel':this.data.carousel,'operate':this.data.operate}
            });
        },
        cancelCarousel:function () {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key,
                data: {}
            });
        }
    },
    afterRender() {
        //添加样式
        this.data.style = $(`<style>${this.data.css}</style>`).appendTo(this.el);
    },
    binds:[
        {
            event:'click',
            selector:'.ok',
            callback:function () {
                this.actions.saveCarousel();
            }
        },
        {
            event:'click',
            selector:'.cancel',
            callback:function () {
                this.actions.cancelCarousel();
            }
        },
        {
            event:'input',
            selector:'.carousel-time',
            callback:function () {
                this.el.find('.error-tip-1').hide();
            }
        },
        {
            event:'input',
            selector:'.operate-time',
            callback:function () {
                this.el.find('.error-tip-2').hide();
            }
        }
    ],
    beforeDestory: function () {
        this.data.style.remove();
    }
};