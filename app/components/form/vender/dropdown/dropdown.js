import Component from '../../../../lib/component'
import './select-control.scss'
let config={
    template:`<div>
                <input class="search-value show-hide-drop" type="text" readonly value="{{value}}"/>
                <div class="select-drop" style="display: none" >
                    <input type="type" class="search"/>
                    {{#options}}
                        <div class="option show-hide-drop" data-py="{{this.py}}" data-value="{{this.value}}">{{this.label}}</div>
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
        this.el.on('click','.show-hide-drop',function(){
            _this.el.find('.select-drop').toggle();
            if($(this).hasClass('option')){
                _this.data.value=$(this).html();
                _this.reload();
            }
        }).on('keyup','.search',function(event){
            if(timer){
                clearTimeout(timer);
                timer=null;
            }
            timer=setTimeout(function(){
                console.log('111111');
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