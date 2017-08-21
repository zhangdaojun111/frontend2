import Component from '../../../lib/component';
import template from './setting-textarea.html';
import './setting-textarea.scss';
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
            this.events.changeValue(this.data);
            this.actions.fillData();
        },
        fillData: function () {
            this.el.find('textarea').val(this.data.value['-1'] || '');
        },
        //周期规则默认值填充
        loadSettingtextarea(data){

        },
    },
    afterRender: function () {
        let _this=this;
        this.el.find('.ui-width').css('width',this.data.width);
        this.actions.fillData();
        this.el.find('.button').button({
            // disabled: true
        });
        this.el.on('click', '.button', () => {
            this.actions.openSettingDialog();
        })
        this.el.on('click','.ui-history',_.debounce(function(){
           _this.events.emitHistory(_this.data)
        },300));
    },
    beforeDestory: function () {

    }
}

class SettingTextareaControl extends Component {
    constructor(data,events) {
        super(config, data,events);
    }
}

export default SettingTextareaControl;
