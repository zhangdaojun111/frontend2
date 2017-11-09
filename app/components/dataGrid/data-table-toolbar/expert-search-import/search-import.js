/**
 * Created by zhr
 */
import {Uploader} from '../../../../lib/uploader'
let obj = {
    selectMode:'single',
    file_filter:'.json'
}
let uploader = new Uploader(obj)
export const searchImport = {
    import: function (key){
        uploader.addFile(key).then(res=> {
            console.log(res)
        })
    }
}