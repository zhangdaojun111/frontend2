import template from './common-query-add.html';
import './common-query-add.scss';
let addQuery = {
    template: template,
    data: {
        name:null
    },
    actions: {
        btnClick: function () {
            $( '.save-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data: {
                        value: $('.query-name-input').val()
                    }
                } )
            } )
            $( '.cancel-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                } )
            } )
        }
    },
    afterRender: function () {
        if (this.data.name) {
            this.el.find('.query-name-input').val(this.data.name);
        }
        this.actions.btnClick();
    },
    beforeDestory: function () {

    }
};
export default addQuery;
