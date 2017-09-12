import AsideNavComponent from "../components/bisystem/aside/aside.nav";
import {router} from '../components/bisystem/bi.manage.router';

let asideNav =new AsideNavComponent();
asideNav.render($('#aside-container'));

Backbone.history.start();




