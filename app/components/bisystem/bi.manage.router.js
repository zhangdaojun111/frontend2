/**
 * Created by birdyy on 2017/8/1.
 */
import {Router} from 'backbone';
import {CanvasCellsComponent} from './canvas/canvas.cells';
import {ViewsEditComponent} from "./views/views";
import {FormBaseComponent} from './forms/base/base';
import {FormEntryComponent} from './forms/entry/entry';
import {componentsJson} from './forms/entry/loadFormChart.json';
let component;
let viewComponent;
let formComponent = {};
const BiAppRouter = Backbone.Router.extend({
    routes: {
        'views/edit':"routerViewsEditComponent",
        'views/:id':'routerViewsComponent',
        'forms/home':'routerFormEntryComponent',
        'forms/:component':'routerFormDynamicComponent',
        '':'routerViewsComponent',
    },

    routerViewsComponent(id) {
        if (component) {
            component.data.views = window.config.bi_views
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
        if (viewComponent) {
            viewComponent.destroyChildren();
            viewComponent.reload();
        } else {
            let ViewsEdit = new ViewsEditComponent();
            viewComponent = ViewsEdit;
            ViewsEdit.render($('#route-outlet'));
        }

    },
    routerFormEntryComponent() {
        let form = new FormEntryComponent();
        form.render($('#route-outlet'));
    },
    routerFormDynamicComponent(type) {
        if (formComponent[type]) {
            formComponent[type].destroyChildren();
            formComponent[type].reset();
            formComponent[type].reload();
        } else {
            let component = new componentsJson[type]['component'];
            component.render($('#route-outlet'));
            formComponent[type] = component;
        }

    }
});

export let router = new BiAppRouter();