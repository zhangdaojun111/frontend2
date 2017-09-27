/**
 * Created by Yunxuan Yan on 2017/8/17.
 */
import template from './attachment-list.html';

let css=`
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
        cursor: pointer;
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
    .my-mask{
        position: fixed;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }
    .mask-div{
        position: absolute;
        z-index: 2;
        background: black;
        height: 100%;
        width: 100%;
        opacity: 0.3;
    }
    .img-pre{
        vertical-align: middle;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        z-index: 10;
        max-height:80%;
    }
    .rotate-button{
        position: absolute;
        transform: translate(50%,-50%);
        right: 50%;
        bottom: 0;
        width: 300px;
        height: 50px;
        z-index: 10;
        padding:0 20px;
        background: rgba(0,0,0,0.3);
        padding-top: 5px;
        display:flex;
        align-items:center;
        justify-content: center;
    }
    .closeImg:hover{
        background-color:darkred;
    }
`;

export const attachmentListConfig = {
    template: template,
    data:{
        css:css.replace(/(\n)/g, ''),
    },
    actions:{
        deleteItem:function (item) {
            HTTP.post('delete_attachment',{
                file_ids:JSON.stringify([item['file_id']]),
                dinput_type:this.data.dinput_type
            }).then(res=>{
                if(res.success){
                }
            });
            HTTP.flush();

            let index = _.findIndex(this.data.attachmentList,item);
            this.data.attachmentList.splice(index,1);
            let deletedFiles = Storage.getItem('deletedItem-'+this.data.id,Storage.SECTION.FORM);
            if(deletedFiles == undefined){
                deletedFiles = [];
            }
            deletedFiles.push(item['file_id']);
            Storage.setItem(deletedFiles,'deletedItem-'+this.data.id,Storage.SECTION.FORM);
        },
        viewItem:function (item) {
            if(item.viewable == 'no'){
                return;
            }
            let url = '/download_attachment/?file_id='+item.file_id+'&download=0&dinput_type='+this.data.dinput_type;
            let ele;
            if(item.viewable == 'viewable'){
                ele = $('<img src="'+url+'">');
            } else if(item.viewable == 'playable'){
                ele = $('<video width="400" controls><source src="'+url+'" type="video/mp4">您的浏览器不支持HTML5</video>');
            }
            this.el.find('.preview-anchor').empty().append(ele);
        },
        isViewable:function (filename) {
            let exp = filename.split('.').pop();
            let viewableFileType = ['jpg','jpeg','bmp', 'png', 'tiff', 'gif', 'exif', 'svg', 'pcd', 'dxf', 'ufo'];
            for(let type of viewableFileType){
                if(exp.toLowerCase().indexOf(type)!=-1){
                    return 'viewable';
                }
            }
            if(exp.toLowerCase().indexOf('mp4')!=-1){
                return 'playable';
            }
            return 'no';
        }
    },
    afterRender:function () {
        this.data.style = $('<style type="text/css"></style>').text(this.data.css).appendTo($("head"));
        this.el.find('.table').addClass('table-striped').addClass('table-bordered');
        HTTP.post('query_attachment_list',{
            file_ids:JSON.stringify(this.data.fileIds),
            dinput_type:this.data.dinput_type
        }).then(res=>{
            if(res.success){
                let t = this;
                this.data['attachmentList'] = res.rows;
                for(let row of res.rows){
                    row['dinput_type']=this.data.dinput_type;
                    row['callback'] = this.actions.deleteItem;
                    let ele = $('<tr></tr>');
                    let fileTd = $('<td>'+row.file_name+'</td>');
                    ele.append(fileTd);
                    let controlersTd = $('<td></td>');
                    let downloadCon = $('<a href="/download_attachment/?file_id='+row.file_id+'&download=1&dinput_type='+this.data.dinput_type+'">下载</a>');
                    controlersTd.append(downloadCon);
                    let viewCon = $('<a>预览</a>');
                    controlersTd.append(viewCon);
                    viewCon.on('click',function () {
                        t.actions.viewItem(row);
                    });
                    if(this.data.isView == 0){
                        let deleteCon = $('<a>删除</a>');
                        controlersTd.append(deleteCon);
                        deleteCon.on('click',function () {
                            t.actions.deleteItem(row);
                            ele.remove();
                        })
                    }
                    ele.append(controlersTd);
                    row['viewable']= this.actions.isViewable(row.file_name);
                    if(row['viewable']=='no'){
                        viewCon.css('color','#a9a9a9');
                    }
                    this.el.find('.attachment-list-anchor').append(ele);
                }
            }
        });
        HTTP.flush();
    },
    beforeDestroy:function () {
        this.data.style.remove();
    }
}

// export default class AttachmentList extends Component {
//     constructor(data){
//         config.data = _.defaultsDeep(data,config.data);
//         super(config);
//     }
// }
