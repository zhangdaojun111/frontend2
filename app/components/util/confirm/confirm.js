import template from './confirm.html';

let confirmConfig = {
    template: template,
    data: {
        text: '提示内容'
    },
    actions: {
        confirm: function () {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key,
                data: {
                    res: true
                }
            });
        },
        cancel: function () {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key,
                data: {
                    res: false
                }
            });
        }
    },
    afterRender: function () {
        this.el.find('.text p').text(decodeURIComponent(this.data.text));
        this.el.on('click', '.yes', () => {
            this.actions.confirm();
        }).on('click', '.no', () => {
            this.actions.cancel();
        });
    }
}

export default confirmConfig;