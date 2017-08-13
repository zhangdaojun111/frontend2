import alertConfig from '../components/util/alert/alert';
import confirmConfig from '../components/util/confirm/confirm';
import {PMAPI, PMENUM} from './postmsg';
export default {

    alert: function(msg) {
        let config = _.defaultsDeep({}, alertConfig);
        config.data.text = msg;
        return PMAPI.openDialogByComponent(config, {
            width: 300,
            height: 170,
            title: '提示',
            modal: true
        });
    },

    confirm: function(msg) {
        let resolveFunc;
        let promise = new Promise((resolve) => {
            resolveFunc = resolve;
        });
        let config = _.defaultsDeep({}, confirmConfig);
        config.data.text = msg;
        PMAPI.openDialogByComponent(config, {
            width: 300,
            height: 170,
            title: '提示',
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
    
    showTips: function (msg) {
        return this.alert(msg);
    }
}