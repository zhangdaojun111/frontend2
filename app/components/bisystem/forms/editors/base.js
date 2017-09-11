import Component from '../../../../lib/component';
import {Text} from '../form/text/text';
import {Select} from '../form/select/select';
import {AutoComplete} from '../form/autocomplete/autocomplete';
import {Radio} from '../form/radio/radio';
import {Checkbox} from '../form/checkbox/checkbox';
import {Choosed} from '../form/choosed/choosed';
import {Button} from '../form/button/button';
import {TableSingle} from '../form/single/single';
import {Deep} from '../form/deep/deep';
import {YaXis} from '../form/linebar.yAxis/yAxis';
import msgbox from "../../../../lib/msgbox";
import {ChartFormService} from '../../../../services/bisystem/chart.form.service';
import Mediator from '../../../../lib/mediator';

let formItemTypes = {
    'text': Text,
    'select': Select,
    'autocomplete': AutoComplete,
    'radio': Radio,
    'checkbox': Checkbox,
    'choosed':Choosed,
    'button': Button,
    'table_single': TableSingle,
    'deep': Deep,
    'yAxis': YaXis
}

class Base extends Component {
    constructor(config, data, event){
        super(config, data, event);
    }
    drawForm(container){
        let options = this.data.options;
        this.formItems = {};
        options.forEach((item) => {
            let clazz = formItemTypes[item.type];
            let instance = new clazz({
                value: item.defaultValue,
                label: item.label,
                name: item.name,
                list: item.list,
                class: item.class,
                rules: item.rules,
                placeholder: item.placeholder,
                required: item.required,
                category: item.category, // 用于input输入框类型 number text
            }, item.events);
            this.append(instance, this.el.find(container ? container : '.form-group'));
            this.formItems[item.name] = instance;
        });
    }
    /**
     * 获取所有字段数据
     */
    getData(){
        let chart = {};
        if (this.formItems) {
            Object.keys(this.formItems).map(name =>{
                chart[name] = this.formItems[name].getValue();
            })
        }

        return chart;
    }

    fillData(){}

    /**
     * 传送图表数据
     */
    async save(chart){
        let res = await ChartFormService.saveChart(JSON.stringify(chart));
        if (res['success'] == 1) {
            msgbox.alert('保存成功');
            if (!chart['chartName']['id']) {
                this.reload();
            };
            Mediator.publish('bi:aside:update',{type: chart['chartName']['id'] ? 'update' :'new', data:res['data']})
        } else {
            msgbox.alert(res['error'])
        };
    }

    reset(chart) {
        this.data.chart_id = chart.id ? chart.id : null;
        this.data.id = chart.id ? chart.id : null;
        this.data.chart = null;
    }
}
export {Base}