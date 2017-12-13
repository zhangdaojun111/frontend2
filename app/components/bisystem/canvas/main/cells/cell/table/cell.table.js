/**
 * Created by birdyy on 2017/7/31.
 * 表格图表配置
 */
import {CellBaseComponent} from '../base';
import template from './cell.table.html';
import "./cell.table.scss";
import handlebars from 'handlebars';
import {PMAPI} from '../../../../../../../lib/postmsg';
import {HTTP} from "../../../../../../../lib/http";

handlebars.registerHelper('ifLast', function (index,row, options) {
    let lastIndex = row[0].length - 1 ;
    if(index == lastIndex){
        return options.inverse(this);
    } else {
        return options.fn(this);
    }

});
let config = {
    template: template,
    data: {
        rows: [],
        chart: {},
        firstLoad:true,      //第一次load后备份数据
        sortIndex:'',    //排序列序号
        sortMode:'normal',    //排序模式（升序，降序，还原）
    },
    binds: [
        {   // 查看 编辑 历史
            event:'click',
            selector:'.table-operate a',
            callback:function (context,event) {
                let data = {
                    table_id: this.data.chart.table_id,
                    real_id:this.data.chart.data.rows[$(context).attr('data-index')][this.data.chart.data.rows[0].length - 1]
                };
                console.log(data);
                this.actions.gridHandle($(context).attr('class'), data);
            }
        },
        {   //列排序
            event:'click',
            selector:'.sort-column',
            callback:function (context,event) {
                this.actions.sortColumn(context,event);
            }
        }
    ],
    actions: {
        //操作列点击事件
        gridHandle: function (type,data) {
                if (type == 'table-view') {
                    let obj = {
                        table_id: data.table_id,
                        parent_table_id:'',
                        parent_real_id: '',
                        parent_temp_id: '',
                        parent_record_id: '',
                        real_id: data.real_id,
                        temp_id: '',
                        record_id: '',
                        btnType: 'view',
                        is_view: 1,
                        in_process: 0,
                        is_batch: 0,
                        form_id: this.data.formId,
                        flow_id: this.data.flowId,
                    };
                    let url = this.actions.returnIframeUrl('/iframe/addWf/', obj);
                    let title = '查看';
                    this.actions.openSelfIframe(url, title);
                }
                if (type == 'table-edit') {
                    let btnType = 'table-edit';
                    let obj = {
                        table_id: data.table_id,
                        parent_table_id: '',
                        parent_real_id: '',
                        parent_temp_id: '',
                        parent_record_id: '',
                        real_id: data.real_id,
                        temp_id: '',
                        btnType: 'edit',
                        in_process: 0,
                        is_batch: 0,
                        form_id: this.data.formId,
                        flow_id: this.data.flowId,
                    };
                    let url = this.actions.returnIframeUrl('/iframe/addWf/', obj);
                    let title = '编辑';
                    this.actions.openSelfIframe(url, title);
                }
                if (type == 'table-history') {
                    let obj = {
                        table_id: data.table_id,
                        real_id: data.real_id
                    };
                    PMAPI.openDialogByIframe(`/iframe/historyApprove/`, {
                        width: 1000,
                        height: 600,
                        title: `历史`,
                        modal: true
                    }, {obj}).then(res => {

                    })
                }
                // //半触发操作
                // if (data.event.srcElement.className == 'customOperate') {
                //     let id = data["event"]["target"]["id"];
                //     for (let d of this.data.customOperateList) {
                //         if (d["id"] == id) {
                //             this.actions.customOperate(d, data);
                //         }
                //     }
                // }
                // //行级操作
                // if (data.event.srcElement.className == 'rowOperation') {
                //     let id = data["event"]["target"]["id"];
                //     for (let ro of this.data.rowOperation) {
                //         if (ro['row_op_id'] == id) {
                //             //在这里处理脚本
                //             //如果前端地址不为空，处理前端页面
                //             this.actions.doRowOperation(ro, data);
                //         }
                //     }
                // }

        },
        //返回数据url
        returnIframeUrl( u,obj ){
            let str = '?';
            for( let o in obj ){
                str += (o + '=' + obj[o] + '&');
            }
            str = str.substring( 0,str.length - 1 );
            return u + str;
        },

        //打开局部的弹窗
        openSelfIframe: function (url, title, w, h) {
            w = window.screen.width * 0.8;
            h = window.screen.height * 0.6;
            PMAPI.openDialogToSelfByIframe(url, {
                width: w || 1400,
                height: h || 800,
                title: title,
                modal: true,
                defaultMax: true,
                // customSize: true
            }).then((data) => {
                if (title === '编辑') {
                    window.location.reload()
                }
            })
        },

        //获取表的表单工作流参数
        getPrepareParmas: function ( data ) {
            return HTTP.post('prepare_params',data )
        },

        /**
         * 用于组装单行表格所需数据
         * @param cellChart = 表格的原始数据
         */
        singleTable(cellChart) {
            let cellData = cellChart['chart'];
            const columnNum = cellData['columnNum']; // 显示多少列
            let rows = Math.ceil(cellData['columns'].length / columnNum); // 计算出显示多少行
            let list = []; // 组合 字段的name 和 value 成一个列表
            let columnList = []; // 获取每列字段
            let tableRows = []; // 单行表格每行的数据

            // 组装列字段和列数据
            cellData['columns'].forEach((title, index) => {
                list.push(title['name']);
                list.push(cellData['data']['rows'][0][index]);
            });

            // 显示每列的数据
            for (let i = 0; i < columnNum; i++) {
                columnList.push(list.slice(i * rows * 2, (i * rows + rows) * 2));
            }

            // 把每列的数据转化为行
            for (let i = 0; i < rows ; i++) {
                let row = [];
                columnList.forEach((val, index, items) => {
                    if (index === items.length - 1) {
                        if (val.length < rows * 2) {
                            for (let i = 0; i < (rows * 2 - val.length); i++) {
                                val.push(' ');
                            }
                        }
                    }
                    val.slice(i * 2, i * 2 + 2).map(v => {
                        row.push(v);
                    });
                });
                tableRows.push(row);
            }
            return tableRows;
        },
        /**
         * 点击表头进行列排序
         * @param context
         * @param event
         */
        sortColumn:function (context,event) {
            this.actions.setSortParam(context,event);
        },
        /**
         * 监听排序点击，记录排序参数
         * @param context
         * @param event
         */
        setSortParam:function (context,event) {
            let $icon = $(context).find('i');
            if($icon[0].className === 'normal' || ''){
                this.data.sortMode = 'asc';
            }else if($icon[0].className.includes('asc')){
                this.data.sortMode = 'desc';
            }else if($icon[0].className.includes('desc')){
                this.data.sortMode = 'normal';
            }else{
                console.log('error');
            }
            this.data.sortIndex = $(context)[0].cellIndex;
            //使用排序后的数据刷新表格
            this.reload();
        },
        sortTableData:function (data) {
            console.log(data.chart);
            if(this.data.sortMode === 'normal'){
                //直接使用原始数据刷新表格
                return data;
            }else{
                //需要进行排序
                let sortIndex = this.data.sortIndex;
                let sortData = data.chart.data.rows;

                if(this.data.sortMode === 'asc'){
                    sortData.sort(function (a,b) {
                        return a[sortIndex] - b[sortIndex];
                    })
                }else{
                    sortData.sort(function (a,b) {
                        return b[sortIndex] - a[sortIndex];
                    })
                }
            }
        },
        setSortIcon:function () {
            this.el.find(`thead tr th:eq(${this.data.sortIndex}) i`).attr('class',`${this.data.sortMode}`);
        }
    },
    afterRender() {
        // 向agid服务器获取数据 flow_id，form_id
        let prepareParmas = this.actions.getPrepareParmas({table_id: this.data.chart.table_id});
        Promise.all([prepareParmas]).then(res => {
            this.data.flowId = (res[0]['data']['flow_data'][0] && res[0]['data']['flow_data'][0]['flow_id']) || '';
            this.data.formId = res[0]['data']['form_id'];
        });
        HTTP.flush();
        //操作界面 控制
        if(this.data.chart.editInterface && this.data.chart.editInterface == 1){
            this.el.find('.bi-table').addClass('editInterface');
        }else{
            this.el.find('.bi-table').removeClass('editInterface');
        }

        //pdf页面加overflow:hidden
        if(window.config.pdf){
            this.el.find('.bi-table').addClass('download-pdf');
        }
        //reload设置排序图标
        this.actions.setSortIcon();
    },

    beforeRender: function () {
        let data;
        //备份数据（仅一次），用于展示最初顺序
        if(this.data.firstLoad){
            this.data.firstLoad = false;
            data = {
                cell:this.data.cell,
                chart:this.data.chart
            };
            this.backupData = $.extend(true,{},data);
        }else{
            //对data进行排序后，执行init
            data = $.extend(true,{},this.backupData);
            this.actions.sortTableData(data);
        }
        let cellChart = CellTableComponent.init(data);
        $.extend(true, this.data, cellChart);
    }
};


export class CellTableComponent extends CellBaseComponent {
    // constructor(cellChart) {
    //     config.data.chart = cellChart['chart'] ? cellChart['chart'] : null;
    //     config.actions.init(cellChart);
    //     super(config);
    // }
    constructor(extendConfig) {
        super($.extend(true,{},config,extendConfig));
    }

    static init(cellChart) {
        //格式化数据
        let data = cellChart.chart.data.rows;
        for (let k in data){
            for (let n in data[k]){
                let temp = data[k][n];
                if(CellTableComponent.isNumber(temp)){
                    //自定义设置精度
                    let acc = cellChart.chart.customAccuracy?cellChart.chart.customAccuracy:0;
                    data[k][n] = CellTableComponent.numFormat(temp,acc);
                }
            }
        }

        if (cellChart['chart']['single'] === 1) {
            if (cellChart['chart']['data']['rows'][0]) {
                CellTableComponent.singleTable(cellChart);
            }
        }
        return cellChart;
    }

    /**
     * 用于组装单行表格所需数据
     * @param cellChart = 表格的原始数据
     */
   static singleTable(cellChart) {
        let cellData = cellChart['chart'];
        const columnNum = cellData['columnNum']; // 显示多少列
        let rows = Math.ceil(cellData['columns'].length / columnNum); // 计算出显示多少行
        let list = []; // 组合 字段的name 和 value 成一个列表
        let columnList = []; // 获取每列字段
        let tableRows = []; // 单行表格每行的数据

        // 组装列字段和列数据
        cellData['columns'].forEach((title, index) => {
            list.push(title['name']);
            list.push(cellData['data']['rows'][0][index]);
        });

        // 显示每列的数据
        for (let i = 0; i < columnNum; i++) {
            columnList.push(list.slice(i * rows * 2, (i * rows + rows) * 2));
        }

        // 把每列的数据转化为行
        for (let i = 0; i < rows ; i++) {
            let row = [];
            columnList.forEach((val, index, items) => {
                if (index === items.length - 1) {
                    if (val.length < rows * 2) {
                        for (let i = 0; i < (rows * 2 - val.length); i++) {
                            val.push(' ');
                        }
                    }
                }
                val.slice(i * 2, i * 2 + 2).map(v => {
                    row.push(v);
                });
            });
            tableRows.push(row);
        }
        cellChart.rows = tableRows;
    }
    static numFormat(num,acc) {
        num = parseFloat(Number(num)).toString().split(".");
        num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
        if(acc){
            if(num[1]){
                num[1] = '0.' + num[1];
                num[1] = parseFloat(num[1]).toFixed(acc);
                num[1] = num[1].replace('0.','');
            }else{
                num[1]  = new String('0').repeat(acc);
            }
        }
        num = num.join(".");
        return num;
    }

    static isNumber(value) {         //验证是否为数字
        let patrn = /^(-)?\d+(\.\d+)?$/;
        return !(patrn.exec(value) === null || value === "");
    }
}

CellTableComponent.config = config;