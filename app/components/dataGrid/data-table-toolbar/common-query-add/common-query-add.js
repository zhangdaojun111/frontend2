import template from './common-query-add.html';
import './common-query-add.scss';
let addQuery = {
    template: template,
    data: {

    },
    actions: {
        btnClick: function () {
            $( '.save-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data: {
                        value: $('.input').val()
                    }
                } )
            } )
            $( '.cancel-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data: {

                    }
                } )
            } )
        }
    },
    afterRender: function () {
        this.actions.btnClick();
    },
    beforeDestory: function () {

    }
};
export default addQuery;
