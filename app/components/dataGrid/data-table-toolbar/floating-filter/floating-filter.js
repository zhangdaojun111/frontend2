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
                    this.eGui.style.paddingTop = '5px';
                    this.eGui.innerHTML = '<input type="text"/>';
                    if( colInfo == 'none' ){
                        this.eGui.innerHTML = '<input disabled type="text"/>';
                    }
                    this.eFilterInput = this.eGui.querySelector('input');
                    this.eFilterInput.className = 'filter-input filter-input-' + searchFiled;
                    this.eGui.style.height = '25px';
                    this.eFilterInput.style.width = '80%';
                    this.eFilterInput.style.height = '15px';
                    this.eFilterInput.style.lineHeight = '20px';
                    this.eFilterInput.style.color = 'rgb(85,85,85)';
                    this.eFilterInput.style.border = '1px solid #E4E4E4';
                    this.eFilterInput.style.marginBottom = '5px';
                    this.eFilterInput.style.borderRadius = '2px';
                    this.eFilterInput.style.textIndent = '5px';
                    //人员信息特殊提示
                    if( colInfo == 'person' ){
                        this.eFilterInput.placeholder = '为保证查询正确，请输入完整信息。';
                    }
                    let searchType = 'keyup';
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
                    this.eFilterInput.addEventListener( 'input', _.debounce(  ($event)=> {
                        That.actions.keyupSearch($event,this.eFilterInput,searchFiled,colInfo,searchType,searchOldValue,searchValue)
                    },1000 ) )
                };

                FloatingFilter.prototype.getGui = function () {
                    return this.eGui;
                };
            return FloatingFilter;

        },
        //解决汉字搜索第一次传空' '的问题
        keyupSearch: function($event,oInput,col_field,colInfo,searchType,searchOldValue,searchValue) {
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
        floatingFilterPostData: function(col_field,keyWord,searchOperate){
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