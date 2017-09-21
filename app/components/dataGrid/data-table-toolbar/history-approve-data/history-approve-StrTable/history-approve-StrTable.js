/**
 * Created by zhr
 */
import Component from "../../../../../lib/component";
import template from './history-approve-StrTable.html';
import strikeItem from "./history-approve-StrItem/history-approve-StrItem"



let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {
        if(this.data.history_data){
            this.data.trigger_work_records[0].data.forEach((item)=>{
                this.append(new strikeItem(item), this.el.find('.history-table-body.strike'));
            })
        }
    }
}
class strikeTable extends Component {
    constructor(data) {
        config.data = data
        super(config)
    }
}
export default strikeTable