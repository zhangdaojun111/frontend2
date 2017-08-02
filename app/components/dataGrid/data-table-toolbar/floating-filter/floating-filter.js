import Component from "../../../../lib/component";
import template from './floating-filter.html';
import agGrid from "../../agGrid/agGrid";

let config = {
    template: template,
    data: {
    },
    actions: {
        createFilter: function(colInfo,searchFiled,searchValue,searchOldValue) {
                let FloatingFilter = function() {
                }
                let That = this
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
                    if( colInfo == 'none' ){
                        this.eGui.innerHTML = '<input disabled type="text"/>'
                    }
                    if( colInfo == 'date' ){
                        this.eFilterInput.type = 'date';
                        searchType = 'change';
                    }else if( colInfo  == 'time' ){
                        this.eFilterInput.type = 'time';
                        searchType = 'change';
                    }else if( colInfo  == 'datetime' ){
                        this.eFilterInput.type = 'datetime-local';
                        searchType = 'change';
                    }else {
                        this.eFilterInput.type = 'text';
                    }
                    this.eFilterInput.addEventListener(searchType,($event)=> {
                        if($event['keycode'] != 229){
                            That.actions.keyupSearch($event,this.eFilterInput,searchFiled,colInfo,searchType,searchOldValue,searchValue);
                        }
                    })
                    if( searchType == 'keyup' ){
                        this.eFilterInput.addEventListener( 'keydown', ($event)=> {
                            if( $event.keyCode == 229 ){
                                That.actions.keyupSearch($event,this.eFilterInput,searchFiled,colInfo,searchType,searchOldValue,searchValue);
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
            let keyWord = colInfo == 'number' ? Number(oInput.value) : oInput.value;
            let searchOperate = colInfo == 'number' ? 'EQUALS' : 'CONTAINS';
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

            this.actions.floatingFilterPostData(col_field,keyWord,searchOperate);
        },
        floatingFilterPostData:function(col_field,keyWord,searchOperate){
        }
    },
    afterRender: function() {
    }
}
class FloatingFilter extends Component {
    constructor() {
        super(config)
    }
}
export default FloatingFilter