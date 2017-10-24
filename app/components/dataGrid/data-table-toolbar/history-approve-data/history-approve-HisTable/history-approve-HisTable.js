/**
 * Created by zhaohaoran
 */
import Component from "../../../../../lib/component";
import template from './history-approve-HisTable.html'
import historyItem from "./history-approve-HisItem/history-approve-HisItem";



let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {
        let name = this.data.history_data.data[0]['update_user'];
        this.el.find('.editName').html(`&nbsp;&nbsp;&nbsp;修改人:${name}`);
        if(this.data.history_data && this.data.history_data.data.length > 0){
            this.data.history_data.data.forEach((item)=>{
                this.append(new historyItem(item), this.el.find('.history-table-body.history'));
            })
        }
        // this.el.find('.history-table-header').eq(0).css('display','block')
        // if(this.data.approve_tip){
        //     this.data.approve_tip.forEach((item)=>{
        //         this.append(new examineItem(item), this.el.find('.history-table-body.examine'));
        //     })
        // }
    }
}
class historyTable extends Component {
    // constructor(data) {
    //     config.data = data
    //     super(config)
    // }
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}
export default historyTable
