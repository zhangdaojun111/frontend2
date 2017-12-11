/**
 * Created by birdyy on 2017/9/5.
 * y轴字段，图表类型添加
 */
import {Base} from '../../base';
import {AutoComplete} from '../../autocomplete/autocomplete';
import {Select} from '../../select/select';
import {Text} from '../../text/text';
import template from './y.html'
let config = {
    template: template,
    data: {
        value: {
            field: {},
            type: {},
        }
    },
    actions: {},
    binds: [
        {
            event: 'click',
            selector: '.add-y-btn',
            callback: function (context) {
                this.trigger('onAddY', this.componentId);
            }
        },
        {
            event: 'click',
            selector: '.remove-y-btn',
            callback: function (context) {
                this.trigger('onRemoveY', this.componentId);
                this.destroySelf();
            }
        }
    ],
    afterRender(){
        this.field = new AutoComplete({},{
            onSelect: (value)=> {
                this.data.value.field = value;
                this.trigger('onSelectY',value);
            }
        });
        let typeConfig = {
            value: 'line',
            list: [
                {'value': 'line', 'name': '折线图'},
                {'value': 'bar', 'name': '柱状图'},
            ]
        };
        this.data.value.type = {name: "折线图", type:"line"};
        this.type = new Select(typeConfig, {
            onChange: (value) => {
                this.data.value.type = value === 'line' ? {name: "折线图", type:"line"} : {name: "柱状图", type:"bar"};
                this.trigger('onSetBG', value);
            }
        });
        this.group = new Text({placeholder: '分组名称'},{
            onChange:(value) => {
                this.data.value.group = value ? value : 0;
            }
        });
        this.append(this.field, this.el.find(".form-chart-y-columns"));
        this.append(this.type, this.el.find(".form-chart-y-columns"));
        this.append(this.group, this.el.find('.form-chart-y-columns'));
    }
};

class Y extends Base {
    constructor(extendConfig){
        super($.extend(true,{},config,extendConfig))
    }

    /**
     * 获取y数据
     */
    getYData() {
        this.data.value.group = this.group.data.value ? this.group.data.value : 0;
        return this.data.value;
    }
}

export {Y}
Y.config = config;