/**
 * Created by zhr
 */
import Component from "../../../../lib/component";
import template from './operationDetails.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import {HTTP} from "../../../../lib/http";
import './operationDetails.scss'

let config = {
    template: template,
    data: {
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
                console.log(this.data.dataInfo)
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