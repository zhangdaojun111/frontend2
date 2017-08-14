/**
 * Created by birdyy on 2017/8/1.
 */
import {Router} from 'backbone';
import {CanvasCellsComponent} from './canvas/canvas.cells';
import {ViewsEditComponent} from "./views/views";
import {FormBaseComponent} from './forms/base/base';

let component;
const BiAppRouter = Backbone.Router.extend({
    routes: {
        'views/edit':"routerViewsEditComponent",
        'views/:id':'routerViewsComponent',
        'forms/home':'routerFormsBaseComponent',
        '':'routerViewsComponent',
    },
    routerViewsComponent(id) {
        if (component) {
            component.destroyChildren();
            component.viewId = id;
            component.reload();
        } else {
            let CanvasCells = new CanvasCellsComponent(id);
            component = CanvasCells;
            CanvasCells.render($('#route-outlet'));
        }
    },
    routerViewsEditComponent() {
        let ViewsEdit = new ViewsEditComponent();
        ViewsEdit.render($('#route-outlet'));
    },
    routerFormsBaseComponent() {
        let form = new FormBaseComponent();
        console.log(form);
        form.render($('#route-outlet'));
    }
});

export let router = new BiAppRouter();