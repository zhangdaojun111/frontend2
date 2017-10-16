/**
 * Created by zhr
 */
import Component from "../../../../lib/component";
import template from './history-approve-data.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import {HTTP} from "../../../../lib/http";
import historyTable from "./history-approve-HisTable/history-approve-HisTable";
import examineTable from "./history-approve-ExaTable/history-approve-ExaTable";
import strikeTable from "./history-approve-StrTable/history-approve-StrTable";
import './history-approve-data.scss'
import agGrid from "../../agGrid/agGrid";

let config = {
    template: template,
    dataShow:[],
    recordHistory:[],
    historyData:[],
    triggerWorkRecords:[],
    data: {
        table_id:'',
        real_id:'',
        key:'',
        res:{}
    },
    actions: {
        // 渲染修改历史
        renderHisTable:function(){
            this.historyData[0]['history_data'].forEach((row) => {
                this.append(new historyTable({history_data:row}), this.el.find('.history-table-box.history'));
            });
        },
        // 渲染审批历史
        renderExaTable:function(){
            this.recordHistory.forEach((row) => {
                this.append(new examineTable(row), this.el.find('.history-table-box.examine'));
            });
        },
        // 渲染触发历史
        renderStrTable:function(){
            this.append(new strikeTable({trigger_work_records: this.triggerWorkRecords}), this.el.find('.history-table-box.strike'));
            // this.triggerWorkRecords.forEach((row) => {
            //     this.append(new strikeTable(row), this.el.find('.history-table-box.strike'));
            // });
        },
        afterGetMsg:function() {
            this.recordHistory = [];
            this.historyData = [];
            this.triggerWorkRecords = [];
            let _this = this;
            let obj = {
                table_id: this.data.table_id,
                real_id: this.data.real_id,
            }
            dataTableService.getHistoryApproveData(obj).then( res=>{
                if( res.record_history && res.record_history.length > 0 ){
                    res.record_history.forEach((item)=> {
                        _this.recordHistory.push({'approve_tip':item['approve_tip']});
                        _this.historyData.push({'history_data':item['history_data']});
                    })
                } else {
                    if(res.history_data && res.history_data.length > 0){
                        this.historyData.push({
                            'record_name': '',
                            'history_data': res.history_data
                        });
                    }
                }
                _this.triggerWorkRecords = res.trigger_work_records || [];
                if(_this.historyData && _this.historyData.length > 0) {
                    _this.actions.renderHisTable();
                }
                if(_this.recordHistory && _this.recordHistory.length > 0){
                    _this.actions.renderExaTable();
                }
                if(_this.triggerWorkRecords && _this.triggerWorkRecords.length > 0){
                    _this.actions.renderStrTable();
                }

            })
            HTTP.flush();
            this.el.on('click','.history-tab-item',function() {
                let i = _this.el.find('.history-tab-item').index(this);
                _this.el.find('.history-tab-item').removeClass('active');
                _this.el.find('.history-tab-item').eq(i).addClass('active');
                _this.el.find('.history-content').removeClass('active');
                _this.el.find('.history-content').eq(i).addClass('active');
            })
            this.el.on('click','.history-table-title',function() {
                if($(this).attr('title') == 'false') {
                    $(this).next('.history-table').css('display','block')
                    $(this).find('.img').addClass('active')
                    $(this).attr('title','true')
                } else {
                    $(this).next('.history-table').css('display','none')
                    $(this).find('.img').removeClass('active')
                    $(this).attr('title','false')
                }
            })
        }
    },
    afterRender: function() {
        // PMAPI.subscribe(PMENUM.open_iframe_params, (res)=>{
        //     for (let item in res.data.obj) {
        //         this.data[item] = res.data.obj[item]
        //     }
        //     this.actions.afterGetMsg()
        // })
        PMAPI.getIframeParams(window.config.key).then((res) => {
            for (let item in res.data.obj) {
                this.data[item] = res.data.obj[item]
            }
            this.actions.afterGetMsg()
        })
    }
}
class historyApprove extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]

        }
        super(config)
    }
}
export default historyApprove