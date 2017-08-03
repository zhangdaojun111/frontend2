/**
 * Created by zj on 2017/8/2.
 */
import Component from "../../../lib/component";
import template from './calendar.setting.html';
import './calendar.setting.scss';

import {MenuData} from '../testData/get_menu_data';

let config = {
    template: template,
    data: {
        testData: [1, 2, 3, 4, 5],
    },
    actions: {

    },
    afterRender: function() {
        console.log(MenuData);
        this.el.on('click', '.test', () => {
            this.data.testData.forEach(item => {
                $('.setting-content').append('<span class="data-test">test' + item +'</span>');
            });
            $('.data-test').bind("click",function(){
                console.log('ss');
                let a = $(this).html();
                console.log(a);
            });
        });

    }
};

class CalendarSetting extends Component {
    constructor() {
        super(config);
    }
}

export default CalendarSetting;