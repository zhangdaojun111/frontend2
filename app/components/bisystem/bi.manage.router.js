/**
 * Created by birdyy on 2017/8/1.
 */
import {Router} from 'backbone';
import {CanvasMain} from './canvas/main/main';
import {ViewsEditComponent} from "./views/views";
import {FormEntryComponent} from './forms/entry/entry';
import {componentsJson} from './forms/entry/loadFormChart.json';

let canvasComponent;
let formComponent = {};
let viewsManage;
const BiAppRouter = Backbone.Router.extend({
    routes: {
        'views/edit':"routerViewsEditComponent",
        'canvas/:id':'routerViewsComponent',
        'forms/home':'routerFormEntryComponent',
        'forms/:chart': 'routerFormDynamicComponent',
        'forms/:chart/:id':'routerFormDynamicComponent',
        '':'routerViewsComponent',
    },

    routerViewsComponent(id) {
        if (canvasComponent) {
            canvasComponent.actions.destroyCanvasCells();
        } else {
            canvasComponent = new CanvasMain();
            canvasComponent.render($('#route-outlet'));
        };
        canvasComponent.actions.switchViewId(id);
    },
    routerViewsEditComponent() {
        canvasComponent = null;
        if (viewsManage) {
            viewsManage.reload();
        } else {
            viewsManage = new ViewsEditComponent();
            viewsManage.render($('#route-outlet'));
        }


    },
    routerFormEntryComponent() {
        let form = new FormEntryComponent();
        form.render($('#route-outlet'));
    },
    routerFormDynamicComponent(type,id) {
        canvasComponent = null;
        let comType = {
            assortment: type,
            id: id
        };
        if (formComponent[type]) {
            formComponent[type].reset(comType);
            formComponent[type].reload();
        } else {
            let component = new componentsJson[type]['component'](comType);
            component.render($('#route-outlet'));
            formComponent[type] = component;
        };
    }
});

export let router = new BiAppRouter();