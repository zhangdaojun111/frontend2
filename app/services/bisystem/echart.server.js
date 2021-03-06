/**
 * Created by birdyy on 2017/8/1.
 * name echarts 服务渲染
 */
import echarts from 'echarts';
import {EchartsOption} from '../../components/bisystem/echarts.config/echarts.config';
import {ToolPlugin} from "../../components/bisystem/utils/tool.plugin";
import {HTTP} from '../../lib/http';
import {canvasCellService} from './canvas.cell.service';
import * as chinaMap from '../../components/bisystem/utils/china';

const defaultOption = {
    grid: {},
    xAxis : [],
    yAxis : [],
    series : []
};

export class EchartsService {
    constructor(cellChart) {
        let myChart = echarts.init(document.getElementById(cellChart['id']));
        this.myChart = myChart;
        let option = this.getEchartsOption(cellChart['cellChart']);
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
                option = this.pieOption(cellChart);// 饼图处理
                break;
            case 'circular':
                option = this.pieOption(cellChart);// 环形图处理
                break;
            case 'multilist':
                option = this.multiChartOption(cellChart); // 多表处理
                break;
            case 'normal':
                option = this.lineBarOption(cellChart); // 折线柱状混合图
                break;
            case 'radar':
                option = this.radarOption(cellChart); // 雷达图处理
                break;
            case 'funnel':
                option = this.funnelOption(cellChart); // 漏斗图处理
                break;
            case 'stylzie':
                option = this.stylzieOption(cellChart); // 风格图处理
                break;
            case 'map':
                option = this.mapOption(cellChart); // 地图处理
                break;
            case 'gauge':
                option = this.gaugeOption(cellChart); // 仪表盘处理
                break;
            case 'message':
                option = this.messageOption(cellChart); // 消息处理
                break;
            case 'approval':
                option = this.approvalOption(cellChart); // 审批处理
                break;
            case 'calendar':
                option = this.calendarOption(cellChart); // 日程处理
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
        let ySelectedGroup = cellChart['chart']['ySelectedGroup'];
        if (cellOption.data['xAxis'].length === 0 || cellOption.data['yAxis'].length === 0 ) {
            return defaultOption;
        }
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
        let isStack = false; // 判断是否堆叠
        let firstYAxisUnit, secondYAxisUnit; // 获取y轴的单位
        cellOption['yAxis'].forEach(y => {
             if (y['yAxisIndex'] === 0) {
                 firstYAxisUnit = y['unit']
             } else if (y['yAxisIndex'] === 1) {
                 secondYAxisUnit = y['unit']
             }
        })

        yAxis.forEach((y,i) => {
            // 判断是否是堆叠情况
            if (cellOption.yAxis[i] && cellOption.yAxis[i]['group']) {
                isStack = true;
            }
            legend.push(y[nameType]);
            if (nameType === 'new_name') {
                if (Array.isArray(ySelectedGroup) && ySelectedGroup.length > 0) {
                    for (let ySelectItem of ySelectedGroup) {
                        if (ySelectItem.field.dfield === y.dfield) {
                            ySelectItem.field.name = y['new_name'];
                            break;
                        }
                    }
                }
            }
            let maxNumber = Math.max.apply(null, y['data']);
            let minNumber = Math.min.apply(null, y['data']);
            if (y['yAxisIndex'] === 1) {
                secondMaxYnum.push(maxNumber);
                secondMinYnum.push(minNumber);
            } else {
                firstMaxYnum.push(maxNumber);
                firstMinYnum.push(minNumber);
            }
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
                },
                areaStyle:cellOption['chartAssignment'] && cellOption['chartAssignment']['val'] == 1 ? (cellOption.yAxis[y['yAxisIndex']] && cellOption.yAxis[y['yAxisIndex']].areaStyle===1 ? {normal:{}} :{}) : (cellOption.yAxis[i] && cellOption.yAxis[i].areaStyle==1)?{normal: {}}:{},
                stack:cellOption.yAxis[i] && cellOption.yAxis[i]['group'] || '',
                label: (cellOption.yAxis[i] && cellOption.yAxis[i]['label']==1)?
                    {normal: {
                        show: true,
                        position: (cellOption.yAxis[i] && cellOption.yAxis[i]['group'] != '')?'inside':'top'
                        // position:'top'
                    }}:{}
            });
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
                        let markNum = 0;
                        if (cellOption['echartX']['textNum'] !== 0) {
                            markNum = Math.ceil(value.length / cellOption['echartX']['textNum']);
                        } else {
                            markNum = 0;
                        }
                        let val = [];
                        for (let i = 0; i < markNum; i++) {
                            val.push(value.slice(i * cellOption['echartX']['textNum'], (i + 1) * cellOption['echartX']['textNum']));
                        }
                        return val.join('\n');
                    }
                };
            }
        }
        let firstMax = Math.max.apply(null, firstMaxYnum);
        let firstMin = Math.min.apply(null, firstMinYnum);
        let secondMax = Math.max.apply(null, secondMaxYnum);
        let secondMin = Math.min.apply(null, secondMinYnum);
        //如果数据里面有柱状图，则y轴起始点从0开始
        let isZero = false;
        for(let y of yAxis){
            if(y.type.type == 'bar' && firstMin >= 0){
                isZero = true;
                break;
            }
        }

        const splitNumber = 5;// y轴分成几段
        if (!isStack) {
            linebarOption['yAxis'][0]['min'] = isZero ? 0 : firstMin;
        }
        linebarOption['color'] = Array.isArray(cellOption['theme']) && cellOption['theme'].length > 0 ? cellOption['theme'] : EchartsOption['blue'];
        if (cellOption.double !== 1) {
            let cellWidth = cellChart.cell.size['width'];
            let str = cellChart.chart.data.xAxis[0];
            let len = str.length;
            linebarOption['grid']['right'] = Math.min(Math.max(len*1000/(cellWidth^3),15),40);
            linebarOption['yAxis'][0]['axisLabel']['formatter'] = firstYAxisUnit ? "{value}" + firstYAxisUnit : "{value}"
            // linebarOption['yAxis'][0]['interval'] = Math.abs(firstMax / splitNumber);
        } else if (cellOption.double === 1) {
            // 双y轴 如果有一个y轴小于0
            if (firstMin < 0 || secondMin < 0) {
                if (isStack) {
                    linebarOption['yAxis'][0]['max'] = null;
                    linebarOption['yAxis'][0]['min'] = null;
                    linebarOption['yAxis'][0]['axisLabel']['formatter'] = firstYAxisUnit ? "{value}" + firstYAxisUnit : "{value}"
                    linebarOption['yAxis'].push({
                        type: 'value',
                        inverse: false,
                        max: null,
                        min: null,
                        // interval:!isStack && secondMin > 0 ?  (secondMax - secondMin) / splitNumber > 1 ? Math.ceil((secondMax - secondMin) / splitNumber) : Number(((secondMax - secondMin) / splitNumber).toFixed(5)) : null,
                        axisLabel: {
                            inside: false,
                            formatter: function(value,index) {
                                let isDecimal = _.cloneDeep(value).toString().indexOf('.');
                                return isDecimal !== -1 ? secondYAxisUnit ? value.toFixed(5) + secondYAxisUnit : value.toFixed(5) :  secondYAxisUnit ? value +  secondYAxisUnit : value;
                            }
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
                } else {
                    linebarOption['yAxis'][0]['max'] = Math.abs(firstMin) > Math.abs(firstMax) ? Math.abs(firstMin) : Math.abs(firstMax);
                    linebarOption['yAxis'][0]['min'] = Math.abs(firstMin) > Math.abs(firstMax) ? firstMin : -Math.abs(firstMax);
                    linebarOption['yAxis'][0]['axisLabel']['formatter'] = firstYAxisUnit ? "{value}" + firstYAxisUnit : "{value}"
                    linebarOption['yAxis'].push({
                        type: 'value',
                        inverse: false,
                        max: Math.abs(secondMin) > Math.abs(secondMax) ? Math.abs(secondMin) : Math.abs(secondMax),
                        min: Math.abs(secondMin) > Math.abs(secondMax) ? secondMin : -Math.abs(secondMax),
                        // interval:!isStack && secondMin > 0 ?  (secondMax - secondMin) / splitNumber > 1 ? Math.ceil((secondMax - secondMin) / splitNumber) : Number(((secondMax - secondMin) / splitNumber).toFixed(5)) : null,
                        axisLabel: {
                            inside: false,
                            formatter: function(value,index) {
                                let isDecimal = _.cloneDeep(value).toString().indexOf('.');
                                return isDecimal !== -1 ? secondYAxisUnit ? value.toFixed(5) + secondYAxisUnit:value.toFixed(5) : secondYAxisUnit ? value + secondYAxisUnit : value;
                            }
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
                }
            } else {
                linebarOption['yAxis'][0]['max'] = isStack ? null : firstMax;
                linebarOption['yAxis'][0]['min'] = isStack && firstMin < 0 ? null : 0;
                linebarOption['yAxis'][0]['axisLabel']['formatter'] = firstYAxisUnit ? "{value}" + firstYAxisUnit : "{value}";
                linebarOption['yAxis'].push({
                    type: 'value',
                    inverse: false,
                    max: null,
                    min: null,
                    // interval:!isStack && secondMin > 0 ?  (secondMax - secondMin) / splitNumber > 1 ? Math.ceil((secondMax - secondMin) / splitNumber) : Number(((secondMax - secondMin) / splitNumber).toFixed(5)) : null,
                    axisLabel: {
                        inside: false,
                        formatter: function(value,index) {
                            let isDecimal = _.cloneDeep(value).toString().indexOf('.');
                            return isDecimal !== -1 ? secondYAxisUnit ? value.toFixed(5) + secondYAxisUnit:value.toFixed(5) : secondYAxisUnit ? value + secondYAxisUnit : value;
                        }
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

            }

            // 当双y轴 只有2个y轴字段时 修改折线颜色
            if (cellOption['yAxis'].length === 2) {
                yAxis.map((y, colorIndex) => {
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

        // 默认显示y轴字段列表
        if (Array.isArray(ySelectedGroup) && ySelectedGroup.length > 0) {
            legend.map(name => {
                for (let val of ySelectedGroup) {
                    if (val.field.name === name) {
                        linebarOption['legend']['selected'][name] = true;
                        break;
                    } else {
                        linebarOption['legend']['selected'][name] = false;
                    }
                }
            });
        }

        if (cellOption['yHorizontal']) {
            let _t = linebarOption.xAxis;
            linebarOption.xAxis = linebarOption.yAxis;
            linebarOption.yAxis = _t;
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

        if (cellOption['yHorizontalColumns'] && cellOption['yHorizontalColumns']['marginBottom']) {
            if (cellOption['yHorizontalColumns'].hasOwnProperty('marginBottom')) {
                if (cellOption['yHorizontal']) {
                    //y轴横向展示的时候，显示所有y坐标
                    linebarOption['yAxis'][0]['axisLabel']['interval'] = 0;
                } else {
                    //显示所有x坐标
                    linebarOption['xAxis'][0]['axisLabel']['interval'] = 0;
                    //如果没选择x轴横向展示
                    if(!cellOption['echartX']['textNum']){
                        linebarOption['xAxis'][0]['axisLabel']['rotate'] = 45;
                        linebarOption['grid']['bottom'] = cellOption['yHorizontalColumns']['marginBottom'];
                    }
                }
            }
        }

        //x轴为3日期,5日期时间,12年份,30年月类型字段时开启数据缩放
        let dateType = ['3','5','12','30'];
        let xDateType = cellOption['data']['x'] ? cellOption['data']['x'] : cellOption['xAxis'];
        if(!cellOption['yHorizontal'] && xDateType && xDateType['type'] && dateType.indexOf(xDateType['type']) != -1 && window.config.bi_user !== 'manager'){
            linebarOption['grid']['bottom'] = parseInt(linebarOption['grid']['bottom']) + 30;
            if(!window.config.pdf){
                linebarOption['dataZoom']=[
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        bottom:5,
                        height:20,
                        left:0,
                        right:5,
                        startValue: linebarOption['xAxis'][0]['data'][0],
                        endValue: linebarOption['xAxis'][0]['data'][linebarOption['xAxis'][0]['data'].length-1],
                        rangeMode: ['value', 'value']
                    },
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        startValue: linebarOption['xAxis'][0]['data'][0],
                        endValue: linebarOption['xAxis'][0]['data'][linebarOption['xAxis'][0]['data'].length-1],
                        rangeMode: ['value', 'value']
                    }
                ]
            }
        }
        //是否设置自定义高度top
        if(cellOption['customTop']){
            linebarOption['grid']['top'] = cellOption['customTop'];
            linebarOption['legend']['type'] = 'plain';
        }

        //最后一条数据必显示
        if(cellOption.data.xAxis){
            linebarOption['xAxis'][0]['axisLabel']['showMaxLabel'] = true;
            linebarOption['xAxis'][0]['axisLabel']['showMinLabel'] = true;
        }

        //自定义 图表字体大小
        if(cellOption['customTextStyle'] && cellOption['customTextStyle'].hasOwnProperty('chartSize')){
            linebarOption['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
            linebarOption['xAxis'].forEach((val,index)=>{
                val.axisLabel.textStyle = {
                    fontSize:cellOption['customTextStyle']['chartSize']
                };
            });
            linebarOption['yAxis'].forEach((val,index)=>{
                val.axisLabel.textStyle = {
                    fontSize:cellOption['customTextStyle']['chartSize']
                };
            });
        }
        // 增加y轴单位
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
        }
        let [legend, series] = [[], []];
        const [xAxis, yAxis, title] = [cellOption.data['xAxis'], cellOption.data['yAxis'], cellOption.chartName['name']];
        yAxis[0]['data'].forEach((data, i) => {
            legend.push(xAxis[i]);
            series.push({
                name: xAxis[i],
                value: data
            });
        });
        const pieOption = EchartsOption.getEchartsConfigOption('pie');
        pieOption['legend'].data = legend;
        pieOption['series'][0].data = series;
        pieOption['series'][0].name = title;
        pieOption['color'] = Array.isArray(cellOption['theme']) && cellOption['theme'].length > 0 ? cellOption['theme'] : EchartsOption['blue'];
        if(cellChart.chart.chartType.type == 'circular'){
            pieOption['series'][0].radius = ['50%','80%'];
        }
        //是否设置自定义图表半径
        if(cellOption['customPie'] && cellOption['customPie'].hasOwnProperty('radius')){
            pieOption['legend']['type'] = 'plain';
            pieOption['series'][0]['center'] = [cellOption['customPie']['centerX'],cellOption['customPie']['centerY']];
            if(cellChart.chart.chartType.type == 'pie'){
                pieOption['series'][0]['radius'] = cellOption['customPie']['radius'];
            }else{
                pieOption['series'][0]['radius'] = isNaN(cellOption['customPie']['radius'])?[(parseFloat(cellOption['customPie']['radius'])-20)+'%',cellOption['customPie']['radius']]:[cellOption['customPie']['radius']-20+'',cellOption['customPie']['radius']];
            }
        }

        //自定义 图表字体大小
        if(cellOption['customTextStyle'] && cellOption['customTextStyle'].hasOwnProperty('chartSize')){
            pieOption['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
        }

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
        const offset = 20; // 多表之间相隔间距
        const gridFirstTop = 30; // grid第一个默认top
        let gridRight = 10;
        let gridLeft = 50;
        let cellHeight = cellChart['cell']['size']['height'];
        cellHeight = cellHeight - 10 - 20; // cell的高度减去60的边距，就是实际的表格的高度
        let multillist = cellOption['data']['multillist'];

        // tableHeight 为多表图表中每一个图表的高度
        let tableHeight = (cellHeight - Math.max(offset * (multillist.length - 1), 0) - Math.max(12 * (multillist.length - 1), 0) - gridFirstTop) / multillist.length;
        let colors = Array.isArray(cellOption['theme']) && cellOption['theme'].length > 0 ? cellOption['theme'] : EchartsOption['blue'];
        let legend = [];
        multillist.forEach((option, index, list) => {
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
                legend.push(y['name']);
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
                let max = Math.max.apply(null, y['data']);
                let min = Math.min.apply(null, y['data']);
                ymin.push(min);
                ymax.push(max);
            });
            let maxYNum = Math.min.apply(null, ymax);
            if (maxYNum.toString().length > 6) {
                gridLeft = 10 * (maxYNum.toString().length);
            }

            mutiListOption['grid'].push({
                left: 0,
                right: gridRight,
                top: gridFirstTop + tableHeight * index + offset * index,
                height: tableHeight,
                containLabel: true
            });
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

                min: Math.min.apply(null, ymin),
            });
        });
        mutiListOption['legend']['data'] = legend;

        //自定义 图表字体大小
        if(cellOption['customTextStyle'] && cellOption['customTextStyle'].hasOwnProperty('chartSize')){
            mutiListOption['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
            mutiListOption['xAxis'].forEach((val,index)=>{
                val.axisLabel = {textStyle:{fontSize:cellOption['customTextStyle']['chartSize']}};
            });
            mutiListOption['yAxis'].forEach((val,index)=>{
                val.axisLabel = {textStyle:{fontSize:cellOption['customTextStyle']['chartSize']}};
            });
        }
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

            // let maxnum = Math.max.apply(null, cellOption['data']['rows'][index])
            // maxNumList.push(maxnum);

            let tempData = cellOption['data']['rows'][index];
            tempData = tempData.map(item=>{
                return Math.abs(item)
            });
            let maxnum = Math.max(...tempData);
            maxNumList.push(maxnum);
        });

        cellOption['columns'].forEach(column => {
            radarOption['radar'][0]['indicator'].push({
                text: column['name'],
                // max: Math.max.apply(null, maxNumList)
                max: (Math.max(...maxNumList)/Math.cos(Math.PI/cellOption['columns'].length)+10),
            });
        });
        radarOption['color'] = Array.isArray(cellOption['theme']) && cellOption['theme'].length > 0 ? cellOption['theme'] : EchartsOption['blue'];

        //自定义 图表字体大小
        if(cellOption['customTextStyle'] && cellOption['customTextStyle'].hasOwnProperty('chartSize')){
            radarOption['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
        }
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
     * 风格箱处理
     * @param chart = cellChart['chart']数据
     */
    stylzieOption(cellChart) {
        let cellOption = cellChart['chart'];
        const stylzieOption = EchartsOption.getEchartsConfigOption('stylzie');
        let data = _.cloneDeep(cellOption.data.xAxis).fill('');
        cellOption.data.xAxis.forEach((val,index) => {
            let item = [EchartsOption.setStylzieX(val),EchartsOption.setStylzieY(cellOption.data.yAxis[index]), new Date(cellOption.data.dateAxis[index]).getDate(),cellOption.data.dateAxis[index]];
            data[index] = item;
        });
        // 如果时间是30 - 1号这种格式，需要把数据反转
        if (cellOption.data.dateAxis[0] > cellOption.data.dateAxis[cellOption.data.dateAxis.length - 1]) {
            data.reverse();
        }

        let links = data.map(function (item, i) {
            return {
                source: i,
                target: i + 1
            };
        });
        links.pop();
        stylzieOption.series[0].links = links;
        stylzieOption.series[0].data = data;

        //自定义 图表字体大小
        if(cellOption['customTextStyle'] && cellOption['customTextStyle'].hasOwnProperty('chartSize')){
            stylzieOption['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
            stylzieOption['xAxis']['axisLabel']['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
            stylzieOption['yAxis']['axisLabel']['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
        }

        return stylzieOption;
    }

    /**
     * 地图数据处理
     * @param cellChart
     * @returns {*}
     */
    mapOption(cellChart){
        const mapOption = EchartsOption.getEchartsConfigOption('map');
        let data = [];
        let cellOption = cellChart['chart'];
        let xData = cellOption.data.xAxis;
        let yData = cellOption.data.yAxis[0].data;
        //数据处理
        let yMax = cellOption.data.yAxis[0].data[0];
        let yMin = cellOption.data.yAxis[0].data[0];
        for( let k in xData){
            let temp = {};
            temp['name'] = xData[k];
            temp['value'] = yData[k];
            yMax = yMax > Number(yData[k]) ? yMax : Number(yData[k]);
            yMin = yMin < Number(yData[k]) ? yMin : Number(yData[k]);
            data.push(temp);
        }
        //计算分段（默认分6段）
        let splitDis = ((yMax) - yMin)/6;
        let splitList = [];
        let beginDis = {min:(yMax - splitDis)};
        let endDis = {max:(yMin + splitDis)};
        splitList.push(beginDis);
        for (let i=1; i<5; i++){
            let tempDis = {};
            tempDis.min = yMin + i*splitDis;
            tempDis.max = yMin + (i+1)*splitDis;
            splitList.push(tempDis);
        }
        splitList.push(endDis);

        mapOption.series[0].data = data;
        mapOption.series[0].name = cellOption.data.yAxis[0].name;
        mapOption.visualMap.pieces = splitList;
        //自定义设置精度
        if(cellOption['customAccuracy']){
            mapOption['tooltip']['formatter'] = function(params,ticket,callback){
                return params.seriesName+'<br/>' + params.data.name + ' : ' + parseFloat(params.data.value).toFixed(parseInt(cellOption['customAccuracy']));
            };
        }

        //自定义 图表字体大小
        if(cellOption['customTextStyle'] && cellOption['customTextStyle'].hasOwnProperty('chartSize')){
            mapOption['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
        }
        return mapOption;
    }


    /**
     * 仪表图
     * @param chart = cellChart['chart']数据
     */
    gaugeOption(cellChart) {
        const gaugeOption = EchartsOption.getEchartsConfigOption('gauge');
        let cellOption = cellChart['chart'];
        if (cellOption['yAxis'].length === 0 ) {
            return defaultOption;
        }
        gaugeOption.series[0].min = Math.min(...cellOption['data']['range']);
        gaugeOption.series[0].max = Math.max(...cellOption['data']['range']);
        if(cellOption['data']['range'] && cellOption['data']['range'][0] == 0 && cellOption['data']['range'][1] == 0){
            if(cellOption['data']['yAxis']>0){
                gaugeOption.series[0].min = 0;
                gaugeOption.series[0].max = cellOption['data']['yAxis'];
            }else {
                gaugeOption.series[0].min = cellOption['data']['yAxis'];
                gaugeOption.series[0].max = 0;
            }
        }
        gaugeOption.series[0].name = cellOption['yAxis'][0].name;
        gaugeOption.series[0].data['value'] = cellOption['data']['yAxis'];

        //自定义设置精度
        if(cellOption['customAccuracy']){
            gaugeOption.series[0]['axisLabel']['formatter'] = function(value){
                return value.toFixed(parseInt(cellOption['customAccuracy']));
            };
            gaugeOption.series[0]['detail']['formatter'] = function(value){
                return value.toFixed(parseInt(cellOption['customAccuracy']));
            };
        }

        //自定义 图表字体大小
        if(cellOption['customTextStyle'] && cellOption['customTextStyle'].hasOwnProperty('chartSize')){
            gaugeOption['textStyle'] = {fontSize:cellOption['customTextStyle']['chartSize']};
            gaugeOption.series[0]['detail']['textStyle']['fontSize'] = cellOption['customTextStyle']['chartSize'];
        }
        return gaugeOption;
    }

    /**
     * 消息
     * @param chart = cellChart['chart']数据
     */
    messageOption(cellChart) {
        const messageOption = EchartsOption.getEchartsConfigOption('message');
        let cellOption = cellChart['chart'];


        return messageOption;
    }
    /**
     * 审批
     * @param chart = cellChart['chart']数据
     */
    approvalOption(cellChart) {
        const approvalOption = EchartsOption.getEchartsConfigOption('approval');
        let cellOption = cellChart['chart'];


        return approvalOption;
    }
    /**
     * 日程
     * @param chart = cellChart['chart']数据
     */
    calendarOption(cellChart) {
        const calendarOption = EchartsOption.getEchartsConfigOption('calendar');
        let cellOption = cellChart['chart'];


        return calendarOption;
    }
    /**
     * 获取下穿数据
     * @param data 需要发送给服务器的参数
     */
    async getDeepData(data) {
        const res = await canvasCellService.getDeepData(data);
        return new Promise((resolve, reject) => {
            resolve(res);
        })
    }
}