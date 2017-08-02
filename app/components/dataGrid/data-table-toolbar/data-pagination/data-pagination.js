import Component from "../../../../lib/component";
import template from './data-pagination.html';
import './data-pagination.scss';

let config = {
    template: template,
    data: {
        pagination: true,
        //数据总条数
        total: 0,
        //每页显示数量
        rows: 100,
        //当前页数
        currentPage: 1,
        //分页总数
        sumPage: 8,
        //分页后第一条是总数据多少条
        firstRow: 1,
        //rows可选项
        options: [100, 200, 300, 400, 500, 5000],
    },
    actions: {
        //分页数据改变
        paginationChanged: function ( obj ) {//currentPage,rows,firstRow
        }
    },
    afterRender: function () {

        $(".selectPage").hide();
        //监听下拉框的值
        $(".selectSize").change(() => {
            this.data.currentPage = 1;
            this.data.firstRow = 0;
            this.data.rows = $(".selectSize").val()
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            console.log(this.data.sumPage);
            $('.current-page').html(this.data.currentPage);
            $(".sumPage").html("共" + this.data.sumPage + "页");

            let obj = {
                currentPage: this.data.currentPage,
                rows: this.data.rows,
                firstRow: this.data.firstRow
            }
            this.actions.paginationChanged(obj);
        }),
            //点击下一页 当前页面数加1
            $(".goNext").click(() => {
                this.data.rows = $(".selectSize").val()
                this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
                if (this.data.currentPage < this.data.sumPage) {
                    console.log(this.data.currentPage)
                    console.log(this.data.currentPage.type)
                    this.data.currentPage += 1;
                    this.data.firstRow = this.data.rows * (this.data.currentPage - 1);
                    //this.actions.paginationChanged(this.data.currentPage,this.data.rows,this.data.firstRow);
                    //console.log(this.actions.paginationChanged());
                    $('.current-page').html(parseInt(this.data.currentPage));
                    console.log(this.data.currentPage)
                }

            }),
            //点击上一页 当前页面数减1
            $(".goPre").click(() => {
                this.data.rows = $(".selectSize").val();
                if (this.data.currentPage > 1) {
                    this.data.currentPage -= 1;
                    //this.actions.paginationChanged(this.data.currentPage,this.data.rows,this.data.firstRow);
                    this.data.firstRow = (this.data.rows * (this.data.currentPage - 1));
                    console.log(this.actions.paginationChanged());
                    $('.current-page').html(this.data.currentPage);
                }
            })
        //直接跳到第一页
        $(".goFirst").click(() => {
            this.data.rows = $(".selectSize").val();
            this.data.currentPage = 1;
            this.data.firstRow = 0;
            $('.current-page').html(this.data.currentPage);

        })
        //直接跳到最后一页
        $(".goLast").click(() => {
            this.data.rows = $(".selectSize").val();
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            this.data.currentPage = this.data.sumPage;
            this.data.firstRow = (this.data.sumPage - 1) * this.data.rows;
            $('.current-page').html(this.data.currentPage);

        }),

            //点击当前得页码  跳出可选择页码的文本框
            $(".current-page").click(() => {
                this.data.rows = $(".selectSize").val();
                this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
                this.data.firstRow = (this.data.sumPage - 1) * this.data.rows;
                $(".sumPage").html("共" + this.data.sumPage + "页");
                $(".selectPage").show();

            })
        //点击确定按钮跳转到目标页面
        $(".confirm").click(() => {
            this.data.rows = $(".selectSize").val();
            let target = $(".enter-number").val();
            if (target <= this.data.sumPage) {
                this.data.currentPage = Number(target);
                this.data.firstRow = (this.data.sumPage - 1) * this.data.rows;
                $('.current-page').html(parseInt(this.data.currentPage));
                $(".selectPage").hide()
            }
            console.log(target);
        }),
            //点击取消
            $(".cancel").click(() => {
                $(".selectPage").hide()
            })
        //刷新
        $(".ui-icon-refresh").click(() => {

            this.actions.paginationChanged();
        })
    }

}

class dataPagination extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);

    }

}

export default dataPagination;