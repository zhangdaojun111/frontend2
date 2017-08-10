class Uploader {

    constructor(){
        this.formData = new FormData();
        this.fileInput = $("<input type='file' style='visibility:hidden;' multiple='true'>");
        this.fileInput.appendTo('body');
        this.fileList = {};
        this.code = new Date().getTime();
    }

    addFile(name){
        if (_.isUndefined(this.fileList[name])) {
            this.fileList[name] = {};
        }
        let resolve = null;
        let that = this;
        let promise = new Promise((_resolve) => {
            resolve = _resolve;
        });
        this.fileInput.one('change', function () {
            let path = this.value;
            let files = this.files;
            if (files.length === 1) {
                for (let i = 0; i < files.length; i++){
                    let file = files[i];
                    that.fileList[name][that.code++] = {
                        filename: file.name,
                        file: file
                    }
                }
            }
            that.fileInput.val('');
            resolve(that.fileList[name]);
        });
        this.fileInput.trigger('click');
        return promise;
    }

    deleteFileByCode(code){

    }

    deleteFileByName(code){

    }

    appendData(){}

    upload(url, options, onprogress){
        let defaultOptions = {
            type: 'POST',
            cache: false,
            processData: false,
            contentType: false,
            be
        }
        return $.ajax({
            url: '/upload',
            type: 'POST',
            cache: false,
            processData: false,
            contentType: false
        });
    }

}

export {Uploader}