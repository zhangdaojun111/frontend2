/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../../../lib/component";
import template from './calendar.setting.item.html';
import './calendar.setting.item.scss';


let config = {
    template: template,
    data: {
        menuItem: {}
    },
    actions: {

    },
    afterRender: function() {
        this.el.find('.menu-label').html(this.data.menuItem['label']);
        this.data.menuItem['items'].forEach(item => {
            this.el.find('.menu-item').append('<span class="item-child" id ='+ item['table_id'] +' >'+ item['label'] + '</span>');
        });

        //console.log(this.el.append(this.data.menuItem['label']));
    }
};

class CalendarSettingItem extends Component {
    constructor(data) {
        config.data.menuItem = data;
        super(config);
    }
}

export default CalendarSettingItem;