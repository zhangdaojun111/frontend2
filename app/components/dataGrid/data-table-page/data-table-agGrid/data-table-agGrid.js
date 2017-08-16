import Component from "../../../../lib/component";
import template from './data-table-agGrid.html';
import './data-table-agGrid.scss';
import {HTTP} from "../../../../lib/http";
import Mediator from "../../../../lib/mediator";
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import msgBox from '../../../../lib/msgbox';
import agGrid from "../../agGrid/agGrid";
import {dataTableService} from "../../../../services/dataGrid/data-table.service";
import {workflowService} from "../../../../services/workflow/workflow.service";
import {FormService} from "../../../../services/formService/formService";
import {dgcService} from "../../../../services/dataGrid/data-table-control.service";
import {fieldTypeService} from "../../../../services/dataGrid/field-type-service";
import FloatingFilter from "../../data-table-toolbar/floating-filter/floating-filter";
import customColumns from "../../data-table-toolbar/custom-columns/custom-columns";
import groupGrid from "../../data-table-toolbar/data-table-group/data-table-group";
import dataPagination from "../../data-table-toolbar/data-pagination/data-pagination";
import delSetting from '../../data-table-toolbar/data-table-delete/data-table-delete';
import importSetting from '../../data-table-toolbar/data-table-import/data-table-import';
import exportSetting from '../../data-table-toolbar/data-table-export/data-table-export';

import expertSearch from "../../data-table-toolbar/expert-search/expert-search";


let config = {
    template: template,
    data: {
        tableId: '5318_EHFuJD7Ae76c6GMPtzdiWH',
        formId: '',
        tableType: '',
        parentTableId: '',
        parentRealId: '',
        parentTempId: '',
        parentRecordId: '',
        rowId: '',
        fieldId: '',
        source_field_dfield: '',
        base_buildin_dfield: '',
        fieldContent: null,
        rowData:[],
        //iframe弹窗key
        key: '',
        // 提醒颜色
        remindColor: {remind_color_info: {}, info: ''},
        //数据总数
        total: 0,
        //展示的数据行数
        rows: 100,
        //第一条数据位置
        first: 0,
        //头部字段属性字典{f1： info}
        colsDict: {},
        //字段id对应field_id
        id2field: {},
        //字段field_id对应id
        field2id: {},
        //操作列
        menuType: false,
        //操作列的宽度
        operateColWidth: 0,
        //自定义操作
        customOperateList: [],
        //自定义行机操作
        rowOperation: [],
        //是否固化
        isFixed: false,
        //模式
        viewMode: 'normal',
        //floatingFilter搜索参数
        searchValue: [],
        //floatingFilter搜索参数
        searchOldValue: [],
        //floatingFilter搜索参数
        queryList: {},
        //请求数据参数
        commonQueryData:[],
        //没有定制列
        noNeedCustom: false,
        postData: [],
        //定制列（列宽）
        colWidth: {},
        //定制列（固定列）
        fixCols: {l: [], r: []},
        //定制列（列排序）
        orderFields: [],
        //定制列（隐藏列）
        ignoreFields: [],
        //分组
        myGroup: [],
        //分组列数据
        groupFields: [],
        //原始字段数据
        fieldsData: [],
        //临时查询数据
        temporaryCommonQuery:[],
        //高级查询需要的字段信息
        expertSearchFields: [],
        //定制列需要字段信息
        customColumnsFields: [],
        //搜索参数
        filterParam: {expertFilter:[], filter: [], is_filter: 0, common_filter_id: '', common_filter_name: ''},
        //是否第一次渲染agGrid
        firstRender: true,
        //权限
        permission:{add: 1, calendar: 1, complex_search: 1, custom_field: 1, custom_width: 1, delete: 1, download: 1, edit: 1, group: 1, in_work: 1, search: 1, upload: 1, view: 1 ,setting: 1,cell_edit:1,new_window:1},
        //是否分组
        groupCheck: false,
        //是否显示定制列panel
        isShowCustomPanel: false,
        //排序方式
        frontendSort: true,
        //排序参数
        sortParam: {sortOrder:'',sortField:'',sort_real_type:''},
        //是否显示floatingFilter
        isShowFloatingFilter: false,
        //批量工作流ids
        batchIdList: [],
        //选择的数据
        selectIds: [],
        //编辑模式
        isEditable: false,
        //第一次进入加载footer数据
        firstGetFooterData: true,
        //是否返回在途footer数据
        inProcessFooter: false,
        //是否有分页
        pagination: false,
        //对应关系增加的数据
        correspondenceAddList: [],
        //对应关系减少的数据
        correspondenceRemoveList: [],
        //对应关系选择的数据
        correspondenceSelectedList: [],
        //对应关系选择的数据
        correspondenceSelectedData: []
    },
    //生成的表头数据
    columnDefs: [],
    actions: {
        createHeaderColumnDefs: function () {
            let columnDefs = [],
                headerArr = [],
                columnArr = [],
                otherCol = []
            for (let col of this.data.fieldsData) {
                headerArr.push({data: col, header: col["name"].split('->')})
            }

            for (let data of headerArr) {
                for (let i = 0, length = data.header.length; i < length; i++) {
                    this.actions.getArr(i, 0, columnArr, length, data, otherCol);
                }
            }

            for (let col of columnArr) {
                columnDefs.push(col);
            }

            //在途添加状态
            if( this.data.viewMode == 'in_process' ){
                columnDefs.unshift( dgcService.in_process_state );
            }
            //添加选择列
            columnDefs.unshift(
                dgcService.selectCol
            );
            //添加序号列
            let number = dgcService.numberCol;
            number['headerCellTemplate'] = this.actions.resetPreference();
            columnDefs.unshift(number);
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

            columnDefs.unshift( dgcService.groupCol );
            columnDefs.push(operate)
            return columnDefs;
        },
        getArr: function (i, n, column, len, data, otherCol) {
            if (i == n) {
                this.actions.createHeader(column, i, len, data, otherCol)
            } else {
                for (let col of column) {
                    if (data.header[n] == col['headerName'] && col['children']) {
                        this.actions.getArr(i, n + 1, col['children'], len, data, otherCol);
                    }
                }
            }
        },
        createHeader: function (column, i, len, data, otherCol) {
            let key = 0;
            for (let col of column) {
                if (col['headerName'] == data.header[i]) {
                    key++;
                }
            }
            if (key == 0) {
                if (i != ( len - 1 )) {
                    column.push({
                        headerName: data.header[i],
                        groupId: data.header[i],
                        marryChildren: false,
                        children: []
                    })
                } else {//多级表头最底层节点，作为一列
                    this.data.id2field[data.data.id] = data.data.field;
                    this.data.field2id[data.data.field] = data.data.id;
                    //id列不添加多级索引不添加
                    if (data.data["field"] == "_id" || data.data['dtype'] == 9) {
                        return;
                    }
                    let headClass = fieldTypeService.numOrText(data.data["real_type"]) ? 'header-style-r' : 'header-style-l';

                    //解决后台配置字段之后类排序没有该字段导致该列不显示的BUG
                    if (this.data.orderFields.indexOf(data.data["field"]) == -1) {
                        otherCol.push(data.data["field"]);
                    }

                    let fixArr = this.data.fixCols.l.concat(this.data.fixCols.r);

                    let obj = {
                        headerName: data.header[i],
                        // headerCellTemplate: (params) => {
                        //     return this.headerCellRenderer(params);
                        // },
                        // headerComponent:HeaderComponent,
                        // headerComponentFramework:<{new():HeaderComponent}>HeaderComponent,
                        tableName: data.data['table_name'],
                        id: data.data["id"],
                        field: data.data["field"],
                        enableCellChangeFlash: true,
                        suppressMenu: true,
                        suppressToolPanel: true,
                        suppressMovable: fixArr.indexOf(data.data["field"]) == -1 ? false : true,
                        field_content: data.data['field_content'],
                        colId: data.data["field"],
                        source_table_id: data.data["source_table_id"] || '',
                        base_buildin_dfield: data.data["base_buildin_dfield"] || '',
                        source_field_dfield: data.data["source_field_dfield"] || '',
                        source_table_name: data.data["source_table_name"] || '',
                        is_correspondence_num: data.data["is_correspondence_num"] || 0,
                        dtype: data.data["dtype"],
                        dsearch: data.data["dsearch"],
                        child_table_id: data.data["child_table_id"],
                        count_table_id: data.data["count_table_id"],
                        dinput_type: data.data["dinput_type"],
                        is_user: data.data["is_user"],
                        main_type: data.data["main_type"],
                        real_type: data.data["real_type"],
                        real_accuracy: data.data["real_accuracy"],
                        tooltipField: fieldTypeService.noToolTips(data.data["dinput_type"]) ? '' : data.data["field"],
                        sortingOrder: ['desc', 'asc', null],
                        hide: false,
                        minWidth: 20,
                        filter: fieldTypeService.numOrText(data.data["real_type"]) ? "number" : "text",
                        headerClass: headClass,
                        cellStyle: {'font-style': 'normal'},
                        floatingFilterComponent: this.floatingFilterCom.actions.createFilter(fieldTypeService.searchType(data.data["real_type"]), data.data["field"], this.data.searchValue, this.data.searchOldValue),
                        floatingFilterComponentParams: {suppressFilterButton: true},
                        enableRowGroup: true,
                        suppressSorting: false,
                        suppressResize: false,
                        suppressMovable: false,
                        cellRenderer: (params) => {
                            return this.actions.bodyCellRender(params);
                        }
                    }
                    // if (fieldContent) {
                    //     if (data.data['id'] == fieldContent['child_field']||data.data['id'] == fieldContent['count_field']) {
                    //         obj['cellStyle'] = {'font-style': 'normal'};
                    //         obj['cellStyle']['background-color'] =  'rgb(177,215,253)';
                    //     }
                    // }
                    // 图片可见单元格属性修改
                    if (data.data["dinput_type"] == fieldTypeService.IMAGE_TYPE && data.data['field_content']['is_show_image'] == 1) {
                        obj['cellStyle'] = {'font-style': 'normal'};
                        obj['cellStyle']['overflow'] = "visible";
                    }
                    let width = data.data["width"];
                    if (this.data.colWidth && this.data.colWidth[data.data["field"]]) {
                        width = this.data.colWidth[data.data["field"]];
                    }
                    obj["width"] = width + 17;
                    if (( fieldTypeService.childTable(data.data["dinput_type"]) || fieldTypeService.countTable(data.data["dinput_type"]) )) {
                        obj['editable'] = false;
                        obj['cellStyle'] = {'font-style': 'normal'};
                        obj['cellStyle'] ['background'] = "#ddd"
                    }
                    // if( editCols ){
                    //     this.setEditableCol( obj );
                    // }

                    column.push(obj);
                }
            }
        },
        bodyCellRender: function (params) {
            if (params.data && params.data.myfooter && params.data.myfooter == "合计") {
                return params.value || '';
            }
            let myValue = params['value'];//当前单元格数值
            let remindColorInfo = this.data.remindColor['remind_color_info'];//枚举提醒颜色
            let info = this.data.remindColor['info'];//数字提醒颜色
            let colDef = params.colDef;//当前单元格数据
            let rowId;     //当前rowId
            let sHtml;      //要显示的html元素的字符串
            let color = "transparent"; //颜色
            let real_type = colDef["real_type"];
            let dinput_type = colDef["dinput_type"];
            // let someStyle = 'text-align:right;margin:-5px;padding-left:5px;padding-right:5px;display:inline-block;width:calc(100% + 10px);height:100%;';//默认的样式
            let someStyle = 'margin:-5px;padding-left:5px;padding-right:5px;display:inline-block;width:calc(100% + 10px);height:100%;';//默认的样式
            let someStyle_a = 'text-decoration:underline;margin:-5px;padding-left:5px;padding-right:5px;display:inline-block;width:calc(100% + 10px);height:100%;';//默认的样式
            if (params.data) {
                rowId = params.data['_id']
            }
            //显示提醒颜色start---
            //判断是否为数字类型
            try {
                if (info) {
                    let oInfo = JSON.parse(info);
                    for (let i in oInfo) {
                        if (i == rowId) {
                            try {
                                color = oInfo[i][colDef['colId']];
                            } catch (err) {
                                color = 'transparent';
                            }
                        }
                    }
                }
                //判断是否为枚举类型
                for (let i in remindColorInfo) {
                    if (i == colDef['colId'] && remindColorInfo[i][myValue]) {
                        color = remindColorInfo[i][myValue];
                    }
                }
            } catch (err) {
            }

            let opcity = '0.3';
            if (color != undefined && color != 'transparent') {
                color = dgcService.colorRgb(color, opcity);
            }

            //是否是重要字段（入库之前检测下是否为空）
            if (colDef.main_type && colDef.main_type.id != null) {
                //兼容日期规则控件
                if (myValue == '' || myValue == undefined || (params.value[-1] != undefined && params.value[-1] == '')) {
                    let conditionAll = colDef.main_type["condition"];
                    for (let condition of conditionAll) {
                        let conditinField = '';
                        if (condition["optionfield"] != null) {
                            //通过id查找field
                            for (let col of this.data.fieldsData) {
                                if (col["id"] == condition["optionfield"]) {
                                    conditinField = col["field"];
                                }
                            }
                            //条件字段的匹配条件（==，>,<,>=,<=）
                            switch (condition["option"]) {
                                case '==': {
                                    if (params.data[conditinField] == condition["context"]) {
                                        color = 'rgba(255,0,0,1)'
                                    }
                                    break;
                                }
                                case '>': {
                                    if (params.data.conditinField > condition["context"]) {
                                        color = 'rgba(255,0,0,1)'
                                    }
                                    break;
                                }
                                case '<': {
                                    if (params.data.conditinField < condition["context"]) {
                                        color = 'rgba(255,0,0,1)'
                                    }
                                    break;
                                }
                                case '<=': {
                                    if (params.data.conditinField <= condition["context"]) {
                                        color = 'rgba(255,0,0,1)'
                                    }
                                    break;
                                }
                                case '>=': {
                                    if (params.data.conditinField >= condition["context"]) {
                                        color = 'rgba(255,0,0,1)'
                                    }
                                    break;
                                }
                            }
                        } else {
                            color = 'rgba(255,0,0,1)';
                        }
                    }
                }
            }

            //内置相关原始数据穿透颜色提示
            if( this.data.viewMode == 'source_data' && this.data.base_buildin_dfield == colDef.field ){
                color='rgba(255,0,0,0.5)';
            }
            if (params.value == undefined) {
                sHtml = '<span style="' + someStyle + 'background-color:' + color + '"><span/>';
                return sHtml;
            }

            //前端表达式值计算
            if (colDef.dinput_type == fieldTypeService.SURFACE_EXPRESSION) {
                let exp = colDef.field_content.update_exp;
                let row_data = params.data;
                let reg = /\@f\d+\@/g;
                let items = exp.match(reg);
                for (let i in items) {
                    i = items[i].replace("@", "").replace("@", "");
                    let is_number = (this.data.colsDict[i] && (this.data.colsDict[i].real_type == 10 || this.data.colsDict[i].real_type == 11));
                    let f = i;
                    i = "@" + i + "@";
                    while (exp.indexOf(i) != -1) {
                        // this.cols
                        exp = exp.replace(i, is_number ? row_data[f] : "'" + row_data[f] + "'");
                    }
                }
                exp = exp.replace("#", "this.functionLib.");
                while (exp.indexOf("#") != -1) {
                    exp = exp.replace("#", "this.");
                }
                params["value"] = eval(exp);
            }

            //编辑模式下处理不能编辑数据
            // if(this.isShowEditCancel && params.colDef && !params.colDef.editable){
            //     color='rgba(230,230,230,0.8)';
            // }

            //处理数字类型
            if (fieldTypeService.numOrText(real_type)) {//数字类型
                let numVal = fieldTypeService.intOrFloat(real_type) ? dgcService.formatter(params.value) : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                if (fieldTypeService.childTable(dinput_type) || fieldTypeService.countTable(dinput_type)) {//子表||统计类型
                    if (this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence') {
                        sHtml = '<span style="color:rgb(85,85,85);' + someStyle + 'background-color:' + color + '"><span>' + numVal + '</span><span/>';
                    } else {
                        sHtml = '<span style="color:#337ab7;' + someStyle + 'background-color:' + color + '"><span id="childOrCount">' + numVal + '</span><span/>';
                    }
                } else {
                    if (colDef['base_buildin_dfield'] != '' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人') {
                        sHtml = '<a  title="查看源数据" style="' + someStyle_a + 'background-color:' + color + '"><span id="relatedOrBuildin">' + numVal + '</span><span/>';
                    } else {
                        sHtml = '<span style="' + someStyle + 'background-color:' + color + '"><span>' + numVal + '</span><span/>';
                    }
                }
            }

            //加密文本处理
            else if (real_type == fieldTypeService.SECRET_TEXT) {
                sHtml = '<span style="text-align: center;">******</span>';
            }

            //周期规则处理
            else if (real_type == fieldTypeService.CYCLE_RULE) {
                let val = params["data"][colDef["colId"]]["-1"] || "";
                if (val !== "") {
                    val = val.replace(/\n/g, "\n;\n");
                }
                if (colDef['base_buildin_dfield'] != '' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人') {
                    sHtml = '<a  title="查看源数据" style="' + someStyle_a + 'background-color:' + color + '"><span id="relatedOrBuildin">' + val + '</span></a>';
                } else {
                    sHtml = '<span style="' + someStyle + 'background-color:' + color + '"><span>' + val + '</span></span>';
                }
            }

            //富文本编辑框
            else if (real_type == fieldTypeService.UEDITOR) {
                sHtml = '<a title="富文本" style="text-align: center;">查看详情</a>';
            }

            //大数字段处理
            else if (real_type == fieldTypeService.DECIMAL_TYPE) {
                if (fieldTypeService.childTable(dinput_type) || fieldTypeService.countTable(dinput_type)) {//子表||统计类型
                    let bigNum = params.value > 9007199254740992 ? dgcService.formatter(params.value.toString()) + '.00' : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                    sHtml = '<a style="float:right;color:#337ab7;" id="childOrCount">' + bigNum + '</a>';
                } else {
                    let bigNum = params.value > 9007199254740992 ? dgcService.formatter(params.value.toString()) + '.00' : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                    if (colDef['base_buildin_dfield'] != '' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人') {
                        sHtml = '<a  title="查看源数据" style="' + someStyle_a + 'background-color:' + color + '"><span id="relatedOrBuildin">' + bigNum + '</span></a>';
                    } else {
                        sHtml = '<span style="' + someStyle + 'background-color:' + color + '"><span>' + bigNum + '</span></span>';
                    }
                }
            }

            //地址类型
            else if (real_type == fieldTypeService.URL_TYPE) {
                sHtml = '<a href="' + someStyle_a + '" style="float:left;color:#337ab7;" id="shareAddress" target="_blank">' + myValue + '</a>';
            }

            //合同编辑器
            else if (real_type == fieldTypeService.TEXT_COUNT_TYPE) {
                sHtml = '<a style="text-align: center;color:#337ab7;">' + "查看" + '</a>' + '<span style="color:#000">' + "丨" + '</span>' + '<a style="text-align: center;color:#337ab7;">' + '下载' + '</a>';
            }

            //表对应关系（不显示为数字）
            else if (real_type == fieldTypeService.CORRESPONDENCE) {
                if (this.data.viewMode == 'editFromCorrespondence') {
                    sHtml = '<span style="color:' + color + '">' + params.value + '</span>';
                } else {
                    sHtml = '<a style="' + someStyle_a + 'background-color:' + color + ' " ><span id="correspondenceClick">' + params.value + '</span></a>';
                }
            }

            //图片附件
            else if (real_type == fieldTypeService.IMAGE_TYPE && colDef['field_content']['is_show_image'] == 1) {
                let cDiv = document.createElement('div');
                let cImg = document.createElement('img');
                let dImg = document.createElement('img');
                cImg.src = params.value;
                cImg.style.height = 'inherit';
                cImg.style.position = 'relative';
                cDiv.style.height = 'inherit';
                dImg.style.position = 'absolute';
                dImg.style.maxWidth = (window.innerWidth / 2 - 120) + 'px';
                dImg.style.maxHeight = (window.innerHeight - 300) / 2 + 'px';
                dImg.style.zIndex = '2';
                cImg.addEventListener("mouseover", function (param) {
                    dImg.src = param.target['src'];
                    if (param.y > window.innerHeight / 2) {
                        dImg.style.bottom = '0'
                    }
                    if (param.x < window.innerWidth / 2) {
                        dImg.style.left = '100%'
                    } else {
                        dImg.style.right = '100%'
                    }
                    cDiv.appendChild(dImg);

                });
                cImg.addEventListener("mouseout", function () {
                    cDiv.removeChild(dImg);
                });
                cDiv.appendChild(cImg);
                sHtml = cDiv;
            }

            //普通附件||视频附件
            else if (real_type == fieldTypeService.ATTACHMENT || real_type == fieldTypeService.VIDEO_TYPE) {
                sHtml = '<a id="file_view" title="查看详情">' + myValue.length || 0 + '个附件</a>';
            }

            //都做为文本处理
            else {
                if (fieldTypeService.childTable(dinput_type) || fieldTypeService.countTable(dinput_type,real_type)) { //子表或统计类型
                    if (this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence') {
                        sHtml = '<span style="float:right;color:rgb(85,85,85);">' + params.value + '</span>';
                    } else {
                        sHtml = '<a style="color:#337ab7;' + someStyle_a + 'background-color:' + color + '" ><span id="childOrCount">' + params.value + '</span></a>';
                    }
                } else {
                    if (colDef['base_buildin_dfield'] != '' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人') {
                        sHtml = '<a  title="查看源数据" style="' + someStyle_a + 'background-color:' + color + '"><span id="relatedOrBuildin">' + params.value + '</span></a>';
                    } else {
                        sHtml = '<span style="' + someStyle + 'background-color:' + color + '"><span>' + params.value + '</span></span>';
                    }
                }
            }

            //分组无数据时容错
            if (params && params.colDef && params.colDef.headerName == 'Group') {
                sHtml = sHtml = '<span>' + params.value + '</span>';
            }
            return sHtml;
        },
        //重置偏好
        resetPreference: function () {
            let eHeader = document.createElement('span');
            if( !this.data.noNeedCustom ){
                eHeader.innerHTML = "初";
                eHeader.className = "table-init-logo";

                eHeader.addEventListener('click', () => {
                    alert("重置偏好")
                });
            }
            return eHeader;
        },
        //生成操作列
        operateCellRenderer: function (params) {
            let rowStatus = 0;
            let operateWord = 2;
            if (!params.data || ( params.node.rowGroupIndex <= this.rowGroupIndex ) || params.data && params.data.myfooter && params.data.myfooter == '合计') {
                return '';
            }
            if( this.data.viewMode == 'in_process' ){
                return '<div style="text-align:center;"></span><a href=javascript:void(0); class="ui-link" data-type="gridView">查看</a></div>';
            }
            if (params.data.group || Object.is(params.data.group, '') || Object.is(params.data.group, 0)) {
                return '';
            }
            if (params.hasOwnProperty("data") && params["data"].hasOwnProperty("status")) {
                rowStatus = params["data"]["status"];
            }
            try {
                if (params["data"]["status"]) {
                    rowStatus = params["data"]["status"];
                }
            } catch (e) {
                rowStatus = 0;
            }
            let str = '<div style="text-align:center;"><a class="gridView" style="color:#337ab7;">查看</a>';
            if (this.data.viewMode == 'normal' || this.data.viewMode == 'source_data') {
                if (this.data.isFixed || rowStatus == 2) {
                    str += ' | <span style="color: darkgrey;">编辑</span>';
                    str += ' | <a style="color: darkgrey;">历史</a>';
                } else {
                    str += ' | <a  class="gridEdit" style="color:#337ab7;">编辑</a>';
                    str += ' | <a  class="gridHistory" style="color:#337ab7;">历史</a>';
                }
                operateWord = operateWord + 4;
            }
            if (this.data.viewMode == 'batchInApprove') {
                str += ' | <a  class="gridEdit" style="color:#337ab7;">编辑</a>';
                operateWord = operateWord + 2;
            }
            if (this.data.customOperateList) {
                for (let d of this.data.customOperateList) {
                    str += ` | <a class="customOperate" id="${ d["id"] }" style="color:#337ab7;">${ d["name"] }</a>`;
                    operateWord = operateWord + (d["name"] ? d["name"].length : 0);
                }
            }
            if (this.data.rowOperation) {
                for (let ro of this.data.rowOperation) {
                    if (ro.frontend_addr && ro.frontend_addr == 'export_row') {
                        let selectedRows = JSON.stringify([params.data._id])
                        str += ` | <a class="rowOperation" id="${ ro["row_op_id"] }" href='/data/customize/ta_excel_export/?table_id=${ this.pageId }&selectedRows=${ selectedRows }' style="color:#337ab7;">${ ro["name"] }</a>`;
                        operateWord = operateWord + (ro["name"] ? ro["name"].length : 0);
                    } else {
                        str += ` | <a class="rowOperation" id="${ ro["row_op_id"] }" style="color:#337ab7;">${ ro["name"] }</a>`;
                        operateWord = operateWord + (ro["name"] ? ro["name"].length : 0);
                    }
                }
            }
            str += '</div>';
            return str
        },
        //floatingFilter拼参数
        floatingFilterPostData: function (col_field, keyWord, searchOperate) {
            this.data.queryList[col_field] = {
                'keyWord': keyWord,
                'operate': dgcService.getMongoSearch(searchOperate),
                'col_field': col_field
            };
            //用于去除queryList中的空值''
            let obj = {};
            for (let key in this.data.queryList) {
                if (!( this.data.queryList[key]["keyWord"] == "" )) {
                    obj[key] = this.data.queryList[key];
                }
            }
            this.data.queryList = obj;
            let filter = [];
            for (let attr in this.data.queryList) {
                filter.push({
                    "relation": "$and",
                    "cond": {
                        "leftBracket": 0,
                        "searchBy": this.data.queryList[attr]['col_field'],
                        "operate": this.data.queryList[attr]['operate'],
                        "keyword": this.data.queryList[attr]['keyWord'],
                        "rightBracket": 0
                    }
                });
            }
            this.data.filterParam['filter'] = filter;
            this.data.filterParam['is_filter'] = 1;
            this.actions.getGridData();
        },
        postExpertSearch:function(data,id,name) {
            this.data.filterParam.expertFilter = data;
            this.data.filterParam.common_filter_id = id;
            this.data.filterParam.common_filter_name = name;
            this.actions.getGridData();
        },
        //偏好赋值
        setPreference: function (res) {
            if (res['colWidth']) {
                this.data.colWidth = res['colWidth'].colWidth;
                if (typeof ( this.data.colWidth ) == 'string') {
                    this.data.colWidth = JSON.parse(res['colWidth'].colWidth);
                }
            }
            if (res['pageSize'] && res['pageSize'].pageSize) {
                this.data.rows = res['pageSize'].pageSize;
            }
            if (res['ignoreFields']) {
                this.data.ignoreFields = JSON.parse(res['ignoreFields']['ignoreFields']);
            } else {
                // this.data.hideColumn = ['f1','f2','f3','f4']
                // let json = {
                //     action:'ignoreFields',
                //     table_id:this.pageId,
                //     ignoreFields:JSON.stringify( this.hideColumn ),
                // }
                // this.dataTableService.savePreference( json );
            }
            if (res['fieldsOrder']) {
                this.data.orderFields = JSON.parse(res['fieldsOrder']['fieldsOrder']);
            }
            if (res['pinned'] && res['pinned']['pinned']) {
                this.data.fixCols = JSON.parse(res['pinned']['pinned']);
            }
            this.data.myGroup = (res['group'] != undefined) ? JSON.parse(res['group'].group) : [];
            // console.log("rows")
            // console.log(this.data.rows)
            // console.log("colWidth")
            // console.log(this.data.colWidth)
            // console.log("ignoreFields")
            // console.log(this.data.ignoreFields)
            // console.log("fixCols")
            // console.log(this.data.fixCols)
            // console.log("myGroup")
            // console.log(this.data.myGroup)
            // console.log("orderFields")
            // console.log(this.data.orderFields)
        },
        //初始化按钮
        renderBtn: function () {
            let btnGroup = dgcService.gridBtn( this.data.viewMode );
            let btns = this.el.find( '.dataGrid-btn-group' )[0].querySelectorAll('a');
            let html = ''
            for( let btn of btns ){
                let name = btn.className;
                if( btnGroup.indexOf( name )!=-1 && ( this.data.permission[dgcService.permission2btn[name]] || dgcService.permission2btn[name] == 'especial' ) ){
                    html+=btn.outerHTML;
                }
            }
            let con = this.el.find( '.dataGrid-btn-group' )[0];
            con.innerHTML = html;
            con.style.display = 'block';
        },
        //请求表头数据
        getHeaderData: function () {
            let obj1 = {
                actions: JSON.stringify(['ignoreFields', 'group', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                table_id: this.data.tableId
            }
            let obj2 = {
                table_id: this.data.tableId
            }
            let preferenceData = dataTableService.getPreferences(obj1);
            let headerData = dataTableService.getColumnList(obj2);
            let sheetData = dataTableService.getSheetPage( obj2 );

            Promise.all([preferenceData, headerData, sheetData]).then((res)=> {
                this.actions.setPreference( res[0] );
                this.data.fieldsData = res[1].rows || [];
                this.data.permission = res[1].permission;
                //初始化按钮
                this.actions.renderBtn();
                //创建高级查询需要字段数据
                let r = dgcService.createNeedFields( this.data.fieldsData )
                this.data.expertSearchFields = r.search;
                //定制列需要字段数据
                this.data.customColumnsFields = r.custom;
                //分组需要字段数据
                this.data.groupFields = r.group;
                //创建表头
                this.columnDefs = this.actions.createHeaderColumnDefs();
                //创建sheet分页
                this.actions.createSheetTabs( res[2] )

                this.actions.getGridData();
                //按钮点击事件
                this.actions.onBtnClick();
            })
            HTTP.flush();
        },
        //请求在途数据
        getInprocessData: function () {
            let postData = this.actions.createPostData();
            let post_arr = [];
            let body = dataTableService.getTableData( postData );
            let remindData = dataTableService.getReminRemindsInfo({table_id:this.data.tableId});
            post_arr = [body,remindData]
            Promise.all(post_arr).then((res)=> {
                this.data.rowData = res[0].rows || [];
                this.data.total = res[0].total;
                //提醒赋值
                this.data.remindColor = res[1];
                this.data.common_filter_id = res[0].common_filter_id || '';
                if( this.data.firstRender ){
                    //渲染agGrid
                    this.actions.renderAgGrid();
                }else {
                    let d = {
                        rowData: this.data.rowData
                    }
                    //赋值
                    this.agGrid.actions.setGridData(d);
                }
                //获取在途footer数据
                this.data.inProcessFooter = true;
                let footerPostData = this.actions.createPostData();
                this.data.inProcessFooter = false;

                dataTableService.getFooterData( footerPostData ).then( res=>{
                    this.data.footerData = dgcService.createFooterData( res );
                    let d = {
                        footerData: this.data.footerData
                    }
                    //赋值
                    this.agGrid.actions.setGridData(d);
                } );
                HTTP.flush();
                this.actions.sortWay();
            })
            HTTP.flush();
        },
        //请求表格数据
        getGridData: function () {
            if( this.data.viewMode == 'in_process' ){
                this.actions.getInprocessData();
                return;
            }
            let postData = this.actions.createPostData();
            let post_arr = [];
            let body = dataTableService.getTableData( postData );
            let remindData = dataTableService.getReminRemindsInfo({table_id:this.data.tableId});
            post_arr = [body,remindData]
            if( !this.data.firstGetFooterData ){
                let footer = dataTableService.getFooterData( postData );
                post_arr.push( footer )
            }
            Promise.all(post_arr).then((res)=> {
                this.data.rowData = res[0].rows || [];
                this.data.total = res[0].total;
                //对应关系特殊处理
                if( this.data.viewMode == 'viewFromCorrespondence'||this.data.viewMode == 'editFromCorrespondence' ){
                    this.actions.setCorrespondence(res[0]);
                }
                //提醒赋值
                this.data.remindColor = res[1];
                this.data.common_filter_id = res[0].common_filter_id || '';
                if( !this.data.firstGetFooterData ){
                    this.data.footerData = dgcService.createFooterData( res[2] );
                }
                if( this.data.firstRender ){
                    //渲染agGrid
                    this.actions.renderAgGrid();
                }else {
                    let d = {
                        rowData: this.data.rowData,
                        footerData: this.data.footerData
                    }
                    //赋值
                    this.agGrid.actions.setGridData(d);
                }
                //对应关系回显
                if( this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence' ){
                    this.actions.setCorrespondenceSelect();
                }
                if( this.data.pagination ){
                    this.pagination.actions.resetPagination( this.data.total );
                }
                this.actions.sortWay();
            })
            HTTP.flush();
        },
        //请求footer数据
        getFooterData: function () {
            let postData = this.actions.createPostData();
            dataTableService.getFooterData( postData ).then( res=>{
                this.data.footerData = dgcService.createFooterData( res );
                let d = {
                    footerData: this.data.footerData
                }
                //赋值
                this.agGrid.actions.setGridData(d);
            } )
            HTTP.flush();
        },
        //设置对应关系数据
        setCorrespondence: function ( res ) {
            //对应关系回显的ids
            if ( res.selectedList ) {
                this.data.correspondenceSelectedList = res.selectedList;
            }
            //对应关系增加的ids
            if ( res.addList ) {
                this.data.correspondenceAddList = res.addList;
            }
            //对应关系减少的ids
            if ( res.removeList ) {
                this.data.correspondenceRemoveList = res.removeList;
            }
        },
        //保存对应关系
        saveCorrespondence: function () {
            let json = {
                from_table_id : this.data.parentTableId,
                from_table_temp_id: this.data.parentTempId,
                from_table_db_id: this.data.parentRealId,
                correspondence_table_id: this.data.tableId,
                correspondence_row_ids: JSON.stringify(this.data.correspondenceSelectedList)
            };
            dataTableService.saveForCorrespondence( json ).then( res=>{
                console.log( "对应关系保存" )
                console.log( res )
                msgBox.alert( '保存成功' );
                this.actions.correspondenceSaved();
                this.actions.getGridData();
            } )
            HTTP.flush();
        },
        //对应关系保存成功(通知表单刷新用)
        correspondenceSaved: function () {},
        //对应关系勾选
        setCorrespondenceSelect: function () {
            this.data.correspondenceSelectedData = [];
            this.agGrid.gridOptions.api.forEachNode( (node) => {
                if( !node["data"] ){//处理在group中，报错
                    return;
                }
                let id = node["data"]["_id"];
                if(this.data.correspondenceSelectedList.indexOf(id) != -1){
                    this.data.correspondenceSelectedData.push( node["data"] );
                    node.setSelected(true);
                }
            });
        },
        //显示勾选项
        checkCorrespondence: function () {
            let title = this.el.find( '.correspondence-check span' )[0].innerHTML;
            let obj = {
                rowData: title == '仅显示勾选项'?this.data.correspondenceSelectedData:this.data.rowData
            }
            this.agGrid.actions.setGridData( obj );
            this.el.find( '.correspondence-check span' )[0].innerHTML = title == '仅显示勾选项'?'显示全部':'仅显示勾选项';
            this.actions.setCorrespondenceSelect();
        },
        //行选择时触发
        onRowSelected: function ($event) {
            if( !$event["node"]["data"] ){
                return;
            }
            let select = $event.node.selected;
            let id = $event.node.data._id;
            if( this.data.viewMode == 'editFromCorrespondence' ){
                if( select && this.data.correspondenceSelectedList.indexOf( id ) == -1 ){
                    this.data.correspondenceSelectedList.push( id );
                }
                if( !select && this.data.correspondenceSelectedList.indexOf( id ) != -1 ){
                    let arr2 = [];
                    for( let d of this.data.correspondenceSelectedList ){
                        if( d != id ){
                            arr2.push( d );
                        }
                    }
                    this.data.correspondenceSelectedList = arr2;
                }
            }
        },
        //返回请求数据
        createPostData: function () {
            let json = {
                table_id: this.data.tableId,
                first: this.data.first,
                rows: this.data.rows,
                parent_table_id: this.data.parentTableId,
                parent_real_id: this.data.parentRealId,
                parent_temp_id: this.data.parentTempId,
                tableType: this.data.tableType,
                fieldId: this.data.fieldId,
                rowId: this.data.rowId,
                is_filter: this.data.filterParam.is_filter,
                filter: []
            }
            if( this.data.viewMode == 'in_process' ){
                let ids = [];
                for( let d of this.data.rowData ){
                    ids.push( d._id );
                }
                json = {
                    table_id: this.data.tableId,
                    tableType: 'in_process',
                    filter: []
                }
                if( this.data.inProcessFooter ){
                    json['mongo'] = {
                        _id: { $in: ids }
                    }
                }
            }
            if( this.data.viewMode == 'viewFromCorrespondence'||this.data.viewMode == 'editFromCorrespondence' ){
                json['rows'] = 99999;
                json['first'] = 0;
                json['is_temp'] = this.data.viewMode == 'editFromCorrespondence'? 1:0;
            }
            if( this.data.viewMode == 'ViewChild'||this.data.viewMode == 'EditChild'||this.data.viewMode == 'child' ){
                json["childInfo"]= {parent_page_id: this.data.parentTableId, parent_row_id: this.data.rowId};
            }
            if( this.data.viewMode == 'count' ){
                json["tableType"]='count';
            }
            if( this.data.viewMode == 'createBatch' ){
                json["is_batch"] = 1;
                json['mongo'] = {
                    _id: { $in: this.data.batchIdList }
                }
            }
            if( this.data.viewMode == 'source_data' ){
                //要注意tableId和source_table_id与平常不同
                json["source_table_id"] = this.data.tableId;
                json["table_id"] = this.data.parentTableId;
                json["base_buildin_dfield"] = this.data.source_field_dfield;
                json['mongo'] = {
                    _id: this.data.rowId
                }
            }
            if( this.data.filterParam.filter && this.data.filterParam.filter.length != 0 ){
                json['filter'] = this.data.filterParam.filter || [];
            }
            if( this.data.filterParam['common_filter_id'] ){
                json['filter'] = json['filter'] || [];
                for( let a of this.data.filterParam.expertFilter ){
                    json['filter'].push( a );
                }
                if( this.data.filterParam['common_filter_id'] != '临时高级查询' ){
                    json['common_filter_id'] = this.data.filterParam['common_filter_id'] || '';
                }
                if( this.data.filterParam.filter.length == 0 ){
                    msgBox.alert( '加载常用查询<'+this.data.filterParam['common_filter_name']+'>' );
                }
            }
            if( this.data.groupCheck ){
                json['is_group'] = 1;
                json['group_fields'] = JSON.stringify( this.data.myGroup.fields );
                json['tableType'] = 'group';
            }
            //排序
            if( this.data.sortParam.sortField ){
                json = _.defaultsDeep( json,this.data.sortParam )
            }
            json = dgcService.returnQueryParams( json );
            this.data.filterParam.is_filter = 1;
            return json;
        },
        //渲染agGrid
        renderAgGrid: function () {
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
                onRowDoubleClicked: this.actions.onRowDoubleClicked,
                setRowStyle: this.actions.setRowStyle,
                onRowSelected: this.actions.onRowSelected
            }
            this.agGrid = new agGrid(gridData);
            this.append(this.agGrid , this.el.find('#data-agGrid'));
            //渲染定制列
            if( this.el.find('.custom-column-btn')[0] ){
                //如果有定制列修改偏好状态
                this.actions.calcColumnState();
                let custom = {
                    gridoptions: this.agGrid.gridOptions,
                    fields: this.data.customColumnsFields,
                    fixCols: this.data.fixCols,
                    tableId: this.data.tableId,
                    agGrid: this.agGrid
                }
                this.customColumnsCom  = new customColumns(custom);
                this.append(this.customColumnsCom, document.querySelector('.custom-columns-panel'));

                //点击关掉定制列panel
                this.el.find( '.ag-body' ).on( 'click',()=>{
                    this.el.find( '.custom-columns-panel' )[0].style.display = 'none';
                    this.data.isShowCustomPanel = false;
                    this.actions.changeAgGridWidth();
                } )
            }
            //渲染分组
            if( this.el.find('.group-btn')[0] ){
                let groupLit = {
                    tableId: this.data.tableId,
                    gridoptions: this.agGrid.gridOptions,
                    fields: this.data.myGroup.length == 0 ? this.data.groupFields : this.actions.deleteGroup(this.data.groupFields),
                    myGroup:  this.actions.setMyGroup(this.data.myGroup.fields)
                }
                this.groupGridCom = new groupGrid(groupLit);
                this.append(this.groupGridCom,document.querySelector('.group-panel'));

                this.groupGridCom.actions.onGroupChange = this.actions.onGroupChange;
            }
            //渲染分页
            let noPagination = ['in_process','viewFromCorrespondence','editFromCorrespondence']
            if( noPagination.indexOf( this.data.viewMode ) == -1 ){
                this.data.pagination = true;
                let paginationData = {
                    total: this.data.total,
                    rows: this.data.rows,
                    tableId: this.data.tableId
                }
                this.pagination = new dataPagination(paginationData);
                this.pagination.actions.paginationChanged = this.actions.refreshData;
                this.append(this.pagination, this.el.find('.pagination'));
            }
            //高级查询
            if( this.el.find( '.expert-search-btn' )[0] ){
                this.actions.getExpertSearchData();
            }
            this.data.firstRender = false;
        },
        //触发导出
        onExport: function () {
            let filer = [];
            if( this.data.filterParam.filter && this.data.filterParam.filter.length != 0 ){
                filer = this.data.filterParam.filter || [];
            }
            if( this.data.filterParam['common_filter_id'] ){
                for( let a of this.data.filterParam.expertFilter ){
                    filer.push( a );
                }
            }
            let obj = {
                tableId: this.data.tableId,
                groupCheck: this.data.groupCheck,
                rowId: this.data.rowId,
                parentRealId: this.data.parentRealId,
                fieldId: this.data.fieldId,
                tableType: this.data.tableType,
                filterParam: filer
            }
            for( let o in obj ){
                exportSetting.data[o] = obj[o];
            }
            PMAPI.openDialogByComponent(exportSetting, {
                width: 380,
                height: 220,
                title: '导出数据'
            }).then((data) => {

            });
        },
        //分组触发
        onGroupChange: function (group) {
            this.agGrid.gridOptions.columnApi.setColumnVisible( 'group' , true)
            this.data.myGroup.fields = group;
            this.actions.getGridData();
        },
        //列宽改变
        onColumnResized: function ($event) {
            if( this.data.noNeedCustom ){
                return;
            }
            this.customColumnsCom.actions.onColumnResized( this.customColumnsCom );
        },
        //拖动结束
        onDragStopped: function ($event) {
            if( this.data.noNeedCustom ){
                return;
            }
            this.customColumnsCom.actions.onFix();
            this.customColumnsCom.actions.dragAction();
        },
        //剔除已经保存的分组
        deleteGroup: function(data) {
            let field = [];
            for(let j = 0; j < data.length; j++){
                field.push(data[j]);
            }
            if(this.data.myGroup.length != 0) {
                for (let k = 0; k < this.data.myGroup.fields.length; k++) {
                    for (let i = 0; i < field.length; i++) {
                        if (this.data.myGroup.fields[k] == field[i].field) {
                            field.splice(i, 1);
                        }
                    }
                }
            }
            return field;

        },
        //组装分组偏好设置
        setMyGroup:function(myGroup) {
            let myGroupList = [], myGroupAry = [];
            if(this.data.myGroup.length != 0) {
                for (let j = 0; j < myGroup.length; j++) {
                    myGroupList.push(myGroup[j]);
                }
                for (let i = 0; i < myGroupList.length; i++) {
                    this.data.customColumnsFields.forEach((item) => {
                        if (item.field == myGroupList[i]) {
                            let myGroupObj = {};
                            myGroupObj['field'] = item.field;
                            myGroupObj['name'] = item.name;
                            myGroupAry.push(myGroupObj);
                        }
                    });
                }
            }
            return myGroupAry;
        },
        //分页刷新操作
        refreshData: function ( data ) {
            this.data.rows = data.rows;
            this.data.first = data.firstRow;
            this.actions.getGridData();
        },
        //根据偏好返回agGrid sate
        calcColumnState: function () {
            let gridState = this.agGrid.gridOptions.columnApi.getColumnState();
            let indexedGridState = {};
            for(let state of gridState) {
                indexedGridState[state['colId']] = state;
            }
            let numState = indexedGridState['number']||{};
            numState['pinned']= this.data.fixCols.l.length > 0 ? 'left' : null;
            let selectState = indexedGridState['mySelectAll']||{};
            selectState['pinned']= this.data.fixCols.l.length > 0 ? 'left' : null;
            let group = indexedGridState['group']||{};
            group['hide'] = true;
            //默认分组、序号、选择在前三个
            let arr = [ group , numState , selectState ];
            //左侧固定
            for( let col of this.data.fixCols.l ){
                let state = indexedGridState[col]||{};
                state['hide'] = this.data.ignoreFields.indexOf( col ) != -1;
                state['pinned'] = 'left';
                arr.push(state);
            }
            //中间不固定
            let fixArr = this.data.fixCols.l.concat( this.data.fixCols.r );
            for( let data of this.data.orderFields ){
                if( data == '_id'||data == 'group' ){
                    continue;
                }
                if( data != 0 && fixArr.indexOf( data ) == -1 ){
                    let state = indexedGridState[data]||{};
                    state['hide'] = this.data.ignoreFields.indexOf( data ) != -1;
                    state['pinned'] = null;
                    arr.push(state);
                }
            }
            if(this.data.orderFields.length == 0){
                for(let state of gridState){
                    let id = state['colId'];
                    if(id != 'number' && id != 'mySelectAll' && id != 'group'){
                        state['hide'] = this.data.ignoreFields.indexOf(id)!=-1;
                        state['pinned'] = null;
                        arr.push(state);
                    }
                }
            }
            //右侧固定
            for( let col of this.data.fixCols.r ){
                let state = indexedGridState[col]||{};
                state['hide'] = this.data.ignoreFields.indexOf( col ) != -1;
                state['pinned'] = 'right';
                arr.push(state);
            }
            //操作列宽度
            for( let d of arr ){
                if( d.colId && d.colId == 'myOperate' ){
                    d['width'] = this.data.operateColWidth;
                }
            }
            //初始化状态
            this.agGrid.gridOptions.columnApi.setColumnState( arr );
        },
        //渲染颜色
        setRowStyle: function ( param ) {
            if( !param["data"] ){//处理在分组时报错
                return;
            }
            let id = param["data"]["_id"];
            //如果是在工作流进行中的数据显示特殊颜色
            if( param["data"] && param["data"]["status"] && param["data"]["status"] == 2 ){
                return {background:'#E2D6C0'};
            }
            if( param["data"]["data"] && param["data"]["data"]["status"] && param["data"]["data"]["status"] == 1 ){
                return {background:'rgba(255,84,0,.2)'};
            }
            //如果是在工作计算cache中的数据显示特殊颜色
            if( param["data"] && param["data"]["data_status"] && param["data"]["data_status"] == 0 ){
                return {background:'#FFEFEF'};
            }
            //对应关系颜色
            if( this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence' ){
                if(this.data.correspondenceAddList.indexOf(id) != -1){
                    //对应关系增加的背景色
                    return {background:'#bfda93'};
                }else if(this.data.correspondenceRemoveList.indexOf(id) != -1){
                    //对应关系减少的背景色
                    return {background:'#fd8f8f'};
                }
            }
        },
        //创建sheet分页数据
        createSheetTabs: function ( res ) {
            if( res.rows.length > 0 ){
                let arr = [{name:'全部数据',id:0,value:[]}];
                for( let r of res.rows ){
                    let obj = {
                        name: r.name,
                        id: r.id,
                        value: dgcService.retureFields( this.data.id2field , r.fids )
                    }
                    arr.push( obj );
                }
                let sheetHtml = dgcService.returnSheetHtml( arr );
                this.el.find( '.SheetPage' ).html( sheetHtml );
                this.el.on( 'click','.SheetPage ul li',(e)=>{
                    let gridoptions = this.agGrid.gridOptions;
                    let ignore = ['group','number','mySelectAll','myOperate'];
                    let id = this.el.find(e.target).attr( 'sheetId' );
                    let currentId = this.el.find(e.target).parent().attr( 'currentId' );
                    let arr = JSON.parse( this.el.find(e.target).attr( 'sheetValue' ) );
                    if( id == currentId ){
                        return;
                    }
                    this.el.find(e.target).parent().attr( 'currentId',id );
                    let state = gridoptions.columnApi.getColumnState();
                    for( let s of state ){
                        if( ignore.indexOf( s.colId ) == -1 ){
                            s.hide = arr.indexOf( s.colId ) == -1 && id != 0 ? true:false;
                        }
                    }
                    gridoptions.columnApi.setColumnState( state );
                    this.customColumnsCom.actions.makeSameSate();
                } );
                this.el.find('.SheetPage ul li:first').addClass('active1');
                this.el.find('.SheetPage ul li').on('click',function () {
                    $(this).addClass('active1');
                    $(this).siblings().removeClass('active1');
                }) ;
                this.el.find( '.ag-grid-con' ).height( 'calc( 100% - 80px )' );
                this.el.find( '.SheetPage' ).show();

            }
        },
        //按钮点击事件
        onBtnClick: function () {
            this.actions.customColumnClick();
            this.actions.groupBtnClick();
            //高级查询
            if( this.el.find( '.expert-search-btn' )[0] ){
                this.el.find( '.dataGrid-commonQuery' )[0].style.display = 'block';
                this.el.find( '.expert-search-btn' ).on( 'click',()=>{
                    let d = {
                        tableId: this.data.tableId,
                        fieldsData: this.data.expertSearchFields,
                        commonQuery: this.data.commonQueryData,
                        commonQuerySelectLength:this.el.find('.dataGrid-commonQuery-select option').length
                        // getExpertSearchData:this.actions.getExpertSearchData,
                        // postExpertSearch:this.actions.postExpertSearch,
                        // saveTemporaryCommonQuery:this.actions.saveTemporaryCommonQuery
					}
                    PMAPI.openDialogByIframe(`/iframe/expertSearch/`,{
                        width:950,
                        height:600,
                        title:`高级查询`,
                        modal:true
                    },{d}).then(res=>{
                        if(res.type == 'temporaryQuery') {
                            this.actions.postExpertSearch(res.value,res.id,res.name);
                            this.el.find('.dataGrid-commonQuery-select').val(res.name);
                        } if(res.appendChecked) {
                            this.data.saveTemporaryCommonQuery == res.value
                            this.actions.appendQuerySelect()
                        } if(res.saveCommonQuery || res.onlyclose == true) {
                            this.actions.getExpertSearchData()
                        }
                    })
                } )
            }

            //宽度自适应
            if( this.el.find( '.grid-auto-width' )[0] ){
                this.el.find( '.grid-auto-width' ).on( 'click',()=>{
                    if( !this.data.isAutoWidth ){
                        this.data.lastGridState = this.agGrid.gridOptions.columnApi.getColumnState();
                        this.agGrid.actions.autoWidth();
                    }else {
                        this.agGrid.gridOptions.columnApi.setColumnState( this.data.lastGridState );
                    }
                    this.el.find( '.grid-auto-width' ).find( 'span' ).html( !this.data.isAutoWidth?'恢复默认':'自适宽度' );
                    this.data.isAutoWidth = !this.data.isAutoWidth;
                } )
            }
            //搜索
            if( this.el.find( '.float-search-btn' )[0] ){
                this.el.find( '.float-search-btn' ).on( 'click',()=>{
                    let height = this.data.isShowFloatingFilter ? 0:30;
                    this.agGrid.gridOptions.api.setFloatingFiltersHeight(height);
                    this.data.isShowFloatingFilter = !this.data.isShowFloatingFilter;
                } )
            }
            //删除
            if( this.el.find('.grid-del-btn')[0] ){
                this.el.find( '.grid-del-btn' ).on( 'click',()=>{
                    this.actions.retureSelectData();
                    delSetting.data['deletedIds'] = this.data.deletedIds;
                    PMAPI.openDialogByComponent(delSetting, {
                        width: 300,
                        height: 200,
                        title: '删除'
                    }).then((data) => {
                        if( data.type == 'del' ){
                            this.actions.delTableData();
                        }
                    });
                } )
            }
            //导入数据
            if( this.el.find( '.grid-import-btn' )[0] ){
                this.el.find('.grid-import-btn').on( 'click',()=>{
                    let json = {
                        tableId: this.data.tableId,
                        parentTableId: this.data.parentTableId,
                        parentRealId: this.data.parentRealId,
                        parentTempId: this.data.parentTempId,
                        isBatch: this.data.viewMode == 'createBatch'?1:0
                    }
                    let url = dgcService.returnIframeUrl( '/iframe/dataImport/',json );
                    let winTitle = '导入数据';
                    this.actions.openSourceDataGrid( url,winTitle,600,800 );
                } )
            }
            //导出
            if( this.el.find('.grid-export-btn')[0] ){
                this.el.find('.grid-export-btn').on( 'click',()=>{
                    this.actions.onExport()
                } )
            }
            //全屏
            if( this.el.find('.grid-new-window')[0] ){
                let url_obj = {
                    tableId: this.data.tableId,
                    tableName: this.data.tableName,
                    formId: this.data.formId,
                    tableType: this.data.tableType,
                    viewMode: this.data.tableType,
                    parentTableId: this.data.parentTableId,

                    parentRealId: this.data.parentRealId,
                    parentTempId: this.data.parentTempId,
                    parentRecordId: this.data.parentRecordId,
                    rowId: this.data.rowId,
                    fieldId: this.data.fieldId,
                    source_field_dfield: this.data.source_field_dfield,
                    base_buildin_dfield: this.data.base_buildin_dfield
                }
                let url = dgcService.returnIframeUrl('/datagrid/source_data_grid/', url_obj);
                this.el.find('.grid-new-window')[0].href = url;
            }
            //新增数据
            if( this.el.find( '.new-form-btn' )[0] ){
                this.el.find( '.new-form-btn' ).on( 'click',()=>{
                    let obj = { table_id: this.data.tableId,btnType: 'new' };
                    let url = dgcService.returnIframeUrl( '/form/index/',obj );

                    let title = '新增'
                    this.actions.openSourceDataGrid( url,title );
                } )
            }
            //在途刷新
            if( this.el.find( '.refresh-btn' )[0] ){
                this.el.find( '.refresh-btn' ).on( 'click',()=>{
                    this.actions.getInprocessData();
                } )
            }
            //对应关系保存
            if( this.el.find( '.correspondence-save' )[0] ){
                this.el.find( '.correspondence-save' ).on( 'click',()=>{
                    this.actions.saveCorrespondence();
                } )
            }
            //对应关系勾选
            if( this.el.find( '.correspondence-check' )[0] ){
                this.el.find( '.correspondence-check' ).on( 'click',()=>{
                    this.actions.checkCorrespondence();
                } )
            }
        },
        appendQuerySelect: function() {
            let length = this.el.find('.dataGrid-commonQuery-select option').length
            for (let i = 0; i< length ;i++) {
                if(this.el.find('.dataGrid-commonQuery-select option').eq(i).val() == '临时高级查询'){
                    this.el.find('.dataGrid-commonQuery-select option').eq(i).remove()
                }
            }
            this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option Temporary" fieldId="00" value="临时高级查询">临时高级查询</option>`)
            this.el.find('.dataGrid-commonQuery-select').val('临时高级查询');

        },
        //删除数据
        delTableData: function () {
            let json = {
                table_id:this.data.tableId,
                temp_ids:JSON.stringify([]),
                real_ids:JSON.stringify( this.data.deletedIds ),
                is_batch: this.data.viewMode == 'createBatch'?1:0
            }
            dataTableService.delTableData( json ).then( res=>{
                if( res.success ){
                    msgBox.alert( '删除成功' )
                }else {
                    msgBox.alert( res.error )
                }
            } )
            HTTP.flush();
        },
        //定制列
        customColumnClick: function () {
            if( this.el.find('.custom-column-btn')[0] ){
                this.el.find( '.custom-column-btn' ).on( 'click',()=>{
                    this.el.find( '.custom-columns-panel' )[0].style.display = this.data.isShowCustomPanel?'none':'block';
                    this.data.isShowCustomPanel = !this.data.isShowCustomPanel;

                    this.actions.changeAgGridWidth();
                } )
            }
        },
        //分组点击
        groupBtnClick: function () {
            if( !this.el.find('.group-btn')[0] ){
                return;
            }
            this.el.on('click','.group-btn',()=> {
                if(!this.data.groupCheck) {
                    this.el.find('.group-btn').find('span').html('数据');
                    this.el.find('.group-panel').show();
                    this.data.groupCheck = !this.data.groupCheck;
                    this.actions.onGroupChange(this.data.myGroup.fields)
                } else {
                    this.el.find('.group-btn').find('span').html('分组');
                    this.el.find('.group-panel').hide();
                    this.data.groupCheck = !this.data.groupCheck;
                    this.agGrid.gridOptions.columnApi.setColumnVisible( 'group' , false);
                    this.actions.getGridData();
                }
                this.actions.changeAgGridWidth();
            })
        },
        //返回选择数据
        retureSelectData: function () {
            this.data.deletedIds = [];
            let rows = this.agGrid.gridOptions.api.getSelectedRows();
            for( let r of rows ){
                if( r._id ){
                    this.data.deletedIds.push( r._id );
                }
            }
        },
        //改变agGrid宽度
        changeAgGridWidth: function () {
            let num = 0;
            if( this.data.groupCheck ){
                num+=200;
            }
            if( this.data.isShowCustomPanel ){
                num+=200;
            }
            let grid = this.el.find( '#data-agGrid' )
            grid.width( 'calc(100% - ' + num + 'px)' );
        },
        //筛选增加删除后常用查询
        getDiffereceQuery: function(data) {
            let ary = [];
            if(this.data.commonQueryData.length < data.length){
                for (let i = 0; i < data.length; i++) {
                    if(i >= this.data.commonQueryData.length) {
                        ary.push(data[i]);
                    }
                }
            } else if(this.data.commonQueryData.length < data.length){
                for (let i = 0; i < this.data.commonQueryData.length; i++) {
                    if(i >= data.length) {
                        ary.push(data[i]);
                    }
                }
            }

            return ary
        },
        //获取临时常用查询数据
        saveTemporaryCommonQuery: function(data) {
            this.el.find('.dataGrid-commonQuery-select').val('临时高级查询');
            this.data.saveTemporaryCommonQuery  = data;
        },
        //获取高级查询数据
        getExpertSearchData: function () {
            let obj = {'actions':JSON.stringify( ['queryParams'] ),'table_id':this.data.tableId};
            dataTableService.getPreferences( obj ).then( res=>{
                this.el.find('.dataGrid-commonQuery-option').remove();
                this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option" fieldId="100" value="常用查询">常用查询</option>`)
                res.rows.forEach((row) => {
                    this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option" fieldId="${row.id}" value="${row.name}">${row.name}</option>`)
                });
                this.data.commonQueryData = res.rows;
                //第一次请求footer数据
                if( this.data.firstGetFooterData ){
                    if( this.data.common_filter_id ){
                        for( let r of res.rows ){
                            if( r.id == this.data.common_filter_id ){
                                this.data.filterParam = {
                                    filter: JSON.parse(r.queryParams),
                                    is_filter: 1,
                                    common_filter_id: this.data.common_filter_id,
                                    common_filter_name: r.name
                                }
                                $('.dataGrid-commonQuery-select').val(r.name);
                            }
                        }
                    }
                    this.data.firstGetFooterData = false;
                    this.actions.getFooterData();
                }
            } );
            HTTP.flush();
        },
        //排序方式
        sortWay: function () {
            this.data.frontendSort = this.data.total < this.data.rows?true:false;
            for( let d of this.data.fieldsData ){
                if( fieldTypeService.backSortField( d.real_type ) ){
                    this.data.frontendSort = false;
                }
            }
            if( this.data.viewMode == 'in_process' ){
                this.data.frontendSort = true;
            }
            console.log( '排序方式：' + (this.data.frontendSort ? '前端排序' : '后端排序') );
            this.agGrid.gridOptions["enableServerSideSorting"] = !this.data.frontendSort;
            this.agGrid.gridOptions["enableSorting"] = this.data.frontendSort;
        },
        //触发排序事件
        onSortChanged: function ($event) {
            if( this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence' || this.data.frontendSort ){
                return;
            }
            let data = this.agGrid.gridOptions.api.getSortModel()[0];
            if (data) {
                this.data.sortParam['sortOrder']= (data.sort == "desc" ? -1 : 1);
                this.data.sortParam['sortField']=data.colId;
                for( let d of this.data.fieldsData ){
                    if( d['field'] == data.colId ){
                        this.data.sortParam['sort_real_type']=d['real_type'];
                    }
                }
            }else {
                this.data.sortParam = {sortOrder:'',sortField:'',sort_real_type:''}
            }
            this.actions.getGridData();
        },
        //点击cell
        onCellClicked: function (data) {
            console.log( "______data_______" )
            console.log( data )
            if( !data.data || this.data.isEditable ){
                return;
            }
            //分组重新渲染序号
            let groupValue = data.data.group;
            if( (groupValue||Object.is( groupValue,'' )||Object.is( groupValue,0 ))&&data.colDef.field=='group' ){
                this.agGrid.gridOptions.api.redrawRows();
            }
            let arr=[];
            for(let obj of data.columnApi._columnController.primaryColumns){
                if(obj['colDef']['count_table_id']){
                    arr.push(obj);
                }
            }

            this.col_id=data.data._id;
            this.colDef=arr;
            //行选择
            if(data.colDef.headerName != "操作"){
                dgcService.rowClickSelect( data )
            }

            //数据计算cache不可操作
            if( data["data"]["data_status"] &&  data["data"]["data_status"]=='0'){
                msgBox.alert("数据计算中，请稍候");
                return;
            }

            //图片查看
            if( data.colDef.real_type == fieldTypeService.IMAGE_TYPE ){
            }
            //富文本字段
            if( data.colDef.real_type == fieldTypeService.UEDITOR ){
            }
            //合同编辑器
            if( data.colDef.real_type == fieldTypeService.TEXT_COUNT_TYPE ){
            }
            //附件字段
            if( data.event.srcElement.id == 'file_view' && fieldTypeService.attachment(data.colDef.real_type) ){
            }
            //内置相关查看原始数据用
            if( data.event.srcElement.id == 'relatedOrBuildin' ){
                console.log( "内置相关穿透" )
                let obj = {
                    tableId: data.colDef.source_table_id,
                    tableName: data.colDef.source_table_name||'',
                    parentTableId: this.data.tableId,
                    rowId: data.data._id,
                    base_buildin_dfield: data.colDef.source_field_dfield,
                    source_field_dfield: data.colDef.base_buildin_dfield,
                    tableType: 'source_data',
                    viewMode: 'source_data'
                }
                let url = dgcService.returnIframeUrl( '/datagrid/source_data_grid/',obj );
                let winTitle = this.data.tableName + '->' + obj.tableName;
                this.actions.openSourceDataGrid( url,winTitle );
            }
            //对应关系查看
            if(data.colDef.real_type == fieldTypeService.CORRESPONDENCE && data.value.toString().length && data.event.target.id == "correspondenceClick"){
                console.log( '对应关系穿透' )
                let json = {
                    form_id:'',
                    table_id:this.data.tableId,
                    is_view:1,
                    parent_table_id:'',
                    parent_real_id:'',
                    parent_temp_id:'',
                    real_id: data['data']['_id']
                }

                FormService.getDynamicData( json ).then( res=>{
                    let obj = {
                        tableId: data.colDef.field_content.correspondence_table_id,
                        tableName: data.colDef.source_table_name||'',
                        parentTableId: this.data.tableId,
                        parentTempId: res.data.temp_id.value,
                        tableType: '',
                        viewMode: 'viewFromCorrespondence',
                        rowId: data.data._id,
                        parentRealId: data.data._id
                    }
                    let url = dgcService.returnIframeUrl( '/datagrid/source_data_grid/',obj );
                    let winTitle = this.data.tableName + '->' + obj.tableName;
                    this.actions.openSourceDataGrid( url,winTitle );
                } )
                HTTP.flush();
            }
            //统计
            if( fieldTypeService.countTable(data.colDef.dinput_type,data.colDef.real_type) && data.value.toString().length && data.event.target.id == "childOrCount" ){
                console.log( '统计穿透' )
                let obj = {
                    tableId: data.colDef.field_content.count_table,
                    tableName: data.colDef.field_content.count_table_name||'',
                    parentTableId: this.data.tableId,
                    tableType: 'count',
                    viewMode: 'count',
                    rowId: data.data._id,
                    parentRealId: data.data._id,
                    fieldId: data.colDef.id
                }
                let url = dgcService.returnIframeUrl( '/datagrid/source_data_grid/',obj );
                let winTitle = this.data.tableName + '->' + obj.tableName;
                this.actions.openSourceDataGrid( url,winTitle );
            }
            // 子表
            if( fieldTypeService.childTable(data.colDef.dinput_type) && data.value.toString().length && data.event.target.id == "childOrCount" ){
                console.log( "子表穿透" )
                let obj = {
                    tableId: data.colDef.field_content.child_table,
                    tableName: data.colDef.field_content.child_table_name||'',
                    parentTableId: this.data.tableId,
                    tableType: 'child',
                    viewMode: 'child',
                    rowId: data.data._id,
                    parentRealId: data.data._id,
                    fieldId: data.colDef.id
                }
                let url = dgcService.returnIframeUrl( '/datagrid/source_data_grid/',obj );
                let winTitle = this.data.tableName + '->' + obj.tableName;
                this.actions.openSourceDataGrid( url,winTitle );
            }
            //点击操作列
            if( data.colDef.headerName == "操作" ){
                this.actions.gridHandle( data )
            }
        },
        //操作列点击事件
        gridHandle: function ( data ) {
            console.log( "操作" )
            console.log( data )
            if( data.event.srcElement.className == 'gridView' ){
                console.log( '查看' )
                let obj = { table_id: this.data.tableId,real_id: data.data._id,btnType: 'view',is_view:1 };
                let url = dgcService.returnIframeUrl( '/form/index/',obj );
                let title = '查看'
                this.actions.openSourceDataGrid( url,title );
            }
            if( data.event.srcElement.className == 'gridEdit' ){
                console.log( '编辑' )
                let obj = { table_id: this.data.tableId,real_id: data.data._id,btnType: 'edit' };
                let url = dgcService.returnIframeUrl( '/form/index/',obj );
                let title = '编辑'
                this.actions.openSourceDataGrid( url,title );
            }
            if( data.event.srcElement.className == 'gridHistory' ){
                console.log( '历史' )
            }
        },
        //行双击
        onRowDoubleClicked: function (data) {
            console.log( "行双击查看" )
            console.log( data )
            let obj = { table_id: this.data.tableId,real_id: data.data._id,btnType: 'view',is_view:1 };
            let url = dgcService.returnIframeUrl( '/form/index/',obj );
            let title = '查看'
            this.actions.openSourceDataGrid( url,title );
        },
        //打开穿透数据弹窗
        openSourceDataGrid: function ( url,title,w,h ) {
            PMAPI.openDialogByIframe( url,{
                width: w || 1300,
                height: h || 800,
                title: title,
                modal:true
            } ).then( (data)=>{
                if( data.type == "batch" ){
                    this.actions.returnBatchData( data.ids );
                }
            } )
        },
        //返回批量工作流导入后数据
        returnBatchData: function (ids) {
        }
    },
    afterRender: function () {
        if( this.data.viewMode == 'in_process' ){
            this.data.noNeedCustom = true;
        }
        this.floatingFilterCom = new FloatingFilter();
        this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;
        this.actions.getHeaderData();
        let _this = this
        $('.dataGrid-commonQuery-select').bind('change', function() {
            if($(this).val() == '常用查询') {
                _this.actions.postExpertSearch([],'');
            } else if($(this).val() == '临时高级查询') {
                _this.actions.postExpertSearch(_this.data.saveTemporaryCommonQuery,'');
            } else {
                // $(this).find('.Temporary').remove();
                _this.data.commonQueryData.forEach((item) => {
                    if(item.name == $(this).val()){
                        _this.actions.postExpertSearch(JSON.parse(item.queryParams),item.id,item.name);
                    }
                })
            }
        })
    }
}

class dataTableAgGrid extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default dataTableAgGrid;