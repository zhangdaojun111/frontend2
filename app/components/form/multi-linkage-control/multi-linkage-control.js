import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';

let config={
    template:`  <div class="clearfix" style="display: flex;align-items: center">
                    {{#if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                    {{else}}
                            <div class="multi-drop" style="display: flex;align-items: center"></div>
                            <div class="refresh">刷新</div>
                            <div style="float: left;">
                        {{#if required}}
                            <span id="requiredLogo" class="{{requiredClass}}" ></span>
                        {{/if}} 
                    </div>
                    {{/if}}
                </div>`,
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect',function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            for (let i=0;i<_this.data.index;i++){
                let d={};
                if(i==data.index){
                    d['showValue']=data.value;
                }
                d['options']=[];
                let set=new Set();
                for(let key in _this.data.dataList){
                    if(_this.data.dataList[key][data.index] == data.value){
                        set.add(_this.data.dataList[key][i]);
                    }
                }
                for(let item of set){
                    d['options'].push({label:item,value:item});
                }
                let drop=_this.childDrop[i];
                drop.data=Object.assign(drop.data,d);
                drop.reload();
            }
            let childSelectValue=[];
            for(let obj of _this.childDrop){
                if(obj.data.value){
                    childSelectValue.push(obj.data.value);
                }
            }
            if(childSelectValue.length == _this.data.index){
                for(let key in _this.data.datalist){
                    let isValue=true;
                    for(let i=0;i<_this.data.index;i++){
                        if(_this.data.dataList[key][i]!=childSelectValue[i]){
                            isValue=false;
                            break;
                        }
                    }
                    if(isValue){
                        _this.data.value=key;
                        data['value']=key;
                        if(_this.data.required){
                            Mediator.publish('form:checkRequired',data);
                        }
                    }
                }
            }
        });
        this.el.on('click','.refresh',function(){
            for (let i=0;i<_this.data.index;i++){
                let d={};
                d['showValue']='请选择';
                d['options']=[];
                d['index']=i;
                d['dfield']=_this.data.dfield;
                let set=new Set();
                for(let key in _this.data.dataList){
                    set.add(_this.data.dataList[key][i]);
                }
                for(let item of set){
                    d['options'].push({label:item,value:item});
                }
                let drop=_this.childDrop[i];
                drop.data=Object.assign(drop.data,d);
                drop.reload();
                _this.data.value='';
                Mediator.publish('form:changeValue',_this.data);
            }
        });
    },
    afterRender(){
        if(!this.childDrop){
            this.set('childDrop',[]);
        }
        if(this.data.be_control_condition){
           return;
        }
        let index;
        for(let key in this.data.dataList){
            index=this.data.dataList[key].length;
            this.data['index']=index;
        }
        let isInit=this.childDrop.length;
        for (let i=0;i<index;i++){
            let d={};
            d['value']='请选择';
            d['options']=[];
            d['index']=i;
            d['dfield']=this.data.dfield;
            let set=new Set();
            for(let key in this.data.dataList){
                set.add(this.data.dataList[key][i]);
            }
            for(let item of set){
                d['options'].push({label:item,value:item});
            }
            if(isInit){
                this.append(this.childDrop[i],this.el.find('.multi-drop'));
            }else{
                let drop=new DropDown(d);
                this.childDrop[i]=drop;
                this.append(drop,this.el.find('.multi-drop'));
            }
        }
    }
}
export default class MultiLinkageControl extends Component{
    constructor(data){
        super(config,data);
    }
}