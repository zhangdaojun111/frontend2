import {BiBaseComponent} from '../bi.base.component';

import template from './aside.nav.html';
import './aside.nav.scss';
import { biChartService } from "../../../services/bisystem/bi.chart.service";
import dragula from 'dragula';
import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    data:{
        charts:window.config.charts
    },
    actions:{
        /**
         * 初始化拖拽drag容器 && 设置drag options
         */
        chartDrag() {
            let cells = $('.cell');
            let container = [$('#aside-container .charts-items')[0], ...cells];
            let drake = dragula(container,{
                moves(el, container, handle) {
                    return container.className !== 'cells-container';
                },
                copy(el, source) {
                    return true;
                },

                invalid(el, handle) {
                    return $(el).closest('.canvas-container')[0]
                },
                removeOnSpill: true
            }).on('drop',(el, target, elContainer) => {
                let chartIndex = $(el).attr('data-index');
                let chart = this.getChart(chartIndex);
                chart['componentId'] = $(target).parent('div').attr('component');
                // chart render
                Mediator.publish('chart:drag', chart);
                el.remove();
            });
            return drake;
        },
    },

    afterRender() {
        Mediator.subscribe('hello', (data) => {
            let drake = this.actions.chartDrag();
        })
        // 顶部 新建图标/编辑图标 阴影效果切换
        $('.user a').each(function () {
            // console.log($(this));
            $(this).on('click',function () {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            })
        });

        //滑过 显示编辑删除
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

        //点击 显示隐藏菜单
        $('.btn_ripple').each(function () {
            $(this).on('click',function () {
                let top = $(this).position().top;
                console.log(top);
                $('.hide_meun').eq(0).css('top',top);
                $('.hide_meun').eq(0).fadeIn('normal');
            });
        });
        $('.btn_del').click(function () {
            alert(1);
            $('.hide_meun').eq(0).hide();
        });
        $('.btn_change').click(function () {
            alert(1);
            $('.hide_meun').eq(0).hide();
        });

        // $('body').click(function () {
        //     $('.hide_meun').eq(0).hide();
        // })
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
