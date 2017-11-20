/**
 * Created by birdyy on 2017/8/1.
 */
import {Router} from 'backbone';
import {CanvasMain} from '../bisystem/canvas/main/main';

let canvasComponent;
const BiAppRouter = Backbone.Router.extend({
    routes: {
        'canvas/:id':'routerViewsComponent',
        '':'routerViewsComponent',
    },
    routerViewsComponent(id) {
        if (canvasComponent) {
            canvasComponent.actions.destroyCanvasCells();
        } else {
            canvasComponent = new CanvasMain();
            canvasComponent.render($('#route-outlet'));
        }
        canvasComponent.actions.switchViewId(id);
    }
});

export let router = new BiAppRouter();