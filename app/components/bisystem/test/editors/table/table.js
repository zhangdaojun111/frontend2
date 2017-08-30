import {Base} from '../base';
import template from './table.html';

let config = {
    template: template,
    data: {
        options: [
            {
                label: '图表名称',
                name: 'table_name',
                defaultValue: '你好才华',
                type: 'text',
                events: {
                    onChange: function (value) {
                        this.formItems['copy_name'].setValue(value);
                    }
                }
            }, {
                label: '图表名称2',
                name: 'copy_name',
                defaultValue: '你好才华',
                type: 'text'
            },
            {
                label: '数据来源',
                name: 'source',
                defaultValue: '',
                type: 'autoselect'
            }
        ]
    },
    afterRender() {
        // 初始化渲染表单
        this.drawForm()
    }
}

class TableEditor extends Base {

    constructor() {
        super(config);
    }

}

export {TableEditor}