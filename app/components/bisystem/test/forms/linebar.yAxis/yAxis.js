/**
 * Created by birdyy on 2017/9/1.
 * 折线柱状图y轴
 */

import template from './yAxis.html';
import './yAxis.scss';
import {Base} from '../base';
import {Y} from './y/y';

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
                }
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
            Object.keys(this.data.yAxis).forEach(key => {
                this.data.yAxis[key].field.setList(data);
            });
            this.trigger('onUpdate')
        }
    },
    binds: [],
    afterRender(){
        this.actions.addY();
    }
}

class YaXis extends Base {
    constructor(data, event) {
        super(config, data, event)
    }

    /**
     * 获取y轴字段数据
     */
    getYaxisData() {
        let data = [];
        Object.keys(this.data.yAxis).forEach(key => {
            data.push(Object.assign({
                areaStyle: 0,
                group: 0
            }, this.data.yAxis[key].getYData()));
        })
        return data;
    }

    /**
     * 设置y轴的值
     * @param yAxis = y轴数据
     */
    setValue(yAxis) {
        Object.keys(this.data.yAxis).forEach(key => {
            this.data.yAxis[key].destroySelf()
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
        })
    }


}

export {YaXis}