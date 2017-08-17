import template from './data-table-export.html';
import './data-table-export.scss';
let girdExport = {
    template: template,
    data: {

    },
    actions: {
        btnClick: function () {
            $( '.save-btn' ).click( ()=>{
                this.actions.getCheckBoxValue()
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
            console.log($('#condition').is(':checked'))
            console.log($('#columns').is(':checked'))
            console.log($('#accessory').is(':checked'))
        }
    },
    afterRender: function () {
        this.actions.btnClick();
    },
    beforeDestory: function () {

    }
};
export default girdExport;
