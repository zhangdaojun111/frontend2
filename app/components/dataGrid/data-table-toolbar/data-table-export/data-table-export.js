/**
 * @author yangxiaochuan
 * 导出
 */
import template from './data-table-export.html';
let css = `
.export-container{
   width:600px;
   height:330px;
}
.input-item{
   height:40px;
   line-height:40px;
   border:1px;
   width:580px;
}
.disableClick {
}
.disableClick:hover {
    cursor: not-allowed;
}
.input-box{
    position: absolute;
    top: 5px;
    left:10px;
    width: 580px;
    height: 120px;
    background-color: rgba(255, 255, 255, 0);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(242, 242, 242, 1);
    border-radius: 0px;
    box-shadow: none;
}
.button-box{
    position: absolute;
    text-align: center;
    width: 91px;
    height: 30px;
    lin-height:30px;
    background-color: rgba(0, 136, 255, 1);
    border: none;
    border-radius: 4px;
    box-shadow: none;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #FFFFFF;
    bottom:15px
    margin-left: 500px;
    bottom: 25px;
    right: 15px;
}
   .left{
   width: 40px;
    height: 40px;
    background: inherit;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(242, 242, 242, 1);
    border-left: 0px;
    border-right: 0px;
    border-radius: 0px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    text-align: left;
     height:40px;
     width:40px;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    text-align: left;
     }
.right{
background-color: rgba(250, 250, 250, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(242, 242, 242, 1);
    border-left: 0px;
    border-right: 0px;
    border-radius: 0px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    position: absolute;
    float:right;
    left:40px;
    width: 540px;
    height: 40px;
    background: inherit;
    background-color: rgba(250, 250, 250, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(242, 242, 242, 1);
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    text-align: left;
}
.export-input{
    margin-top: 13px;
    margin-left: 13px;
}
#last{
   border-bottom:1px;
}
.text{
   margin-left:5px;
}
.export-btn{
    font-family: '微软雅黑';
    text-align: center;
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #FFFFFF !important;
    text-decoration:none
}
.btn-name{
margin-top:7px;
}
#right1{
top:0
}
#right2{
top:40px
}
#right3{
top:80px
}

\`;


`;

let exportSetting = {
    template: template,
    data: {
        css: css.replace(/(\n)/g, ''),
        isFilter: true,
        custom: true,
        attachment: false,
        hideOptions:[]
    },
    actions: {
        createUrl: function () {
            let json = {
                table_id: this.data.tableId,
                isFilter: this.data.isFilter,
                custom: this.data.custom,
                filter: JSON.stringify( this.data.filterParam ),
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
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        this.el.on( 'click','#isFilter',()=>{
            this.actions.changeState( 'isFilter' );
        } ).on( 'click','#columns',()=>{
            this.actions.changeState( 'custom' );
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
        this.data['isFilter'] = true;
        this.data['custom'] = true;
        this.data['attachment'] = false;
        for( let h of this.data.hideOptions ){
            let d = this.el.find( '.input-item' );
            let obj = {
                isFilter: 0,
                custom: 1,
                attachment: 2
            }
            this.data[h] = false;
            let a = this.el.find( '#'+h )
            a[0].checked = false;
            a[0].disabled = true;
            a[0].className += ' disableClick';
            d.eq( obj[h] ).find( 'div' ).css( 'background','#E4E4E4' );
        }
        this.actions.createUrl();
    },
    beforeDestory: function () {

    }
};
export default exportSetting;
