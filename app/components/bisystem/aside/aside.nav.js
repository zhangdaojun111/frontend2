import {BiBaseComponent} from '../bi.base.component';

import template from './aside.nav.html';
import './aside.nav.scss';

import Mediator from '../../../lib/mediator';
import {ChartsComponent} from './charts/charts';
let config = {
    template: template,
    data:{
        charts:window.config.charts,
        chart_id:"",
    },
    actions:{
        reload() {
            this.reload();
        }
    },

    afterRender() {
        //加载左侧导航
        this.data.charts.forEach((val,index) => {
            let chartsComponent = new ChartsComponent(val);
            this.append(chartsComponent,this.el.find('.charts-items'));
        });

        //模糊搜索
        let self = this;
        this.el.on('input','.filter-match',()=>{
            self.el.find('.charts-items li').hide();
            let len = self.el.find('.filter-match').val().length;
            if(len<=0){
                self.el.find('.charts-items li').show();
            }
            self.el.find('.charts-items li').each(function () {
                // let val = self.el.find('.filter-match').val();
                // if($(this).find('.item').text().test(/val/)){
                //     $(this).show();
                // }
               if($(this).find('.item').text().substr(0,len) === self.el.find('.filter-match').val()){
                    $(this).show();
               }
            })
        });
    },
    firstAfterRender() {
        Mediator.subscribe('bi:aside:del', (res) => {
            let charts = this.data.charts;
            for(let [index,view] of charts.entries()) {
                if (res.id === view.id) {
                    charts.splice(index,1);
                    break;
                }
            }
        });

        Mediator.subscribe('bi:aside:update',(res) => {
            if (res['type'] == 'new') {
                window.config.charts.push(res['data']);
                this.data.charts = window.config.charts
            } else {
                let charts = [];
                for(let chart of window.config.charts) {
                    if (res['data'].id == chart.id) {
                        chart = res['data'];
                    };
                    charts.push(chart);
                }
                this.data.charts = window.config.charts = charts;
            };
            this.reload();
        })
    }
};

class AsideNavComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }

    /**
     * 获取单个chart数据
     * @param index = this.data.charts[index]
     * @returns {"assortment": "funnel", "id": 1094, "name": "图表名字"}
     */
    getChart(index) {
        let chart = this.data.charts[index];
        return chart;
    }


}

export default AsideNavComponent;
