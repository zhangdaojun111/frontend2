/**
 * Created by zj on 2017/12/1.
 */
import dataTableAgGridOld from '../../../../../../../app/components/dataGrid/data-table-page/data-table-agGrid/data-table-agGrid'
import {dgcService} from "../../../../../../../app/services/dataGrid/data-table-control.service";
import {TabService} from "../../../../../../../app/services/main/tabService";
import agGrid from "../../../../../../../app/components/dataGrid/agGrid/agGrid";
import FloatingFilter from "../../../../../../../app/components/dataGrid/data-table-toolbar/floating-filter/floating-filter";
import {PMAPI, PMENUM} from '../../../../../../../app/lib/postmsg';
let config = {
    data: {
    },
    actions: {
        createHeaderColumnDefs: function (edit) {
            let columnDefs = [],
                headerArr = [],
                columnArr = [],
                otherCol = [];
            for (let col of this.data.fieldsData) {
                headerArr.push({data: col, header: col["name"].split('->')})
            }

            for (let data of headerArr) {
                for (let i = 0, length = data.header.length; i < length; i++) {
                    this.actions.getArr(i, 0, columnArr, length, data, otherCol, edit);
                }
            }

            for (let col of columnArr) {
                columnDefs.push(col);
            }

            //在途添加状态
            if (this.data.viewMode == 'in_process') {
                columnDefs.unshift(dgcService.in_process_state);
            }
            //添加选择列
            if (this.data.viewMode != 'reportTable2') {
                columnDefs.unshift(
                    dgcService.selectCol
                );
            }
            //添加序号列
            if (this.data.viewMode != 'reportTable2') {
                let number = dgcService.numberCol;
                number['headerCellTemplate'] = this.actions.resetPreference();
                columnDefs.unshift(number);
            }
            //添加操作列
            let operate = dgcService.operationCol;
            //操作展示方式
            if (this.data.menuType) {

            } else {
                operate["width"] = this.data.operateColWidth;
                operate["cellStyle"] = {'font-style': 'normal'};
                operate["cellRenderer"] = (params) => {
                    return this.actions.operateCellRenderer(params)
                }
            }

            columnDefs.unshift(dgcService.groupCol);
            if (this.data.viewMode != 'reportTable2') {
                columnDefs.unshift(operate)
            }
            return columnDefs;
        },

    },
    afterRender: function () {
        this.showLoading();
        window.top.hideMiniForm?'':(window.top.hideMiniForm={});
        window.top.hideMiniForm[this.data.tableId]=()=>{
            $('.dataTableMiniForm').hide();
        };
        //发送表单tableId（订阅刷新数据用
        if (dgcService.needRefreshMode.indexOf(this.data.viewMode) != -1 && !this.data.departmentDiary) {
            TabService.onOpenTab(this.data.tableId).done((result) => {
                if (result.success === 1) {
                    // console.log("post open record success");
                } else {
                    console.log("post open record failed")
                }
            });
        }
        try {
            dgcService.accuracy = window.config.sysConfig.accuracy || 1000;
        } catch (e) {
        }
        let gridData = {
            columnDefs: this.columnDefs,
            rowData: this.data.rowData,
            footerData: this.data.footerData,
            floatingFilter: true,
            fieldsData: this.data.fieldsData,
            onColumnResized: this.actions.onColumnResized,
            onSortChanged: this.actions.onSortChanged,
            onDragStopped: this.actions.onDragStopped,
            onCellClicked: this.actions.onCellClicked,
            onCellValueChanged: this.actions.onCellValueChanged,
            onRowDoubleClicked: this.actions.onRowDoubleClicked,
            onCellDoubleClicked: this.actions.onCellDoubleClicked,
            setRowStyle: this.actions.setRowStyle,
            rowDataChanged: this.actions.rowDataChanged,
            onRowSelected: this.actions.onRowSelected
        };
        this.agGrid = new agGrid(gridData);
        this.append(this.agGrid, this.el.find('#data-agGrid'));

        this.floatingFilterCom = new FloatingFilter();
        this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;

        //渲染cache数据
        if (window.config.data_cached == 1 && this.data.viewMode == 'normal' && this.data.cacheData) {
            console.log('加载cache数据');
            this.actions.renderCacheData(window.config.cached_data);
            try {
                this.data.showTabs(1);
                this.hideLoading();
            } catch (e) {
            }
            console.timeEnd('渲染时间');
            return;
        }

        if (this.data.viewMode == 'normal' && this.data.cacheData && window.config.cached_data) {
            let data = window.config.cached_data;
            console.log("只加载Header的cache数据");
            console.log(data);
            console.log(window.config);
            //表头
            let headerRes = [data.preferences, data.column_list, data.tab_page, data.operation, data.prepare_params];
            this.actions.setHeaderData(headerRes);
            this.actions.getGridData();
            return;
        }

        if (this.data.viewMode == 'in_process') {
            this.data.noNeedCustom = true;
        }
        if (this.data.viewMode == 'deleteHanding') {
            PMAPI.getIframeParams(window.config.key).then((res) => {
                this.data.deleteHandingData = res.data.obj.deleteHandingData || [];
                this.actions.getHeaderData();
            })
        }

        PMAPI.subscribe(PMENUM.aside_fold, () => {
            console.log($('.ui-dialog').width());
            $('.ui-dialog').width('calc(100% - 3px)');
        });
        this.actions.getHeaderData();
    },
    beforeDestory(){
        window.top.hideMiniForm[this.data.tableId]=null;
        delete window.top.hideMiniForm[this.data.tableId];
    }
};

class dataTableAgGrid extends dataTableAgGridOld{
    constructor(data, newconfig) {
        super(data, $.extend(true, {}, config, newconfig));
    }
}
export default dataTableAgGrid;