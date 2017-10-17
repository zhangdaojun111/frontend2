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
        openSettingDialog() {
            let choosedData = _.defaultsDeep({}, this.data.value);
            delete choosedData['-1'];
            popupSetting.data.choosedData = choosedData;

            PMAPI.openDialogByComponent(popupSetting, {
                width: 800,
                height: 600,
                title: this.data.label
            }).then((data) => {
                if (!data.onlyclose) {
                    let choosedData = data.choosedData;
                    this.actions.onSettingDataReturn(choosedData);
                }
            });
        },
        onSettingDataReturn(choosedData) {
            choosedData['-1'] = choosedData['-1'].join('\n');
            this.data.value = choosedData;
            this.events.changeValue(this.data);
            this.actions.fillData();
        },
        fillData() {
            this.el.find('textarea').val(this.data.value['-1'] || '');
        },
        //周期规则默认值填充
        loadSettingtextarea(data){

        },
    },
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data);
            }
        },
        {
            event: 'click',
            selector: '.button',
            callback: function(){
                this.actions.openSettingDialog();
            }
        }
    ],
    afterRender() {
        this.el.find('.ui-width').attr('title', this.data.value[-1]);
        this.el.find('.ui-width').css('width',this.data.width);
        this.actions.fillData();
        // this.actions.openSettingDialog();
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        this.el.find('.button').button({
            // disabled: true
        });
    },
    beforeDestory() {
        this.el.off();
    }
}

class SettingTextareaControl extends Component {
    constructor(data,events) {
        super(config, data,events);
    }
}

export default SettingTextareaControl;
