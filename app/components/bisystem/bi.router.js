/**
 * Created by birdyy on 2017/8/1.
 */
import {Router} from 'backbone';
import {CanvasMain} from './canvas/main/main';

const BiAppRouter = Backbone.Router.extend({
    routes: {
        'views/:id':'routerViewsComponent',
        '':'routerViewsComponent',
    },
    routerViewsComponent(id) {
        CanvasMain.actions.switchViewId(id);
    }
});

export let router = new BiAppRouter();