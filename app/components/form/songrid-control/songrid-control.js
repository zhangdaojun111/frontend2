import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import DataTableAgGrid from '../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';

let config={
    template:`   <div class="clearfix">
                    {{#if unvisible}}
                        <p class="info">权限受限</p>
                    {{else if be_control_condition}}
                        <p class="info">被修改条件限制</p>
                    {{else}}
                        {{#if popupType}}
                             <a href="javascript:void(0);" class="ui-forms-a">查看详情</a>
                             {{#if required}}
                                    <span id="requiredLogo" class="required" ></span>
                             {{/if}}
                             <input type="hidden">
                        {{else}}
                            <div class="ui-songrid-box">
                                 <div style="width: 100%; height: 100%;text-align: left;" class="songGrid">
                                    
                                 </div>
                            </div>    
                        {{/if}}    
                     {{/if}}       
               </div>`,
    data:{
        isShow:true,
    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        _this.el.on('click','.ui-forms-a',_.debounce(function(){
            Mediator.publish('form:openSongGrid:'+_this.data.tableId,_this.data);
        },300));
        console.log(this.data.isView=='0'?'normal':'ViewChild');
        let config={
            tableId:this.data.value,
            parentTableId:this.data.parent_table_id,
            parentTempId:this.data.parent_temp_id,
            rowId:this.data.parent_temp_id,
            tableType:'child',
            viewMode:this.data.isView=='0'?'normal':'ViewChild',
        }
        let dataGrid=new DataTableAgGrid(config);
        this.append(dataGrid,this.el.find('.songGrid'));
    },
    beforeDestory:function(){
    }
}
export default class Songrid extends Component{
    constructor(data){
        super(config,data);
    }
}