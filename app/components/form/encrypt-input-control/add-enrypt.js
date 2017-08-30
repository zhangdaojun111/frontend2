import template from './add-enrypt.html';

let css = ``;
css = css.replace(/(\n)/g, '')
let AddItem = {
    template: template.replace(/\"/g, '\''),
    data: {
        newItems: [],
    },
    actions: {
    },
    afterRender: function () {
        let _this = this;
        this.el.on('click', '#save', function () {
            let valPw = $(this).siblings("input").val();
            console.log(valPw)
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: _this.key,
                data: {
                    newItems: valPw
                }
            })
        });
        this.el.on('click', ("#cancel"), () => {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: _this.key,
                data: {
                    cancel: true,
                }
            })
        });
    },
}
export default AddItem