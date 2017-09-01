/**
 * Created by birdyy on 2017/8/31.
 * 图表公共字段配置文件 eg: 图表名称，数据来源，选择颜色，选择图标
 */

let chartName = {
    label: '图表名称',
    name: 'chartName',
    defaultValue: '',
    type: 'text',
    events: {}
};
let theme = {
    label: '选择颜色',
    name: 'theme',
    defaultValue: '',
    type: 'radio',
    list:[
        {value:'blue', name:'蓝色'},
        {value: 'green',name: '绿色'},
        {value: 'grayBlue', name:'灰蓝色'}
    ],
    events: {}
};
let icon = {
    label: '选择图标',
    name: 'icon',
    defaultValue: '',
    type: 'radio'
}

export {chartName, theme, icon};