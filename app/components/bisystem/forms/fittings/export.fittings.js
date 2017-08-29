/**
 * Created by birdyy on 2017/8/15.
 * 导出fittings
 */
import {InputComponent} from './input/input';
import {RadioComponent} from './radio/radio';
import {SelectComponent} from './select/select';
import {CheckboxComponent} from './checkbox/checkbox';
import {AutoCompleteComponent} from './autocomplete/autocomplete';
import {AutoCompleteComponent1} from './autocomplete1/autocomplete';

export const fittings = {
    input: InputComponent,
    radio: RadioComponent,
    select: SelectComponent,
    checkbox: CheckboxComponent,
    autoComplete: AutoCompleteComponent,
    autocomplete1: AutoCompleteComponent1,
};

/**
 * 实例化配配件
 * @param option = {
 *  data: 实例化初始数据
 *  type: 实例化那种配件
 *  me: 实例化组件父组件
 *  container: 实例化组件容器
 * }
 */
let instanceFitting = (option) => {
    let component;
    if (option.data) {
        component = new fittings[option.type](option.data);
    } else {
        component = new fittings[option.type]()
    };
    option.me.append(component, option.me.el.find(`.${option.container ? option.container : 'chart-form'}`));
    return component
};
export {instanceFitting}

/**
 * 组合fitting
 * @param fields[] 命名字段 eg:[{name: search, option: instanceFitting配置参数}]
 */
let groupFitting = (fields = []) => {
    let fittings = {};
    fields.map(field => {
        fittings[field.name] = instanceFitting(field.option);
    });
    return fittings;
}

export {groupFitting};
