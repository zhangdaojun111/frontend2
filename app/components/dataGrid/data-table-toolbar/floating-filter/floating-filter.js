import Component from "../../../../lib/component";
import template from './floating-filter.html';
import agGrid from "../../agGrid/agGrid";
import fieldTypeService from "../../../../lib/service/field-type-service";
// import dataTableService from "../../service/data-table.service";
// import {Grid,GridOptions} from 'ag-grid/main';


let config = {
    template: template,
    data: {},
    searchValue: [],
    actions: {
        agInit: function(params) {
            let colInfo = params.colInfo;
            let searchOldValue = params.searchOldValue;
            let searchValue = params.searchValue;
            this.actions.createFilter(colInfo,searchOldValue,searchValue);
        },
        createFilter: function(colInfo,searchFiled,searchValue,searchOldValue) {
            let FloatingFilter = function() {
            }
            FloatingFilter.prototype.init = function (params) {
                // this.onFloatingFilterChanged = params.onFloatingFilterChanged;
                this.eGui = document.createElement('div');
                this.eGui.innerHTML = '<input type="text"/>'
                this.eFilterInput = this.eGui.querySelector('input');
                this.eFilterInput.className = 'filter-input';
                this.eGui.style.height = '25px';
                this.eFilterInput.style.width = '80%';
                this.eFilterInput.style.height = '18px';
                this.eFilterInput.style.lineHeight = '20px';
                this.eFilterInput.style.color = 'rgb(85,85,85)';
                this.eFilterInput.style.border = '1px solid #55A1F3';
                this.eFilterInput.style.marginBottom = '5px';
                let searchType = 'keyup';
                if( colInfo == 3 ){
                    this.eFilterInput.type = 'date';
                    searchType = 'change';
                }else if( colInfo  == 4 ){
                    this.eFilterInput.type = 'time';
                    searchType = 'change';
                }else {
                    this.eFilterInput.type = 'text';
                }
                this.eFilterInput.addEventListener(searchType,($event)=> {
                    if($event['keycode'] != 229){
                        // this.actions.keyupSearch($event,this.eFilterInput,col_field,colInfo,searchType,searchOldValue,searchValue);
                    }
                })
                if( searchType == 'keyup' ){
                    this.eFilterInput.addEventListener( 'keydown', ($event)=> {
                        if( $event.keyCode == 229 ){
                            // this.keyupSearch($event,this.eFilterInput,col_field,colInfo,searchType,searchOldValue,searchValue);
                        }
                    });
                }
            };

            FloatingFilter.prototype.getGui = function () {
                return this.eGui;
            };
            return FloatingFilter;

        },
        //解决汉字搜索第一次传空' '的问题
        keyupSearch: function($event,oInput,col_field,colInfo,searchType,searchOldValue,searchValue) {
            let keyArr = [32,37,38,39,40]
            if($event['keycode'] && keyArr.indexOf($event['keycode'])==-1){
                if(oInput.value[oInput.value.length-1] == ' ' || oInput.value == "" && !searchOldValue[col_field]) {
                    return;
                }
                for(let i=0; i<oInput.value.length; i++){
                    if( oInput.value[i]==' ' && (( searchOldValue[col_field] && searchOldValue[col_field][i] && searchOldValue[col_field][i] != ' ' )) ){
                        return;
                    }
                }
            }
            let keyWord = fieldTypeService.numOrText( colInfo.real_type ) ? Number(oInput.value) : oInput.value;
            let searchOperate = fieldTypeService.numOrText( colInfo.real_type ) ? 'EQUALS' : 'CONTAINS';
            if( oInput.value == "" ){
                keyWord = oInput.value;
            }
            if( searchOldValue[col_field] && searchOldValue[col_field] == keyWord ){
                return;
            }else {
                searchOldValue[col_field] = keyWord;
            }

            //日期时间情况下
            if( searchType == 'change' ){
                if( keyWord.indexOf( 'T' ) != -1 ){
                    keyWord = keyWord.replace( 'T',' ' );
                }
            }
            searchValue[col_field] = oInput.value;
            this.dTService.dataSearch.next({
                col_field:col_field,
                keyWord:keyWord,
                searchOperate:searchOperate
            })
        }
    },
    afterRender: function() {
        // this.actions.agInit();
    }
}
class FloatingFilter extends Component {
    constructor() {
        super(config)
    }
}
export default FloatingFilter