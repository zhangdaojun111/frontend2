import Component from '../../../../lib/component';
import {Text} from '../forms/text/text';
import {Select} from '../forms/select/select';
import {AutoComplete} from '../forms/autocomplete/autocomplete';
import {Radio} from '../forms/radio/radio';
import {Checkbox} from '../forms/checkbox/checkbox';
import {Choosed} from '../forms/choosed/choosed';
import {Save} from '../forms/save/save';
import {TableSingle} from '../forms/single/single';
import {Deep} from '../forms/deep/deep';

let formItemTypes = {
    'text': Text,
    'select': Select,
    'autocomplete': AutoComplete,
    'radio': Radio,
    'checkbox': Checkbox,
    'choosed':Choosed,
    'save': Save,
    'table_single': TableSingle,
    'deep': Deep
}

class Base extends Component {
    constructor(config, data, event){
        super(config, data, event);
    }
    drawForm(){
        let options = this.data.options;
        this.formItems = {};
        options.forEach((item) => {
            let clazz = formItemTypes[item.type];
            let instance = new clazz({
                value: item.defaultValue,
                label: item.label,
                name: item.name,
                deeps: item.deeps,
                list: item.list,
            }, item.events);
            this.append(instance, this.el.find('.form-group'));
            this.formItems[item.name] = instance;
        });
    }

    /**
     * 获取所有字段数据
     */
    getData(){
        let chart = {}
        Object.keys(this.formItems).map(name =>{
           chart[name] = this.formItems[name].getValue();
        })
        return chart;
    }
    fillData(){}

    reset(chart) {
        this.data.chart_id = chart.id ? chart.id : null;
    }
}
export {Base}