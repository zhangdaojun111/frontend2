import template from './data-table-export.html';
let css = `
`
let exportSetting = {
    template: template,
    data: {
        css: css.replace(/(\n)/g, ''),
        isFilter: true,
        custom: true,
        attachment: true
    },
    actions: {
        createUrl: function () {
            let json = {
                table_id: this.data.tableId,
                isFilter: this.data.isFilter,
                custom: this.data.custom,
                filter: this.data.filterParam,
                is_group: this.data.groupCheck?1:0,
                attachment: this.data.attachment
            }
            if( this.data.tableType == 'count' ){
                json['parent_real_id'] = this.data.parentRealId;
                json['fieldId'] = this.data.fieldId;
                json['rowId'] = this.data.rowId;
                json['tableType'] = this.data.tableType;
            }
            let url = this.actions.returnIframeUrl( '/export/',json );
            this.el.find( '.export-btn' )[0].href = url;
        },
        changeState: function ( d ) {
            this.data[d] = !this.data[d];
            this.actions.createUrl();
        },
        //返回数据url
        returnIframeUrl( u,obj ){
            let str = '?';
            for( let o in obj ){
                str += (o + '=' + obj[o] + '&');
            }
            str = str.substring( 0,str.length - 1 );
            return u + str;
        }
    },
    afterRender: function () {
        this.el.on( 'click','#isFilter',()=>{
            this.actions.changeState( 'isFilter' );
        } ).on( 'click','#columns',()=>{
            this.actions.changeState( 'columns' );
        } ).on( 'click','#attachment',()=>{
            this.actions.changeState( 'attachment' );
        } ).on( 'click','.export-btn',()=>{
            PMAPI.sendToParent( {
                key: this.key,
                type: PMENUM.close_dialog,
                data: {
                    type: 'export'
                }
            } )
        } )
        this.actions.createUrl();
    },
    beforeDestory: function () {

    }
};
export default exportSetting;
