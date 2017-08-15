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

        //滑过 显示编辑删除

        // $('.charts-items li').each(function (index) {
        //     $(this).hover(
        //         function () {
        //             $('.btn_ripple').eq(index).show();
        //         },
        //         function () {
        //             $('.btn_ripple').eq(index).hide();
        //         }
        //     )
        // });

        //模糊搜索
        $('.filter-match').on('input',function () {
            //值改变时 隐藏
            $('.charts-items li').css('display','none');

            //填空值时 仍显示
            if($('.filter-match').val().length<=0){
                $('.charts-items li').css('display','block');
                return;
            }

            // 模糊匹配 遍历所有 将匹配的显示出来
            $('.charts-items li').each(function (index) {
                if ($('.charts-items li').eq(index).text().substr(0,$('.filter-match').val().length) == $('.filter-match').val()){
                    $('.charts-items li').eq(index).css('display','block');
                }
            })
        });

    },
    firstAfterRender() {
        Mediator.on('bi:aside:del', (res) => {
            let charts = this.data.charts;
            for(let [index,view] of charts.entries()) {
                if (res.id === view.id) {
                    charts.splice(index,1);
                    break;
                }
            }
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
        return chart
    }


}

export default AsideNavComponent;
