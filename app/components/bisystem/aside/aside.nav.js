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
    actions:{},

    afterRender() {
        //加载左侧导航
        this.data.charts.forEach((val,index) => {
            let chartsComponent = new ChartsComponent(val);
            this.append(chartsComponent,this.el.find('.charts-items'));
        });

        Mediator.subscribe('init:drag', (data) => {
            let drake = this.actions.chartDrag();
        });

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
            $(this).on('click',function (event) {
                let flag = true;
                let top = $(this).offset().top - $('.charts-container').offset().top - 81;
                const hideMenuHeight = $('.hide_meun').height();
                $('.hide_meun').eq(0).css('top',top);
                $('.hide_meun').eq(0).fadeIn('normal');
                //底部显示 不超过底部
                if (top>625){
                    $('.hide_meun').eq(0).css('top',top-hideMenuHeight);
                }
                event.stopPropagation();
                //点击消失
                $(document).bind('click',function () {
                    if (flag){
                        $('.hide_meun').eq(0).fadeOut();
                        flag = false;
                    }else{
                        return;
                    }
                })
            });
        });

        //点击 跳转页面
        $('.btn_del').click(function () {
            confirm('确定删除吗？');
            $('.hide_meun').eq(0).fadeOut();
        });
        $('.btn_change').click(function () {
            alert('这里是跳转路由');
            $('.hide_meun').eq(0).fadeOut();
        });

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
        })
    },
    firstAfterRender() {
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
