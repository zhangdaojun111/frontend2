import Component from "../../../lib/component";
import {HTTP} from "../../../lib/http";
import {PMAPI,PMENUM} from "../../../lib/postmsg";
import Mediator from "../../../lib/mediator";
import {FormService} from '../../../services/formService/formService';
import './buildChoose.scss';
import FormEntry from '../../../entrys/form';
import SearchBar from "./searchBar";

let config={
    template:`<hearder class="search-bar"></hearder>
              <nav class="ui-nav">
                <ul></ul>            
              </nav>
              {{#if authority}}
                <p style="font-size:20px">您没有查看权限</p>
              {{else}} 
              <section class="ui-section">
               
              </section>
              {{/if}} 
            `,
    data:{

    },
    actions:{
        //默认表单
        formDefaultVersion : function (data){
            let html=`<table class="form table table-striped table-bordered table-hover ">
            <tbody>
                `;
            for(let obj of data){
                if(data.type==='hidden'){
                    html+=`<div data-dfield="${obj.dfield}" data-type="${obj.type}"></div>`;
                }else{
                    html+=`<tr>
                        <td style="width: 150px;white-space: nowrap;">${ obj.label }</td>
                        <td><div data-dfield="${obj.dfield}" data-type="${obj.type}"></div></td>
                </tr>`;
                }
            }
            html+=`</tbody>
        </table>`
            return html;
        },
    },
    firstAfterRender(){
        let _this=this;
        FormService.getStaticData({field_id:this.data.fieldId}).then(res=>{
            _this.data=Object.assign({},_this.data,res['data'][0]);
            FormEntry.createForm({
                table_id:_this.data.source_table_id,
                    form_id:'',
                    is_view:1,
                    parent_table_id:'',
                    parent_real_id:'',
                    parent_temp_id:'',
                    real_id:_this.data['options'][1]['value'],
                    el:_this.el.find('.ui-section'),
            });
            for(let i = 0,len=_this.data['options'].length;i<len;i++){
                if(_this.data['options'][i]['value'] !=''){
                    _this.el.find('ul').append(`<li><a href="javascript:void(0);" title="${_this.data['options'][i]['label']}" data-value="${_this.data['options'][i]['value']}">${_this.data['options'][i]['label']}</a></li>`)
                }
            }
            let searchBar=new SearchBar({tableId:_this.data.source_table_id});
            _this.append(searchBar,_this.el.find('.search-bar'));
            _this.data.selected={value:_this.data['options'][1]['value'],label:_this.data['options'][1]['label']};
        });
        HTTP.flush();
        _this.el.on('click','a',function(){
            _this.data.selected={value:$(this).data('value'),label:$(this).html()};
            FormEntry.createForm({
                table_id:_this.data.source_table_id,
                form_id:'',
                is_view:1,
                parent_table_id:'',
                parent_real_id:'',
                parent_temp_id:'',
                real_id:$(this).data('value'),
                el:_this.el.find('.ui-section'),
            });
        })
        Mediator.subscribe('form:chooseSelect',function(data){
            _this.el.find('a').each((index,obj)=>{
                if(data.indexOf($(obj).data('value')) != -1){
                    $(obj).show();
                }else{
                    $(obj).hide();
                }
            })
        });
        Mediator.subscribe('form:chooseConfirm',function(data){
            if(data='isConfirm'){
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key:_this.data.key,
                    data:_this.data.selected
                })
            }
        });
    }
}

export default class BuildChoose extends Component{
    constructor(data){
        super(config,data);
        console.log(this.data);
    }
}