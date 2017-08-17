/**
 * Created by Yunxuan Yan on 2017/8/17.
 */
import template from './attachment-list.html';

export const attachmentListConfig = {
    template: template,
    data:{},
    actions:{
        deleteItem:function (item) {
            HTTP.postImmediately('/delete_attachment/',{
                file_ids:JSON.stringify([item['file_id']]),
                dinput_type:this.data.dinput_type
            })
        },
        viewItem:function (item) {
            let ele = $('<img>');
            ele.attr('src','/download_attachment/?file_id='+item.file_id+'&download=0&dinput_type='+this.data.dinput_type);
            this.el.find('.preview-anchor').append(ele);
        }
    },
    afterRender:function () {
        HTTP.postImmediately('/query_attachment_list/',{
            file_ids:JSON.stringify(this.data.fileIds),
            dinput_type:this.data.dinput_type
        }).then(res=>{
            //MOCK
            res = {rows:
                [{file_name: "dd6786b56762f1257060e2956bf1c825_r.jpg", file_id: "59892726d8e9e4794d2205d2", content_type: "image/jpeg"},
                    {file_name: "223a8dc1ca7fec6894211030f5d1cd1b_r.jpg", file_id: "5989272cd8e9e479522205d1", content_type: "image/jpeg"},
                    {file_name: "223a8dc1ca7fec6894211030f5d1cd1b_c.jpg", file_id: "5989272cd8e9e479522205d1", content_type: "image/jpeg"}],
                success: 1,
                error: ""};
            //!MOCK
            if(res.success){
                let t = this;
                this.data['attachmentList'] = res.rows;
                for(let row of res.rows){
                    row['dinput_type']=this.data.dinput_type;
                    row['callback'] = this.actions.deleteItem;
                    let ele = $('<tr></tr>');
                    let fileTd = $('<td></td>');
                    fileTd.text(row.file_name);
                    ele.append(fileTd);
                    let controlersTd = $('<td></td>');
                    let downloadCon = $('<a>下载</a>');
                    downloadCon.attr('href','/download_attachment/?file_id='+row.file_id+'&download=1&dinput_type='+this.data.dinput_type);
                    controlersTd.append(downloadCon);
                    let viewCon = $('<a>预览</a>');
                    controlersTd.append(viewCon);
                    viewCon.on('click',function () {
                        t.actions.viewItem(row);
                    });
                    let deleteCon = $('<a>删除</a>');
                    controlersTd.append(deleteCon);
                    deleteCon.on('click',function () {
                        t.actions.deleteItem(row);
                        ele.remove();
                    })
                    ele.append(controlersTd);
                    row['element']=ele;
                    this.el.find('.attachment-list').append(ele);
                }
            }
        })
    }
}

// export default class AttachmentList extends Component {
//     constructor(data){
//         config.data = _.defaultsDeep(data,config.data);
//         super(config);
//     }
// }
