/**
 * Created by zhr
 */
import {Uploader} from '../../../../lib/uploader';
import Component from "../../../../lib/component";
import template from './search-import.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import msgBox from '../../../../lib/msgbox';
import './search-import.scss';

let searchImport = Component.extend({
    template: template,
    data: {
        tableId: null,
        parentKey: null,
        fileData: null,
        choice: 1
    },
    actions: {
        //选择文件
        upload: function(){
            this.data.uploader.addFile(this.data.key).then(res=> {
                this.data.fileData = res;
                this.actions.fileTip();
            });
        },
        //改变文件提醒
        fileTip: function () {
            let name = '请选择文件';
            for( let k in this.data.fileData ){
                name = this.data.fileData[k].filename;
            }
            this.el.find( '.file-name' )[0].innerHTML = name;
        },
        //只保留最新的文件
        saveFile:function (){
            let num = 0;
            for( let code in this.data.fileData ){
                num++;
            }
            let newFile = {};
            let n = 0;
            let currentCode ='';
            for( let code in this.data.fileData ){
                n++;
                if( n==num ){
                    newFile[code] = this.data.fileData[code];
                    currentCode = code;
                }else {
                    this.data.uploader.deleteFileByCode( code,'/upload_data/' );
                }
            }
            this.data.fileData = newFile;
        },
        //上传文件
        import: function() {
            this.actions.saveFile();
            if (this.el.find('.choice-input').find('input').eq(1).hasClass('active')) {
                this.data.choice = 0
            }
            let json = {
                file: 'upload_file',
                table_id: this.data.tableId,
                override: this.data.choice
            };
            this.data.uploader.appendData(json);
            let url = `/import_queryparams/?table_id=${this.data.tableId}&override=${this.data.choice}`;
            let toolbox = {
                update: function () {
                },
                finish: function (res) {
                },
                showError: function () {
                }
            };
            this.data.uploader.upload(url, {}, toolbox.update(), (res) => {
                if(res.success == 1) {
                    msgBox.showTips('导入成功')
                } else if (res.error) {
                    msgBox.alert('待导入的查询条件中有字段不存在于本表，无法导入')
                }
                PMAPI.closeIframeDialog(window.config.key, {
                    type: res.success
                });
            })
        },
        afterGetMsg:function () {
            let obj = {
                selectMode:'single',
                file_filter:'.ini'
            };
            let _this = this;
            this.data.uploader = new Uploader(obj);
            this.el.on('click','.search-uploader-button',function() {
                _this.actions.upload();
            }).on('click','.choice-input', function(){
                _this.el.find('.choice-input').find('input').removeClass('active');
                $(this).find('input').addClass('active');
            }).on('click','.search-import-submit-btn',function(){
                if(_this.data.fileData) {
                    _this.actions.import();
                } else {
                    msgBox.alert('请选择文件')
                }
            })
        }
    },
    afterRender: function () {
        PMAPI.getIframeParams(window.config.key).then((res) => {
            for (let item in res.data.obj) {
                this.data[item] = res.data.obj[item]
            }
            this.actions.afterGetMsg();
        })
    },
});
// class searchImport extends Component {
//     constructor(data,newConfig){
//         super($.extend(true,{},config,newConfig,{data:data||{}}));
//     }
// }
export default searchImport
