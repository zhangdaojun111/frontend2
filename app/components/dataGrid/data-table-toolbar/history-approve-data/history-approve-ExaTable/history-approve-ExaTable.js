/**
 * Created by zhaohaoran
 */
import Component from "../../../../../lib/component";
import template from './history-approve-ExaTable.html'
import examineItem from "./history-approve-ExaItem/history-approve-ExaItem";



let examineTable = Component.extend({
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {
        if(this.data.approve_tip && this.data.approve_tip.length > 0){
            this.data.approve_tip.forEach((item)=>{
                this.append(new examineItem({data:item}), this.el.find('.history-table-body.examine'));
            })
        }
    }
})
// class examineTable extends Component {
//     constructor(data,newConfig){
//         super($.extend(true,{},config,newConfig,{data:data||{}}));
//     }
// }
export default examineTable
