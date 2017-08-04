import {BiBaseComponent} from '../bi.base.component';

import template from './bisystem.nav.html';
import './bisystem.nav.scss';
import { biChartService } from "../../../services/bisystem/bi.chart.service";

let config = {
    template: template,
    data:{
        charts:{}
    },
    actions:{
       async init(){
            const res = await biChartService.getCharts();
            console.log(res);

        }
    },

    afterRender() {
        // this.el.css('width:100%;height:100%');
        //  const res = biChartService.getCharts();

        // 图标/图标 阴影效果切换
        $('.user a').each(function () {
            // console.log($(this));
            $(this).on('click',function () {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            })
        });

        //显示右侧编辑删除按钮
        $('.charts-items li').each(function (index) {
            $(this).hover(
                function () {
                    $('.btn_ripple').eq(index).show();
                },
                function () {
                    $('.btn_ripple').eq(index).hide();
                }
            )
        });

        //点击显示隐藏菜单
        $('.btn_ripple').each(function () {
            $(this).on('click',function () {
                $('.hide_meun').eq(0).fadeIn('normal');
                $('body').mousedown(function () {
                    $('.hide_meun').eq(0).hide();
                })
            })
        });
    }
};

class AsideNavComponent extends BiBaseComponent{
    constructor() {
        // let charts = biChartService.getCharts();
        // config.data.charts = charts;
        // console.log(charts);
        config.actions.init();
        super(config)

    }
}

export default AsideNavComponent;
