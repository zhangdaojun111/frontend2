import Component from "../../../../../lib/component";
import template from './calendar.seting.item.child.html';
import './calendar.seting.item.child.scss';
import Mediator from '../../../../../lib/mediator';
import {PMAPI} from '../../../../../lib/postmsg';
let config = {
    template: template,
    data: {
        menuItem: {}
    },
    actions: {

    },
    afterRender: function() {
        let that = this;
        this.el.on('click',".item-child",function(){
            console.log(that.data.menuItem);
            Mediator.emit('calendar-set-left:calendar-set',{table_id:that.data.menuItem['table_id']});
            // PMAPI.openDialogByIframe(
            //     '/calendar_mgr/set/?table_id='+that.data.menuItem['table_id'],
            //     {
            //         width: "100%",
            //         height: '900',
            //         title: '设置'
            //     })
        });

    }
};

class CalendarSetingItemChild extends Component {
    constructor(data) {
        config.data.menuItem = data;
        super(config);
    }
}

export default CalendarSetingItemChild;