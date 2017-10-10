import alertConfig from '../components/util/alert/alert';
import confirmConfig from '../components/util/confirm/confirm';
import {Tips} from '../components/util/tips/tips';
import {PMAPI, PMENUM} from './postmsg';
import {progressConfig} from "../components/util/progresses/progresses";
import {Loading} from "../components/util/loading/loading"


export default {

    alert: function(msg) {
        let config = _.defaultsDeep({}, alertConfig);
        config.data.text = encodeURIComponent(msg);
        return PMAPI.openDialogByComponent(config, {
            width: 400,
            title: '提示',
            maxable: false,
            modal: true
        });
    },

    confirm: function(msg) {
        let resolveFunc;
        let promise = new Promise((resolve) => {
            resolveFunc = resolve;
        });
        let config = _.defaultsDeep({}, confirmConfig);
        config.data.text = encodeURIComponent(msg);
        PMAPI.openDialogByComponent(config, {
            width: 400,
            title: '提示',
            maxable: false,
            modal: true
        }).then((data) => {
            if (data.onlyclose === true) {
                resolveFunc(false);
            } else {
                resolveFunc(data.res);
            }
        });
        return promise;
    },

    /**
     *  后期会改进为5秒关闭
     */
    showTips: function (msg) {
        PMAPI.sendToParent({
            type: PMENUM.show_tips,
            data: msg
        });
        // return this.alert(msg);
    },
    showLoadingSelf:function () {
        PMAPI.sendToSelf({
            type: PMENUM.show_loading
        });
    },
    showLoadingRoot:function () {
        PMAPI.sendToParent({
            type: PMENUM.show_loading
        });
    },
    hideLoadingSelf:function () {
        PMAPI.sendToSelf({
            type: PMENUM.hide_loading
        });
    },
    hideLoadingRoot:function () {
        PMAPI.sendToParent({
            type: PMENUM.hide_loading
        });
    },

    _showTips: function (msg) {
        Tips.showMessage(msg)
    },
    _showLoading:function () {
        Loading.showLoading();
    },
    _hideLoading:function () {
        Loading.hideLoading();
    },
    /**
     * 显示进度条
     */
    showProgress: function (data) {
        let key = PMAPI._getKey();
        // let height = data.files.length*24+30;
        let height = 170;
        let width = 400; //410
        if(data.files.length == 0){
            return;
        }
        PMAPI.openDialogByComponentWithKey(_.defaultsDeep({},{data:data},progressConfig),key,{
            width:width,
            height:height,
            title:'查看上传进度'
        });

        return {
            /**
             * @param item 上传进度百分比数组[20,30,20]
             **/
            update:function (items) {
                PMAPI.sendToSelf({
                    type:PMENUM.send_data_to_dialog_component,
                    key:key,
                    data:{type:'update',msg:items}
                })
            },
            finish:function ({fileId:index}) {
                PMAPI.sendToSelf({
                    type:PMENUM.send_data_to_dialog_component,
                    key:key,
                    data:{type:'finish',msg:index}
                })
            },
            /**
             *
             * @param msgData {fileId:filename_time,msg:'....'}
             */
            showError:function (msgData) {
                PMAPI.sendToSelf({
                    type:PMENUM.send_data_to_dialog_component,
                    key:key,
                    data:{type:'error',msg:msgData}
                })
            }
        }
    },


}