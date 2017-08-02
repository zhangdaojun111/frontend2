import Handlerbar from 'handlebars';

let componentId = 10000;
let map = new WeakMap();

class Component {

    constructor(config, data) {

        config = _.defaultsDeep({}, config || {});
        data = _.defaultsDeep({}, data || {});
        this.template = config.template || '';
        this.data = _.defaultsDeep({}, config.data, data);

        if (config.actions) {
            this.actions = {};
            for (let name in config.actions) {
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
        if (el.length === 0) {
            console.error('component: el必须是存在于dom内的节点');
            console.dir(this);
            return;
        }
        this.el = el;
        this.el.attr('component', this.componentId);
        map.set(this.el.get(0), this);
        return this.reload();
    }

    reload() {
        let compiler = Handlerbar.compile(this.template);
        let html = compiler(this.data);
        this.el.html(html);
        if (this.firstAfterRender && this.firstAfterRenderRunned !== true) {
            this.firstAfterRender();
            this.firstAfterRenderRunned = true;
        }
        this.afterRender && this.afterRender();
        return this;
    }

    set(key, value) {
        this[key] = value;
    }

    append(component, container, tagName) {
        tagName = tagName || 'div';
        let el = $(`<${tagName}>`).appendTo(container);
        component.render(el);
        return this;
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
        for (let name in this) {
            this[name] = null;
        }

        return this;
    }

    findBrothers() {
        let doms = this.el.parent().find('> [component]');
        let coms = [];
        let that = this;
        doms.each(function() {
            let component = map.get(this);
            if (component !== that) {
                coms.push(component);
            }
        });
        return coms;
    }

}

export default Component;