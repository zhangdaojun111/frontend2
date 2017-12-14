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
        formatter: '{b} : {c} ({d}%)'
    },
    legend: {
        show: true,
        orient: 'horizontal',
        left: 0,
        bottom: 0,
        data: [],
        type: 'scroll'
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [],
            label: {
                normal: {
                    // formatter: "{b} : \n {c}  ({d}%)",
                    formatter:function (param) {
                        let str = '';
                        let name = param.data.name.toString();
                        //判断是英文名称还是中文名称，分别处理
                        let reg = new RegExp("[\\u4E00-\\u9FFF]+","g");     //含有中文就按中文字符处理，否则按英文字符处理
                        if(reg.test(name)){
                            if(name.length > 8){
                                let str1 = name.substr(0,8);
                                let str2 = name.substr(8);
                                name = str1 + '\n' + str2;
                            }
                            str += name + ' ' + ': ';

                        }else{
                            let space = 0;
                            let flag = true;
                            let i=1;
                            while(flag){
                                space = name.indexOf(' ',space + 1);
                                if(space !== -1 && space >= 16*i){      //英文字符一行显示16个
                                    let temp1 = name.substr(0,space);
                                    let temp2 = name.substr(space);
                                    name = temp1 + '\n' + temp2;
                                    space++;
                                    i++;
                                }else if(space === -1){
                                    flag = false;
                                }
                            }
                            str += name + ' ' + ': ';
                        }
                        str += '\n';
                        str += param.data.value + '\n';
                        str += param.percent + '%';
                        return str;
                    }
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
        x: 'center'
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
        left:0,
        orient: 'horizontal',
        data: [],
        selected: {},
        type: 'scroll'
    },
    radar: [
        {
            indicator: [],
            radius: '80%',
            center: ['50%', '50%'],
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
};

// 折线柱状图
const linebar = {
    animation : false,
    textStyle:{
      fontFamily:'sans-serif'
    },
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
        left: 10,
        right: 15,
        bottom: 10,
        top:30,
        containLabel: true
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
            axisLabel : {
            },
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
// 风格箱图
const stylzie = {
    tooltip: {
        formatter: function (value, index) {
            return value.data[3]
        }
    },

    grid: {
        left: 0,
        right: 25,
        bottom: 10,
        top: 30,
        containLabel: true
    },
    xAxis: {
        type : 'value',
        min:0,
        max:300,
        data : [],
        axisLabel: {
            formatter:  function (value, index) {

                let texts = [];
                switch (index) {
                    case 1:
                        // code
                        texts.push('价值');
                        break;
                    case 3:
                        // code
                        texts.push('平衡');
                        break;
                    case 5:
                        // code
                        texts.push('成长');
                        break;
                    default:
                        texts.push('');
                    // code
                }
                return texts
            }
        }
    },
    yAxis: {
        type : 'value',
        min:0,
        max:300,
        axisLabel: {
            formatter:  function (value, index) {
                let texts = [];
                switch (index) {
                    case 1:
                        // code
                        texts.push('小盘');
                        break;
                    case 3:
                        // code
                        texts.push('中盘');
                        break;
                    case 5:
                        // code
                        texts.push('大盘');
                        break;
                    default:
                        texts.push('');
                    // code
                }
                return texts
            }
        }
    },
    series: [
        {
            type: 'graph',
            layout: 'none',
            coordinateSystem: 'cartesian2d',
            symbolSize: 10,
            label: {
                normal: {
                    show: true,
                    offset:[0, -10],
                    formatter: function(value,index) {
                        return value.data[2]
                    }
                }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            data: [],
            links: [],
            lineStyle: {
                normal: {
                    color: '#2f4554'
                }
            }
        }
    ]

};

//地图
const map = {
    title : {
        text: '',
        subtext: '',
        x:'left'
    },
    // dataZoom:{
    //     type:'slider',
    //     show:true,
    //     xAxisIndex:{
    //
    //     }SSSS
    //
    // },
    tooltip:{
        trigger: 'item',
        triggerOn:'none'
    },
    visualMap: {
        x: 'left',
        y: 'bottom',
        // type:'piecewise',
        color: ['#338CE2','#b4e2f7'],
        text:['高','低'],
    },
    series : [
        {
            type: 'map',
            mapType: 'china',
            roam: true,    //是否开启鼠标缩放和平移漫游
            zoom:1,
            scaleLimit:{
                min:0.5,
                max:2
            },
            itemStyle:{     //地图区域的多边形 图形样式
                normal:{        //是图形在默认状态下的样式
                    label:{
                        show:true,      //是否显示标签
                        textStyle: {
                            color: "black"
                        }
                    }
                },
                emphasis:{              //是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                    label:{show:true}
                }
            },
            top:"1.5%",     //以纵向位置控制图片大小，使其尽量饱满
            bottom:'1.5%'
        }
    ]
};



// 仪表盘
const gauge = {
    animation : false,
    tooltip: {
        formatter: "{a} : {c}"
    },
    // toolbox: {
    //     feature: {
    //         restore: {},
    //         saveAsImage: {}
    //     }
    // },
    series : [
        {
            name:'默认数据',
            type:'gauge',
            min:0,
            max:1,
            radius:'80%',
            splitNumber: 20,       // 分割段数
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color:[[0.3125,'#00B766'],[0.675,'#F9C10C'],[1,'#FF4C4C']],
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                splitNumber: 10,   // 每份split细分多少段
                length :20,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {           // 坐标轴文本标签
                textStyle: {       // 其余属性默认使用全局文本样式
                    color: '#000'
                },
            },
            splitLine: {           // 分隔线
                show: true,        // 默认显示，属性show控制显示与否
                length :20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            pointer : {
                length: '75%',
                width : 4,
            },
            itemStyle:{
                normal:{
                    color:'#000',
                }
            },
            detail : {
                formatter:'{value}',
                offsetCenter: [0, 44], // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样
                    fontSize: '14',
                    fontWeight: 'bolder',
                    color: '#000',
                    borderWidth: '1',
                    borderType: 'solid',
                    borderColor: '#ccc',
                }
            },
            data:{value: 0.575}
        }
    ]
};

//消息
const message = {

};

//审批
const approval = {

};

//日程
const calendar = {

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
            case 'stylzie':
                option = stylzie;
                break;
            case 'gauge':
                option = gauge;
                break;
            case 'map':
                option = map;
                break;
            case 'message':
                option = message;
                break;
            case 'approval':
                option = approval;
                break;
            case 'calendar':
                option = calendar;
                break;
        }
        return _.cloneDeep(option);
    },

    // 风格箱X区间值转换
    setStylzieX(x) {
        let convertX;

        if (x < 125 ) {
            convertX = x * (100 / 125);
        } else if (x >= 125 && x <= 175) {
            convertX = (x - 125) * (100 / 50) + 100;
        } else {
            convertX = (x - 175) * (100 / 875) + 200;
        }
        return convertX;
    },

    // 风格箱Y区间值转换
    setStylzieY(y) {
        let convertY;
        if (y < 100 ) {
            convertY = y * 100 / 125;
        } else if (y >=100 && y <= 200) {
            convertY = (y - 100) * (100 / 100) + 100;
        } else {
            convertY = (y - 200) * (100 / 800) + 200;
        }
        return convertY;
    }
};