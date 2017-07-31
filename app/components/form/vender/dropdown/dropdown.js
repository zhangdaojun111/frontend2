import Component from '../../../../lib/component'
import './select-control.scss'
import Mediator from '../../../../lib/mediator';
let config={
    template:`<div style="position: relative;">
                <input class="search-value show-hide-drop" type="text" readonly data-value="{{value}}" value="{{showValue}}"/>
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
    firstAfterRender:function(){
        let _this=this;
        let timer=null;
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
            let value=$(this).html();
            if($(this).hasClass('option')){
                _this.data.value=value;
                _this.reload();
                if(value=='请选择'){
                    value='';
                }
                let data={showValue:value,value:$(this).data('value'),dfield:_this.data.dfield};
                if(_this.data.index || _this.data.index==0){
                    data['index']= _this.data.index
                }
                Mediator.publish('form:dropDownSelect',data);
            }
            event.stopPropagation();
        }).on('keyup','.search',function(event){
            if(timer){
                clearTimeout(timer);
                timer=null;
            }
            timer=setTimeout(function(){
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
            },500);
        })
    }
}
export default class DropDown extends Component{
    constructor(data){
        super(config,data);
    }
}