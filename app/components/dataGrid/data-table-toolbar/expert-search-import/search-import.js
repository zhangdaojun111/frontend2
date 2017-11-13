/**
 * Created by zhr
 */
import {Uploader} from '../../../../lib/uploader';
import Component from "../../../../lib/component";
import template from './search-import.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import './search-import.scss';

let config = {
    template: template,
    data: {
        tableId: null,
        parentKey: null,
        fileData: null,
        choice: 1
    },
    actions: {
        upload: function(){
            this.data.uploader.addFile(this.data.key).then(res=> {
                this.data.fileData = res;
            });
        },
        import: function() {
            if (this.el.find('.common-search-title .choice-input').eq(1).hasClass('active')) {
                this.data.choice = 0
            }
            let json = {
                file: 'upload_file',
                table_id: this.data.tableId,
                override: this.data.choice
            }
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
                PMAPI.closeIframeDialog(window.config.key, {
                    type: res.success
                });
            })
        },
        afterGetMsg:function () {
            let obj = {
                selectMode:'single',
                file_filter:'.ini'
            }
            let _this = this;
            this.data.uploader = new Uploader(obj);
            this.el.on('click','.search-uploader-button',function() {
                _this.actions.upload();
            }).on('click','.choice-input', function(){
                _this.el.find('.choice-input').removeClass('active');
                $(this).addClass('active');
            }).on('click','.search-import-submit-btn',function(){
                _this.actions.import()
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
};
class searchImport extends Component {
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}
export default searchImport







// let obj = {
//     selectMode:'single',
//     file_filter:'.ini'
// }
// let uploader = new Uploader(obj);
// let fileData;
// export const searchImport = {
//     import: function (key,id,choice){
//         uploader.addFile(key).then(res=> {
//             fileData = res;
//         })
//         let json = {
//             file:'upload_file',
//             table_id: id,
//             override: choice
//         }
//         uploader.appendData( json );
//         let url = `/import_queryparams/?table_id=${id}&override=${choice}`;
//         let toolbox = {
//             update:function () {},
//             finish:function (res) {},
//             showError:function () {}
//         };
//         uploader.upload(url,{},toolbox.update(),(res)=>{
//             console.log(res)
//         })
//     }
// }