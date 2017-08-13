import './msgbox';
import browserMd5File from 'browser-md5-file';
import {HTTP} from "./http";

class Uploader {

    constructor(){
        this.formData = new FormData();
        this.fileInput = $("<input type='file' style='visibility:hidden;' multiple='true'>");
        this.fileInput.appendTo('body');
        this.fileList = {};
        this.code = new Date().getTime();
    }

    /**
     * 打开‘选择文件’窗口，选择上传文件
     * @param name 选择文件窗口代号，用于获取本次窗口所选择的所有文件
     * @returns {Promise} 返回本次选择的文件控制列表
     */
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
            // if (files.length === 1) {
                for (let i = 0; i < files.length; i++){
                    let file = files[i];
                    that.fileList[name][that.code++] = {
                        filename: file.name,
                        file: file,
                        state: 'initial'
                    };
                }
            // }
            that.fileInput.val('');
            resolve(that.fileList[name]);
        });
        this.fileInput.trigger('click');
        return promise;
    }

    /**
     * 删除指定文件
     * @param code 文件专有ID，可通过addForm返回值获得
     * @param url 删除接口的地址
     */
    deleteFileByCode(code,url){
        let names = Object.keys(this.fileList);
        for(let name of names){
            if(this.fileList[name][code]){
                this._deleteFileItem(name,code,url);
                return;
            }
        }
    }

    /**
     * 删除特定某次‘选择文件’窗口所选的所有文件
     * @param name 选择文件窗口代号
     * @param url 删除接口的地址
     */
    deleteFileByName(name,url){
        if(!this.fileList[name]){
            return;
        }
        let codes = Object.keys(this.fileList[name]);
        for(let code of codes){
            this._deleteFileItem(name,code,url);
        }
    }

    _deleteFileItem(name,code,url){
        let fileChooser = this.fileList[name];
        let fileItem = fileChooser[code];
        if(fileItem['state']=='finished'){
            let json = {
                file_ids:JSON.stringify([fileItem['fileId']])
            };
            if(this.fileList['dinput_type'])
                json['dinput_type'] = this.fileList['settings']['dinput_type'];
            delete fileChooser[code];
            return HTTP.postImmediately(url,json);
        } else if(fileItem['state']=='on'){
            fileItem['state']='pre-delete';
        } else {
            delete fileChooser[code];
        }
    }

    /**
     * 加挂formData参数
     * @param params：{
     *      md5:true 后端需要MD5文件验证，用于分包上传的文件校验
     *      per_size:number 如果分包上传，则指定文件分包大小，0为默认值1024*768
     *      dinput_type:控件类型即对应的文件类型
     * } or {
     *      table_id:表格名称
     *      ...
     * }其他粘在formData上与后端处理相关的参数
     */
    appendData(params){
        let keys = Object.keys(params);
        for(let k of keys){
            let val = params[k];
            if(val){
                this.formData.append(k,val);
            }
        }
        this.fileList['settings']={};
        if(params['md5'] || params['MD5']){
            this.fileList['settings']['md5']=true;
        }
        if(params['per_size']){
            this.fileList['settings']['per_size']=params['per_size']==0?1024*768:params['per_size'];
        }
        if(params['dinput_type']){
            this.fileList['settings']['dinput_type']=params['dinput_type'];
        }
        if(params['content_type']){
            this.fileList['settings']['content_type']=params['content_type'];
        }
    }

    /**
     * 暂停指定文件
     * @param name 选择文件窗口代号
     * @param code 文件ID
     */
    pause(name,code){
       //暂停传输
        if(this.fileList[name][code]['state']='on'){
            this.fileList[name][code]['state']='paused';
        }
    }

    /**
     * 继续上传指定文件
     * @param name 选择文件窗口代号
     * @param code 文件ID
     */
    shiftOn(name,code){
        //继续传输
        if(this.fileList[name][code]['state']='paused'){
            this.fileList[name][code]['state']='on';
            this.fileList[name][code]['index']++;
            this._transmitData(name,code);
        } else {
            console.log('The file of '+name+' - '+code+' is '+this.fileList[name][code]['state']);
        }
    }

    /**
     * 上传所有文件
     * @param url 上传地址
     * @param options 上传请求选项
     * @param onprogress 进程回调
     *              function(event){} event.name,event.code
     */
    upload(url, options, onprogress){
        let defaultOptions = {
            type: 'POST',
            url: url,
            data: this.formData,
            async:true,
            cache: false,
            processData: false,
            contentType: false,
            timeout:60000,
            success:function (data) {},
            error: function (error) {
                console.dir(error);
            }
        };

        this.fileList['settings']['options'] = _.defaultsDeep(options,defaultOptions);
        this.fileList['settings']['onProgress'] = onprogress;
        let keys = Object.keys(this.fileList);
        //如果内存CPU开销大的话要改为一个一个文件上传的串行模式
        for(let name of keys){
            if(name == 'settings'){
                continue;
            }
            let codes = Object.keys(this.fileList[name]);
            for(let code of codes){
                let fileItem = this.fileList[name][code];
                if(this.fileList['settings']['per_size']){
                    fileItem['index'] = 0;
                    fileItem['chunks'] = Math.ceil(fileItem.file.size/this.fileList['settings']['per_size']);
                }
                if(this.fileList['settings']['content_type']){
                    fileItem['content_type']==fileItem.file.type;
                }
                fileItem['state']='on';
                if(this.fileList['settings']['md5']){
                    browserMd5File(fileItem['file'],(err, md5)=>{
                        fileItem['md5'] = md5;
                        this._transmitData(name,code);
                    })
                }else {
                    this._transmitData(name,code);
                }
            }
        }
    }

    _transmitData(name,code){
        let fileItem = this.fileList[name][code];
        if(fileItem['state']!='on'){
            if(fileItem['state'=='pre-delete']){
                delete this.fileList[name][code];
            }
            return;
        }
        //准备formData和options
        let keys = Object.keys(fileItem);
        for(let k of keys){
            if(this.formData.get(k)){
                this.formData.delete(k);
            }
            this.formData.append(k,fileItem[k]);
        }
        this.formData.delete('state');
        let packSize = this.fileList['settings']['per_size'];
        let startIndex = fileItem['index']*packSize;
        if(packSize){
            this.formData.delete('file');
            this.formData.append('file',
                fileItem.file.slice(startIndex, startIndex + packSize));
            let t = this;
            this.fileList['settings']['options']['xhr']=function () {
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    let onprogress = t.fileList['settings']['onProgress'];
                    if(onprogress==undefined){
                        onprogress = function(event){};
                    }
                    let startIndex = fileItem['index']*packSize;
                    myXhr.upload.addEventListener('progress',(event)=>{
                        let obj = {
                            code:code,
                            name:name,
                            total:startIndex+event['total']
                        }
                        if(event['loaded']){
                            obj['loaded'] = event['loaded']+startIndex;
                        } else {
                            obj['position'] = event['position']+startIndex;
                        }
                        let proEvent = _.defaultsDeep(obj,event);
                        onprogress(proEvent);
                    },false);
                    return myXhr;
                }
            };
        } else {
            this.fileList['settings']['options']['xhr']=function () {
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    if(onprogress==undefined){
                        onprogress = function(event){};
                    }
                    myXhr.upload.addEventListener('progress',(event)=>{
                        event['code']=code;
                        event['name']=name;
                        onprogress(event);
                    },false);
                    return myXhr;
                }
            };
        }

        HTTP.ajaxImmediately(this.fileList['settings']['options']).then(res=>{
            if(res.success){
                if(this.fileList['settings']['per_size']
                    && fileItem['index'] < fileItem['chunks']-1){
                    fileItem['index']++;
                    this._transmitData(name,code);
                } else {
                    fileItem['state']='finished';
                    fileItem['fileId'] = res['file_id'];
                    fileItem['thumbnail'] = res['thumbnail'];
                }
            } else {
                fileItem['state']='failed';
                //todo：重传,需确认后端在失败后是否删除本次传输包的数据
            }
        });

    }

    destroy() {
        this.formData = null;
        this.fileList = null;
        this.code = null;
        this.fileInput.remove();
        this.fileInput = null;
    }

}

export {Uploader}
