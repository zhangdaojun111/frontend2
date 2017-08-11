import Component from "../../../../../lib/component";
import template from './calendar.seting.item.child.html';
import './calendar.seting.item.child.scss';
import Mediator from '../../../../../lib/mediator';
import {PMAPI} from '../../../../../lib/postmsg';
let config = {
    template: template,
    data: {
        menuItem: {},
        menuItemID:{},
    },
    actions: {

    },
    afterRender: function() {
        let that = this;
        this.el.on('click',".item-child",function(){
            Mediator.emit('calendar-left:calendar-set',{data:that.data.menuItemID});
            // PMAPI.openDialogByIframe(
            //     '/calendar_mgr/set/?table_id='+that.data.menuItemID,
            //     {
            //         width: "100%",
            //         height: '900',
            //         title: '设置'
            //     })
        });

    }
};

class CalendarSetingItemChild extends Component {
    constructor(menuItem,menuItemID) {
        config.data.menuItem = menuItem;
        config.data.menuItemID = menuItemID;
        super(config);
    }
}

export default CalendarSetingItemChild;