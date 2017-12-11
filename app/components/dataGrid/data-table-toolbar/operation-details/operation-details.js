/**
 * Created by zhr
 */
import Component from "../../../../lib/component";
import template from './operation-details.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import workflowForGrid from '../../../../entrys/workflowForGrid';
import {dgcService} from '../../../../services/dataGrid/data-table-control.service';
import {HTTP} from "../../../../lib/http";
import './operation-details.scss'

let operationDetails = Component.extend({
    template: template,
    data: {
        tableId:'',
        type:'',
        content:'',
        dataInfo:[],
    },
    bind:[{
        // event:'click',
        // selector:'.operation-from-details',
        // callback: _.debounce(function(){
        //     debugger
        // }, 0)
    }],
    actions: {
        //打开穿透数据弹窗
        openSourceDataGrid: function ( url,title ) {
            PMAPI.openDialogByIframe( url,{
                width: 1300,
                height: 800,
                title: title,
                modal:true
            } ).then( (data)=>{
            } )
        },
        //加载工作流组件
        openWorkFlow: function(index){
            let data = this.data.dataInfo[index];
            let obj = {
                form_id: data["form_id"],
                record_id: data["id"],
                flow_id: data["flow_id"],
                table_id: this.data.tableId
            }
            let winTitle = '查看工作流';
            obj['btnType'] = 'view';
            let url = dgcService.returnIframeUrl( '/wf/approval/',obj );
            this.actions.openSourceDataGrid( url,winTitle );
        },
        afterGetMsg:function() {
            let _this = this;
            if(this.data.type == 'cache_detail') {
                this.el.find('.cache-detail-content').css('display','block')
                this.el.find('.cache-detail-text').html(this.data.content);
            } else if (this.data.type == 'operation') {
                if(this.data.dataInfo.length == 1){
                    workflowForGrid.init({
                        record_id:this.data.dataInfo[0].record_id,
                        table_id:this.data.tableId,
                        form_id:this.data.dataInfo[0].form_id,
                        flow_id:this.data.dataInfo[0].flow_id,
                        el:'#approval-workflow'
                    });
                } else if(this.data.dataInfo.length >1 ){
                    this.data.dataInfo.forEach((item)=>{
                        this.el.find('#approval-workflow').append(`<div class="operation-from-item"><span class="operation-from-name">${item.record_name}</span><span class="operation-from-details">详情</span></div>`)
                    })
                }
                // workflowForGrid.init({
                //     record_id:'599bdb325700e9eeb23029fb',
                //     table_id:'5318_EHFuJD7Ae76c6GMPtzdiWH',
                //     form_id:181,
                //     flow_id:43,
                //     el:'#approval-workflow'
                // });
                this.el.find('.operation-content').css('display','block')
                this.el.find('.operation-text').html(this.data.content);
            }
            this.el.find('.operation-from-details').click(function(){
                _this.actions.openWorkFlow($(this).parent('.operation-from-item').index());
            })
        }
    },
    afterRender: function() {
        PMAPI.getIframeParams(window.config.key).then((res) => {
            for (let item in res.data.obj) {
                this.data[item] = res.data.obj[item]
            }
            this.actions.afterGetMsg()
        })
    }
});
// class operationDetails extends Component {
//     constructor(data,newConfig){
//         super($.extend(true,{},config,newConfig,{data:data||{}}));
//     }
// }
export default operationDetails