/**
 *@author yudeping
 *aggrid附件弹窗
 */

import template from './attachment-list.html';

let css = `
    .attachment-list{
      //  width:100%;
        //height:100%;       
          height: 90%;
          display: flex;
          border: 1px solid #E4E4E4;
          margin: 10px;
          text-align: left;          
    }
    .attachment-list .table {    
          position: relative;
          margin: 0 auto;
          width: 99%;
          max-width: 100%;
          margin-bottom: 20px;
          margin-top: 8px;
    }
    .attachment-list .table a{
        outline-style:none;
    }
    .attachment-list .table-bordered  thead  tr  th:first-child,.attachment-list .table-bordered  tbody  tr  td:first-child{
      width: 70%;
    }
    .attachment-list .table-bordered  thead  tr  th:last-child,.attachment-list .table-bordered  tbody  tr  td:last-child{
      width: 30%;
    }
    .attachment-list .table-bordered  tbody  tr  td a{
        text-decoration: none;
         margin-right: 25px;
         color:#0088FF;       
    }
    
    .attachment-list .table  thead  tr  th,
    .attachment-list .table  tbody  tr  th,
    .attachment-list .table  tfoot  tr  th,
    .attachment-list .table  thead  tr  td,
    .attachment-list .table  tbody  tr  td,
    .attachment-list .table  tfoot  tr  td {
      padding: 8px;
      line-height: 1.42857143;
      vertical-align: top;
      border-top: 1px solid #F2F2F2;
    }
    .attachment-list .table  thead  tr th {
      vertical-align: bottom;
      border-bottom: 2px solid #ddd;
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
      font-weight: 700;
      font-style: normal;
      text-align: left;
    }
      .attachment-list .table  tbody  tr td {
        font-family: '微软雅黑';
        font-weight: 400;
        font-style: normal;
        font-size: 12px;
    }
    .attachment-list .table-bordered  thead  tr  th,
    .attachment-list .table-bordered  tbody  tr  th,
    .attachment-list .table-bordered  tfoot  tr  th,
    .attachment-list .table-bordered  thead  tr  td,
    .attachment-list .table-bordered  tbody  tr  td,
    .attachment-list .table-bordered  tfoot  tr  td {
      border: 1px solid #F2F2F2;
    }
    .attachment-list .table-bordered  thead  tr  th,
    .attachment-list .table-bordered  thead  tr  td {
      border-bottom-width: 2px;
    }
    `;
let AttachmentList = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
        currentIndex:0,
        list: [],
        dinput_type: '',
        fileIds: '',
        is_view: '',
        fileGroup: [],
    },
    binds: [
        {
            //图片弹窗预览
            event:'click',
            selector:'.pre',
            callback:function (event) {
                let id = event.dataset.id;
                if(id == undefined){
                    return;
                }
                PMAPI.openPreview({list:this.data.list,id:id});
            }
        }, {
            //删除
            event: 'click',
            selector: '.del',
            callback: function (event) {
                let fileIds = $(event).attr('data-id');
                //如果直接用delete_attachment删除此文件，而并没有提交表单，那么下次访问将看到file_id但是没有任何文件名和文件的脏数据
                // let _this = this;
                // HTTP.post('delete_attachment', {
                //     file_ids: JSON.stringify([fileIds]),
                //     dinput_type: this.data.dinput_type
                // }).then(res => {
                //     _this.data.list = res["rows"];
                //     for (let i = 0, len = _this.data.list.length; i < len; i++) {
                //         if (_this.data.list[i]["file_id"] == fileIds) {
                //             _this.data.list.splice(i, 1);
                //             break;
                //         }
                //     }
                //     _this.reload();
                // });
                // HTTP.flush();
                for (let i = 0, len = this.data.list.length; i < len; i++) {
                    if (this.data.list[i]["file_id"] == fileIds) {
                        this.data.list.splice(i, 1);
                        break;
                    }
                }
                this.el.find('#'+fileIds).remove();
                let deletedFiles = Storage.getItem('deletedItem-'+this.data.control_id,Storage.SECTION.FORM);
                if(deletedFiles == undefined){
                    deletedFiles = [];
                }
                deletedFiles.push(fileIds);
                Storage.init((new URL(document.URL)).searchParams.get('key'));
                Storage.setItem(deletedFiles,'deletedItem-'+this.data.control_id,Storage.SECTION.FORM);

            }
        }
    ],
    actions: {},
    afterRender() {
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        //给各个href赋值，解决dinput_type在引号中无法获得的问题
        for(let item of this.data.list){
            let ele =this.el.find('#'+item.file_id);
            ele.find('.download-url').attr('href','/download_attachment/?file_id='+item.file_id+'&download=1&dinput_type='+this.data.dinput_type);
            let previewUrl = ele.find('.preview-url');
            if(previewUrl.length > 0){
                previewUrl.attr('href','/download_attachment/?file_id='+item.file_id+'&download=0&dinput_type='+this.data.dinput_type);
            }
            if(this.data.is_view){
                ele.find('.del').hide();
            } else {
                ele.find('.del').show();
            }
        }
        this.data.lastPreviewableIndex = this.data.list.length - 1;
    },
    beforeDestory() {
        this.data.style.remove();
    }
}
export default AttachmentList