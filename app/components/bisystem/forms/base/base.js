/**
 * Created by birdyy on 2017/8/14.
 * title: chart组件基础配置
 * desc: 图表基础配置 eg:图表名称，数据来源，选择颜色，选中图表，高级查询...
 *       具体的配置通过base.config.js
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './base.html';
import {fittings} from './base.config';

let config = {
    template: template,
    data: {
        fittings: {}
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {
        this.renderFittings();
    }
}

export class FormBaseComponent extends BiBaseComponent {
    constructor() {
        super(config);
        this.groupFittings(fittings);
    }

    /**
     * 组装配件 from base.config,
     * fittings 通过base.config + 初始化data获取
     */
    groupFittings(fittings) {
        Object.keys(fittings).map(key => {
            this.data.fittings[key] = new fittings[key];
        });
    }

    /**
     * 渲染配件 fittings
     */
    renderFittings() {
        Object.values(this.data.fittings).map(fitting => {
            this.append(fitting,this.el.find('.base'))
        });
    }
}