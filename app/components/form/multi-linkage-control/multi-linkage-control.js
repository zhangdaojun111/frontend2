import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';

let config={
    template:`  <div class="clearfix">
                    <div class="multi-drop" style="display: flex;align-items: center"></div>
                    <div style="float: left;">
                        {{#if required}}
                            <span id="requiredLogo" class="required" ></span>
                        {{/if}} 
                    </div>
                </div>`,
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        this.set('childDrop',[]);
        let index;
        for(let key in this.data.datalist){
            index=this.data.datalist[key].length;
            this.data.index=index;
        }
        for (let i=0;i<index;i++){
            let d={};
            d['value']='请选择';
            d['options']=[];
            d['index']=i;
            d['dfield']=_this.data.dfield;
            let set=new Set();
            for(let key in this.data.datalist){
                // d['options'].push({label:this.data.datalist[key][i],value:this.data.datalist[key][i]});
                set.add(this.data.datalist[key][i]);
            }
            for(let item of set){
                d['options'].push({label:item,value:item});
            }
            let drop=new DropDown(d);
            _this.childDrop[i]=drop;
            _this.append(drop,_this.el.find('.multi-drop'));
        }
        Mediator.subscribe('form:valueChange',function(data){
            console.log(data);
            if(data.dfield !=_this.data.dfield){
                return;
            }

            //重置必填样式
            if(_this.data.required){
                if(data.value=='' || data.value.length ==0 || data.value==null){
                    _this.el.find('#requiredLogo').get(0).className='required';
                }else{
                    _this.el.find('#requiredLogo').get(0).className='required2';
                }
            }
        });
    }
}
export default class MultiLinkageControl extends Component{
    constructor(data){
        super(config,data);
    }
}