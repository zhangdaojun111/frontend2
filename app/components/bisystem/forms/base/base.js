/**
 * Created by birdyy on 2017/8/14.
 * title: chart组件基础配置
 * desc: 图表基础配置 eg:图表名称，数据来源，选择颜色，选中图表，高级查询...
 *       具体的配置通过base.config.js
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './base.html';

let config = {
    template: template,
    data: {},
    actions: {},
    afterRender() {}
}

export class FormBaseComponent extends BiBaseComponent {
    constructor() {
        super(config)
    }
}