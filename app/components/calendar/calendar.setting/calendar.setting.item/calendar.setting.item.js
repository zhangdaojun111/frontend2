/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../../../lib/component";
import template from './calendar.setting.item.html';
import './calendar.setting.item.scss';
import CalendarSetingItemChild from "./calendar.seting.item.child/calendar.seting.item.child";

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
    binds: [
        // {
        //     event: 'click',
        //     selector: '.menu-item-title',
        //     callback: function (temp = this) {
        //         console.log(11);
        //         // if($(temp).is(".has-hide")){
        //         //     $(temp).removeClass('has-hide');
        //         // }else{
        //         //     $(temp).addClass('has-hide');
        //         // }
        //     }
        // }
    ],
    afterRender: function () {
        let _this = this;
        if (this.data.menuItem['items']) {
            this.data.menuItem['items'].forEach(item => {
                if (item['items']) {
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