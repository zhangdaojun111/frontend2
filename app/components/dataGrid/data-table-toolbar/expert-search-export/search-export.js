/**
 * Created by zhr
 */
export const searchExport = {
    createUrl: function(data) {
        debugger
        let json = {
            table_id: this.data.tableId,
        }
        let url = this.returnIframeUrl(json,'/expert/')
    },
    returnIframeUrl: function(u, obj) {
        let str = '?';
        for( let a in obj) {
            str += (a + '=' + obj[a] + '&')
        }
        str = str.substring(0,str.length - 1);
        return u + str;
    },
    export: function(data){
        this.createUrl(data);
    }
}/**
 * Created by dell on 2017/11/9.
 */
