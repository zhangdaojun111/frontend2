import {BiBaseComponent} from '../bi.base.component';

import template from './aside.nav.html';
import './aside.nav.scss';
import { biChartService } from "../../../services/bisystem/bi.chart.service";

let config = {
    template: template,
    data:{
        charts:window.config.charts
    },
    actions:{},

    afterRender() {

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
}

export default AsideNavComponent;
