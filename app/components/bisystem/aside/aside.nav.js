import {BiBaseComponent} from '../bi.base.component';

import template from './aside.nav.html';
import './aside.nav.scss';

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
            $(this).on('click',function (event) {
                let flag = true;
                let top = $(this).position().top;
                $('.hide_meun').eq(0).css('top',top);
                $('.hide_meun').eq(0).fadeIn('normal');
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
            $('.charts-item').css('display','none');

            //填空值时 仍显示
            if($('.filter-match').val().length<=0){
                $('.charts-item').css('display','block');
                return;
            }

            //模糊匹配 遍历所有 将匹配的显示出来
            $('.charts-item').each(function (index) {
                if ($('.charts-item').eq(index).text().substr(0,$('.filter-match').val().length) == $('.filter-match').val()){
                    $('.charts-item').eq(index).css('display','block');
                }
            })
        })
    }
};

class AsideNavComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }
}

export default AsideNavComponent;
