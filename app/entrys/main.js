
import '../assets/scss/main.scss';

// import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {MenuComponent} from '../components/main/menu-full/menu.full';
import {IframeInstance} from '../components/main/iframes/iframes';
import {HeaderInstance} from '../components/main/header/header';

function presetMenuData(menu) {
    let res = _.defaultsDeep([], menu);
    res.forEach((item) => {
        item.mid = item.folder_id;
        if (item.items) {
            presetMenuData(item.items);
        }
    });
    return res;
}

if (window.config && window.config.menu) {
    let allMenu = new MenuComponent({list: presetMenuData(window.config.menu)});
    let commonMenu = new MenuComponent({list: presetMenuData(window.config.menu)});
    allMenu.render($('#aside .menu.all'));
    commonMenu.render($('#aside .menu.common')).actions.hide();
    let allBtn = $('#aside .tabs p.all');
    let commonBtn = $('#aside .tabs p.common');
    $('#aside .tabs p').on('click', function () {
        let me = $(this);
        if (me.hasClass('all')) {
            allMenu.actions.show();
            commonMenu.actions.hide();
            allBtn.addClass('active');
            commonBtn.removeClass('active');
        } else {
            allMenu.actions.hide();
            commonMenu.actions.show();
            allBtn.removeClass('active');
            commonBtn.addClass('active');
        }
    })
}

IframeInstance.render($('#content'));
HeaderInstance.render($('#header'));

