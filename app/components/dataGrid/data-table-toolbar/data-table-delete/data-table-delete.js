import template from './data-table-delete.html';
let css = `
.del-ids-no {
    display: none;
    border: 1px solid #000;
}
.del-ids-yes {
    display: none;
}
`;
let delSetting = {
    template: template,
    data: {
        css: css.replace(/(\n)/g, ''),
        deletedIds: []
    },
    actions: {
        delType: function () {
            if( this.data.deletedIds.length == 0 ){
                $( '.del-ids-no' ).show();
                $( '.del-ids-yes' ).hide();
            }else {
                $( '.del-ids-yes' ).show();
                $( '.del-ids-no' ).hide();
            }
        },
        btnClick: function () {
            $( '.del-cancel-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data: {
                        type: 'cancel'
                    }
                } )
            } )
            $( '.del-submit-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data: {
                        type: 'del'
                    }
                } )
            } )
        }
    },
    afterRender: function () {
        this.actions.delType();
        this.actions.btnClick();
    },
    beforeDestory: function () {
        
    }
};
export default delSetting;
