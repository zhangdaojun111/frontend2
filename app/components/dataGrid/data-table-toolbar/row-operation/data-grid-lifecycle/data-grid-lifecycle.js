/**
 * Created by wyh on 2017/11/15.
 */
import Component from '../../../../../lib/component';
import template from './data-grid-lifecycle.html'
import './data-grid-lifecycle.scss';
import {PMAPI,PMENUM} from '../../../../../lib/postmsg';
import msgBox from '../../../../../lib/msgbox';
import {dataTableService} from '../../../../../services/dataGrid/data-table.service';
import {FormService} from '../../../../../services/formService/formService';
import {HTTP} from "../../../../../lib/http";
import {dgcService} from "../../../../../services/dataGrid/data-table-control.service";
import {Loading} from "../../../../../components/util/loading/loading"

let config = {
    template:template,
    data:{
        //@input
        lifeCycleData:'',
        cycleTitle:'',
        flow_node:[],
        define_infos:'',
        define_real:'',
        //对应数据
        thisData : {},
        thisRows : {},
        //统计对象
        countObject : {},
        tempData : {},
    },
    actions:{
        init:function () {
            let cycleObj=[];
            this.data.thisData = this.data.define_infos[this.data.lifeCycleData.rowId]||{};
            let json1 = {
                table_id : this.data.lifeCycleData.table_id,
            };
            let json2 = {
                table_id : this.data.lifeCycleData.table_id,
                first : 0,
                rows : 99999,
                special_count_field_list : this.data.flow_node
            };
            let header = FormService.getStaticData( json1 );
            let body = dataTableService.getTableData( json2 );
            Promise.all([header,body]).then(res=>{
                let data = res[0].data;
                let oData=res[1].rows;
                if( !this.data.thisData ) {
                    this.data.thisData = {};
                }
                if( !this.data.tempData ) {
                    this.data.tempData = {};
                }
                for( let i = 0 ; i < oData.length ; i++) {
                    if( oData[i]._id == this.data.lifeCycleData.rowId){
                        this.data.tempData = oData[i]||{};
                    }
                }
                for( let i = 0 ; i < this.data.define_real.length ; i++ ) {
                    if( this.data.define_real[i]._id == this.data.lifeCycleData.rowId ) {
                        this.data.thisRows = this.data.define_real[i];
                    }
                }
                this.actions.askForStatus( 0 , data , cycleObj );
            });
            HTTP.flush();
        },
        askForStatus: function (i, data, cycleObj) {
            if( data[i].field_content.count_table ){
                let obj={
                    name : data[i].label ,
                    parent_table_id : this.data.lifeCycleData.table_id ,
                    table_id : data[i].field_content.count_table ,
                    rowId : this.data.lifeCycleData.rowId ,
                    fieldId : data[i].id ,
                    flow_node : false
                };
                if( this.data.thisData[data[i].dfield] ){
                    obj.flow_node = true;
                    obj['status'] = this.data.thisRows[data[i].dfield] == '结束' ? 1 : 0 ;
                    obj['wf_table_id3'] = this.data.thisData[data[i].dfield]['table_id'][0];
                    obj['formId'] =  this.data.thisData[data[i].dfield]['form_id'];
                    obj['recordId'] = this.data.thisData[data[i].dfield]['record_id'];
                    obj['flowId'] = this.data.thisData[data[i].dfield]['flow_id'];
                    let now = new Date();
                    let past = new Date( this.data.thisData[data[i].dfield]['creat_time'] );
                    let time = now.getTime() - past.getTime();
                    obj['time'] = Math.ceil(time/3600000/24);
                    this.data.countObject[ obj.name ]=obj;
                }
                let oDfield = data[ i ].dfield;
                let json = {
                    table_id : data[i].field_content.count_table,
                    first : 0,
                    rows : 99999,
                    parent_table_id : this.data.lifeCycleData.table_id,
                    parent_real_id : this.data.lifeCycleData.rowId,
                    rowId : this.data.lifeCycleData.rowId,
                    fieldId : data[i].id,
                    tableType : 'count',
                    if_filter : 1,
                };
                dataTableService.getTableData( json ).then(res=>{
                    if(res.rows.length){
                        obj['_id'] = res.rows[0]._id;
                        cycleObj.push(obj);
                        this.data.countObject[obj.name] = obj;
                        if(obj.name=="管理人用印"){
                            obj['status']=res.rows[0].f8;
                        }else if(obj.name=="托管人用印"){
                            obj['status']=res.rows[0].f9;
                        }else if(obj.name=="委托人用印") {
                            obj['status'] = res.rows[0].f10;
                        }
                    }
                    if( i == data.length-1){
                        let num = Number(this.actions.statusCal('开立募集账户')+this.actions.statusCal('资金监督协议')+this.actions.statusCal('开立托管账户')+this.actions.statusCal('外包服务协议')+this.actions.statusCal('经纪服务协议')+this.actions.statusCal('期货备忘录'));
                        if( num > 0 ){
                            let arr = [];
                            arr=this.actions.timePush(arr,'开立募集账户');
                            arr=this.actions.timePush(arr,'资金监督协议');
                            arr=this.actions.timePush(arr,'开立托管账户');
                            arr=this.actions.timePush(arr,'外包服务协议');
                            arr=this.actions.timePush(arr,'经纪服务协议');
                            arr=this.actions.timePush(arr,'期货备忘录');
                            arr.sort( function ( a , b ) { return b - a; });
                            this.data.countObject['协议']={
                                name : '协议',
                                status : 0,
                                time : arr[0]
                            }
                        }
                        if( num == 12 ){
                            this.data.countObject['协议']={
                                name : '协议',
                                status : 1
                            }
                        }
                        this.actions.setStyles();
                        this.hideLoading();
                    }else{
                        this.actions.askForStatus(i + 1, data, cycleObj);
                    }
                });
                HTTP.flush();
            }else{
                this.actions.askForStatus(i + 1, data, cycleObj);
            }
        },
        //计算status
        statusCal: function( name ){
            if( this.data.countObject[ name ] ) {
                if( this.data.countObject[ name ].status == 0 ){
                    return 1;
                }else{
                    return 2;
                }
            }else{
                return 0;
            }
        },
        //计算时间
        timePush: function(arr, name){
            if( this.data.countObject[ name ] ) {
                if( this.data.countObject[ name ].status == 0 ) {
                    arr.push( this.data.countObject[ name ].time );
                }
            }
            return arr;
        },
        //编辑成功后
        isSuccess: function(data) {
            if (data) {
                this.showLoading();
                this.actions.init();
            }
        },
        //关于用印
        goBlack: function(){
            return this.data.countObject[ '管理人用印' ] || this.data.countObject[ '托管人用印' ] || this.data.countObject[ '委托人用印' ] ;
        },
        //字颜色
        fontColor: function( name ){
            if( this.data.countObject[ name ] ){
                if( this.data.countObject[ name ].status == 0 ){
                    return 'rgba(255, 255, 255, 1)';
                }
            }
            return 'rgba(0, 0, 0, 1)';
        },
        //选择背景颜色
        backgroundColor: function( name ){
            if( this.data.countObject[ name ] ){
                if( this.data.countObject[ name ].status == 0 ){
                    return 'rgba(14, 122, 239, 1)';
                }
            }
            return 'rgba(255, 255, 255, 1)';
        },
        //选择闹钟或者连线
        imgSelect: function( name ){
            if( this.data.countObject[ name ] ) {
                if( this.data.countObject[ name ].status == 0 ) {
                    return 1;
                } else {
                    return 2;
                }
            } else {
                return 0;
            }
        },
        //选择用印边框颜色
        statusSelect: function( name ){
            console.log('---------用印');
            console.log(name);
            console.log(this.data.countObject[ name ]);
            console.log(!this.data.countObject[ name ]);
            console.log('---------用印-------end');
            if( this.data.countObject[ name ]) {
                if( this.data.countObject[ name ].status == "是" ){
                    return 'rgba(14, 122, 239, 1)';
                } else {
                    return 'rgba(169, 169, 169, 1)';
                }
            }else{
                return 'rgba(169, 169, 169, 1)';
            }
        },
        //选择边框颜色
        borderColor: function( name ){
            if( !this.data.countObject[ name ] ){
                return 'rgba(169, 169, 169, 1)';
            }else{
                return 'rgba(14, 122, 239, 1)';
            }
        },
        onClickElement( name ){
            if( !this.data.countObject[ name ] ){ return;}

            FormService.getPrepareParmas({table_id: this.data.countObject[name].table_id}).then(res=> {
                let obj = {
                    table_id: this.data.countObject[name].table_id,
                    parent_table_id: this.data.countObject[name].parent_table_id || '',
                    parent_real_id: '',
                    parent_temp_id: '',
                    real_id: this.data.countObject[name]._id,
                    // temp_id: data.data.temp_id || '',
                    // record_id: data.data.record_id || '',
                    btnType: 'view',
                    is_view: 1,
                    form_id: res.data.form_id,
                    flow_id: this.data.countObject[name]['flowId'] || '',
                };
                let url = dgcService.returnIframeUrl('/iframe/addWf/', obj);
                let title = '查看'
                PMAPI.openDialogByIframe(url, {
                    width: 1600,
                    height: 800,
                    title: title,
                    modal: true,
                }).then((data) => {
                    if (data == 'success' || data.refresh) {
                        this.showLoading();
                        this.actions.init();
                    }
                })
            })
        },
        setStyles:function () {
            //连接线,背景色,字体颜色,提醒图片
            this.el.find('div.setColor').each((i,e) => {
                let color = this.actions.fontColor(e.title);
                $(e).css('color',color)
            })
            this.el.find('div.setBorderColor').each((i,e) => {
                if(e.title.indexOf('用印') != -1){
                    console.log(111)
                    let borderColor = this.actions.statusSelect(e.title);
                    $(e).css('borderColor',borderColor)
                }else{
                    let borderColor = this.actions.borderColor(e.title)
                    $(e).css('borderColor',borderColor)
                }
            })
            this.el.find('div.setBackgroundColor').each((i,e) => {
                let backgroundColor = this.actions.backgroundColor(e.title);
                $(e).css('backgroundColor',backgroundColor)
            })
            this.el.find('img.ngif').each((i,e) => {
                if(e.alt == 'goBlack'){
                    let num = Boolean(this.actions.goBlack()) ? 1 : 0;
                    let className = 'goBlack' + num;
                    if($(e).hasClass(className)){
                        $(e).css('display','inline-block');
                    }else{
                        $(e).css('display','none');
                    }
                }else{
                    let name = e.alt;
                    let className = 'imgSelect' + this.actions.imgSelect(name);
                    if($(e).hasClass(className)){
                        $(e).css('display','inline-block');
                    }else{
                        $(e).css('display','none');
                    }
                }
            });
            //剩余天数
            if(this.actions.imgSelect('协议') == 1 ) {
                let days = this.data.countObject['协议'].time || 5;
                this.el.find('#u76').append(`<p class="tipsP">5天（当前节点<span>${days}</span>天）</p>`)
            }
            if(this.actions.imgSelect('用印状态') == 1 ) {
                let days = this.data.countObject['用印状态'].time || 5;
                this.el.find('#u78').append(`<p class="tipsP">5天（当前节点<span>${days}</span>天）</p>`)
            }
            //标题
            $('#lifecycle-title').html(`<div class="cycle-title" style="text-align: center;padding: 30px 0 0 0;">${this.data.cycleTitle}</div>`)
        }
    },
    binds:[
        {
            event: 'click',
            selector: '#u0',
            callback: function(){
                this.actions.onClickElement('立项状态');
            }
        },
        {
            event: 'click',
            selector: '#u2',
            callback: function(){
                this.actions.onClickElement('产品要素');
            }
        },
        {
            event: 'click',
            selector: '#u8',
            callback: function(){
                this.actions.onClickElement('产品合同审批');
            }
        },
        {
            event: 'click',
            selector: '#u20',
            callback: function(){
                this.actions.onClickElement('管理人用印');
            }
        },
        {
            event: 'click',
            selector: '#u22',
            callback: function(){
                this.actions.onClickElement('托管人用印');
            }
        },
        {
            event: 'click',
            selector: '#u24',
            callback: function(){
                this.actions.onClickElement('委托人用印');
            }
        },
        {
            event: 'click',
            selector: '#u26',
            callback: function(){
                this.actions.onClickElement('开立募集账户');
            }
        },
        {
            event: 'click',
            selector: '#u28',
            callback: function(){
                this.actions.onClickElement('资金监督协议');
            }
        },
        {
            event: 'click',
            selector: '#u30',
            callback: function(){
                this.actions.onClickElement('开立托管账户');
            }
        },
        {
            event: 'click',
            selector: '#u32',
            callback: function(){
                this.actions.onClickElement('外包服务协议');
            }
        },
        {
            event: 'click',
            selector: '#u34',
            callback: function(){
                this.actions.onClickElement('经纪服务协议');
            }
        },
        {
            event: 'click',
            selector: '#u36',
            callback: function(){
                this.actions.onClickElement('期货备忘录');
            }
        },
    ],
    afterRender: function(){
        console.log('====this is lifecycle====');
        this.showLoading()
        PMAPI.getIframeParams(window.config.key).then((res) => {
            console.log(res);
            this.data.lifeCycleData = res.data.lifeCycleData;
            this.data.cycleTitle = res.data.cycleTitle;
            this.data.flow_node = res.data.flow_node;
            this.data.define_infos = res.data.define_infos;
            this.data.define_real = res.data.define_real;
            this.actions.init();
        })
    }
};


class lifeCycle extends Component {
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default lifeCycle;