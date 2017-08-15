import Component from "../../../../lib/component";
import template from './data-table-import.html';
import './data-table-import.scss';
import {Uploader} from "../../../../lib/uploader";
import {FormService} from "../../../../services/formService/formService";

let config = {
    template: template,
    data: {
        tableId: '',
        isAdmin: '',
        parentTableId: '',
        parentRealId: '',
        parentTempId: '',
        isBatch: 0,
        flowId: '',
        workflowList: [],
    },
    actions: {
        prepareWorkflowData: function () {
            FormService.getPrepareParmas({table_id: this.data.tableId}).then( res=>{
                console.log( "###########" )
                console.log( "###########" )
                console.log( res )
                let workflow = this.el.find( '.workflow' );
                if( res.data.form_id != 0 ){
                    this.data.flowId = res.data.form_id;
                    this.data.workflowList = res.data.flow_data;
                    let html = '';
                    for( let d of this.data.workflowList ){
                        html+= '<option value='+ d.flow_id + '>' + d.flow_name + '</option>'
                    }
                    this.el.find( '.chooseFlow' ).innerHTML = html;
                    this.el.find( '.chooseFlow' ).val( this.data.workflowList[0] )
                }else {
                    workflow[0].outerHTML = '';
                    workflow[1].outerHTML = '';
                }
                //执行脚本
                if( res["data"]["upload_exec_file_remark"] ){
                    this.el.find( '.uploadRemark' ).show();
                    this.el.find( '.uploadRemark-con' )[0].innerHTML = res["data"]["upload_exec_file_remark"];
                }
            } )
        }
    },
    afterRender: function (){
        console.log( "+++++++++" )
        console.log( this.data )
        this.actions.prepareWorkflowData();
        //上传初始化
        this.uploader = new Uploader();
        this.el.on( 'click','.uploader-button',()=>{
            //上传文件
            this.uploader.addFile('test1').then(res=>{
                temp = res;
                this.uploader.appendData({
                    md5:true,
                    per_size:0,
                    dinput_type:9,
                    content_type:true
                });
                //暂停传输
                // setTimeout(()=>{
                //     let codes = Object.keys(res);
                //     uploader.pause('test1',codes[0]);
                //     console.log('paused');
                //     state = 'paused,test1,'+codes[0];
                // },3000);
                this.uploader.upload('/upload_attachment/?is_image_type=0',{},(event)=>{
                    console.log('name:'+event.name+',code:'+event.code);
                    console.log(' position:'+(event.loaded||event.position) +",total:"+event.total);
                })
            });
        } )
    }
}

class dataTableImport extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default dataTableImport;