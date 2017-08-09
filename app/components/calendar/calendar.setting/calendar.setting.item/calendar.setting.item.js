/**
 * Created by zj on 2017/8/3.
 */
import Component from "../../../../lib/component";
import template from './calendar.setting.item.html';
import './calendar.setting.item.scss';

import CalendarSet from '../../../calendar.set/calendar.set';
import {PMAPI} from '../../../../lib/postmsg';


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
            let menuItem = document.createElement('span');
            menuItem.className = 'item-child';
            menuItem.innerHTML = item['label'];
            this.el.find('.menu-item').append(menuItem);
            menuItem.onclick = function () {
                console.log(item);
                // let component = new CalendarSet();
                // let el = $('<div>').appendTo(document.body);
                // component.render(el);
                // el.dialog({
                //     title: '日历设置',
                //     width: '99%',
                //     height: '950',
                //     background: '#ddd',
                //     close: function() {
                //         $(this).dialog('destroy');
                //         component.destroySelf();
                //     }
                // });
                PMAPI.openDialogByIframe(
                    'http://127.0.0.1:8088/calendar_mgr/set/?table_id='+item['table_id'],
                    {
                        width: "100%",
                        height: '900',
                        title: '设置'
                    })
            }
        });
    }
};

class CalendarSettingItem extends Component {
    constructor(data) {
        config.data.menuItem = data;
        super(config);
    }
}

export default CalendarSettingItem;