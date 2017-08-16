import template from './data-control-alert.html';

let alertConfig1 = {
    template: template,
    data: {
        text: '所选日期不能晚于当前日期！'

    },
    actions: {
        close: function () {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: this.key,
                data: {
                    alert: true
                }
            });
        }
    },
    afterRender: function () {
        this.el.on('click', 'button', () => {
            this.actions.close();
        })
    }
}

export default alertConfig1;