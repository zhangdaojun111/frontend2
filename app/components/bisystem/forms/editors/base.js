import Component from '../../../../lib/component';
import {Text} from '../form/text/text';
import {Select} from '../form/select/select';
import {AutoComplete} from '../form/autocomplete/autocomplete';
import {Radio} from '../form/radio/radio';
import {Checkbox} from '../form/checkbox/checkbox';
import {Choosed} from '../form/choosed/choosed';
import {Save} from '../form/save/save';
import {TableSingle} from '../form/single/single';
import {Deep} from '../form/deep/deep';
import {YaXis} from '../form/linebar.yAxis/yAxis';

let formItemTypes = {
    'text': Text,
    'select': Select,
    'autocomplete': AutoComplete,
    'radio': Radio,
    'checkbox': Checkbox,
    'choosed':Choosed,
    'save': Save,
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
                required: item.required
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

    reset(chart) {
        this.data.chart_id = chart.id ? chart.id : null;
        this.data.id = chart.id ? chart.id : null;
        this.data.chart = null;
    }
}
export {Base}