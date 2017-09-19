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
import {CanvasOriginalAdvancedComponent} from './advanced/original.advanced';

// 自定义original_each_yAxis helper
handlebars.registerHelper('original_each_yAxis', function(data,index, options) {
    return data[index];
});

// 自定义original_data_title helper
handlebars.registerHelper('original_data_title', function(index, options) {
    return index;
    // return data['field'] ? data['field']['name'] : data['name'];
});

// 自定义分组original_data_title helper
handlebars.registerHelper('original_group_data', function(data, options) {
    return data ? data : '暂无数据';
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
            if (this.data.cellChart.chart.chartGroup && this.data.cellChart.chart.chartGroup['id']) { // 折柱图分组
                return  {
                    attribute: null,
                    select: this.data.cellChart.cell.select.map(item => {
                        if (item.select) {
                            isEmptyX = false
                        } else {
                            this.data.hideGroup.push(item);
                        }
                        return JSON.stringify({'ename':item.ename, 'selected': item.select});
                    }),
                    isEmptyX: isEmptyX,
                };

            } else {
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
            }
        },

        /**
         * 当下穿数据时更新数据
         */
        updateOriginal(data) {
            let originalData = CanvasOriginalDataComponent.handleOriginalData(data);
            this.data = originalData;
            this.reload();
        },

        /**
         * 新增高级字段
         */
        addAdvancedList(){
            let that = this;
            this.el.find('.add-advanced-list').click( function () {
                $(this).closest('.list').hide();
                let originForm = new CanvasOriginalAdvancedComponent();
                that.append(originForm,$(this).closest('.origin-data'));
            })
        }
    },
    data: {
        selectAllX: true,
        floor:0,
        xAxis: [],
        hideGroup: [], //需要隐藏的分组列表
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

                if (this.data.cellChart.chart.chartGroup && this.data.cellChart.chart.chartGroup['id']) {
                    if (data.isEmptyX) {
                        msgbox.alert('至少选择一条分组数据');
                        return false;
                    }
                } else {
                    if (data.isEmptyY || data.isEmptyX) {
                        msgbox.alert('至少选择一条x轴和y轴数据');
                        return false;
                    };
                };

                canvasCellService.saveOriginalData(originalData).then(res => {
                    if (res['success'] !== 1) {
                        msgbox.showTips(res['error']);
                    } else {
                        this.trigger('onUpdateOriginal', this.data.cellChart.chart.chartGroup && this.data.cellChart.chart.chartGroup['id'] ? {hideGroup:this.data.hideGroup,originalData: originalData}: originalData);
                    };
                    this.destroySelf();
                });
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
                };
                return false;
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
                    };
                    if (selectAll) {
                        $('.selectAllX input').prop('checked', true);
                    };
                }
            }
        },
        // { // 点击下穿排序
        //     event:'click',
        //     selector:'.selectY',
        //     callback:function (context) {
        //         let index = $(context).attr('data-y-index');
        //         alert(index);
        //         $(context).find('i').addClass('active').siblings('th').removeClass('active');
        //         return false;
        //     }
        // },
    ],
    afterRender() {
        //新增高级字段
        this.actions.addAdvancedList();

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
        //　如果是分组　使用分组模版
        if (data.cellChart.chart.chartGroup['id']) {
            CanvasOriginalDataComponent.handleLineBarGroupOriginalData(data)
            return false;
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
        };
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
     * 处理折线柱状图分组的原始数据
     */
    static handleLineBarGroupOriginalData(data) {
        data.template = groupTemplate;
        let groups = data.cellChart.chart.data.yAxis.map(item => item.ename); //已选择分组信息
        groups = Array.from(new Set(groups)).map(name => {
            return {ename: name, xAxis: data.cellChart.chart.data.xAxis, yAxis:[],select: true}
        });

        groups.forEach(item => {
            data.cellChart.chart.data.yAxis.forEach(y => {
                if (y.ename === item.ename) {
                    item['yAxis'].push(y)
                };
            })
        });

        // 如果select有数据就用select的数据 select = xAxis
        if (data.cellChart.cell.select.length > 0) {
            data.cellChart.cell.select.forEach((item,index) => {
                groups[index].select = JSON.parse(item).selected;
                if (!JSON.parse(item).selected) {
                    data.selectAllX = false;
                };
            })

        };

        data.cellChart.cell.select = groups;
        // 如果attribute有数据就用attribute的数据 attribute = yAxis
        data.cellChart.cell.attribute = data.cellChart.chart.yAxis.map(item => {
            return {'selected': true, 'name': item.field.name}
        });
        data.cellChart.cell.attribute.unshift({'selected': true, 'name': data.cellChart.chart.xAxis.name});
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
        if (data.cellChart.chart.pieType.value === 1) {
            data.cellChart.pieSingle = true;
        }
    }
}