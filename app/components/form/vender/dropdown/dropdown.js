import Component from '../../../../lib/component'
import Mediator from '../../../../lib/mediator';
let config={
    template:`<div style="position: relative;">
                {{#if is_view}}
                <input class="search-value show-hide-drop" type="text" readonly data-value="{{value}}" value="{{showValue}}" disabled/>
                {{else}}
                <input class="search-value show-hide-drop" type="text" readonly data-value="{{value}}" value="{{showValue}}"/>
                {{/if}}
                <div class="select-drop" style="display: none;position: absolute;top:100%;z-index: 1;background: #fff;border: 1px solid #ccc" >
                    <input type="type" class="search"/>
                    {{#options}}
                        <div style="height: 20px" class="option show-hide-drop" data-py="{{this.py}}" data-value="{{this.value}}">{{this.label}}</div>
                    {{/options}}
                </div>
              </div>`,
    data:{

    },
    actions:{

    },
    afterRender:function(){
        let _this=this;
        this.el.off();
        this.el.on('click','.show-hide-drop',function(event){
            let $select=_this.el.find('.select-drop');
            let isShow=true;
            if($select.is(':hidden')){
                isShow=false;
            }
            $('.select-drop').not($(this)).hide()
            if(isShow){
                $select.hide();
            }else{
                $select.show();
            }
            let showValue=$(this).html();
            let value=$(this).data('value');
            _this.el.find('.search').focus();
            if($(this).hasClass('option')){
                _this.data.value=value;
                _this.data.showValue=showValue;
                _this.reload();
                if(value=='请选择' ||value == ''){
                    showValue='';
                    value='';
                }
                let data={value:value,dfield:_this.data.dfield,showValue:showValue};
                if(_this.data.index || _this.data.index==0){
                    data['index']= _this.data.index
                }
                Mediator.publish('form:dropDownSelect'+_this.data.tableId,data);
            }
            event.stopPropagation();
        })
        this.el.find('.search').on('input',_.debounce(function(event){
            let value=event.target.value;
            if(value){
                _this.el.find('.option').each(function(){
                    if($(this).html().indexOf(value) == -1 && $(this).data('py').split(',').every(function(item){
                            return item.indexOf(value)==-1;
                        })){
                        $(this).hide();
                    }
                });
            }else{
                _this.el.find('.option').each(function(){
                    $(this).show();
                });
            }
        },1000)).on('click',function(event){
            event.stopPropagation();
        });
    }
}
export default class DropDown extends Component{
    constructor(data){
        super(config,data);
    }
}