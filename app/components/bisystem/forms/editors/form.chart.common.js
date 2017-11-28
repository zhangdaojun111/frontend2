/**
 * Created by birdyy on 2017/8/31.
 * 图表公共字段配置文件 eg: 图表名称，数据来源，选择颜色，选择图标
 */

let chartName = {
    label: '图表名称',
    name: 'chartName',
    defaultValue: '',
    required: true,
    placeholder: '请输入图表名称',
    rules:[
        {
            errorMsg: '图表名称不能为空',
            type: 'required', // length reg function number xxx
        }
    ],
    type: 'text',
    events: {}
};
let countColumn = {
    label: '统计字段',
    name: 'countColumn',
    defaultValue: {},
    type: 'radio',
    list:[],
    events: {},
    class: 'countColumn',
    // required: true,
    // rules:[
    //     {
    //         errorMsg: '统计字段不能为空',
    //         type: 'required',
    //     }
    // ],
};

let theme = {
    label: '选择颜色',
    name: 'theme',
    defaultValue: '',
    type: 'theme',
    list:[]
};

let icon = {
    label: '选择图标',
    name: 'icon',
    defaultValue: '',
    type: 'radio'
};
let button = {
    label: '',
    name: '返回图表',
    defaultValue: '',
    type: 'button',
    class:'back-chart'
};

export {chartName,theme, icon,button,countColumn};