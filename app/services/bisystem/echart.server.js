/**
 * Created by birdyy on 2017/8/1.
 * name echarts 服务渲染
 */
import * as echarts from 'echarts';
import {EchartsOption} from '../../components/bisystem/echarts.config/echarts.config';
import {ToolPlugin} from "../../components/bisystem/utils/tool.plugin";
import {HTTP} from '../../lib/http';

const defaultOption = {
    grid: {},
    xAxis : [],
    yAxis : [],
    series : []
};


export class EchartsService {
    constructor(cellChart) {
        let myChart = echarts.init(document.getElementById(cellChart['id']));
        let option = this.getEchartsOption(cellChart['cellChart']);
        this.myChart = myChart;
        myChart.setOption(option);
    }

    /**
     * 设置echarts option配置文件
     * @param chart = cellChart['chart']数据
     */
    getEchartsOption(cellChart) {
        const chartType = cellChart['chart']['assortment'] || '';
        let option = {};
        switch (chartType) {
            case 'pie':
                option = this.pieOption(cellChart);
                break;
            case 'multilist':
                option = this.multiChartOption(cellChart);
                break;
            case 'normal':
                option = this.lineBarOption(cellChart); // 折线柱状混合图
                break;
            case 'radar':
                option = this.radarOption(cellChart); // 折线柱状混合图
                break;
            case 'funnel':
                option = this.funnelOption(cellChart); // 折线柱状混合图
                break;
        }
        return option;
    }

    /**
     * 折线柱状图
     * @param chart = cellChart['chart']数据
     */
    lineBarOption(cellChart) {
        let cellOption = cellChart['chart'];
        if (cellOption.data['xAxis'].length === 0 || cellOption.data['yAxis'].length === 0 ) {
            return defaultOption;
        };
        // console.log(cellOption);
        // 组合图采用new_name，下穿图采用name
        const nameType = (cellOption.chartAssignment && cellOption.chartAssignment.val) === 1 ? 'new_name' : 'name';
        const [legend, series] = [[], []];
        const [xAxis, yAxis] = [cellOption.data['xAxis'], cellOption.data['yAxis']];
        const linebarOption = EchartsOption.getEchartsConfigOption('linebar');
        linebarOption['xAxis'][0]['data'] = xAxis;
        let firstMaxYnum = [];
        let firstMinYnum = [];
        let secondMaxYnum = [];
        let secondMinYnum = [];
        let firstMaxTextYnum = [];
        let secondMaxTextYnum = [];
        let maxXnum = [];
        let maxYTextNum; // y轴数字toSting().length最大字数

        yAxis.forEach(y => {
            legend.push(y[nameType]);
            let yTextNum = [];
            y['data'].forEach(val => {
                if (val) {
                    yTextNum.push(val.toString().length);
                }
            });
            let maxYTnum = Math.max.apply(null, yTextNum);
            let maxNumber = Math.max.apply(null, y['data']);
            let minNumber = Math.min.apply(null, y['data']);
            if (y['yAxisIndex'] === 1) {
                secondMaxYnum.push(maxNumber);
                secondMinYnum.push(minNumber);
                secondMaxTextYnum.push(maxYTnum);
            } else {
                firstMaxYnum.push(maxNumber);
                firstMinYnum.push(minNumber);
                firstMaxTextYnum.push(maxYTnum);
            };
            series.push({
                name: y[nameType],
                type: y['type'] && y['type']['type'],
                data: y['data'],
                barMaxWidth: '30%',
                barMinWidth: '5%',
                symbolSize: 4,
                originData: y['originData'], // 这里新增原始数据
                selected: y['selected'], // 这里新增原始数据是否被选中
                yAxisIndex: y['yAxisIndex'] === 1 ? 1 : 0,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            });
        });
        xAxis.forEach(x => {
            // let maxXn = Math.max.apply(null, x.toString().length);
            maxXnum.push(x.toString().length);
        });

        // 如果自定义了x轴展示
        if (cellOption['echartX'] && cellOption['echartX']['textNum'] !== 0) {
            if (cellOption['echartX'].hasOwnProperty('textNum')) {
                if (cellOption['yHorizontal']) {
                    linebarOption['grid']['left'] = cellOption['echartX']['marginBottom'];
                } else {
                    linebarOption['grid']['bottom'] = cellOption['echartX']['marginBottom'];
                }
                linebarOption['xAxis'][0]['axisLabel']['formatter'] = function(value) {
                    if (value === undefined || value === null) {
                        return value;
                    } else {
                        value = value.toString();
                        let markNum = 0
                        if (cellOption['echartX']['textNum'] !== 0) {
                            markNum = Math.ceil(value.length / cellOption['echartX']['textNum']);
                        } else {
                            markNum = 0;
                        };
                        let val = [];
                        for (let i = 0; i < markNum; i++) {
                            val.push(value.slice(i * cellOption['echartX']['textNum'], (i + 1) * cellOption['echartX']['textNum']));
                        }
                        return val.join('\n');
                    };
                };
            }
        };
        let firstMax = ToolPlugin.fixMaxNumber(Math.max.apply(null, firstMaxYnum));
        let firstMin = ToolPlugin.fixMinNumber(Math.min.apply(null, firstMinYnum));
        let secondMax = ToolPlugin.fixMaxNumber(Math.max.apply(null, secondMaxYnum));
        let secondMin = ToolPlugin.fixMinNumber(Math.min.apply(null, secondMinYnum));
        let firstMaxText = Math.max.apply(null, firstMaxTextYnum);
        let secondMaxText = Math.max.apply(null, secondMaxTextYnum);
        let maxXTextNum = Math.max.apply(null, maxXnum);


        linebarOption['yAxis'][0]['min'] = firstMin;
        linebarOption['color'] = cellOption['theme'] ? EchartsOption[cellOption['theme']] : EchartsOption['blue'];
        if (cellOption.double !== 1) {
            if (10 * firstMaxText > 30) {
                linebarOption['grid']['left'] = 10 * firstMaxText;
            };
        } else if (cellOption.double === 1) {
            // 判断是否显示双y轴
            if (10 * firstMaxText > 30) {
                linebarOption['grid']['left'] = 10 * firstMaxText;
            };

            if (10 * secondMaxText > 30) {
                linebarOption['grid']['right'] = 10 * secondMaxText;
            };

            const splitNumber = 5;
            linebarOption['yAxis'][0]['max'] = firstMax;
            linebarOption['yAxis'][0]['interval'] = Math.abs( (firstMax-firstMin) / splitNumber);
            linebarOption['yAxis'].push({
                type: 'value',
                inverse: false,
                scale: true,
                splitNumber: splitNumber,
                max: secondMax,
                min: secondMin,
                interval: Math.abs( (secondMax - secondMin) / splitNumber) === 0 ? 0.2 : Math.abs( (secondMax - secondMin) / splitNumber),
                axisLabel: {
                    inside: false
                },
                axisLine: {},
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#ececec'
                    }
                },
            });
            // 当双y轴 只有2个y轴字段时 修改折线颜色
            if (cellOption['yAxis'].length === 2) {
                yAxis.map((y, colorIndex) => {
                    console.log(linebarOption['yAxis'][colorIndex]);
                    if (linebarOption['yAxis'][colorIndex]) {
                        linebarOption['yAxis'][colorIndex]['axisLine'] = {
                            lineStyle: {
                                color: linebarOption['color'][colorIndex]
                            }
                        };
                    }
                });
            }
        }
        linebarOption['series'] = series;
        linebarOption['legend'].data = legend;

        if (cellOption['yHorizontal']) {
            linebarOption['grid']['left'] = 15 * maxXTextNum;
            // 如果grid 最大值不超过30 默认设置为30
            if (linebarOption['grid']['left'] < 30) {
                linebarOption['grid']['left'] = 30;
            };
            let _t = linebarOption.xAxis;
            linebarOption.xAxis = linebarOption.yAxis;
            linebarOption.yAxis = _t;
            linebarOption['grid']['right'] = 30;
            linebarOption.series.forEach((item) => {
                if (item['yAxisIndex'] !== undefined) {

                    item['xAxisIndex'] = item['yAxisIndex'];
                    delete item['yAxisIndex'];
                }
            });

            // 当双y轴 只有2个y轴字段时 修改折线颜色
            if (cellOption['dodouble'] === 1 && cellOption['yAxis'].length === 2) {
                yAxis.map((y, colorIndex) => {
                    linebarOption['xAxis'][colorIndex]['axisLine'] = {
                        lineStyle: {
                            color: linebarOption['color'][colorIndex]
                        }
                    };
                });
            }
        }
        if (cellOption['yHorizontalColumns']) {
            linebarOption['yAxis'][0]['axisLabel']['interval'] = 0;
        };
        return linebarOption;
    }

    /**
     * 饼图
     * @param chart = cellChart['chart']数据
     */
    pieOption(cellChart) {
        let cellOption = cellChart['chart'];
        if (cellOption.data['xAxis'].length === 0 || cellOption.data['yAxis'].length === 0 ) {
            return defaultOption;
        };
        let [legend, series] = [[], []];
        const [xAxis, yAxis, title] = [cellOption.data['xAxis'], cellOption.data['yAxis'], cellOption.chartName['name']];
        yAxis[0]['data'].forEach((data, i) => {
            legend.push(xAxis[i]);
            series.push({
                name: xAxis[i],
                value: data
            });
        })
        const pieOption = EchartsOption.getEchartsConfigOption('pie');
        pieOption['legend'].data = legend;
        pieOption['series'][0].data = series;
        pieOption['series'][0].name = title;
        pieOption['color'] = cellOption['theme'] ? EchartsOption[cellOption['theme']] : EchartsOption['blue'];

        return pieOption;
    }

    /**
     * 多表
     * @param chart = cellChart['chart']数据
     */
    multiChartOption(cellChart) {
        let cellOption = cellChart['chart'];
        const mutiListOption = EchartsOption.getEchartsConfigOption('multilist'); // 获取多表默认配置option
        const multilistData = cellOption['data']['multillist'][0]['xAxis']; // 多表数据
        const offset = 30; // 多表之间相隔间距
        const gridFirstTop = 10; // grid第一个默认top
        let gridRight = 10;
        let gridLeft = 50;
        let cellHeight = cellChart['size']['height'];
        cellHeight = cellHeight - 30 - 36; // cell的高度减去60的边距，就是实际的表格的高度
        let multillist = cellOption['data']['multillist'];
        // tableHeight 为多表图表中每一个图表的高度
        let tableHeight = (cellHeight - Math.max(offset * (multillist.length - 1), 0) - Math.max(12 * (multillist.length - 1), 0) - gridFirstTop) / multillist.length;
        let colors = cellOption['theme'] ? EchartsOption[cellOption['theme']] : EchartsOption['blue'];
        multillist.forEach((option, index, list) => {
            // mutiListOption['dataZoom'][0]['xAxisIndex'].push(index);
            // mutiListOption['dataZoom'][1]['xAxisIndex'].push(index);
            mutiListOption['xAxis'].push({
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#ececec'
                    }
                },
                gridIndex: index,
                type: 'category',
                boundaryGap: true,
                axisLine: {onZero: true},
                data: multilistData
            });
            let ymin = [];
            let ymax = [];

            option['yAxis'].map((y, yindex) => {
                mutiListOption['series'].push({
                    name: y['name'],
                    type: cellOption['sources'][index]['chartType']['type'],
                    xAxisIndex: index,
                    yAxisIndex: index,
                    symbolSize: 4,
                    hoverAnimation: false,
                    data: y['data'],
                    itemStyle: {
                        normal: {
                            color: colors[yindex],
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    }
                });
                let max = Math.max.apply(null, y['data'])
                let min = Math.min.apply(null, y['data'])
                ymin.push(min);
                ymax.push(max);
            });
            let maxYNum = Math.min.apply(null, ymax);
            if (maxYNum.toString().length > 6) {
                gridLeft = 10 * (maxYNum.toString().length);
            };
            mutiListOption['grid'].push({
                left: gridLeft,
                right: gridRight,
                top: gridFirstTop + tableHeight * index + offset * index,
                height: tableHeight
            })
            mutiListOption['yAxis'].push({
                gridIndex: index,
                type: 'value',
                nameGap: 10,
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#ececec'
                    }
                },
                min: Math.min.apply(null, ymin)
            });
        });
        return mutiListOption;
    }

    /**
     * 雷达图处理
     * @param chart = cellChart['chart']数据
     */
    radarOption(cellChart) {
        let cellOption = cellChart['chart'];
        const radarOption = EchartsOption.getEchartsConfigOption('radar');
        let maxNumList = [];
        cellOption['data']['product_data'].forEach((product, index) => {

            radarOption['legend']['data'].push(product.toString());

            // 默认只显示第一条数据
            radarOption['legend']['selected'][product.toString()] = index === 0;

            // 第一根线 用一个背景区域填充图表
            let _data = {
                name: product.toString(),
                value: cellOption['data']['rows'][index]
            };
            if (index === 0) {
                _data['areaStyle'] = {
                    normal: {
                        opacity: 0.2,
                        color: '#5b95e8'
                    }
                };
            }
            radarOption['series'][0]['data'].push(_data);

            let maxnum = Math.max.apply(null, cellOption['data']['rows'][index])
            maxNumList.push(maxnum);
        });

        cellOption['columns'].forEach(column => {
            radarOption['radar'][0]['indicator'].push({
                text: column['name'],
                max: Math.max.apply(null, maxNumList)
            });
        });
        radarOption['color'] = cellOption['theme'] ? EchartsOption[cellOption['theme']] : EchartsOption['blue'];
        return radarOption;
    }

    /**
     * 漏斗图处理
     * @param chart = cellChart['chart']数据
     */
    funnelOption(cellChart) {
        let cellOption = cellChart['chart'];
        const funnelOption = EchartsOption.getEchartsConfigOption('funnel');

        cellOption.columns.forEach((column, index) => {
            funnelOption.legend.data.push(column.name);
            funnelOption.series[0].data.push({
                value: cellOption.data.rows[0][index],
                name: column.name
            });
        });
        funnelOption['color'] = cellOption['theme'] ? EchartsOption[cellOption['theme']] : EchartsOption['blue'];
        return funnelOption;
    }


    /**
     * 获取下穿数据
     * @param data 需要发送给服务器的参数
     */
    async getDeepData(data) {
        const res = await HTTP.getImmediately('/bi/get_deep_bi_data/',data);
        if (res['success']) {

        } else {
            alert(res['error'])
        }
        return new Promise((resolve, reject) => {
            if (res['success']=== 1) {
                resolve(res);
            } else {
                reject(res);
            }
        })
    }
}