import template from './alert.html';

let alertConfig = {
    template: template,
    data: {
        text: '提示内容'
    },
    actions: {
        close: function () {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key
            });
        }
    },
    afterRender: function () {
        this.el.on('click', 'button', () => {
            this.actions.close();
        })
    }
}

export default alertConfig;