/**
 * Created by birdyy on 2017/8/30.
 * 数据源画布
 */
import Component from '../../../../../../../lib/component';
import template from './original.data.html';
import groupTemplate from './original.linebar.group.data.html';
import './original.data.scss';
import handlebars from 'handlebars';
import {canvasCellService} from '../../../../../../../services/bisystem/canvas.cell.service';
import msgbox from '../../../../../../../lib/msgbox';

// 自定义original_each_yAxis helper
handlebars.registerHelper('original_each_yAxis', function(data,index, options) {
    return data[index];
});

// 自定义original_data_title helper
handlebars.registerHelper('original_data_title', function(index, options) {
    return index;
    // return data['field'] ? data['field']['name'] : data['name'];
});

let config = {
    template: template,
    actions: {
        /**
         * 获取原始数据改变的数据
         */
        getChangeData() {
            let [isEmptyY,isEmptyX] = [true,true];
            return  {
                attribute: this.data.cellChart.cell.attribute.map(item =>{
                        if (item.selected) {
                            isEmptyY = false;
                        }
                        return JSON.stringify({selected: item.selected})
                }),
                select: this.data.cellChart.cell.select.map(item => {
                    if (item.select) {
                        isEmptyX = false
                    }
                    return JSON.stringify(item);
                }),
                isEmptyY: isEmptyY,
                isEmptyX: isEmptyX,
            };
        },

        /**
         * 当下穿数据时更新数据
         */
        updateOriginal(data) {
            let originalData = CanvasOriginalDataComponent.handleOriginalData(data);
            this.data = originalData;
            this.reload();
        }
    },
    data: {
        selectAllX: true,
        floor:0,
        xAxis: []
    },
    binds:[
        { // 点击关闭原始数据
            event:'click',
            selector:'.bi-origin-data-close',
            callback:function () {
                let data = this.actions.getChangeData();
                let originalData = {
                    view_id: this.data.viewId,
                    floor: this.data.floor,
                    layout_id: this.data.cellChart.cell.layout_id,
                    chart_id: this.data.cellChart.cell.chart_id,
                    xAxis:this.data.xAxis,
                    select: data.select,
                    attribute: data.attribute
                };
                if (data.isEmptyY || data.isEmptyX) {
                    msgbox.alert('至少选择一条x轴和y轴数据')
                } else {
                    canvasCellService.saveOriginalData(originalData).then(res => {
                        if (res['success'] !== 1) {
                            msgbox.showTips(res['error']);
                        } else {

                            this.trigger('onUpdateOriginal', originalData);
                        };
                        this.destroySelf();
                    });
                }
            }
        },
        { // 点击下穿原始数据
            event:'click',
            selector:'.tr-body a',
            callback:function (context) {
                let name = $(context).text();
                this.trigger('onUpdateDeepOriginal', name);
            }
        },
        {// 选择y轴字段
            event:'change',
            selector:'.selectY input',
            callback:function (context) {
                let checked = $(context).is(':checked');
                let index = parseInt($(context).closest('th').attr('data-y-index'));
                if (checked) {
                    this.data.cellChart.cell.attribute[index].selected = true;
                } else {
                    this.data.cellChart.cell.attribute[index].selected = false;
                }
            }
        },
        { // 选择所有x轴字段
            event:'change',
            selector:'.selectAllX input',
            callback:function (context) {
                let checked = $(context).is(':checked');
                if (checked) {
                    this.el.find(".tr-body input").prop('checked', true);
                    this.data.cellChart.cell.select.map(item => {
                        return item.select = true;
                    });
                } else {
                    this.el.find(".tr-body input").prop('checked', false);
                    this.data.cellChart.cell.select.map(item => {
                        return item.select = false;
                    });
                }
            }
        },
        { // 选择单个x轴字段
            event:'change',
            selector:'.tr-body input',
            callback:function (context) {
                let checked = $(context).is(':checked');
                let index = $(context).closest('tr').index();
                if (!checked) {
                    $('.selectAllX input').prop('checked', false);
                    this.data.cellChart.cell.select[index].select = false;
                }else {
                    this.data.cellChart.cell.select[index].select = true;
                    let selectAll = true;
                    for (let checkbox of [...this.el.find(".tr-body input")]) {
                        if (!$(checkbox).is(':checked')) {
                            selectAll = false;
                            break;
                        }
                    }
                    if (selectAll) {
                        $('.selectAllX input').prop('checked', true);
                    };
                }
            }
        },
    ],
    afterRender() {
    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasOriginalDataComponent extends Component {
    constructor(data,events) {
        let originalData = CanvasOriginalDataComponent.handleOriginalData(data);
        config.template = originalData.template ? originalData.template : template;
        super(config,originalData,events);
    }

    /**
     * 处理初始化数据 用于组装需要的数据格式
     * @param originalData = 初始化data传递过来的参数
     */
    static handleOriginalData(originalData) {
        let data = _.cloneDeep(originalData);
        if (data.cellChart.chart.assortment === 'normal') {
            CanvasOriginalDataComponent.handleLineBarOriginalData(data)
        } else {
            CanvasOriginalDataComponent.handlePieOriginalData(data)
        }
        return data;
    }

    /**
     * 处理折线柱状图的原始数据
     */
    static handleLineBarOriginalData(data) {
        console.log('xxxxxxxxxxxxxxxxxxx');
        console.log(data);

        //　如果是分组　使用分组模版
        if (data.cellChart.chart.chartGroup['id']) {
            data.template = groupTemplate
        };
        // 如果select有数据就用select的数据 select = xAxis
        if (data.cellChart.cell.select.length  === 0) {
            data.cellChart.cell.select = data.cellChart.chart.data.xAxis.map(name => {
                return {'name': name, 'select': true}
            });
        } else {
            data.cellChart.cell.select = data.cellChart.cell.select.map(item => {
                let value = JSON.parse(item);
                if (!value.select) {
                    data.selectAllX = false;
                };
                return value;
            });
        }
        // 如果attribute有数据就用attribute的数据 attribute = yAxis
        if (data.cellChart.cell.attribute.length === 0) {
            data.cellChart.cell.attribute = data.cellChart.chart.yAxis.map(item => {
                return {'selected': true, 'name': item.field.name}
            });
        } else {
            let attribute = data.cellChart.chart.yAxis.map((item,index) => {
                let selected = data.cellChart.cell.attribute[index];
                return {'selected':JSON.parse(selected).selected, 'name': item.field.name}
            });
            data.cellChart.cell.attribute = attribute;
        };
    }

    /**
     * 处理饼图图的原始数据
     */
    static handlePieOriginalData(data) {
        // 如果select有数据就用select的数据 select = xAxis
        if (data.cellChart.cell.select.length  === 0) {
            data.cellChart.cell.select = data.cellChart.chart.data.xAxis.map(name => {
                return {'name': name, 'select': true}
            });
        } else {
            data.cellChart.cell.select = data.cellChart.cell.select.map(item => {
                console.log(item);
                let value = JSON.parse(item);
                if (!value.select) {
                    data.selectAllX = false;
                };
                return value;
            });
        };
        //如果attribute有数据就用attribute的数据 attribute = yAxis
        data.cellChart.cell.attribute = [{'selected': true, 'name': data.cellChart.chart.pieType.value === 1 ? data.cellChart.chart.xAxis.name : data.cellChart.chart.yAxis.name}];
    }
}