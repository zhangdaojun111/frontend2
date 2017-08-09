/**
 * Created by birdyy on 2017/8/1.
 */
import {Router} from 'backbone';
import {CanvasCellsComponent} from './canvas/canvas.cells';
import {ViewsEditComponent} from "./views/views.edit";

const BiAppRouter = Backbone.Router.extend({
    routes: {
        'views/edit':"routerViewsEditComponent",
        'views/:id':'routerViewsComponent',
        '':'routerViewsComponent',
    },
    routerViewsComponent(id) {
        let CanvasCells = new CanvasCellsComponent(id);
        CanvasCells.render($('#route-outlet'));
    },
    routerViewsEditComponent() {
        let ViewsEdit = new ViewsEditComponent();
        ViewsEdit.render($('#route-outlet'));
    }
});

export let router = new BiAppRouter();