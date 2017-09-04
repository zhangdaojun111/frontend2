import alertConfig from '../components/util/alert/alert';
import confirmConfig from '../components/util/confirm/confirm';
import {Tips} from '../components/util/tips/tips';
import {PMAPI, PMENUM} from './postmsg';


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

    _showTips: function (msg) {
        Tips.showMessage(msg)
    }
}