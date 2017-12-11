/**
 * Created by birdyy on 2017/9/1.
 * 折线柱状图y轴
 */

import template from './yAxis.html';
import './yAxis.scss';
import {Base} from '../base';
import {Y} from './y/y';
import {Checkbox} from '../checkbox/checkbox';

let config = {
    template: template,
    data: {
        yAxis: {}, //用来保存用+增加的y轴
        ySource: [], // y轴字段列表
    },
    actions: {
        /**
         * 添加y轴
         */
        addY(data = {}) {
            let y = new Y(data, {
                /**
                 * 增加y轴
                 * @param value
                 */
                onAddY: (value) => {
                    let y = this.actions.addY({first: true});
                    this.data.yAxis[y.componentId].field.setList(this.data.ySource);
                },
                /**
                 * 删除y轴
                 * @param componentId
                 */
                onRemoveY: (componentId) => {
                    delete this.data.yAxis[componentId];
                    this.trigger('onSelectY');
                },
                /**
                 * 当选择y轴字段触发onSelectY事件
                 * @param value = y轴字段
                 */
                onSelectY: (value) => {
                    this.trigger('onSelectY', value);
                },

                /**
                 * 判断是否可以显示折线图面积区域
                 * @param value = y轴字段类型(bar: 柱状图, line: 折线图)
                 */
                onSetBG: (value) => {
                    let areaStyle = this.data.areaStyle.el.find('input');
                    let checkBar;// 判断是否含有bar类型
                    for (let y of this.getYaxisData()) {
                        if (y.type['type'] === 'bar') {
                            checkBar = true;
                            break;
                        }
                    };
                    if(checkBar) {
                            this.data.areaStyle.data.value = [];
                            areaStyle.prop('checked', false);
                            areaStyle.prop('disabled', true);
                    } else {
                        areaStyle.prop('disabled', false);
                    };
                },
            });
            this.append(y, this.el.find('.form-chart-yAxis'));
            this.data.yAxis[y.componentId] = y;
            return y;
        },

        /**
         * 更新y轴数据源
         * @param data = 数据源列表
         */
        updateY(data) {
            this.data.ySource = data;
            Object.keys(this.data.yAxis).forEach((key,index) => {
                this.data.yAxis[key].field.setList(data);
            });
            this.trigger('onUpdate')
        },
        /**
         * 重置y轴字段
         */
        resetY() {
            Object.keys(this.data.yAxis).forEach((key,index)=>{
                this.data.yAxis[key].destroySelf();
                delete this.data.yAxis[key];
            });
            this.actions.addY();

        },
        /**
         * y轴设置
         */
        yMoreSetting() {
            this.data.label = new Checkbox({
                value: [],
                list: [
                    {
                        value:1, name: '显示折柱图值'
                    }
                ],
            });
            this.data.areaStyle = new Checkbox({
                value: [],
                list: [
                    {
                        value:1, name: '显示折线图面积区域<b style="color:red;">(只有Y轴全部为"折线图"时才可以勾选此项)</b>'
                    }
                ],
            },{
                onChange() {}
            });
            this.append(this.data.label, this.el.find('.yAxis-setting'));
            this.append(this.data.areaStyle, this.el.find('.yAxis-setting'));
        }
    },
    binds: [],
    afterRender(){
        this.actions.yMoreSetting();
        this.actions.addY();
    }
}

class YaXis extends Base {
    constructor(data, event,extendConfig) {
        super($.extend(true,{},config,extendConfig), data, event)
    }

    /**
     * 获取y轴字段数据
     */
    getYaxisData() {
        let data = [];
        Object.keys(this.data.yAxis).forEach(key => {
            data.push(Object.assign(
                {
                    label:this.data.label.data.value[0] ? 1: 0,
                    areaStyle:this.data.areaStyle.data.value[0] ? 1: 0
                },this.data.yAxis[key].getYData()))
        });
        return data;
    }

    /**
     * 设置y轴的值
     * @param yAxis = y轴数据
     */
    setValue(yAxis) {
        console.log()
        if (yAxis.length === 0) return false;

        Object.keys(this.data.yAxis).forEach(key => {
            this.data.yAxis[key].destroySelf();
            delete this.data.yAxis[key];
        });
        yAxis.forEach((item,index) => {
            let y = null;
            if (index == 0) {
                y = this.actions.addY();
            } else {
                y = this.actions.addY({first: true});
            };
            y.field.setValue(item['field']);
            y.type.setValue(item['type']['type']);
            y.group.setValue(item['group'] == 0 ? '' : item['group']);
        });
        this.data.areaStyle.setValue(!yAxis[0]['areaStyle'] || yAxis[0]['areaStyle'] == 0 ? 0: 1);
        this.data.label.setValue(!yAxis[0]['label'] || yAxis[0]['label'] == 0 ? 0: 1)
    }


}

export {YaXis}