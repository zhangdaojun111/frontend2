/**
 * Created by zhr
 */
export const searchExport = {
    // createUrl: function(data) {
    //
    // },
    // returnIframeUrl: function(u, obj) {
    //     let str = '?';
    //     for( let a in obj) {
    //         str += (a + '=' + obj[a] + '&')
    //     }
    //     str = str.substring(0,str.length - 1);
    //     return u + str;
    // },
    export: function (id, that) {
        let url = '/export_queryparams/?table_id=' + id;
        that.find('.export-btn')[0].href = url;
    }
};
