/**
 *@author yudeping
 *多级内置控件
 */


import Component from '../../../lib/component'
import template from './multi-linkage-control.html'
import {AutoSelect} from '../../util/autoSelect/autoSelect'
import './multi-linkage-control.scss'

let config={
    template:template,
    actions:{
        refresh(_this){
            if(_this.data.hasChoose){
                _this.data.hasChoose.clear();
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
            //     let drop=_this.data.childDrop[i];
            //     drop.data=Object.assign(drop.data,d);
            //     drop.reload();
            // }
            _this.data.value='';
            _.debounce(function(){_this.events.changeValue(_this.data)},200)();
            _this.reload();
        },

        //改变值
        changeValue(data,index){
        	let _this=this;
            for (let i=0;i<this.data.index;i++){
                let d={};
                if(this.data.hasChoose.has(i)){
                    continue;
                };
                d['list']=[];
                if(i == index){
                    d['choosed']=[{name:data,id:data}];
                }
                if(this.data.childDrop[i].data.choosed[0]['id'] == '请选择'){
                    d['list'].push({name:'请选择',id:'请选择'})
                }

                let set=new Set();
                for(let key in this.data.dataList){
                    if(this.data.dataList[key][index] == data){
                        let isCanSet=true;
                        for(let k of this.data.hasChoose.keys()){
                            if( k != index && this.data.hasChoose.get(k) != this.data.dataList[key][k] ){
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
                let drop=this.data.childDrop[i];
                drop.data=Object.assign(drop.data,d);
                drop.reload();
            }
            let childSelectValue=[];
            for(let obj of this.data.childDrop){
                if(obj.data.choosed[0] && obj.data.choosed[0]['id']){
                    childSelectValue.push(obj.data.choosed[0]['id']);
                }
            }
            if(childSelectValue.length == this.data.index){
                for(let key in this.data.dataList){
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
                            _this.events.changeValue(_this.data);
                        }
                    }
                }
            }
            this.data.hasChoose.set(index,data);
            this.data.isReolad=false;
        },
        //回显
        echoData4Control(value) {
            let list = [];
            if(value !== ""){
                list = this.data.dataList[value];
                //默认值回显没写完
            }
        },
        multiLinkageDefaultData(res){
            if(res != null){
                //如果默认值为空
                if(res == 'none'){
                    this.actions.refresh(_this);
                }else{
                    this.actions.echoData4Control(res);
                }
            }
        },
        //初始化下拉框
        initSelect(){
            let _this=this;
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
                d['choosed']=[];
                d.onSelect=function(data){
                    if( _this.data.isInit || _this.data.isReolad || !_this.data.childDrop[i] || _this.data.childDrop[i].data.choosed.length == 0){
                        if(!_this.data.isInit){
                            _this.data.value='';
                            _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                        }
                        return;
                    }
                    _this.data.isReolad=true;
                    _this.actions.changeValue(data[0]['id'],i);
                    _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                };
                if (this.data.value) {
                    let value = this.data.dataList[this.data.value][i];
                    d['list'].push({name: value, id: value});
                    d['choosed'].push({name: value, id: value});;
                     this.data.hasChoose.set(i, value);

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
                let autoSelect = new AutoSelect({data:d});
                this.data.childDrop[i] = autoSelect;
                this.append(autoSelect, this.el.find('.multi-drop'));
                if (this.data.is_view && this.data.value) {
                    $(this.el.find('.auto-select-component').get(i)).attr('title', d['choosed'][0].name);
                }
            }
            this.data.isInit=false;
        }
    },
    binds:[
        {
            event: 'click',
            selector: '.refresh',
            callback: function(){
                this.actions.refresh(this)
            }
        },
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data);
            }
        }
    ],
    afterRender(){
        this.data.isInit=true;
        //记录已选择的选项数，只有全部选择才会触发changeValue事件
        this.setData('hasChoose', new Map());
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        if (!this.data.childDrop) {
            this.setData('childDrop', []);
        }
        if (this.data.be_control_condition) {
            return;
        }
       this.actions.initSelect();
    },
    beforeDestory(){
        this.el.off();
    }
}
let MultiLinkageControl = Component.extend(config)
export default MultiLinkageControl