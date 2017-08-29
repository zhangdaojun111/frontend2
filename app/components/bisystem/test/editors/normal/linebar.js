import {Base} from '../base';
import template from './linebar.html';

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
            }
        ]
    }
}

class LineBarEditor extends Base {

    constructor() {
        super(config);
    }

}

export {LineBarEditor}