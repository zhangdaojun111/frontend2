/**
 * Created by birdyy on 2017/8/1.
 * name echarts图表基础配置页面
 */

import {ToolPlugin} from "../utils/tool.plugin";

// 图表通用颜色
const blueColors = [
    '#5b95e8',
    '#33b6ac',
    '#55627f',
    '#fd8d88',
    '#ffec4e',

    '#b8d56b',
    '#649356',
    '#538b5e',
    '#529478',
    '#4f877e',

    '#4e6471',
    '#4c446b',
    '#5b4b65',
    '#5a3f5e',
    '#5f3e4f',

    '#753d4a',
    '#7f3846',
    '#8a4b42',
    '#a24445',
    '#be6381',

    '#be6cae',
    '#8b8ae7',
    '#7877eb',
    '#6599e5',

];
const grayBlueColors = [
    '#646c9e',
    '#4facef',
    '#49d2a6',
    '#fee939',
    '#fdb748',

    '#d09435',
    '#d06f35',
    '#d05d35',
    '#d04b35',
    '#d03535',

    '#bf2525',
    '#c13175',
    '#a74298',
    '#9542a7',
    '#8042a7',

    '#6342a7',
    '#48438d',
    '#43518d',
    '#43668d',
    '#3385a3',

    '#339fa3',
    '#3bb67a',
    '#3ea651',
    '#429446',
];
const greenColors = [
    '#77cda3',
    '#f1c888',
    '#b7a4f7',
    '#72beff',
    '#64e3d9',


    '#6cdcab',
    '#77d28f',
    '#7bc875',
    '#a6d772',
    '#d8e470',

    '#e2b978',
    '#f1a673',
    '#f2927f',
    '#e67070',
    '#ee6fab',


    '#e17fe2',
    '#bd80d9',
    '#9a86e4',
    '#8699dd',
    '#7dc7e9',


    '#7de9d1',
    '#7edfa2',
    '#8cd977',
    '#cde076'
];

// 饼图
const pie = {
    animation : false,
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        show: true,
        orient: 'vertical',
        left: 'right',
        bottom: 0,
        data: [],
        type: 'scroll'
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            center: ['40%', '50%'],
            data: [],
            label: {
                normal: {
                    formatter: "{b} : {c} ({d}%)",
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

// 多表
const multillist = {
    animation : false,
    legend: {
        data: [],
        x: 'left'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    axisPointer: {
        link: {xAxisIndex: 'all'}
    },
    grid: [],
    xAxis: [],
    yAxis: [],
    series: []
};

// 雷达
const radar = {
    animation : false,
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        x: 'right',
        bottom: 0,
        orient: 'vertical',
        data: [],
        selected: {},
        type: 'scroll'
    },
    radar: [
        {
            indicator: [],
            radius: '50%',
            center: ['40%', '50%'],
        },
    ],
    series: [
        {
            type: 'radar',
            tooltip: {
                trigger: 'item'
            },
            data: []
        },
    ]
};

// 漏斗图
const funnel = {
    animation : false,
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
    },
    legend: {
        // orient: 'vertical',
        // left: 'left',
        data: []
    },
    calculable: true,
    series: [
        {
            name: '漏斗图',
            type: 'funnel',
            width: '80%',
            left: '10%',
            top: '50',
            bottom: '10',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            data: []
        }
    ]
}

// 折线柱状图
const linebar = {
    animation : false,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            animation: false,
            label: {
                backgroundColor: '#505765'
            }
        }
    },
    legend: {
        top: 0,
        data: [],
        selected: {},
        type: 'scroll'
    },
    grid: {
        left: 30,
        right: 30,
        bottom: 30,
        top: 50
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisPointer: {
                type: 'shadow'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    color: '#ececec'
                }
            },
            axisLabel : {}
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            splitNumber : 5,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    color: '#ececec'
                }
            },
            axisLabel: {
                inside: false
            },
            axisLine: {}
        }
    ],
    series: []

};


export const EchartsOption = {
    blue: blueColors,
    green: greenColors,
    grayBlue: grayBlueColors,

    getEchartsConfigOption(type) {
        let option = {};
        switch (type) {
            case 'pie':
                option = pie;
                break;
            case 'multilist':
                option = multillist;
                break;
            case 'radar':
                option = radar;
                break;
            case 'funnel':
                option = funnel;
                break;
            case 'linebar':
                option = linebar;
                break;
        }
        return ToolPlugin.clone(option);
    }
}