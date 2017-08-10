import template from './data-table-export.html';
import './data-table-export.scss';
let girdExport = {
    template: template,
    data: {

    },
    actions: {
        btnClick: function () {
            this.actions.getCheckBoxValue()
            $( '.save-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data: {
                        // value: $('.input').val()
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
        },
        getCheckBoxValue: function(){
            debugger
            // $('.ecport-input')
        }
    },
    afterRender: function () {
        this.actions.btnClick();
    },
    beforeDestory: function () {

    }
};
export default girdExport;
