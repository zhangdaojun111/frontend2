/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../../../lib/component";
import template from './calendar.setting.item.html';
import './calendar.setting.item.scss';
import CalendarSetingItemChild from "./calendar.seting.item.child/calendar.seting.item.child";
import CalendarSet from '../../../calendar.set/calendar.set';
import {PMAPI} from '../../../../lib/postmsg';


let config = {
    template: template,
    data: {
        menuItem: {}
    },
    actions: {
        addTest: function () {
            $('.component-setting-menu').css({'padding-left': '20px'});
        }
    },
    afterRender: function () {
        let _this = this;
        if(this.data.menuItem['items']) {
            this.data.menuItem['items'].forEach(item => {
                if(item['items']) {
                    let component = new CalendarSettingItem();
                    component.actions.addTest();
                    component.data.menuItem = item;
                    this.append(component, this.el.find('.menu-item'));
                } else {
                    _this.append(new CalendarSetingItemChild(item), this.el.find('.menu-item'));
                }
            });
        }
    }
};

class CalendarSettingItem extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSettingItem;