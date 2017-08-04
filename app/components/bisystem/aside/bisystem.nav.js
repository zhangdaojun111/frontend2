import {BiBaseComponent} from '../bi.base.component';

import template from './bisystem.nav.html';
import './bisystem.nav.scss';

let AsideConfig = {
    template: template,

    actions:{

    },

    afterRender:function () {

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
        super(AsideConfig)
    }
}

export default AsideNavComponent;
