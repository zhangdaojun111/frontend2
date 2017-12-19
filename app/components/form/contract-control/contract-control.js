/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import Component from "../../../lib/component";
import template from './contract-control.html';
import {PMAPI} from "../../../lib/postmsg";
import Mediator from '../../../lib/mediator';
import {HTTP} from "../../../lib/http";
import './contract-control.scss'
import {Storage} from '../../../lib/storage';

let config = {
    template:template,
    data: {
        historyList:[],
    },
    binds:[
        {
            event:'click',
            selector:'.contract-view',
            callback:function () {
                if(!this.data.isAdd) {
                    this.data['mode'] = 'view';
                    this.actions.openEditor('合同模板预览');
                }
            }
        },{
            event:'click',
            selector:'.contract-edit',
            callback:function () {
                this.data['mode']='edit';
                this.actions.openEditor('合同编辑');
            }
        }
    ],
    actions:{
        openEditor:function(title){
            // let contractConfig = _.defaultsDeep({data:this.data},contractEditorConfig);
            PMAPI.openDialogByIframe(`/iframe/contractEditor/`, {
                width: 1400,
                height: 810,
                title: title,
                modal: true,
            }, {data:this.data}).then(res => {
                // if(res.changeBtn) {
                //     Mediator.emit('contract:change:btn', {
                //         changeBtn: res.changeBtn
                //     });
                // }
                if(res.onlyclose){
                    if((new URL(document.URL)).searchParams!=undefined){
                        Storage.init((new URL(document.URL)).searchParams.get('key'));
                    } else {
                        let params = (new URL(document.URL)).search.split("&");
                        params.forEach((param)=>{
                            if(param.indexOf('key')!=-1){
                                Storage.init(param.replace('key=',''));
                            }
                        })
                    }
                    let obj = Storage.getItem('contractCache-'+this.data.id,Storage.SECTION.FORM);
                    if(obj == undefined){
                        return;
                    }
                    for (let data of obj) {
                        delete data['content'];
                        delete data['mode'];
                    }
                    this.data.value = obj;
                } else {
                    this.data.value = res;
                }
                this.trigger('changeValue',this.data);
            })

        },
        // getHistoryModel: function (json) {
        //     return HTTP.postImmediately('/customize/rzrk/show_lastest_history/', json);
        // }

    },

    afterRender:function () {
        if(this.data['is_view']){
            this.el.find('.contract-edit').css('display','none');
        }
        if(this.data.isAdd) {
            this.el.find('.contract-view').eq(0).css({'color':'#999999'});
        }
        // let obj = {
        //     dfield: this.data.dfield,
        //     table_id: this.data.table_id
        // }
        // this.actions.getHistoryModel(obj).then(res=> {
        //     for(let item of res.data) {
        //         for(let i in item) {
        //             let json = {}
        //             json['id'] = i;
        //             json['name'] = item[i].substring(0,item[i].length-5)
        //             this.data.historyList.push(json)
        //         }
        //     }
        // })

    }
}
let ContractControl = Component.extend(config)
export default ContractControl