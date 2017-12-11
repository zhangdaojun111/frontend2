/**
 * Created by birdyy on 2017/8/1.
 */
import {Router} from 'backbone';
import {CanvasMain} from './canvas/main/main';
import {ViewsEditComponent} from "./views/views";
import {FormEntryComponent} from './forms/entry/entry';
import {componentsJson} from './forms/entry/loadFormChart.json';

// 增加backbone router 路由钩子 主要用于自动保存用户画布块布局
Backbone.Router.prototype.before =function () { };
Backbone.Router.prototype.after =function () { };
Backbone.Router.prototype.route =function (route,name,callback)
{
    if (!_.isRegExp(route))route =this._routeToRegExp(route);
    if (_.isFunction(name)) {
        callback = name;
        name = '';
    }
    if (!callback)callback =this[name];
    var router =this;
    Backbone.history.route(route,function (fragment)
    {
        var args =router._extractParameters(route,fragment);
        router.before.apply(router,args);
        callback && callback.apply(router,args);
        router.after.apply(router,args);
        router.trigger.apply(router, ['route:' +name].concat(args));
        router.trigger('route',name,args);
        Backbone.history.trigger('route',router,name,args);
    });
    return this;
};



let canvasComponent;
let formComponent = {};
let viewsManage;
const BiAppRouter = Backbone.Router.extend({
    before: function() {
        if (canvasComponent) {
            let canSaveView = window.config.bi_views.filter(item => item.id == canvasComponent.data.currentViewId);
            if (canSaveView[0] && canSaveView[0].self == 1) {
                canvasComponent.data.headerComponents.trigger('onSaveCanvas');
            }
        }
    },

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
            canvasComponent = new CanvasMain({
                data:{
                    isViewEmpty:window.config.bi_views[0] ? false : true
                }
            });
            canvasComponent.render($('#route-outlet'));
        }
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
        canvasComponent = null;
        let form = new FormEntryComponent();
        form.render($('#route-outlet'));
    },
    routerFormDynamicComponent(type,id) {
        canvasComponent = null;
        console.log(type);
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
        }
    }
});

export let router = new BiAppRouter();