import {Base} from '../base';
import template from './table.html';
import './table.scss';

import {chartName, source,theme,icon} from '../form.chart.common';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../../lib/msgbox";


let config = {
    template: template,
    actions: {

        /**
         * 加载x 和y轴数据
         * @param data 选中的数据源
         */
        async getFields(data) {
            let table = data[0] ? data[0] : null;
            if (table) {
                let res = await ChartFormService.getChartField(table.id);
                if (res['success'] === 1){
                    this.actions.loadColumns(res['data']['x_field']);
                } else {
                    msgbox.alert(res['error'])
                }
            } else {
                this.actions.loadColumns(table);
            }

        },

        /**
         * 渲染列名字段列表（x轴）
         * @param columns 表格列表字段（x轴）
         */
        async loadColumns(columns) {
            if (columns) {
                this.formItems['columns'].setJsonList(columns);
                this.formItems['sortColumns'].setList(columns);
            } else { // 清空字段
                this.formItems['columns'].actions.clear();
                this.formItems['sortColumns'].setList([]);
            }
        },

        /**
         * 初始化操作
         */
       async init() {
           // 绑定数据源onSelect选择事件
            this.formItems['source'].data.onSelect = this.actions.getFields;
            this.formItems['source'].reload();

           // 获取数据来源
            ChartFormService.getChartSource().then(res => {
                if (res['success'] === 1) {
                    this.formItems['source'].setList(res['data']);
                } else {
                    msgbox.alert(res['error'])
                };
            });

            // 获取图标
            ChartFormService.getChartIcon().then(res => {
                if (res['success'] === 1) {
                    let icons =[];
                    icons = res['data'].map(icon => {
                        return {value: icon, name: `<img src=/bi/download_icon/?file_id=${icon} />`}
                    });
                    this.formItems['icon'].setList(icons)
                } else {
                    msgbox.alert(res['error'])
                };
            })
        }
    },
    data: {
        options: [
            chartName,
            source,
            theme,
            icon,
            {
                label: '请选择列名',
                name: 'columns',
                defaultValue: '',
                list: [],
                type: 'checkbox'
            },
            {
                label: '已选择列名',
                name: 'choosed',
                defaultValue: '',
                list: [],
                type: 'choosed'
            },
            {
                label: '默认排序',
                name: 'sort',
                defaultValue: '',
                list: [
                    {value: '1',name: '升序'},
                    {value: '-1', name:'降序'}
                ],
                type: 'radio'
            },
            {
                label: '选择排序字段(非必选)',
                name: 'sortColumns',
                defaultValue: '',
                type: 'autocomplete'
            },
            {
                label: '表格文字对齐方式',
                name: 'alignment',
                defaultValue: '',
                list: [
                    {'value': 'left', 'name': '居左'},
                    {'value': 'center', 'name': '居中'},
                    {'value': 'right', 'name': '居右'},
                ],
                type: 'select'
            },
            {
                label: '请输入显示多少多少列(默认10条)',
                name: 'countNum',
                defaultValue: 10,
                type: 'text'
            },
            {
                label: '',
                name: 'single',
                defaultValue: '',
                list: [
                    {
                        value:1, name: '是否显示为单行'
                    }
                ],
                type: 'checkbox'
            },
        ]
    },
    afterRender() {
        // 渲染图表表单字段
        this.drawForm();
        this.actions.init();
    }
}

class TableEditor extends Base {
    constructor() {
        super(config);
    }
}

export {TableEditor}