import Component from '../../../lib/component';
import template from './tips.html';
import './tips.scss'
let config = {
    template: template,
    actions: {
        show: function () {
            this.$root.fadeIn();
        },
        close: function () {
            this.$root.fadeOut(() => {
                window.clearTimeout(this.data.timer);
                this.destroySelf();
            });
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.close',
            callback: function () {
                this.actions.close();
            }
        }
    ],
    firstAfterRender: function () {
        this.$root = this.el.find('.component-tips-item');
        this.data.timer = window.setTimeout(() => {
            this.destroySelf();
        }, 5000);
    }
}

let dom = $("<div class='tips-box'>").appendTo(document.body);

let Tips = {
    showMessage(msg) {
        let instance = new Component(config, {msg: msg});
        instance.appendTo(dom, 'div', 'desc');
        instance.actions.show();
    }
}

export {Tips}
// let count = 0;
// let timer = window.setInterval(function () {
//     Tips.append('xxxxxxxxxxxxx' + count);
//     count++;
//     if (count === 5) {
//         clearInterval(timer);
//     }
// }, 1000)
