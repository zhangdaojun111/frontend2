/**
 *@author yudeping
 *多选控件
 */


import Component from '../../../lib/component'
import {AutoSelect} from '../../util/autoSelect/autoSelect'
import {FormService} from '../../../services/formService/formService'
import template from './multi-select-control.html'

let config={
    template:template,
    actions:{

        //初始化各框
        resetOption (){
            this.data.sDropOption = [];
            this.data.sMuiltOption = [];
            this.data.sMuiltValue = [];
            this.data.sDropValue = '';
            let d_arr = [],m_arr = [];
            for( let k in this.data.originalList ){
                this.actions.arrSetValue( d_arr,this.data.originalList[k][0] );
                this.actions.arrSetValue( m_arr,this.data.originalList[k][1] );
            }
            for( let a of d_arr ){
                this.data.sDropOption.push({'label':a,'value':a})
            }
            for( let a of m_arr ){
                this.data.sMuiltOption.push({'label':a,'value':a})
            }
            this.data.reset = true;
            setTimeout( ()=>{this.data.reset = false;},10 )
        },

        arrSetValue (arr,val){
            if( arr.indexOf( val ) == -1 ){
                arr.push( val )
            }
        },

        createArr( isView ){
            let arr = [];
            for( let data of this.optionsData ){
                arr.push( isView ? { 'label':data.label,'value':data.label } : { 'label':data.label,'value':data.value } )
            }
            return arr;
        },


        //特殊多选内置单选框选中后触发
        dropOnChange(value){
            this.data.sDropValue=value;
            this.data.multiBuildSelect['more']['data']['list'] = [];
            this.data.sMuiltValue = [];
            if( this.data.sDropValue!='' ){
                this.data.multiBuildSelect['one'].data.list = [{name:this.data.sDropValue,id:this.data.sDropValue}];
            }
            for( let k in this.data.originalList ){
                let arr = this.data.originalList[k];
                if( arr[0] == this.data.sDropValue ){
                    this.data.multiBuildSelect['more']['data']['list'].push( {name:arr[1],id:arr[1]} );
                }
            }
            this.data.multiBuildSelect['more'].reload();
            this.data.multiBuildSelect['one'].reload();
            this.data.isReloading=false;
        },

        //特殊多选内置多选框选中后触发
        muiltOnChange (value){
            this.data.sMuiltValue = value||[];
            this.actions.resetData();
        },

        resetData (){
            let val = [];
            for( let k in this.data.originalList ){
                for( let v of this.data.sMuiltValue ){
                    let arr = [this.data.sDropValue,v];
                    if( this.data.originalList[k].toString() == arr.toString() ){
                        val.push( k );
                    }
                }
            }
            this.data['value'] = val;
            let _this=this;
            _.debounce(function(){_this.events.changeValue(_this.data)},200)();
        },

        setValue(){
            let values=[];
            let titleValues = [];
            this.el.find('.form-control').removeAttr('title');
            for(let key in this.data.childSelect.data.choosed){
                values.push(this.data.childSelect.data.choosed[key]['id']);
                titleValues.push(this.data.childSelect.data.choosed[key]['name']);
            }
            this.data.value=values;
            this.el.find('.form-control').attr('title',titleValues);
            this.el.find('.result').attr('title',titleValues);
        },

        //创建下拉框
        creteSelect(hasValue){
            this.setData('multiBuildSelect',{});
            let _this=this;
            let oneSelect=this.el.find('#oneSelect');
            let moreSelect=this.el.find('#moreSelect');
            if(this.data.sDropOption && this.data.sDropOption.length >0 && this.data.sDropOption[0]['label'] == '-'){
                this.data.sDropOption[0]['value']='-';
            }
            if(this.data.sMuiltOption && this.data.sMuiltOption.length >0 &&[0]['label'] == '-'){
                this.data.sMuiltOption[0]['value']='-';
            }
            if(this.data.options[0] && this.data.options[0]['label'] && this.data.options[0]['label'] == '-'){
                this.data.options[0]['value']='-';
            }
            let data1=_.defaultsDeep({},this.data);
            let data2=_.defaultsDeep({},this.data);
            data1.options=this.data.sDropOption;
            data2.options=this.data.sMuiltOption;
            let oneSelectdata=FormService.createSelectJson(data1,false,2);
            let moreSelectdata=FormService.createSelectJson(data2,true,2);
            oneSelectdata.onSelect=function(data){
                if(_this.data.isInit || data.length == 0 || _this.data.isReloading){
                    return;
                }
                _this.data.isReloading=true;
                _this.actions.dropOnChange(data[0]['id']);
            };
            moreSelectdata.onSelect=function(data){
                if(_this.data.isInit || data.length == 0 || _this.data.isReloading){
                    return;
                }
                let arr=[];
                for(let i in data){
                    arr.push(data[i].id);
                }
                _this.actions.muiltOnChange(arr);
            };

            if(hasValue){
                for(let i in this.data.sMuiltValue){
                    moreSelectdata.choosed.push({
                        name:this.data.sMuiltValue[i],
                        id:this.data.sMuiltValue[i],
                    })
                }
                oneSelectdata.choosed.push({
                    name:this.data.sDropValue,
                    id:this.data.sDropValue,
                })
            }
            let oneAutoSelect=new AutoSelect({data:oneSelectdata});
            let moreAutoSelect=new AutoSelect({data:moreSelectdata});
            this.data.multiBuildSelect['one']=oneAutoSelect;
            this.data.multiBuildSelect['more']=moreAutoSelect;
            this.append(oneAutoSelect,oneSelect);
            this.append(moreAutoSelect,moreSelect);
            this.data.isInit=false;
        },
        changeOption(res){
            if( this.data.dfield && res == this.data.dfield ){
                this.data.value = [];
                this.data.childSelect.data.choosed=[];
                this.reload();
            }
        }
    },
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data);
            }
        },
        {
            event: 'click',
            selector: '.add-item',
            callback: function(){
            	if(this.data.dtype=='14'){
            		this.events.addNewBuildIn(this.data);
	            }else{
		            this.events.addItem(this.data)
	            }
            }
        }
    ],
    afterRender(){
        let _this=this;
        this.data.isInit=true;
        if(!this.data.is_view && this.data.can_add_item){
            this.el.find('.add-item').css('visibility','visible').addClass('icon-fl')
        }
      //  if(this.data.is_view){
            let arr = [];
            for(let k1 in this.data.options) {
                for(let k2 in this.data.value) {
                    if(this.data.value[k2] == this.data.options[k1].value) {
                        arr.push(this.data.options[k1].label);
                    }
                }
                this.el.find('.form-control').attr('title',arr);
            }
       // }
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible').addClass('icon-fl');
        }
        if(!this.data.be_control_condition) {
            if( !this.data.is_special ){
                if( this.data['filterOptions'] == 1 ){
                    if( this.data.childData && this.data.childData != "" ){
                        let arr = [];
                        arr = this.data.childData.indexOf( '$#$' ) != -1 ? this.data.childData.split( '$#$' ) : [this.data.childData];
                        for( let data of arr ){
                            let arr_1 = [];
                            arr_1 = data.split( '#*#' );
                            if( arr_1.length == 2 ){
                                this.data.optionsData.push( { 'label': arr_1[0],'value': arr_1[1] } );
                            }
                        }
                    }
                    if( this.selectType == '1' ){
                        this.data.can_add_item = 0;
                    }
                    let num = 0;
                    for( let option of this.data["options"] ){
                        if( option['label'] == option['value'] ){
                            num++;
                        }
                    }
                    if( this.data.selectType == '1' && this.data.is_view == '1' && num > 0 ){
                        this.data.options2 = this.data["options"];
                    }
                    this.data.options2 = this.data.selectType == "1" ? this.actions.createArr( this.data.selectType == '1' && this.data.is_view == '1' && num > 0 ) : this.data['options'];
                }else{
                    this.data.isViewOptions=[];
                    for(let v of this.data["options"]){
                        if(this.data["value"].indexOf(v.value) != -1){
                            this.data.isViewOptions.push({'label':v.label,'value':v.value})
                        }
                    }
                }

                this.setData('childSelect', {});
                let el=this.el.find('#multi-select');
                if(this.data.options[0] && this.data.options[0]['label'] && this.data.options[0]['label'] == '-'){
                    this.data.options[0]['value']='-';
                }
                if(this.data.isViewOptions && this.data.isViewOptions.length>0 && this.data.isViewOptions[0]['label'] == '-'){
                    this.data.isViewOptions[0]['value']='-';
                }
                if(this.data.options2 && this.data.options2.length>0 && this.data.options2[0]['label'] == '-'){
                    this.data.options2[0]['value']='-';
                }
                let data=FormService.createSelectJson(this.data,true,1);
                data.onSelect=function(){
                    if(_this.data.isInit || !_this.data.childSelect || _this.data.childSelect.data.choosed.length == 0 ){
                        if(!_this.data.isInit){
                            _this.data.value='';
                            _this.el.find('.form-control').attr('title','');
                            _this.el.find('.result').attr('title','');
                            _.debounce(function(){_this.events.changeValue(_this.data)},200)();
                        }
                        return;
                    }
                    _this.actions.setValue();
                    if(_this.data.isSys){
                        _.debounce(function(){_this.events.userSysOptions(_this.data)},200)();
                    }
                    _.debounce(function(){_this.events.changeValue(_this.data)},200)();

                };
                let autoSelect=new AutoSelect({data:data});
                this.data.childSelect=autoSelect;
                this.append(autoSelect,el);
            }else {
                console.log('这里?');
                this.data.originalList = {};
                for( let o of this.data['options'] ){
                    let str = o.label;
                    let arr = str.split('_');
                    this.data.originalList[o.value] = arr;
                }
                this.data.sDropOption = [{label:'',value:''}];
                this.data.sMuiltOption = [];
                this.data.sMuiltValue = [];
                this.data.sDropValue = '';
                if( this.data.value.length != 0 ){
                    let r = this.data.originalList[this.data.value[0]];
                    this.data.sDropOption = [{label:r[0],value:r[0]}];
                    this.data.sDropValue = r[0];
                    for( let v of this.data.value ){
                        let arr = this.data.originalList[v];
                        this.data.sMuiltOption.push({label:arr[1],value:arr[1]});
                        this.data.sMuiltValue.push( arr[1] );
                    }
                    this.actions.creteSelect(true);
                }else {
                    this.actions.resetOption();
                    this.actions.creteSelect(false);
                }
            }
        }
        this.data.isInit=false;
    },
    beforeDestory:function(){
        this.el.off();
    }
};
export default class MultiSelectControl extends Component{
    constructor(data,events,newConfig){
        super($.extend(true,{},config,newConfig),data,events)
    }
}