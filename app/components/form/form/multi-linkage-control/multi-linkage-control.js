import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import template from './multi-linkage-control.html'
import {AutoSelect} from '../../util/autoSelect/autoSelect'
import './multi-linkage-control.scss'

let config={
    template:template,
    actions:{
        refresh(_this){
            if(_this.hasChoose){
                _this.hasChoose.clear();
            }
            // for (let i=0;i<_this.data.index;i++){
            //     let d={};
            //     d['list']=[];
            //     d['index']=i;
            //     d['multiSelect']=false;
            //     d['editable']=_this.data.is_view?false:true;
            //     let set=new Set();
            //     for(let key in _this.data.dataList){
            //         set.add(_this.data.dataList[key][i]);
            //     }
            //     for(let item of set){
            //         d['list'].push({label:item,value:item});
            //     }
            //     let drop=_this.childDrop[i];
            //     drop.data=Object.assign(drop.data,d);
            //     drop.reload();
            // }
            _this.data.value='';
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
            _this.reload();
        },

        //改变值
        changeValue(data,index){
            for (let i=0;i<this.data.index;i++){
                let d={};
                if(this.hasChoose.has(i)){
                    continue;
                };
                d['list']=[];
                if(i == index){
                    d['choosed']=[{name:data,id:data}];
                }
                if(this.childDrop[i].data.choosed[0]['id'] == '请选择'){
                    d['list'].push({name:'请选择',id:'请选择'})
                }

                let set=new Set();
                for(let key in this.data.dataList){
                    if(this.data.dataList[key][index] == data){
                        let isCanSet=true;
                        for(let k of this.hasChoose.keys()){
                            if( k != index && this.hasChoose.get(k) != this.data.dataList[key][k] ){
                                isCanSet=false;
                            }
                        }
                        if(isCanSet){
                            set.add(this.data.dataList[key][i]);
                        }
                    }
                }
                for(let item of set){
                    d['list'].push({name:item,id:item});
                }
                let drop=this.childDrop[i];
                drop.data=Object.assign(drop.data,d);
                drop.reload();
            }
            let childSelectValue=[];
            for(let obj of this.childDrop){
                if(obj.data.choosed[0] && obj.data.choosed[0]['id']){
                    childSelectValue.push(obj.data.choosed[0]['id']);
                }
            }
            if(childSelectValue.length == this.data.index){
                for(let key in this.data.datalist){
                    let isValue=true;
                    for(let i=0;i<this.data.index;i++){
                        if(this.data.dataList[key][i]!=childSelectValue[i]){
                            isValue=false;
                            break;
                        }
                    }
                    if(isValue){
                        this.data.value=key;
                        if(this.data.required){
                            Mediator.publish('form:changeValue:'+this.data.tableId,this.data);
                        }
                    }
                }
            }
            this.hasChoose.set(index,data);
            this.data.isReolad=false;
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
    afterRender(){
        let _this=this;

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

        this.data.isInit=true;
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
        for (let i = 0; i < index; i++) {
            let d = {};
            d['index'] = i;
            d['dfield'] = this.data.dfield;
            d['list']=[];
            d['multiSelect']=false;
            d['editable']=this.data.is_view?false:true;
            d['width']=this.data.width;
            d.onSelect=function(data){
                if( _this.data.isInit || _this.data.isReolad || !_this.childDrop[i] || _this.childDrop[i].data.choosed.length == 0){
                    return;
                }
                _this.data.isReolad=true;
                _this.actions.changeValue(data[0]['id'],i);
                _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
            };
            if (this.data.value) {
                let value = this.data.dataList[this.data.value][i];
                d['list'].push({name: value, id: value});
                this.hasChoose.set(i, value);
            } else {
                let set = new Set();
                d['choosed']=[{name:'请选择',id:'请选择'}];
                for (let key in this.data.dataList) {
                    set.add(this.data.dataList[key][i]);
                }
                for(let item of set) {
                    d['list'].push({name: item, id: item});
                }
            }
            let autoSelect = new AutoSelect(d);
            this.childDrop[i] = autoSelect;
            this.append(autoSelect, this.el.find('.multi-drop'));
        }
        this.data.isInit=false;
    },
    beforeDestory(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:multiLinkageDefaultData:'+this.data.tableId);
    }
}
export default class MultiLinkageControl extends Component{
    constructor(data){
        super(config,data);
    }
}