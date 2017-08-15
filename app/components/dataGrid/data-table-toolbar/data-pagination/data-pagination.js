import Component from "../../../../lib/component";
import template from './data-pagination.html';
import './data-pagination.scss';
import msgBox from '../../../../lib/msgbox';
import {dataTableService} from "../../../../services/dataGrid/data-table.service";
import {HTTP} from "../../../../lib/http"
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
        tableId:''
    },
    actions: {
        //分页数据改变
        paginationChanged: function ( obj ) {//currentPage,rows,firstRow

        },
        disableClick:function () {
            $(this).unbind("click");
            $(this).css({
                "opacity": "0.3",
                "filter": "alpha(opacity=30)"
            });
        },
        setPagination: function () {
            let select = this.el.find( '.selectSize' )
            select[0].value = this.data.rows;
            if (this.data.currentPage===1){
                $(".goFirst").css({
                    "opacity": "0.3",
                    "filter": "alpha(opacity=30)"
                });
            }
            if (this.data.total===0){
                this.data.sumPage=1;
                this.actions.disableClick();
                $(".goLast").css({
                    "opacity": "0.3",
                    "filter": "alpha(opacity=30)"
                });

            }
            this.data.currentPage=1;
            this.actions.disableClick();

            this.data.rows = $(".selectSize").val();
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            if(this.data.currentPage===this.data.sumPage){
                $(".goLast").css({
                    "opacity": "0.3",
                    "filter": "alpha(opacity=30)"
                });
            }
        },
        refreshPagination: function (data) {
            
        }
    },
    afterRender: function () {
        this.actions.setPagination();

        $(".selectPage").hide();
        //监听下拉框的值
        $(".selectSize").change(() => {
            this.data.currentPage = 1;
            this.data.firstRow = 0;
            this.data.rows = $(".selectSize").val()
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            $('.current-page').html(this.data.currentPage);
            $(".sumPage").html("共" + this.data.sumPage + "页");
            let obj = {
                currentPage: this.data.currentPage,
                rows: Number(this.data.rows),
                firstRow: this.data.firstRow
            };
            this.actions.paginationChanged(obj);
            console.log( "pageSize数据保存：" + Number(this.data.rows) );
            dataTableService.savePreference({
                'action': 'pageSize',
                table_id: this.data.tableId,
                pageSize: Number(this.data.rows)
            });
            HTTP.flush();
        });
        //点击下一页 当前页面数加1
        $(".goNext").click(() => {
            this.data.rows = $(".selectSize").val();
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);

            if (this.data.currentPage < this.data.sumPage) {
                $(".goFirst").css({
                    "opacity": "1",
                    "filter": "alpha(opacity=100)"
                });

                this.data.currentPage += 1;
                this.data.firstRow = this.data.rows * (this.data.currentPage - 1);

                $('.current-page').html(parseInt(this.data.currentPage));
                let obj = {
                    currentPage: this.data.currentPage,
                    rows: Number(this.data.rows),
                    firstRow: this.data.firstRow
                };
                this.actions.paginationChanged(obj);
            }
            if (this.data.currentPage===this.data.sumPage){
                $(".goLast").css({
                    "opacity": "0.3",
                    "filter": "alpha(opacity=30)"
                });
            }

        });
        //点击上一页 当前页面数减1
        $(".goPre").click(() => {
            this.data.rows = $(".selectSize").val();
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            if(this.data.currentPage<=2){
                $(".goFirst").css({
                    "opacity": "0.3",
                    "filter": "alpha(opacity=30)"
                });
            }
            if (this.data.currentPage > 1) {
                this.data.currentPage -= 1;
                $(".goLast").css({
                    "opacity": "1.0",
                    "filter": "alpha(opacity=100)"
                });
                //this.actions.paginationChanged(this.data.currentPage,this.data.rows,this.data.firstRow);
                this.data.firstRow = (this.data.rows * (this.data.currentPage - 1));
                $('.current-page').html(this.data.currentPage);
                let obj = {
                    currentPage: this.data.currentPage,
                    rows: Number(this.data.rows),
                    firstRow: this.data.firstRow
                }
                this.actions.paginationChanged(obj);
            }
        });
        //直接跳到第一页
        $(".goFirst").click(() => {
            //如果页面小于1 禁止点击
            $(".goFirst").css({
                "opacity": "0.3",
                "filter": "alpha(opacity=30)"
            });

            if (this.data.currentPage===1){
                this.actions.disableClick();
            }
               else {
                this.data.rows = $(".selectSize").val();
                this.data.currentPage = 1;
                this.data.firstRow = 0;
                $(".goLast").css({
                    "opacity": "1.0",
                    "filter": "alpha(opacity=100)"
                });

                $('.current-page').html(this.data.currentPage);
                let obj = {
                    currentPage: this.data.currentPage,
                    rows: Number(this.data.rows),
                    firstRow: this.data.firstRow
                };
                this.actions.paginationChanged(obj);
            }
        });

        //直接跳到最后一页
        $(".goLast").click(() => {

            if (this.data.total===0){
                this.data.sumPage=1;
                this.data.currentPage=1;
                this.actions.disableClick();
                $(".goLast").css({
                    "opacity": "0.3",
                    "filter": "alpha(opacity=30)"
                });
            }


            if (this.data.currentPage===this.data.sumPage){
                this.actions.disableClick();
            }
            else {
                this.data.currentPage = this.data.sumPage;
                this.data.firstRow = (this.data.sumPage - 1) * this.data.rows;
                $(".goFirst").css({
                    "opacity": "1.0",
                    "filter": "alpha(opacity=100)"
                });
                $(".goLast").css({
                    "opacity": "0.3",
                    "filter": "alpha(opacity=30)"
                });


                $('.current-page').html(this.data.currentPage);
                let obj = {
                    currentPage: this.data.currentPage,
                    rows: Number(this.data.rows),
                    firstRow: this.data.firstRow
                };
                this.actions.paginationChanged(obj);
            }
        });


        //点击当前得页码  跳出可选择页码的文本框
        $(".current-page").click(() => {
            if (this.data.total<=0){

                this.data.currentPage=1;
                this.data.sumPage=1;
                $(".sumPage").html("共" + this.data.sumPage + "页");
                $(".selectPage").show();
                $(".page").hide();
            }
            else {
            this.data.rows = $(".selectSize").val();
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            this.data.firstRow = (this.data.sumPage - 1) * this.data.rows;
            $(".sumPage").html("共" + this.data.sumPage + "页");
            $(".selectPage").show();
            $(".page").hide();
            }
        });

        //点击确定按钮跳转到目标页面

        $(".confirm").click(() => {

            this.data.rows = $(".selectSize").val();
            let target = Number($(".enter-number").val());

            if (this.data.total>0){
                this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
                if (target===0){
                    $('.current-page').html(parseInt(this.data.currentPage));
                    $(".selectPage").hide();
                    $(".page").show();
                    let obj = {
                        currentPage: this.data.currentPage,
                        rows: Number(this.data.rows),
                        firstRow: this.data.firstRow
                    };
                    this.actions.paginationChanged(obj);
                }
                if (target <= this.data.sumPage&&target!==0) {
                    this.data.currentPage = target;
                    this.data.firstRow =((this.data.currentPage - 1) * this.data.rows);
                    $('.current-page').html(parseInt(this.data.currentPage));
                    $(".selectPage").hide();
                    $(".page").show();
                    let obj = {
                        currentPage: this.data.currentPage,
                        rows: Number(this.data.rows),
                        firstRow: this.data.firstRow
                    };
                    this.actions.paginationChanged(obj);
                }
            }
            // this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            if(this.data.total===0) {
                this.data.sumPage=1;

                if (target===0){
                    this.data.currentPage=1;
                    $('.current-page').html(parseInt(this.data.currentPage));
                    $(".selectPage").hide();
                    $(".page").show();

                }
                if (target <= this.data.sumPage&&target!==0) {
                    this.data.currentPage = target;
                    this.data.firstRow =((this.data.currentPage - 1) * this.data.rows);
                    $('.current-page').html(parseInt(this.data.currentPage));
                    $(".selectPage").hide();
                    $(".page").show();
                }
            if (target>this.data.sumPage) {
                msgBox.alert("最大页面是" + this.data.sumPage + "页")
            }
            }
        });
        //点击取消
        $(".cancel").click(() => {
            $(".selectPage").hide();
            $(".page").show();
        });
        //刷新
        $(".ui-icon-refresh").click(() => {
            $(".ui-icon-refresh").addClass('rotate');
            setTimeout(()=>{
                $(".ui-icon-refresh").removeClass('rotate');
            },2000);
            this.data.rows = $(".selectSize").val();
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            this.data.firstRow =((this.data.currentPage - 1) * this.data.rows);
            this.data.currentPage;
            let obj = {
                currentPage: this.data.currentPage,
                rows: Number(this.data.rows),
                firstRow: this.data.firstRow
            };
            this.actions.paginationChanged(obj);
        })
    }

};

class dataPagination extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);

    }

}

export default dataPagination;