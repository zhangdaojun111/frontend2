
import '../assets/scss/main.scss';

// import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {FullMenuInstance} from '../components/main/menu-full/menu.full';
import {IframeInstance} from '../components/main/iframes/iframes';
import {HeaderInstance} from '../components/main/header/header';

FullMenuInstance.render($('#aside .menu'));
IframeInstance.render($('#content'));
HeaderInstance.render($('#header'));

$('#search-menu-button').on('input', _.debounce(function() {
    FullMenuInstance.actions.search(this.value);
}, 1000))
