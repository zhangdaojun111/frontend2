import AsideNavComponent from "../components/bisystem/aside/aside.nav";
import {router} from '../components/bisystem/bi.manage.router';
Backbone.history.start();

let asideNav =new AsideNavComponent();
asideNav.render($('#aside-container'));


