import Component from "../../../../lib/component";
import template from './data-table-import.html';
import './data-table-import.scss';
import msgBox from '../../../../lib/msgbox';
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
        formId: '',
        fileData: {},
        //是否更多
        needMore: false
    },
    actions: {
        prepareWorkflowData: function () {
            FormService.getPrepareParmas({table_id: this.data.tableId}).then( res=>{
                let workflow = this.el.find( '.workflow' );
                if( this.data.workflowList.length != 0 ){
                    this.data.formId = res.data.form_id;
                    this.data.workflowList = res.data.flow_data;
                    let html = '';
                    for( let d of this.data.workflowList ){
                        html+= '<option value='+ d.flow_id + '>' + d.flow_name + '</option>'
                    }
                    let choose = this.el.find( '.chooseFlow' )
                    choose[0].innerHTML = html;
                    choose[0].value = this.data.workflowList[0]['flow_id'];
                    workflow[0].style.display = 'inherit';
                    workflow[1].style.display = 'inherit';
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
        },
        //执行导入
        import: function () {
            let i = 0;
            for( let f in this.data.fileData ){
                i++;
            }
            if( i == 0 ){
                msgBox.alert( '请选择导入文件！' );
                return;
            }
            let json = {};
            json = {
                file:'upload_file',
                table_id: this.data.tableId,
                parent_table_id: this.data.parentTableId,
                parent_real_id: this.data.parentRealId,
                parent_temp_id: this.data.parentTempId,
                is_batch: this.data.isBatch,
                flow_id: this.data.flowId
            }
            if( this.data.needMore ){
                json['has_create_user'] = this.el.find( '.has_create_user' )[0].value;
                json['unique_check'] = this.el.find( '.unique_check' )[0].value;
                json['use_increment_data'] = this.el.find( '.use_increment_data' )[0].value;
                json['use_default_value'] = this.el.find( '.use_default_value' )[0].value;
            }
            this.uploader.appendData( json )

            this.uploader.upload('/upload_data/',{},(event)=>{
                console.log('name:'+event.name+',code:'+event.code);
                console.log(' position:'+(event.loaded||event.position) +",total:"+event.total);
            })
        },
        //加载更多
        addMore: function () {
            this.data.needMore = !this.data.needMore;
            let more = this.el.find( '.need-more' );
            for( let m of more ){
                m.style.display = this.data.needMore?'inherit':'none';
            }
        }
    },
    afterRender: function (){
        if( !this.data.isBatch ){
            this.actions.prepareWorkflowData();
        }
        //上传初始化
        this.uploader = new Uploader();
        this.el.on( 'click','.uploader-button',()=>{
            //上传文件
            this.uploader.addFile( this.data.key ).then(res=>{
                this.data.fileData = res;
                console.log( "_____________" )
                console.log( "_____________" )
                console.log( this.data.fileData )
            });
        } )
        this.el.on( 'click','.import-submit-btn',()=>{
            this.actions.import();
        } )
        this.el.on( 'click','.more-btn',()=>{
            this.actions.addMore();
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