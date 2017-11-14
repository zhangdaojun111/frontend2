/**
 * @author yangxiaochuan
 * 分页
 */

import Component from "../../../../lib/component";
import template from './data-pagination.html';
import './data-pagination.scss';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import msgBox from '../../../../lib/msgbox';
import {dataTableService} from "../../../../services/dataGrid/data-table.service";
import {HTTP} from "../../../../lib/http"

let config = {
    template: template,
    data: {
        tableId: '',
        pagination: true,
        //数据总条数
        total: 0,
        //每页显示数量
        rows: 100,
        //当前页数
        currentPage: 1,
        //分页总数
        sumPage: 1,
        //分页后第一条是总数据多少条
        first: 0,
        //pageSize区间
        range: {
            l:100,
            r:5000
        },
        //选择的条数
        rowGroup: [5000,1000,500,200,100],
        //表级操作
        tableOperationData: [],
        //是否为超级管理员
        isSuperUser: 0,
        //agGrid配置
        gridOptions: null,
        //是否自己操作的失效刷新
        myInvalid: false,
        //是否在刷新
        onRefresh: false,
        //分页应用类型
        type: 'normal'
    },
    actions: {
        //接受rows值和total值
        resetPagination: function (total) {
            //总数赋值
            this.actions.changeVal( 'total',total );
            //当前页面数据
            this.actions.changeVal( 'currentPage',this.data.currentPage );
            //设置pageSize
            this.el.find( '.pageSize' )[0].value = this.data.rows;
            //设置跳转值
            this.el.find( '.enterPageNum' )[0].value = this.data.currentPage;
            //设置总页数
            this.data.sumPage = Math.ceil(Number(total)/Number(this.data.rows));
            if( Number(this.data.sumPage) == 0 ){
                this.data.sumPage = 1;
            }
            this.data.first = ( Number( this.data.currentPage ) - 1)*Number(this.data.rows);
            this.actions.changeVal( 'sumPage',this.data.sumPage );
            this.actions.setDisable();
        },
        //设置不可点击
        setDisable: function () {
            // debugger
            this.actions.removeCanNotClick( 'goFirst' );
            this.actions.removeCanNotClick( 'goPre' );
            this.actions.removeCanNotClick( 'goNext' );
            this.actions.removeCanNotClick( 'goLast' );
            if( this.data.currentPage == 1 ){
                this.actions.addCanNotClick( 'goFirst' );
                this.actions.addCanNotClick( 'goPre' );
            }
            if( this.data.currentPage == this.data.sumPage ){
                this.actions.addCanNotClick( 'goNext' );
                this.actions.addCanNotClick( 'goLast' );
            }
        },
        // 改变值
        changeVal: function (name,num) {
            let className = '.' + name;
            this.el.find( className )[0]['innerHTML'] = num;
        },
        //添加canNotClick
        addCanNotClick: function (name) {
            let e = this.el.find( '.'+name )[0]
            if( e.className.indexOf( ' canNotClick' ) == -1 ){
                e.className += ' canNotClick';
            }
        },
        //去掉canNotClick
        removeCanNotClick: function (name) {
            let e = this.el.find( '.'+name )[0]
            if( e.className.indexOf( 'canNotClick' ) != -1 ){
                e.className = name;
            }
        },
        //是否可点击
        canClick: function (name) {
            return this.el.find( '.'+name )[0].className == name;
        },
        //添加点击事件
        addClick: function () {
            this.el.on( 'click','.goFirst',()=>{
                if( this.actions.canClick( 'goFirst' ) ){
                    this.data.currentPage = 1;
                    this.actions.resetPagination( this.data.total );
                    this.actions.onPaginationChanged();
                }
            } ).on( 'click','.goPre',()=>{
                if( this.actions.canClick( 'goPre' ) ){
                    this.data.currentPage = Number( this.data.currentPage ) - 1;
                    this.actions.resetPagination( this.data.total );
                    this.actions.onPaginationChanged();
                }
            } ).on( 'click','.goNext',()=>{
                if( this.actions.canClick( 'goNext' ) ){
                    this.data.currentPage = Number( this.data.currentPage ) + 1;
                    this.actions.resetPagination( this.data.total );
                    this.actions.onPaginationChanged();
                }
            } ).on( 'click','.goLast',()=>{
                if( this.actions.canClick( 'goLast' ) ){
                    this.data.currentPage = this.data.sumPage;
                    this.actions.resetPagination( this.data.total );
                    this.actions.onPaginationChanged();
                }
            } ).on( 'input','.pageSize',_.debounce( ()=>{
                let input = this.el.find( '.pageSize' )[0];
                if( input.value<this.data.range.l ){
                    msgBox.showTips( '范围：' + this.data.range.l + '-' + this.data.range.r );
                    input.value = this.data.range.l;
                }
                if( input.value>this.data.range.r ){
                    msgBox.showTips( '范围：' + this.data.range.l + '-' + this.data.range.r );
                    input.value = this.data.range.r;
                }
                if( input.value == this.data.rows ){
                    return;
                }
                this.data.rows = input.value;
                this.data.currentPage = 1;
                this.actions.resetPagination( this.data.total );
                this.actions.onPaginationChanged();

                if( this.data.tableId ){
                    console.log("pageSize数据保存：" + Number(this.data.rows));
                    dataTableService.savePreference({
                        'action': 'pageSize',
                        table_id: this.data.tableId,
                        pageSize: Number(this.data.rows)
                    });
                    HTTP.flush();
                }
            },1000 ) ).on( 'input','.enterPageNum',_.debounce( ()=>{
                let input = this.el.find( '.enterPageNum' )[0];
                if( input.value<1 ){
                    msgBox.showTips( '范围：1-' + this.data.sumPage );
                    input.value = 1;
                }
                if( input.value>this.data.sumPage ){
                    msgBox.showTips( '范围：1-' + this.data.sumPage );
                    input.value = this.data.sumPage;
                }
                if( input.value == this.data.currentPage ){
                    return;
                }
                this.data.currentPage = input.value;
                this.actions.resetPagination( this.data.total );
                this.actions.onPaginationChanged();
            },1000 ) ).on( 'click','.ui-icon-refresh',()=>{
                this.actions.onPaginationChanged();
            } ).on( 'click','.data-invalid',()=>{
                this.el.find( '.data-invalid' ).eq(0).html( '' );
            } )
        },
        onPaginationChanged: function (invalid) {
            this.el.find( '.ui-icon-refresh' ).eq(0).addClass( 'refresh-rotate' )
            if( !invalid ){
                this.el.find( '.data-invalid' )[0].innerHTML = '';
            }
            let obj = {
                currentPage: Number(this.data.currentPage),
                rows: Number(this.data.rows),
                first: Number(this.data.first)
            };
            console.log( '分页数据' );
            console.log( obj );
            this.actions.paginationChanged(obj);
        },
        //分页变化
        paginationChanged: function (obj) {
        },
        //外部刷新分页
        setPagination: function ( total,currentPage ) {
            this.data.total = total;
            this.data.currentPage = currentPage;
            this.actions.resetPagination( this.data.total );
            this.el.find( '.ui-icon-refresh' ).eq(0).removeClass( 'refresh-rotate' );
        },
        //表级操作
        tableOperate: function () {
            if( this.data.isSuperUser == 1 ){
                this.el.find( '.tableOperateSelect' ).on( 'change',()=>{
                    let operate = this.el.find( '.tableOperateSelect' )[0];
                    if( operate.value != '操作' ){
                        for( let o of this.data.tableOperationData ){
                            if( o.name == operate.value ){
                                this.actions.tableOperateFun( o.beAddress,o.addressss );
                                break;
                            }
                        }
                    }
                    operate.value = '操作';
                } )
            }
        },
        //表级操作
        tableOperateFun: function (opt,opera) {
            console.log("表级操作")
            console.log(opt)
            console.log(opera)
            if(opera != 0){
                let address = JSON.parse(opera);
                let deleteListRel = [];
                let rows = this.data.gridOptions.api.getSelectedRows();
                for( let r of rows ){
                    if( r._id ){
                        deleteListRel.push( r._id );
                    }
                }
                //需弹框的表级操作
                if(address['feAddress']!=''){
                    if(address['feAddress']=='check'){
                        return;
                    }
                    let beAddress=address['beAddress'];
                    let fun=address['feAddress'].split('?')[0];
                    let params=JSON.parse(address['feAddress'].split('?')[1]);
                    switch(fun){
                        //操作
                        case 'funA':{
                            break;
                        }
                        //操作B
                        case 'funB':{
                            break;
                        }
                    }
                }else{//不需弹框的表级操作-刷新cache
                    msgBox.showTips('已经向服务器发送请求');
                    if(address['beAddress'] != ''){
                        if(address['beAddress'].indexOf('method=get')!=-1){
                            $('<a href="'+address['beAddress']+'" ></a>')[0].click();
                        }else {
                            let funName = '';
                            if(address['beAddress'].indexOf('=')!=-1){
                                funName = address['beAddress'].split('=')[1]
                            }
                            let obj = {
                                table_id:this.data.tableId,
                                selectedRows:JSON.stringify(deleteListRel),
                                function_name: funName
                            }
                            HTTP.postImmediately( address['beAddress'],obj ).then( res=>{
                                if(res['success']==1){
                                    msgBox.showTips('发送成功！');
                                }else if(res['success']==0){
                                    msgBox.alert('发送请求失败！错误是'+res['error']);
                                }
                            } )
                        }
                    }
                }
            }
        },
        //失效刷新
        invalidTips: function () {
            this.el.find( '.data-invalid' ).removeClass('freshtip');
            this.el.find( '.data-invalid' ).removeClass('unfreshtip');
            this.el.find( '.data-invalid' )[0].innerHTML = this.data.myInvalid ? '数据失效，已刷新。' : '数据失效，请刷新。';
            if(this.data.myInvalid) {
                this.el.find( '.data-invalid' ).addClass('freshtip');
            } else {
                this.el.find( '.data-invalid' ).addClass('unfreshtip');
            }
            if( this.data.myInvalid ){
                this.actions.onPaginationChanged( true );
            }
            // this.el.find( '.data-invalid' ).addClass('freshtip');
            this.data.myInvalid = false;
        },
        //延时刷新
        timeDelayRefresh: function () {
            if( !this.data.onRefresh ){
                this.data.onRefresh = true;
                setTimeout( ()=>{
                    this.actions.invalidTips();
                },500 )
                setTimeout( ()=>{
                    this.data.onRefresh = false;
                },500 )
            }
        }
    },
    afterRender: function (){
        this.actions.resetPagination( this.data.total );
        this.actions.addClick();
        //表级操作
        this.actions.tableOperate();
        //订阅数据失效
        if( this.data.type == 'workflow' ){
            PMAPI.subscribe(PMENUM.workflow_approve_msg, (info) => {
                // this.el.find( '.data-invalid' ).removeClass('freshtip');
                // this.el.find( '.data-invalid' )[0].innerHTML = '数据失效，请刷新。';
                // this.el.find( '.data-invalid' ).addClass('freshtip');
                this.actions.timeDelayRefresh();
            })
        }else {
            PMAPI.subscribe(PMENUM.data_invalid, (info) => {
                let tableId = info.data.table_id;
                if( this.data.tableId == tableId ){
                    this.actions.timeDelayRefresh();
                }
            })
        }
    }
};
class dataPagination extends Component {
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}


export default dataPagination;