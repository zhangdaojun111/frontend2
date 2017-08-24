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
                key: this.key,
                data: {
                    confirm: true
                }
            });
        }
    },
    afterRender: function () {
        this.el.find('.text p').text(decodeURIComponent(this.data.text));
        this.el.on('click', 'button', () => {
            this.actions.close();
        })
    }
}

export default alertConfig;