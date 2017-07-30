
import '../assets/scss/main.scss';

// import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {FullMenuInstance} from '../components/main/menu-full/menu.full';
import {IframeInstance} from '../components/main/iframes/iframes';


FullMenuInstance.render($('#aside .menu'));

IframeInstance.render($('#content'));
