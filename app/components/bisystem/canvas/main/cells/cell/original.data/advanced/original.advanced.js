/**
 * Created by birdyy on 2017/9/18.
 * 数据源高级计算
 */
import Component from '../../../../../../../../lib/component';
import template from './original.advanced.html';
import handlebars from 'handlebars';
import msgbox from '../../../../../../../../lib/msgbox';

// 自定义高级计算content组合字段 helper
handlebars.registerHelper('original_advanced_group_name', function(name,data, options) {
    return name + data;
});

// 自定义高级计算模版 helper
handlebars.registerHelper('advanced_compute', function(data, options) {
    return JSON.stringify({'id': data.id, 'name': data.name});
});

let config = {
    template: template,
    actions: {
    },
    data: {
        id:0, //高级计算id 如果是编辑id有值 or 0
        name:'',  // 高级计算名字
        content: [], // 选中的高级计算字段列表,
        compute_model: null, //高级计算模版
    },
    binds:[
        {  //保存高级计算
            event:'click',
            selector:'.submit',
            callback:function () {
                let data = {
                    "id":this.data.id,
                    "chart_id":this.data.chartName.id,
                    "compute_model":this.data.compute_model,
                    "name":this.data.name,
                    "filter":JSON.stringify(this.data.chartGroup),
                    "content":this.data.content
                };
                if (!data.name) {
                    this.el.find('.advanced-name .error').show();
                    return false;
                } else if (data.content.length === 0) {
                    this.el.find('.advanced-values .error').show();
                    return false;
                };
                this.trigger('onSaveAdvancedData',data);
                return false;
            }
        },
        { //返回高级计算字段列表
            event:'click',
            selector:'.submit-area button:last-child',
            callback:function () {
                this.trigger('onBackAdvancedList');
            }
        },
        { //附加字段命名
            event:'input',
            selector:'input[type=text]',
            callback:function (context) {
                this.el.find('.advanced-name .error').hide();
                let val = $(context).val();
                this.data.name = val;
            }
        },
        { //附加字段模版
            event:'change',
            selector:'select',
            callback:function (context) {
                let val = $(context).val();
                this.data.compute_model = val;
            }
        },
        { //选择高级计算分组字段
            event:'change',
            selector:'input[type=checkbox]',
            callback:function (context) {
                this.el.find('.advanced-values .error').hide();
                let isChecked = $(context).is(':checked');
                let ename = $(context).val();
                if (isChecked) {
                    this.data.content.push(JSON.stringify({'ename':ename}));
                } else {
                    _.remove(this.data.content,function(item) {
                        return item.ename === ename
                    })
                }
            }
        },
    ],
    afterRender() {
        this.data.compute_model = JSON.stringify({
            'id': this.data.advancedDataTemplates[0].id, 'name': this.data.advancedDataTemplates[0].name
        });
    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasOriginalAdvancedComponent extends Component {
    constructor(data,events) {
        super(config,data,events);
    }
}