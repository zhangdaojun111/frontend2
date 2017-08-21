import Component from "../../../../lib/component";
import template from './history-approve-data.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import {HTTP} from "../../../../lib/http";
import historyTable from "./history-approve-table/history-approve-table";
import './history-approve-data.scss'
import agGrid from "../../agGrid/agGrid";

let config = {
    template: template,
    dataShow:[],
    recordHistory:[],
    trigger_work_records:[],
    data: {
        table_id:'',
        real_id:'',
        key:'',
        res:{}
    },
    actions: {
        renderTable:function(){
            this.dataShow.forEach((row) => {
                this.append(new historyTable(row), this.el.find('.history-table-box.amend'));
            });
        },
        afterGetMsg:function() {
            let _this = this;
            let obj = {
                table_id: this.data.table_id,
                real_id: this.data.real_id,
            }
            dataTableService.getHistoryApproveData(obj).then( res=>{
                debugger
                if( res.record_history && res.record_history.length > 0 ){

                }
                _this.trigger_work_records = res.trigger_work_records || [];
                if( res.history_data && res.history_data.length > 0 ){
                    _this.dataShow = [];
                    _this.dataShow.push({
                        'record_name': '',
                        'history_data': res.history_data
                    })
                }
                // _this.actions.renderTable()
            })
            HTTP.flush();
            this.el.on('click','.history-tab-item',function() {
                let i = _this.el.find('.history-tab-item').index(this);
                _this.el.find('.history-tab-item').removeClass('active');
                _this.el.find('.history-tab-item').eq(i).addClass('active');
                _this.el.find('.history-content').removeClass('active');
                _this.el.find('.history-content').eq(i).addClass('active');
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