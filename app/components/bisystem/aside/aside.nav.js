import Component from '../../../lib/component';

import template from './aside.nav.html';
import './aside.nav.scss';

import Mediator from '../../../lib/mediator';
import {ChartsComponent} from './charts/charts';
let config = {
    template: template,
    data:{
        charts:window.config.charts,//原始数据
        chart_id:"",//列表对应id
    },
    actions:{
        /**
         * 获取单个chart数据
         * @param index = this.data.charts[index]
         * @returns { "assortment":  "funnel", "id": 1094, "name": "图表名字"}
         */
        getChart(index) {
            let chart = this.data.charts[index];
            return chart;
        },
        /**
         *模糊匹配查询
         */
        searchItems(query) {
            this.el.find('.charts-items li').hide();
            this.el.find('.charts-items li').each(function () {
                let chartVal = $(this).find('.item').text();
                if(chartVal.indexOf(query) !== -1){
                    $(this).show();
                }
            })
        }
    },
    binds:[
        {
        event: 'input',
        selector: '.aside .filter-match',
        callback: _.debounce(function (context,event) {
            let query = $(context).val();
            this.actions.searchItems(query);
            },50)
        },
    ],
    afterRender() {
        //加载左侧导航数据
        this.data.charts.forEach((val,index) => {
            let data = val ? val : null;
            data.imgUrl = window.config.img_url;
            data.isIcon = val['icon']? true:false;
            data.userSelf = val['self'] == 1 ? true : false;

            let chartsComponent = new ChartsComponent({
                data,
                onDelete: (res)=>{
                    let charts = this.data.charts;
                    _.remove(charts,function (val) {
                        return res.id === val.id;
                    });
                    window.config.charts = charts;
                }
            });

            this.append(chartsComponent,this.el.find('.charts-items'));
        });
    },
    firstAfterRender() {
        Mediator.subscribe('bi:aside:update',(res) => {
            if (res['type'] == 'new') {
                window.config.charts.push(res['data']);
                this.data.charts = window.config.charts
            } else {
                let charts = [];
                for(let chart of window.config.charts) {
                    if (res['data'].id == chart.id) {
                        chart = res['data'];
                    }
                    charts.push(chart);
                }
                this.data.charts = window.config.charts = charts;
            }
            this.reload();
        })
    }
};

let AsideNavComponent = Component.extend(config);

// class AsideNavComponent extends Component{
//     constructor(data,events,extendConfig) {
//         super($.extend(true,{},config,extendConfig),data,events)
//     }
// }

export default AsideNavComponent;
