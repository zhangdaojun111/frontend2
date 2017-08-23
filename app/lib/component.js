import Handlerbar from 'handlebars';

let componentId = 10000;
let map = new WeakMap();
let count = 0;

let defaultConfig = {
    template: '',
    data: {},
    events: {},
    actions: {},
    /**
     * {
     *      event: 'click',
     *      selector: '.name',
     *      callback: function(){}
     * }
     */
    binds: [],
    afterRender: null,
    firstAfterRender: null,
    beforeDestory: null,
    firstAfterRenderRunned: false
}

class Component {
    constructor(config, data, events) {
        $.extend(true, this, defaultConfig, config, {data: data||{}, events: events||{}})
        let that = this;
        function scan(obj) {
            for(let name in obj) {
                let item = obj[name];
                if (_.isFunction(item)) {
                    obj[name] = item.bind(that);
                } else if (_.isPlainObject(item) || _.isArray(item)) {
                    scan(item);
                }
            }
        }
        scan(this);
        this.subComponents = [];
        this.componentId = componentId++;
        count ++;
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

    /**
     * 组件渲染
     * @returns {Component}
     */
    reload() {
        this.destroyChildren();
        let compiler = Handlerbar.compile(this.template);
        let html = compiler(this.data);
        this.el.html(html);
        if (this.firstAfterRenderRunned === false) {
            this.bindEvents();
            this.firstAfterRender && this.firstAfterRender();
            this.firstAfterRenderRunned = true;
        }
        this.afterRender && this.afterRender();
        return this;
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        if (this.binds && this.binds.length) {
            let that = this;
            this.binds.forEach((item) => {
                this.el.on(item.event, item.selector, function (event) {
                    item.callback.call(that, this, event);
                });
            })
        }
    }

    cancelEvents() {
        this.el.off();
    }

    trigger(eventName, params) {
        this.events[eventName] && this.events[eventName](params);
        return this;
    }

    addEvent(eventName, func) {
        this.events[eventName] = func.bind(this);
        return this;
    }

    setData(key, value) {
        this.data[key] = value;
    }

    append(component, container, tagName) {
        tagName = tagName || 'div';
        let el = $(`<${tagName}>`).appendTo(container);
        component.render(el);
        this.subComponents.push(component);
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

        count--;

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
        doms.each(function () {
            let component = map.get(this);
            if (component !== that) {
                coms.push(component);
            }
        });
        return coms;
    }

    showLoading(){

    }

    hideLoading(){

    }

    disable(){

    }

    enable(){

    }

}

export default Component;