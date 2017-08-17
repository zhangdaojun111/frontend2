import Component from '../../../lib/component';
import template from './setting-textarea.html';
import './setting-textarea.scss';
import Mediator from '../../../lib/mediator';
import 'jquery-ui/ui/widgets/button';
import {PMAPI} from '../../../lib/postmsg';
import popupSetting from './popup/popup';

let config = {
    template: template,
    data: {
        value: {},
    },
    actions: {
        openSettingDialog: function () {
            let choosedData = _.defaultsDeep({}, this.data.value);
            delete choosedData['-1'];
            popupSetting.data.choosedData = choosedData;

            PMAPI.openDialogByComponent(popupSetting, {
                width: 800,
                height: 600,
                title: this.data.label
            }).then((data) => {
                let choosedData = data.choosedData;
                this.actions.onSettingDataReturn(choosedData);
            });
        },
        onSettingDataReturn: function (choosedData) {
            choosedData['-1'] = choosedData['-1'].join('\n');
            this.data.value = choosedData;
            Mediator.publish('form:changeValue:' + this.data.tableId, this.data);
            this.actions.fillData();
        },
        fillData: function () {
            this.el.find('textarea').val(this.data.value['-1'] || '');
        }
    },
    afterRender: function () {
        let _this=this;
        this.actions.fillData();
        this.el.find('.button').button({
            // disabled: true
        });
        this.el.on('click', '.button', () => {
            this.actions.openSettingDialog();
        })
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
        //周期规则默认值填充
        Mediator.subscribe('form:loadSettingtextarea:'+this.data.tableId,()=>{

        });
    },
    beforeDestory: function () {

    }
}

class SettingTextareaControl extends Component {
    constructor(data) {
        super(config, data);
    }
}

export default SettingTextareaControl;
