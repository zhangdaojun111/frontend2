/**
 * Created by zhaohaoran
 */
import Component from "../../../../../lib/component";
import template from './history-approve-table.html'
import historyItem from "../history-approve-HisTable/history-approve-HisItem/history-approve-HisItem";
import examineItem from "./history-approve-ExaItem/history-approve-ExaItem";



let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {
        console.log(this.data)
        debugger
        if(this.data.history_data){
            this.data.history_data[0].data.forEach((item)=>{
                this.append(new historyItem(item), this.el.find('.history-table-body.history'));
            })
        }
        this.el.find('.history-table-header').eq(0).css('display','block')
        if(this.data.approve_tip){
            this.data.approve_tip.forEach((item)=>{
                this.append(new examineItem(item), this.el.find('.history-table-body.examine'));
            })
        }
    }
}
class examineTable extends Component {
    constructor(data) {
        config.data = data
        super(config)
    }
}
export default examineTable
