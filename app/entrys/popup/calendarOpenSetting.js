/**
 * Created by zj on 2017/8/18.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import CalendarSetting from '../../components/calendar/calendar.setting/calendar.setting';
import {SettingMenuComponent} from '../../components/calendar/calendar.setting.menu/setting.menu';
import '../../assets/scss/core/common.scss';

import {CalendarSetService} from '../../services/calendar/calendar.set.service';
CalendarSetService.getMenu().then(res => {
    let menu = res['menuList'].filter(item => {
        return item['folder_id'] !== 1;
    });
    //let calendarOpenSetting = new SettingMenuComponent({list: menu});
    let calendarOpenSetting = new CalendarSetting({data: {menu: menu}});
    calendarOpenSetting.render($('#calendarOpenSetting'));
});



