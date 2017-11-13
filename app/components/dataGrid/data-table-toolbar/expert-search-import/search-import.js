/**
 * Created by zhr
 */
import {Uploader} from '../../../../lib/uploader'
import template from './search-import.html';
let css = `

\`;
`;

let searchImport = {
    template: template,
    data: {
        css: css.replace(/(\n)/g, ''),
        tableId: null,
        key: null,
        choice: null,
        uploader:null,
        fileData: null
    },
    actions: {
        upload: function(){

        }
    },
    afterRender: function () {
        let obj = {
            selectMode:'single',
            file_filter:'.ini'
        }
        // this.data.uploader = new Uploader(obj);
        this.el.on('click','.search-uploader-button',function() {
            debugger
            this.data.uploader.addFile(key).then(res=> {
                this.data.fileData = res;
            })
        })
    },
};
export default searchImport;








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