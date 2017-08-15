import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';
import template from './multi-linkage-control.html'

let config={
    template:template,
    actions:{
        changeView(_this,is_view){
            for(let obj of _this.childDrop){
                obj.data.is_view=is_view;
                obj.reload();
            }
        },
        refresh(_this){
            if(_this.hasChoose){
                _this.hasChoose.clear();
            }
            for (let i=0;i<_this.data.index;i++){
                let d={};
                d['value']='请选择';
                d['showValue']='请选择';
                d['options']=[];
                d['index']=i;
                d['dfield']=_this.data.dfield;
                let set=new Set();
                for(let key in _this.data.dataList){
                    set.add(_this.data.dataList[key][i]);
                }
                for(let item of set){
                    d['options'].push({label:item,value:item,"tableId":_this.data.tableId});
                }
                let drop=_this.childDrop[i];
                drop.data=Object.assign(drop.data,d);
                drop.reload();
            }
            _this.data.value='';
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        },
        //回显
        echoData4Control(value) {
            let list = [];
            if(value !== ""){
                list = this.data.dataList[value];
                //默认值回显没写完
            }
        }
    },
    firstAfterRender(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect:'+_this.data.tableId,function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            for (let i=0;i<_this.data.index;i++){
                let d={};
                if(_this.hasChoose.has(i)){
                    continue;
                };
                d['options']=[];
                let set=new Set();
                for(let key in _this.data.dataList){
                    if(_this.data.dataList[key][data.index] == data.value){
                        let isCanSet=true;
                        for(let k of _this.hasChoose.keys()){
                            if( k != data.index && _this.hasChoose.get(k) != _this.data.dataList[key][k] ){
                                isCanSet=false;
                            }
                        }
                        if(isCanSet){
                            set.add(_this.data.dataList[key][i]);
                        }
                    }
                }
                for(let item of set){
                    d['options'].push({label:item,value:item,tableId:_this.data.tableId});
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
                            Mediator.publish('form:changeValue:'+_this.data.tableId,data);
                        }
                    }
                }
            }
            _this.hasChoose.set(data.index,data.value);
        });
        Mediator.subscribe('form:multiLinkageDefaultData:'+this.data.tableId,()=>{
            if(res != null){
                //如果默认值为空
                if(res == 'none'){
                    _this.actions.refresh(_this);
                }else{
                    _this.actions.echoData4Control(res);
                }
            }
        });
        this.el.on('click','.refresh',function(){
            _this.actions.refresh(_this)
        });
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender(){
            this.set('hasChoose', new Map());
            if (!this.childDrop) {
                this.set('childDrop', []);
            }
            if (this.data.be_control_condition) {
                return;
            }
            let index;
            for (let key in this.data.dataList) {
                index = this.data.dataList[key].length;
                this.data['index'] = index;
            }
            let isInit = this.childDrop.length;
            for (let i = 0; i < index; i++) {
                let d = {};
                d['options'] = [];
                d['index'] = i;
                d['dfield'] = this.data.dfield;
                d['is_view'] = this.data.is_view;
                if (this.data.value) {
                    let option = this.data.dataList[this.data.value][i];
                    d['value'] = option;
                    d['showValue'] = option;
                    d['options'].push({label: option, value: option, tableId: this.data.tableId});
                    this.hasChoose.set(i, option);
                } else {
                    d['value'] = '请选择';
                    d['showValue'] = '请选择';
                    let set = new Set();
                    for (let key in this.data.dataList) {
                        set.add(this.data.dataList[key][i]);
                    }
                    for (let item of set) {
                        d['options'].push({label: item, value: item, tableId: this.data.tableId});
                    }
                }
                if (isInit) {
                    this.append(this.childDrop[i], this.el.find('.multi-drop'));
                } else {
                    let drop = new DropDown(d);
                    this.childDrop[i] = drop;
                    this.append(drop, this.el.find('.multi-drop'));
                }
            }
    },
    beforeDestory(){
        Mediator.removeAll('form:dropDownSelect:'+this.data.tableId);
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:multiLinkageDefaultData:'+this.data.tableId);
    }
}
export default class MultiLinkageControl extends Component{
    constructor(data){
        super(config,data);
    }
}