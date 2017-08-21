/**
 * Created by zhaohaoran
 */
import Component from "../../../../../lib/component";
import template from './history-approve-table.html'
import historyItem from "./history-approve-HisItem/history-approve-HisItem"


let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {
        if(this.data.history_data){
            this.data.history_data[0].data.forEach((item)=>{
                this.append(new historyItem(item), this.el.find('.history-table-body'));
            })
        }
        this.el.find('.history-table-header').eq(0).css('display','block')
        if(this.data.approve_tip){

        }
    }
}
class historyTable extends Component {
    constructor(data) {
        config.data = data
        super(config)
    }
}
export default historyTable