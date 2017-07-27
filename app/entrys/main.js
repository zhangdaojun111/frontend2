
import '../assets/scss/main.scss';

// import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import {FullMenu} from '../components/menu-full/menu.full';

console.log(FullMenu);


new FullMenu().render($('#aside .menu'));