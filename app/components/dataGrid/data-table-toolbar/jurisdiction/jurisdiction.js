/**
 * Created by zhr
 */
import Component from "../../../../lib/component";
import template from './jurisdiction.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import {HTTP} from "../../../../lib/http";
import './jurisdiction.scss'

let config = {
    template: template,
    data: {
        type:'',
        content:'',
        dataInfo:'',
    },
    actions: {
        afterGetMsg:function() {

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
class jurisdiction extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config)
    }
}
export default jurisdiction