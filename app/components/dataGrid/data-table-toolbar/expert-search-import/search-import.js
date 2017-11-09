/**
 * Created by zhr
 */
import {Uploader} from '../../../../lib/uploader'
let uploader = new Uploader()
export const searchImport = {
    import: function (key){
        uploader.addFile(key).then(res=> {
            debugger
        })
    }

}