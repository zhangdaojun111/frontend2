/**
 * Created by zhr
 */
import Component from "../../../../../lib/component";
import template from './history-approve-StrTable.html';
import strikeItem from "./history-approve-StrItem/history-approve-StrItem"



let config = {
    template: template,
    data: {
        trigger_work_records:[]
    },
    actions: {

    },
    afterRender: function() {
        if(this.data.trigger_work_records){
            this.data.trigger_work_records.forEach((item)=>{
                this.append(new strikeItem(item), this.el.find('.history-table-body.strike'));
            })
        }
    }
}
class strikeTable extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config)
    }
}
export default strikeTable