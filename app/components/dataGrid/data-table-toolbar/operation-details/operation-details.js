/**
 * Created by zhr
 */
import Component from "../../../../lib/component";
import template from './operation-details.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import workflowForGrid from '../../../../entrys/workflowForGrid';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import {HTTP} from "../../../../lib/http";
import './operation-details.scss'

let config = {
    template: template,
    data: {
        tableId:'',
        type:'',
        content:'',
        dataInfo:'',
    },
    actions: {
        afterGetMsg:function() {
            if(this.data.type == 'cache_detail') {
                this.el.find('.cache-detail-content').css('display','block')
                this.el.find('.cache-detail-text').html(this.data.content);
            } else if (this.data.type == 'operation') {
                // if(this.data.dataInfo.length == 1){
                //     workflowForGrid.init({
                //         record_id:this.data.dataInfo[0].record_id,
                //         table_id:this.data.tableId,
                //         form_id:this.data.dataInfo[0].form_id,
                //         flow_id:this.data.dataInfo[0].flow_id
                //     });
                // }
                workflowForGrid.init({
                    record_id:'599bdb325700e9eeb23029fb',
                    table_id:'5318_EHFuJD7Ae76c6GMPtzdiWH',
                    form_id:181,
                    flow_id:43
                });
                this.el.find('.operation-content').css('display','block')
                this.el.find('.operation-text').html(this.data.content);
            }

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
}
class operationDetails extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config)
    }
}
export default operationDetails