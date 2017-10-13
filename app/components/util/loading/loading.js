import Component from '../../../lib/component';
import template from './loading.html';
import './loading.scss'

let config = {
    template:template,
    actions:{
        show:function () {
            this.$root.show();
        }
    },
    afterRender:function () {
        this.$root = this.el.find('.loading-component-box');
    },
};

let Loading = {
    showLoading(){
        if(this.loadingComponent && this.loadingComponent.$root !== null){
            return;
        }
        this.$wrap = $("<div class='loading-component-box'>").appendTo(document.body);
        this.loadingComponent = new Component(config);
        this.loadingComponent.render(this.$wrap);
        this.loadingComponent.actions.show();
    },
    hideLoading(){
        if(this.loadingComponent){
            this.loadingComponent.destroySelf();
            this.$wrap.remove();
        }
    }
};

export {Loading}

