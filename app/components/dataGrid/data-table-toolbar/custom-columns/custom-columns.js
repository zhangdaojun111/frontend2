/**
 * @author yangxiaochuan
 * 定制列
 */
import Component from "../../../../lib/component";
import template from './custom-columns.html';
import './custom-columns.scss';
import {HTTP} from "../../../../lib/http"
import {dataTableService} from "../../../../services/dataGrid/data-table.service";
import 'jquery-ui/ui/widgets/sortable.js';

let config = {
    template: template,
    data: {
        gridoptions: null,
        fields: [],
        icons: {
            check: require('../../../../assets/images/dataGrid/icon_checkbox_yes.png'),
            uncheck: require('../../../../assets/images/dataGrid/icon_checkbox_no.png'),
            rightkong: require('../../../../assets/images/dataGrid/icon_right_kong.png'),
            leftkong: require('../../../../assets/images/dataGrid/icon_left_kong.png'),
            rightshi: require('../../../../assets/images/dataGrid/icon_right_shi.png'),
            leftkshi: require('../../../../assets/images/dataGrid/icon_left_shi.png'),
        },
        fixCols: {l: [], r: []},
        tableId: '',
        dragFields: [],
        hideFields: [],
        agGrid:null,
        close: function () {
            
        },
        setFloatingFilterInput: function () {
        }
    },
    actions: {
        //使状态同步
        makeSameSate: function () {
            let state = this.data.gridoptions.columnApi.getColumnState();
            let html = '';
            let lis = this.el.find( '#dragCustom' ).find( 'li' );
            for( let s of state ){
                for( let li of lis ){
                    if( li.attributes.field.value == s.colId ){
                        li.querySelectorAll('i')[0].className = s.hide ? 'custom-checkbox icon-aggrid-cus checkbox-uncheck' : 'custom-checkbox icon-aggrid-cus checkbox-check';
                        li.querySelectorAll('i')[1].className = s.pinned == 'left' ? 'custom-fix-l icon-aggrid-cus l-shi' : 'custom-fix-l icon-aggrid-cus l-kong';
                        li.querySelectorAll('i')[2].className = s.pinned == 'right' ? 'custom-fix-r icon-aggrid-cus r-shi' : 'custom-fix-r icon-aggrid-cus r-kong';
                        if(s.pinned == 'left') {
                            li.querySelectorAll('i')[1].setAttribute('title','取消锁定')
                        } else {
                            li.querySelectorAll('i')[1].setAttribute('title','固定在最左')
                        }
                        if(s.pinned == 'right') {
                            li.querySelectorAll('i')[2].setAttribute('title','取消锁定')
                        } else {
                            li.querySelectorAll('i')[2].setAttribute('title','固定在最右')
                        }
                        if( this.data.dragFields.indexOf( s.colId )!=-1 ){
                            li.className = s.pinned ? 'custom-disabled':'ui-state-default';
                        }
                        html += li.outerHTML;
                        break;
                    }
                }
            }
            this.el.find( '#dragCustom' )[0].innerHTML = html;

            //隐藏列事件
            this.actions.addHideClick();
            //固定事件触发
            this.actions.fixClick();
            this.actions.selectAllState();
        },
        //返回agGrid状态
        returnState: function () {
            let state = this.data.gridoptions.columnApi.getColumnState();
            return state
        },
        //设置agGrid状态
        setState: function (s) {
            this.data.gridoptions.columnApi.setColumnState( s );
        },
        //隐藏列触发事件
        addHideClick: function () {
            let That = this;
            let checkboxs = this.el.find( '.custom-checkbox' )
            for( let check of checkboxs ){
                check.addEventListener( 'click',function(){
                    let field = $( this ).eq(0).parent().attr( 'field' );
                    let state = That.actions.returnState();
                    let arr = [];
                    for( let s of state ){
                        if( s.colId && s.colId == field ){
                            s.hide = !s.hide;
                        }
                        if( That.data.dragFields.indexOf( s.colId )!=-1 && s.hide ){
                            arr.push( s.colId );
                        }
                    }
                    console.log( "隐藏列数据保存" )
                    console.log( arr )
                    //保存固定列数据
                    dataTableService.savePreference({
                        action: 'ignoreFields',
                        table_id: That.data.tableId,
                        ignoreFields: JSON.stringify( arr )
                    });
                    HTTP.flush();
                    That.actions.setState( state );
                    That.actions.makeSameSate();
                } )
            }
        },
        //拖拽触发事件
        dragAction: function () {
            let state = this.actions.returnState();
            let lis = this.el.find( '#dragCustom' ).find( 'li' );
            let arr = [];
            let fieldArr = [];
            for( let li of lis ){
                for( let s of state ){
                    if( li.attributes.field.value == s.colId ){
                        arr.push( s );
                        fieldArr.push( s.colId );
                        break;
                    }
                }
            }
            for( let s of state ){
                if( fieldArr.indexOf( s.colId )==-1 ){
                    arr.unshift( s );
                }
            }
            let save = [];
            for( let a of arr ){
                if( this.data.dragFields.indexOf( a.colId )!=-1 ){
                    save.push( a.colId )
                }
            }
            console.log( "列排序数据保存" )
            console.log( save )
            //保存固定列数据
            dataTableService.savePreference({
                action: 'fieldsOrder',
                table_id: this.data.tableId,
                fieldsOrder: JSON.stringify( save )
            });
            HTTP.flush();
            this.actions.setState( arr );
            this.data.setFloatingFilterInput();
        },
        //固定列事件触发
        fixClick: function () {
            let That = this;
            let fix_ls = this.el.find( '.custom-fix-l' )
            for( let fix of fix_ls ){
                fix.addEventListener( 'click',function(){
                    That.actions.createFixData( fix.parentElement.attributes.field.value,'l' );
                } )
            }
            let fix_rs = this.el.find( '.custom-fix-r' )
            for( let fix of fix_rs ){
                fix.addEventListener( 'click',function(){
                    That.actions.createFixData( fix.parentElement.attributes.field.value,'r' );
                } )
            }
        },
        //创建固定列数据
        createFixData: function(f,type){
            let obj = this.data.fixCols;
            let a_1 = type == 'l'? obj.l:obj.r;
            let a_2 = type == 'l'? obj.r:obj.l;

            if( a_1.indexOf( f ) == -1 ){
                a_1.push( f );
            }else {
                a_1 = _.remove(a_1, function(n) {
                    return n != f;
                });
            }
            a_2 = _.remove(a_2, function(n) {
                return n != f;
            });
            this.data.fixCols = {
                l:type == 'l'?a_1:a_2,
                r:type == 'l'?a_2:a_1
            }
            this.actions.onFix();
            console.log( "固定列数据保存" )
            console.log( this.data.fixCols )
            //保存固定列数据
            dataTableService.savePreference({
                action: 'pinned',
                table_id: this.data.tableId,
                pinned: JSON.stringify( this.data.fixCols )
            });
            HTTP.flush();
        },
        //触发固定列
        onFix: function () {
            let left = this.data.fixCols.l;
            let right = this.data.fixCols.r;

            let state = this.actions.returnState();
            let obj = {};
            for( let s of state ){
                obj[s.colId] = s;
            }
            let allState = [];
            let arr = ['group','number','mySelectAll'];
            for( let a of arr ){
                if( obj[a] ){
                    obj[a].pinned = left.length == 0?null:'left';
                    allState.push( obj[a] );
                }
            }
            for( let l of left ){
                obj[l].pinned = 'left';
                allState.push( obj[l] );
            }
            for( let s of state ){
                let field = s.colId;
                if( arr.indexOf( field ) == -1 && left.indexOf(field)==-1 && right.indexOf( field ) == -1 ){
                    s['pinned'] = null;
                    allState.push( s )
                }
            }
            for( let r of right ){
                obj[r].pinned = 'right';
                allState.push( obj[r] );
            }
            this.actions.setState( allState );
            this.actions.makeSameSate();
        },
        //搜索事件
        inputSearch: function () {
            this.el.find( '#custom-search-input' ).on( 'input',_.debounce( ()=>{
                let val = this.el.find( '#custom-search-input' )[0].value;
                let lis = this.el.find( '#dragCustom' ).find( 'li' );
                for( let li of lis ){
                    li.style.display = li.attributes.name.value.indexOf( val ) == -1 && val!='' ? 'none':'block'
                }
            },1000 ) )
        },
        //全选事件
        selectAllClick: function () {
            this.el.find( '.custom-select-all' ).on( 'click',()=>{
                let state = this.actions.returnState();
                let i = 0;
                for( let s of state ){
                    if( !s.hide&&this.data.hideFields.indexOf( s.colId )!=-1 ){
                        i++;
                    }
                }
                let save = [];
                for( let s of state ){
                    if( this.data.hideFields.indexOf( s.colId )!=-1 ){
                        s.hide = i==this.data.hideFields.length?true:false;
                    }
                    if( this.data.dragFields.indexOf( s.colId )!=-1 && s.hide ){
                        save.push( s.colId );
                    }
                }
                console.log( "隐藏列数据保存" )
                console.log( save )
                //保存固定列数据
                dataTableService.savePreference({
                    action: 'ignoreFields',
                    table_id: this.data.tableId,
                    ignoreFields: JSON.stringify( save )
                });
                HTTP.flush();
                this.actions.setState( state );
                this.actions.makeSameSate();
            } )
        },
        //判断选择情况
        selectAllState: function () {
            let state = this.actions.returnState();
            let i = 0;
            for( let s of state ){
                if( !s.hide&&this.data.hideFields.indexOf( s.colId )!=-1 ){
                    i++;
                }
            }
            this.el.find( '.custom-select-all' )[0].className = i==this.data.hideFields.length?'custom-select-all icon-aggrid-cus checkbox-check':'custom-select-all icon-aggrid-cus checkbox-uncheck';
        },
        //列宽改变
        onColumnResized: _.debounce( (custom)=>{
            let state = custom.actions.returnState();
            let obj = {};
            for( let s of state ){
                if( custom.data.dragFields.indexOf( s.colId )!=-1 ){
                    obj[s.colId] = s.width;
                }
            }
            console.log( '列宽数据保存' );
            console.log( obj );
            dataTableService.savePreference({
                'action': 'colWidth',
                'table_id': custom.data.tableId,
                'colWidth': JSON.stringify(obj)
            });
            HTTP.flush();
            },2000 )
    },
    afterRender: function (){
        //初始化拖拽
        this.el.find( "#dragCustom" ).sortable({
            items: "li:not(.custom-disabled)",
            scroll: true
        });
        this.el.find( "#dragCustom" ).disableSelection();

        this.el.find('#dragCustom').bind('sortstop', (event)=> {
            this.actions.dragAction();
        });

        for( let f of this.data.fields ){
            if( f.candrag ){
                this.data.dragFields.push( f.field );
            }
            this.data.hideFields.push( f.field )
        }
        //初始化状态
        this.actions.onFix();

        //添加搜索事件
        this.actions.inputSearch();
        //添加全选事件
        this.actions.selectAllClick();
        //关闭
        this.el.find( '.closeCustom' ).on( 'click',()=>{
            this.data.close();
        } )
    }
}

class customColumns extends Component {
    // constructor(data) {
    //     for (let d in data) {
    //         config.data[d] = data[d]
    //     }
    //     super(config);
    // }
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default customColumns;