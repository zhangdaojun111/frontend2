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
            if(this.el.find('#condition').is(':checked') == true) {

                if(this.data.expertFilter.length != 0) {
                    this.data.Filter.push({
                        queryParams: JSON.stringify(this.data.expertFilter[0])
                    })
                }
                if(this.data.filter.length != 0) {
                    this.data.Filter.push({
                        queryParams: JSON.stringify(this.data.filter[0])
                    })
                }
            }
            if(this.el.find('#columns').is(':checked') == true) {
                this.data.columns = true;
            }
            if(this.el.find('#accessory').is(':checked') == true) {
                this.data.attachment = true;
            }
            let href = `/data/export/?table_id=${this.data.tableId}&isFilter=${(this.data.isFilter)}&custom=${this.data.columns}&filter=${JSON.stringify(this.data.Filter)}&parent_real_id=${this.data.parentRealId}&fieldId=${this.data.fieldId}&rowId=${this.data.rowId}&tableType=count&is_group=${this.data.isGroup}&attachment=${this.data.attachment}`
            this.el.find('.save-btn').attr('href',href)
        }
    },
    afterRender: function () {
        this.actions.getCheckBoxValue();
        this.actions.btnClick();
    },
    beforeDestory: function () {

    }
};
export default girdExport;
