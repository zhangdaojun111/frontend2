
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

//点击出现弹出框
$('.btn_ripple').each(function (index) {
    $(this).click(function () {
        // console.log(index);

    })
})