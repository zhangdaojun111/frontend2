/**
 * Created by birdyy on 2017/8/1.
 */
import {Router} from 'backbone';
import {CanvasCellsComponent} from './canvas/canvas.cells';

const BiAppRouter = Backbone.Router.extend({
    routes: {
        'views/:id':'routerViewsComponent',
        '':'routerViewsComponent',
    },
    routerViewsComponent(id) {
        let CanvasCells = new CanvasCellsComponent(id);
        CanvasCells.render($('#route-outlet'));
    }
});

export let router = new BiAppRouter();