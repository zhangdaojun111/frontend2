import Component from "../../../../lib/component";
import template from './data-pagination.html';
import './data-pagination.scss';
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
        firstRow: 0,
        //rows可选项
        options: [100, 200, 300, 400, 500, 5000],
        tableId: ''
    },
    actions: {
        //分页数据改变
        paginationChanged: function (obj) {//currentPage,rows,firstRow

        },
        //接受rows值和total值
        resetPagination:function ( total ) {
            console.log( "***********" )
            console.log( "***********" )
            console.log( total )
            // let totals=this.data.total;
            // let rows = this.actions.selectSize();
            // return [totals,rows];
        },

        disableClick: function () {
            $(this).unbind("click");
            $(this).addClass('custom-disabled');
        },
        //监听下拉框
        selectSize: function () {
            this.data.currentPage = 1;
            this.data.firstRow = 0;
            this.data.rows=Number(this.el.find('.selectSize').val());
            let selectedRows=this.data.rows;
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            console.log(this.data.sumPage);
            this.el.find('.current-page').html(this.data.currentPage);
            this.el.find('.sumPage').html("共" + this.data.sumPage + "页");
            if(this.data.currentPage<this.data.sumPage){
                this.el.find('.goLast').addClass('custom');
            }
            let obj = {
                currentPage: this.data.currentPage,
                rows: Number(this.data.rows),
                firstRow: this.data.firstRow
            };
            this.actions.paginationChanged(obj);
            console.log("pageSize数据保存：" + Number(this.data.rows));
            dataTableService.savePreference({
                'action': 'pageSize',
                table_id: this.data.tableId,
                pageSize: Number(this.data.rows)
            });
            HTTP.flush();
            return selectedRows;
        },

        //点击下一页
        goNext:function () {
            this.data.rows = this.el.find('.selectSize').val();
            this.data.sumPage = Math.ceil(this.data.total/ this.data.rows);
            console.log(this.data.rows);
            console.log(this.data.sumPage);
            if (this.data.currentPage < this.data.sumPage) {
                this.el.find('.goFirst').addClass('custom');
                this.data.currentPage += 1;
                this.data.firstRow = this.data.rows * (this.data.currentPage - 1);
                this.el.find('.current-page').html(parseInt(this.data.currentPage));
                let obj = {
                    currentPage: this.data.currentPage,
                    rows: Number(this.data.rows),
                    firstRow: this.data.firstRow
                };
                this.actions.paginationChanged(obj);
            }
            console.log(this.data.currentPage);
            console.log(this.data.sumPage);
            if (this.data.currentPage===this.data.sumPage) {
                this.el.find('.goLast').addClass('custom-disabled');
            }
        },
        //点击上一页
        goPre: function () {
            this.data.rows = this.el.find('.selectSize').val();
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            if (this.data.currentPage <= 2) {
                this.el.find('.goFirst').removeClass('custom');
             this.el.find('.goFirst').addClass('custom-disabled');
            }
            if (this.data.currentPage > 1) {
                this.data.currentPage -= 1;
                this.el.find('.goLast').addClass('custom');

                //this.actions.paginationChanged(this.data.currentPage,this.data.rows,this.data.firstRow);
                this.data.firstRow = (this.data.rows * (this.data.currentPage - 1));
                this.el.find('.current-page').html(this.data.currentPage);
                let obj = {
                    currentPage: this.data.currentPage,
                    rows: Number(this.data.rows),
                    firstRow: this.data.firstRow
                };
                this.actions.paginationChanged(obj);
            }
        },
        //点击第一页
        goFirst: function () {
            if (this.data.currentPage === 1) {
                this.actions.disableClick();
                this.el.find('.goFirst').addClass('custom-disabled');
            }
            else {
                this.data.rows = this.el.find('.selectSize').val();
                this.data.currentPage = 1;
                this.data.firstRow = 0;
                this.el.find('.goLast').addClass('custom');
                this.el.find('.goFirst').removeClass('custom');
                this.el.find('.goFirst').addClass('custom-disabled');
                this.el.find('.current-page').html(this.data.currentPage);
                let obj = {
                    currentPage: this.data.currentPage,
                    rows: Number(this.data.rows),
                    firstRow: this.data.firstRow
                };
                this.actions.paginationChanged(obj);
            }
        },
        //点击最后一页
        goLast: function () {

            if (this.data.total === 0) {
                this.data.sumPage = 1;
                this.data.currentPage = 1;
                this.actions.disableClick();
                this.el.find('.goLast').addClass('custom-disabled');
            }

            if (this.data.currentPage === this.data.sumPage) {
                this.actions.disableClick();
            }
            else {
                this.data.currentPage = this.data.sumPage;
                this.data.firstRow = (this.data.sumPage - 1) * this.data.rows;
                this.el.find('.goFirst').addClass('custom');
                this.el.find('.goLast').removeClass('custom');
                this.el.find('.goLast').addClass('custom-disabled');
                this.el.find('.current-page').html(this.data.currentPage);
                let obj = {
                    currentPage: this.data.currentPage,
                    rows: Number(this.data.rows),
                    firstRow: this.data.firstRow
                };
                this.actions.paginationChanged(obj);
            }
        },
        //点击当前页码
        clickCurrentPage: function () {
            if (this.data.total <= 0) {
                this.data.currentPage = 1;
                this.data.sumPage = 1;
                this.el.find('.sumPage').html("共" + this.data.sumPage + "页");
                this.el.find('.selectPage').show();
                this.el.find('.page').hide();
            }
            else {
                this.data.rows = this.el.find('.selectSize').val();
                this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
                this.data.firstRow = (this.data.sumPage - 1) * this.data.rows;
                this.el.find('.sumPage').html("共" + this.data.sumPage + "页");
                this.el.find('.selectPage').show();
                this.el.find('.page').hide();
            }
        },
        //点击确定
        confirm: function () {
            this.data.rows = this.el.find('.selectSize').val();
            let target = Number(this.el.find('.enter-number').val());
            if (this.data.total > 0) {
                this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
                if (target === 0) {
                    this.el.find('.current-page').html(this.data.currentPage);
                    this.el.find('.selectPage').hide();
                    this.el.find('.page').show();
                    let obj = {
                        currentPage: this.data.currentPage,
                        rows: Number(this.data.rows),
                        firstRow: this.data.firstRow
                    };
                    this.actions.paginationChanged(obj);
                }
                if (target <= this.data.sumPage && target !== 0) {
                    this.data.currentPage = target;
                    this.data.firstRow = ((this.data.currentPage - 1) * this.data.rows);
                    this.el.find('.current-page').html(this.data.currentPage);
                    this.el.find('.selectPage').hide();
                    this.el.find('.page').show();
                    let obj = {
                        currentPage: this.data.currentPage,
                        rows: Number(this.data.rows),
                        firstRow: this.data.firstRow
                    };
                    this.actions.paginationChanged(obj);
                }
            }
            if (this.data.total === 0) {
                this.data.sumPage = 1;

                if (target === 0) {
                    this.data.currentPage = 1;
                    this.el.find('.current-page').html(this.data.currentPage);
                    this.el.find('.selectPage').hide();
                    this.el.find('.page').show();
                }
                if (target <= this.data.sumPage && target !== 0) {
                    this.data.currentPage = target;
                    this.data.firstRow = ((this.data.currentPage - 1) * this.data.rows);
                    this.el.find('.current-page').html(this.data.currentPage);
                    this.el.find('.selectPage').hide();
                    this.el.find('.page').show();
                }

                if (target > this.data.sumPage) {
                    alert("最大页面是" + this.data.sumPage + "页")
                }
            }
        },
        //点击取消
        cancel: function () {
            this.el.find('.selectPage').hide();
            this.el.find('.page').show();
        },
        //点击刷新
        refresh: function () {
            this.el.find('.ui-icon-refresh').addClass('rotate');
            setTimeout(() => {
                this.el.find('.ui-icon-refresh').removeClass('rotate');
            }, 2000);
            this.data.rows = this.el.find('.selectSize').val();
            this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
            this.data.firstRow = ((this.data.currentPage - 1) * this.data.rows);
            this.data.currentPage;
            let obj = {
                currentPage: this.data.currentPage,
                rows: Number(this.data.rows),
                firstRow: this.data.firstRow
            };
            this.actions.paginationChanged(obj);
        }

    },


    afterRender: function () {
        this.el.find('.selectPage').hide();
        let select = this.el.find('.selectSize');
        select[0].value = this.data.rows;
        if (this.data.currentPage === 1) {
            this.el.find('.goFirst').addClass('custom-disabled');
        }
        if (this.data.total === 0) {
            this.data.sumPage = 1;
            this.actions.disableClick();
            this.el.find('.goLast').addClass('custom-disabled');
        }
        this.data.currentPage = 1;
        this.actions.disableClick();
        this.data.rows = this.el.find('.selectSize').val();
        this.data.sumPage = Math.ceil(this.data.total / this.data.rows);
        if (this.data.currentPage === this.data.sumPage) {
            this.el.find('.goLast').addClass('custom-disabled');
        }

        this.el.on('click', '.goNext', () => {
            this.actions.goNext();
        });
        this.el.on('click', '.goPre', () => {
            this.actions.goPre();
        });

        this.el.on('click', '.goFirst', () => {
            this.actions.goFirst();
        });

        this.el.on('click', '.goLast', () => {
            this.actions.goLast();
        });

        this.el.on('click', '.current-page', () => {

            this.actions.clickCurrentPage();
        });

        this.el.on('click', '.confirm', () => {
            this.actions.confirm();
        });
        this.el.on('click', '.cancel', () => {
            this.actions.cancel();
        });
        this.el.on('click', '.ui-icon-refresh', () => {

            this.actions.refresh();
        });
        this.el.on('change', '.selectSize', () => {
            this.actions.selectSize();
        });
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