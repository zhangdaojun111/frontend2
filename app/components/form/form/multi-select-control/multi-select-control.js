import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator'
import {AutoSelect} from '../../util/autoSelect/autoSelect'
import {FormService} from '../../../services/formService/formService'
import template from './multi-select-control.html'

let config={
    template:template,
    actions:{

        //初始化各框
        resetOption (){
            this.data.sDropOption = [{label:'',value:''}];
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

        dropOnChange(value){
            this.data.sDropValue=value;
            this.multiBuildSelect['more']['data']['list'] = [];
            this.data.sMuiltValue = [];
            if( this.data.sDropValue!='' ){
                this.multiBuildSelect['one'].data.list = [{name:this.data.sDropValue,id:this.data.sDropValue}];
            }
            for( let k in this.data.originalList ){
                let arr = this.data.originalList[k];
                if( arr[0] == this.data.sDropValue ){
                    this.multiBuildSelect['more']['data']['list'].push( {name:arr[1],id:arr[1]} );
                }
            }
            this.multiBuildSelect['more'].reload();
            this.multiBuildSelect['one'].reload();
        },

        muiltOnChange (value){
            this.data.sMuiltValue = value||[];
            this.actions.resetData();
        },

        resetData (){
            let val = [];
            for( let k in this.data.originalList ){
                for( let v of this.data.sMuiltValue ){
                    let arr = [this.data.sDropValue,v]
                    if( this.data.originalList[k].toString() == arr.toString() ){
                        val.push( k );
                    }
                }
            }
            this.data['value'] = val;
            _.debounce(function(){Mediator.publish('form:changeValue:'+this.data.tableId,this.data)},200)();
        },

        setValue(){
            let values=[];
            for(let key in this.childSelect.data.choosed){
                values.push(this.childSelect.data.choosed[key]['id']);
            }
            this.data.value=values;
        },

        //创建下拉框
        creteSelect(hasValue){
            this.set('multiBuildSelect',{});
            let _this=this;
            let oneSelect=this.el.find('#oneSelect');
            let moreSelect=this.el.find('#moreSelect');
            if(this.data.sDropOption && this.data.sDropOption.length >0 && this.data.sDropOption[0]['label'] == '-'){
                this.data.sDropOption[0]['value']='-';
            }
            if(this.data.sMuiltOption && this.data.sMuiltOption.length >0 &&[0]['label'] == '-'){
                this.data.sMuiltOption[0]['value']='-';
            }
            if(this.data.options[0]['label'] == '-'){
                this.data.options[0]['value']='-';
            }
            let data1=_.defaultsDeep({},this.data);
            let data2=_.defaultsDeep({},this.data);
            data1.options=this.data.sDropOption;
            data2.options=this.data.sMuiltOption;
            let oneSelectdata=FormService.createSelectJson(data1,false,true);
            let moreSelectdata=FormService.createSelectJson(data2,true,true);
            oneSelectdata.onSelect=function(data){
                if(_this.data.isInit ){
                    return;
                }
                _this.actions.dropOnChange(data[0]['id']);
            };
            moreSelectdata.onSelect=function(data){
                if(_this.data.isInit ){
                    return;
                }
                _this.actions.muiltOnChange(data[0]['id']);
            };

            if(hasValue){
                for(let i in this.data.sMuiltValue){
                    moreSelectdata.choosed.push({
                        name:this.data.sMuiltValue[i].label,
                        id:this.data.sMuiltValue[i].value,
                    })
                }
            }

            let oneAutoSelect=new AutoSelect(oneSelectdata);
            let moreAutoSelect=new AutoSelect(moreSelectdata);
            this.multiBuildSelect['one']=oneAutoSelect;
            this.multiBuildSelect['more']=moreAutoSelect;
            this.append(oneAutoSelect,oneSelect);
            this.append(moreAutoSelect,moreSelect);
            this.data.isInit=false;
        }
    },
    afterRender(){
        let _this=this;
        Mediator.subscribe('form:changeOption:'+_this.data.tableId,function(data){
            if( _this.data.dfield && res == _this.data.dfield ){
                _this.data.value = [];
                _this.childSelect.data.choosed=[];
                _this.reload();
            }
        })
        this.el.on('click','.add-item',function(){
            _.debounce(function(){Mediator.publish('form:addItem:'+_this.data.tableId,_this.data)},200)();
        })
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
        this.data.isInit=true;
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
                    this.data.isViewOptions=[]
                    for(let v of this.data["options"]){
                        if(this.data["value"].indexOf(v.value) != -1){
                            this.data.isViewOptions.push({'label':v.label,'value':v.value})
                        }
                    }
                }
                console.log(this.data.isViewOptions);

                this.set('childSelect', {});
                let el=this.el.find('#multi-select');
                if(this.data.options[0]['label'] == '-'){
                    this.data.options[0]['value']='-';
                }
                if(this.data.isViewOptions.length>0 && this.data.isViewOptions[0]['label'] == '-'){
                    this.data.isViewOptions[0]['value']='-';
                }
                if(this.data.options2 && this.data.options2.length>0 && this.data.options2[0]['label'] == '-'){
                    this.data.options2[0]['value']='-';
                }
                let data=FormService.createSelectJson(this.data,true);
                data.onSelect=function(){
                    if(_this.data.isInit || !_this.childSelect || _this.childSelect.data.choosed.length == 0 ){
                        return;
                    }
                    _this.actions.setValue();
                    if(_this.data.isSys){
                        _.debounce(function(){Mediator.publish('form:userSysOptions:'+_this.data.tableId,_this.data)},200)();
                    }

                    _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
                };
                let autoSelect=new AutoSelect(data);
                this.childSelect=autoSelect;
                this.append(autoSelect,el);

            }else {
                this.data.originalList = {};
                for( let o of this.data['options'] ){
                    let str = o.label;
                    let arr = str.split('_')
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
                        this.data.sMuiltOption.push({label:arr[1],value:arr[1]})
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
        Mediator.removeAll('form:changeOption:'+this.data.tableId);
    }
}
export default class MultiSelectControl extends Component{
    constructor(data){
        super(config,data);
        console.log('1111');
        console.log(data);
    }
}