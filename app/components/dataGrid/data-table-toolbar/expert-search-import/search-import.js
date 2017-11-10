/**
 * Created by zhr
 */
import {Uploader} from '../../../../lib/uploader'
let obj = {
    selectMode:'single',
    file_filter:'.ini'
}
let uploader = new Uploader(obj);
let fileData;
export const searchImport = {
    import: function (key,id,choice){
        uploader.addFile(key).then(res=> {
            fileData = res;
        })
        let json = {
            file:'upload_file',
            table_id: id,
            override: choice
        }
        uploader.appendData( json );
        let url = `/import_queryparams/?table_id=${id}&override=${choice}`;
        let toolbox = {
            update:function () {},
            finish:function (res) {},
            showError:function () {}
        };
        uploader.upload(url,{},toolbox.update(),(res)=>{
            console.log(res)
        })
    }
}