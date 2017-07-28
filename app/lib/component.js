import Handlerbar from 'handlebars';

let componentId = 10000;
let map = new WeakMap();class Component {

    constructor(config,data) {
        config = config || {};
        if(data){
            //合并从請求或者父組件传递进来的data
            let tempData=JSON.parse(JSON.stringify(data));
            config.data=Object.assign({},config.data,tempData);
        }
        this.template = config.template || '';
        this.data = config.data || {};

        if (config.actions) {
            this.actions = {};
            for(let name in config.actions) {
                this.actions[name] = config.actions[name].bind(this);
            }
        }
        if (config.afterRender) {
            this.afterRender = config.afterRender.bind(this);
        }
        // 只在第一次运行
        if (config.firstAfterRender) {
            this.firstAfterRender = config.firstAfterRender.bind(this);
        }
        if (config.beforeDestory) {
            this.beforeDestory = config.beforeDestory.bind(this);
        }
        this.componentId = componentId++;

    }

    render(el) {
        this.el = el;
        this.el.attr('component', this.componentId);
        map.set(this.el.get(0), this);
        return this.reload();
    }

    reload() {
        let compiler = Handlerbar.compile(this.template);
        let html = compiler(this.data);
        this.el.html(html);
        this.afterRender && this.afterRender();
        if (this.firstAfterRender && this.firstAfterRenderRunned !== true) {
            this.firstAfterRender();
            this.firstAfterRenderRunned = true;
        }
        return this;
    }

    set(key, value) {
        this[key] = value;
    }

    append(component, container) {
        let el = $('<div>').appendTo(container);
        component.render(el);
    }

    destroyChildren(container) {

        if (!container) {
            container = this.el;
        }

        let subs = Array.from(container.find('[component]'));
        subs = subs.sort((prev, current) => {
            let c1 = parseInt($(prev).attr('component'));
            let c2 = parseInt($(current).attr('component'));
            return c1 < c2;
        });

        subs.forEach((element) => {
            let component = map.get(element);
            if (component) {
                component._destroy();
            }
        });

        return this;

    }

    destroySelf() {
        this.destroyChildren();
        return this._destroy();
    }

    _destroy() {

        this.beforeDestory && this.beforeDestory();

        if (this.el) {
            this.el.off();
            this.el.remove();
        }
        for(let name in this) {
            this[name] = null;
        }

        return this;
    }

}

export default Component;