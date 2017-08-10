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
                let fff = document.querySelector( '#importForm' )
                console.log( "!!!!!!!!!!!!" )
                console.log( fff )
                let importForm = new FormData(fff);
                // let file = document.querySelector( '.form-file' );
                // console.log( "+++++++++++++++" )
                // console.log( "+++++++++++++++" )
                // console.log( file.files[0] )
                // importForm.append( 'upload_file',JSON.stringify(file.files[0]) )
                // debugger;
                // let arr = ['has_create_user','unique_check','use_increment_data','use_default_value']
                // for( let a of arr ){
                //     importForm.append( a,$( '.'+a ).val() );
                // }
                console.log( "666" )
                console.log( importForm )
                HTTP.ajaxImmediately({
                    type:"POST",
                    url: '/upload_data/',
                    data: importForm,
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if(myXhr.upload){
                            myXhr.upload.addEventListener('progress',processCallback,false);
                        }
                        return myXhr;
                    },
                    success: function (data) {
                        successCallback(data);
                    },
                    error: function (error) {
                        alert(error);
                    },
                    async:true,
                    cache:false,
                    contentType:false,
                    processData:false,
                    timeout:60000
                })
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
