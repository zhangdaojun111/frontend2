import template from './data-table-import.html';
let css = `
`
let importSetting = {
    template: template,
    data: {
    },
    actions: {
        importData: function () {
            $( '.import-submit-btn' ).click( function () {
                let importForm = new FormData();
                let file = document.querySelector( '.form-file' );
                importForm.append( 'upload_file',file.files[0] )
                let arr = ['has_create_user','unique_check','use_increment_data','use_default_value']
                for( let a of arr ){
                    importForm.append( a,$( '.'+a ).val() );
                }
                console.log( "666" )
                console.log( importForm )
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data: {
                        importForm: importForm
                    }
                } )
            } )
        }
    },
    afterRender: function () {
        this.actions.importData();
    },
    beforeDestory: function () {

    }
};
export default importSetting;
