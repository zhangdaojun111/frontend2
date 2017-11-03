/**
 * @author yangxiaochuan
 * dataGrid
 */

import Component from "../../../../lib/component";
import template from './data-table-agGrid.html';
import './data-table-agGrid.scss';
import '../../../../assets/scss/dataGrid/dataGrid-icon.scss'
import {HTTP} from "../../../../lib/http";
import Mediator from "../../../../lib/mediator";
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import msgBox from '../../../../lib/msgbox';
import agGrid from "../../agGrid/agGrid";
import {dataTableService} from "../../../../services/dataGrid/data-table.service";
import {TabService} from "../../../../services/main/tabService"
import {workflowService} from "../../../../services/workflow/workflow.service";
import {FormService} from "../../../../services/formService/formService";
import {dgcService} from "../../../../services/dataGrid/data-table-control.service";
import {fieldTypeService} from "../../../../services/dataGrid/field-type-service";
import FloatingFilter from "../../data-table-toolbar/floating-filter/floating-filter";
import customColumns from "../../data-table-toolbar/custom-columns/custom-columns";
import groupGrid from "../../data-table-toolbar/data-table-group/data-table-group";
import dataPagination from "../../data-table-toolbar/data-pagination/data-pagination";
import importSetting from '../../data-table-toolbar/data-table-import/data-table-import';
import exportSetting from '../../data-table-toolbar/data-table-export/data-table-export';

import expertSearch from "../../data-table-toolbar/expert-search/expert-search";
import {contractEditorConfig} from '../../../form/contract-control/contract-editor/contract-editor';
import AttachmentList from "../../../form/attachment-list/attachment-list";
import PictureAttachment from "../../../form/picture-attachment/picture-attachment";
import {PersonSetting} from "../../../main/personal-settings/personal-settings";
import ViewVideo from "../../../form/view-video/view-video";
import fastSearch from "../../data-table-toolbar/fast-search/fast-search"
import QuillAlert from "../../../form/quill-alert/quill-alert";


let config = {
    template: template,
    data: {
        tableId: '',
        formId: '',
        tableType: '',
        parentTableId: '',
        parentRealId: '',
        parentTempId: '',
        parentRecordId: '',
        rowId: '',
        fieldId: '',
        flowId: '',
        recordId: '',
        source_field_dfield: '',
        base_buildin_dfield: '',
        fieldContent: null,
        rowData:[],
        footerData:[{myfooter: '合计'}],
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
        //自定义行级操作
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
        onlyCloseExpertSearch:false,
        temporaryCommonQuery:[],
        //高级查询需要的字段信息
        expertSearchFields: [],
        //快速搜索字段数据
        fastSearchFields: [],
        //定制列需要字段信息
        customColumnsFields: [],
        //第一次加载常用查询参数
        common_filter_id: '',
        //搜索参数
        filterParam: {expertFilter:[],fastFilter: [], filter: [], is_filter: 0, common_filter_id: '', common_filter_name: ''},
        //上传一搜索参数
        filterText: '',
        //是否第一次渲染agGrid
        firstRender: true,
        //权限
        permission:{add: 1, calendar: 1, complex_search: 1, custom_field: 1, custom_width: 1, delete: 1, download: 1, edit: 1, group: 1, in_work: 1, search: 1, upload: 1, view: 1 ,setting: 1,cell_edit:1,new_window:1},
        //是否分组
        groupCheck: false,
        //是否显示定制列panel
        isShowCustomPanel: false,
        //点击的关闭
        closePanel: false,
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
        //第一次进入加载footer数据
        firstGetFooterData: true,
        //是否返回在途footer数据
        inProcessFooter: false,
        //是否有分页
        pagination: false,
        //对应关系首次加载
        fristGetCorrespondence:true,
        //对应关系增加的数据
        correspondenceAddList: [],
        //对应关系减少的数据
        correspondenceRemoveList: [],
        //对应关系选择的数据
        correspondenceSelectedList: [],
        //对应关系选择的数据
        correspondenceSelectedData: [],
        //表单对应关系字段
        correspondenceField: '',
        //数据检索模式搜索参数
        keyword: '',
        //删除数据前往处理
        deleteHandingData: {_id: []},
        //表级操作数据
        tableOperationData: [],
        //表的表单、工作流参数
        prepareParmas: {},
        //编辑模式参数
        colControlData: {},
        //是否为编辑模式
        editMode: false,
        //上一次操作状态
        lastGridState: [],
        //编辑模式对比原始数据
        originRowData: {},
        //编辑数据总数
        editRowTotal: 0,
        //编辑已经保存的数量
        editRowNum: 0,
        //编辑保存参数
        saveEditObjArr: [],
        //是否为含有默认字段的表
        haveSystemsFields: false,
        //表的类型
        namespace: '',
        //选择的数据
        selectData: [],
        //是否有sheet
        isShowSheet: false,
        //显示tabs
        showTabs:function (opacity) {
        },
        //是否为部门日报
        departmentDiary: false,
        //部门日报搜索参数
        departmentFilter: {},
        //获取部门日报填写人字段
        getDiarySearchField: function (d) {

        },
        //是否为新窗口打开
        isNewWindow: false,
        //左侧提示
        gridTips: '',
        //是否为双击
        doubleClick: false,
        //是否显示提示
        isShowTips: true,
        //是否第一次创建编辑表头
        firstCreateEditCol: true,
        //第一次获取二维表数据
        firstReportTable: true,
        //二维表项目名称
        project: '',
        //二维表改变的值
        cellChangeValue: {},
        //工作流表单查看操作
        cannotopenform: '',
        //表单数据（子表导入用）
        formData: '',
        //是否加载cache数据
        cacheData: false,
    },
    //生成的表头数据
    columnDefs: [],
    columnDefsEdit: [],
    actions: {
        /**
         * 生成表头
         * 参数：edit是否为编辑模式的表头
         */
        createHeaderColumnDefs: function (edit) {
            let columnDefs = [],
                headerArr = [],
                columnArr = [],
                otherCol = []
            for (let col of this.data.fieldsData) {
                headerArr.push({data: col, header: col["name"].split('->')})
            }

            for (let data of headerArr) {
                for (let i = 0, length = data.header.length; i < length; i++) {
                    this.actions.getArr(i, 0, columnArr, length, data, otherCol , edit);
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
            if( this.data.viewMode != 'reportTable2' ){
                columnDefs.unshift(
                    dgcService.selectCol
                );
            }
            //添加序号列
            if( this.data.viewMode != 'reportTable2' ){
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

            columnDefs.unshift( dgcService.groupCol );
            if( this.data.viewMode != 'reportTable2' ){
                columnDefs.push(operate)
            }
            return columnDefs;
        },
        /**
         * 递归生成表头用
         */
        getArr: function (i, n, column, len, data, otherCol , edit) {
            if (i == n) {
                this.actions.createHeader(column, i, len, data, otherCol,edit)
            } else {
                for (let col of column) {
                    if (data.header[n] == col['headerName'] && col['children']) {
                        this.actions.getArr(i, n + 1, col['children'], len, data, otherCol,edit);
                    }
                }
            }
        },
        /**
         * 递归生成表头用
         */
        createHeader: function (column, i, len, data, otherCol,edit) {
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
                    // let headClass = fieldTypeService.numOrText(data.data["real_type"]) ? 'header-style-r' : 'header-style-l';
                    let headerStyleObj = {
                        right:'header-style-r',left:'header-style-l',center:''
                    }
                    let headClass = headerStyleObj[fieldTypeService.textAline(data.data["real_type"])];

                    if( this.data.viewMode == 'reportTable2' ){
                        headClass = '';
                    }

                    //添加表头提醒
                    if( this.data.headerColor[data.data["field"]] != undefined ){
                        headClass+=(' '+this.data.headerColor[data.data["field"]])
                    }

                    //解决后台配置字段之后类排序没有该字段导致该列不显示的BUG
                    if (this.data.orderFields.indexOf(data.data["field"]) == -1) {
                        otherCol.push(data.data["field"]);
                    }

                    let fixArr = this.data.fixCols.l.concat(this.data.fixCols.r);

                    //判断是否有系统字段（创建时间）
                    if( data.header[i] == '创建时间' ){
                        this.data.haveSystemsFields = true;
                    }
                    let minWidth = {
                        datetime: 160,
                        time: 90,
                        date: 110
                    }
                    //部门日报搜索字段
                    if( this.data.departmentDiary ){
                        if( data.header[i] == '填写人' ){
                            this.data.getDiarySearchField( data.data["field"] );
                        }
                    }
                    let obj = {
                        headerName: data.header[i],
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
                        minWidth: minWidth[fieldTypeService.searchType(data.data["real_type"])] || 20,
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
                    // 图片可见单元格属性修改
                    if (data.data["dinput_type"] == fieldTypeService.IMAGE_TYPE && data.data['field_content']['is_show_image'] == 1) {
                        obj['cellStyle'] = {'font-style': 'normal'};
                        obj['cellStyle']['overflow'] = "visible";
                    }
                    let width = data.data["width"] || 100;
                    if (this.data.colWidth && this.data.colWidth[data.data["field"]]) {
                        width = this.data.colWidth[data.data["field"]];
                    }
                    obj["width"] = width + 17;
                    if( this.data.viewMode == 'child' || this.data.viewMode == 'count' ){
                        if( this.data.source_field_dfield == data.data["field"] && !edit ){
                            obj['cellStyle']['background'] = "rgba(255,0,0,0.5)";
                        }
                    }
                    if( this.data.viewMode == 'reportTable2' && data.data.is_today ){
                        obj['cellStyle']['background'] = "rgba(250,235,180,0.9)";
                    }
                    if( this.data.viewMode == 'reportTable2' && data.data.field == 'num' ){
                        obj['sort'] = "asc";
                    }
                    //编辑模式用
                    if( edit ){
                        obj['cellStyle'] = {'font-style': 'normal','background':'#EBEBEB'};
                        obj = this.actions.setEditableCol( obj );
                    }
                    column.push(obj);
                }
            }
        },
        //设置编辑模式表头，通过表头数据来判断是否可以编辑
        setEditableCol: function ( col ) {
            let editCol = col;
            //拷贝columnDefs的值
            for(let k in col){
                editCol[k]=col[k];
            }
            //列定义可编辑部分的赋值
            let controlData = this.data.colControlData[editCol['colId']];
            if(controlData){
                if(controlData['is_view'] == 0 && controlData['relevance_condition']
                    && Object.getOwnPropertyNames(controlData['relevance_condition']).length == 0) {
                    let type = controlData['type'];
                    switch (type) {
                        case 'Input':
                        case 'Textarea':
                            editCol['editable'] = true;
                            break;
                        case 'Buildin':
                        case 'Select':
                            this.actions.setOptionsForColumn(editCol, controlData, 'options');
                            break;
                        case 'Radio':
                            this.actions.setOptionsForColumn(editCol, controlData, 'group');
                            break;
                        default:
                            break;
                    }
                }
                if( editCol['editable'] == true ){
                    editCol['cellStyle'] = {'font-style': 'normal'};
                }
                if(controlData['reg']){
                    editCol['reg']=controlData['reg'];
                }
                if(controlData['numArea']){
                    editCol['numArea']= controlData['numArea'];
                }
                editCol['required'] = controlData['required'];
            }
            return editCol;
        },
        //设置编辑模式选择类型字段的选项
        setOptionsForColumn: function(editCol,controlData,optionProp){
            editCol['editable']=true;
            editCol['cellEditor']='select';
            let radioParams = [];
            let groups = {};
            if(controlData[optionProp] == undefined){
                let field_content = controlData['field_content'];
                Object.getOwnPropertyNames(field_content).forEach(option=>{
                    let value = option;
                    let label = field_content[value];
                    groups[label]=value;
                    radioParams.push(label);
                });
            } else {
                controlData[optionProp].forEach(option=>{
                    let value = option['value'];
                    let label = option['label'];
                    groups[label]=value;
                    radioParams.push(label);
                })
            }

            controlData['options_objs']=groups;
            editCol['cellEditorParams']={values:radioParams};
        },
        //调用aggrid的API，通过表头数据来生成每个cell内容
        bodyCellRender: function (params) {
            if (params.data && params.data.myfooter && params.data.myfooter == "合计") {
                let textAline = fieldTypeService.textAline( params.colDef["real_type"] )
                let bgStyle = ' style = "display: block;height: 100%;text-align:' + textAline+';"';
                let val = params.value || '';
                if( fieldTypeService.numOrText(params.colDef["real_type"])|| params.colDef["real_type"] == fieldTypeService.DECIMAL_TYPE ){
                    val = dgcService.formatter(val)
                }
                let h = '<span' + bgStyle + '><span>' + val + '</span><span/>';
                return h;
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
                                    if (params.data[conditinField] > condition["context"]) {
                                        color = 'rgba(255,0,0,1)'
                                    }
                                    break;
                                }
                                case '<': {
                                    if (params.data[conditinField] < condition["context"]) {
                                        color = 'rgba(255,0,0,1)'
                                    }
                                    break;
                                }
                                case '<=': {
                                    if (params.data[conditinField] <= condition["context"]) {
                                        color = 'rgba(255,0,0,1)'
                                    }
                                    break;
                                }
                                case '>=': {
                                    if (params.data[conditinField] >= condition["context"]) {
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
                sHtml = '<span ><span/>';
                return sHtml;
            }

            //字段类型对其
            let textAline = fieldTypeService.textAline( colDef["real_type"] )
            let bgStyle = ' style = "display: block;padding: 0 8px;height: 100%;text-align:' + textAline+';"';
            if( color != 'transparent' ){
                bgStyle = ' style = "display: block;padding: 0 8px;height: 100%;background:' + color+';text-align:' + textAline + ';"';
            }

            if( this.data.viewMode == 'reportTable2' ){
                textAline = 'right';
                if( params.colDef.colId == 'num' || params.colDef.colId == "title" ){
                    textAline = 'center';
                }
                bgStyle = ' style = "display: block;padding: 0 8px;height: 100%;background:' + color+';text-align:' + textAline + ';"';
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
            //处理数字类型
            if (fieldTypeService.numOrText(real_type)) {//数字类型
                let numVal = fieldTypeService.intOrFloat(real_type) ? dgcService.formatter(params.value) : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                if (fieldTypeService.childTable(dinput_type) || fieldTypeService.countTable(dinput_type)) {//子表||统计类型
                    if (this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence') {
                        sHtml = '<span' + bgStyle + ' class="ag-num-right-style"><span>' + numVal + '</span><span/>';
                    } else {
                        sHtml = '<a' + bgStyle + 'class="ag-text-style ag-num-right-style" id="childOrCount">' + numVal + '</a>';
                    }
                } else {
                    if (colDef['base_buildin_dfield'] != '' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人') {
                        sHtml = '<a' + bgStyle + ' title="查看源数据" class="ag-text-style ag-num-right-style"><span id="relatedOrBuildin">' + numVal + '</span></a>';
                    } else {
                        sHtml = '<span' + bgStyle + ' class="ag-num-right-style"><span>' + numVal + '</span><span/>';
                    }
                }
            }

            //加密文本处理
            else if (real_type == fieldTypeService.SECRET_TEXT) {
                sHtml = '<span' + bgStyle + '>******</span>';
            }

            //周期规则处理
            else if (real_type == fieldTypeService.CYCLE_RULE) {
                let val = params["data"][colDef["colId"]]["-1"] || "";
                if (val !== "") {
                    val = val.replace(/\n/g, "\n;\n");
                }
                if (colDef['base_buildin_dfield'] != '' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人') {
                    sHtml = '<a' + bgStyle + ' title="查看源数据" class="ag-text-style"><span id="relatedOrBuildin">' + val + '</span></a>';
                } else {
                    sHtml = '<span' + bgStyle + '><span>' + val + '</span></span>';
                }
            }

            //富文本编辑框
            else if (real_type == fieldTypeService.UEDITOR) {
                sHtml = '<a' + bgStyle + ' class="ag-text-style" title="富文本">查看详情</a>';
            }

            //大数字段处理
            else if (real_type == fieldTypeService.DECIMAL_TYPE) {
                if (fieldTypeService.childTable(dinput_type) || fieldTypeService.countTable(dinput_type)) {//子表||统计类型
                    let bigNum = params.value > 9007199254740992 ? dgcService.formatter(params.value.toString()) + '.00' : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                    sHtml = '<a' + bgStyle + ' class="ag-text-style" id="childOrCount">' + bigNum + '</a>';
                } else {
                    let bigNum = params.value > 9007199254740992 ? dgcService.formatter(params.value.toString()) + '.00' : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                    if (colDef['base_buildin_dfield'] != '' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人') {
                        sHtml = '<a' + bgStyle + ' title="查看源数据" class="ag-text-style"><span id="relatedOrBuildin">' + bigNum + '</span></a>';
                    } else {
                        sHtml = '<span' + bgStyle + '><span>' + bigNum + '</span></span>';
                    }
                }
            }

            //地址类型
            else if (real_type == fieldTypeService.URL_TYPE) {
                sHtml = '<a' + bgStyle + ' class="ag-text-style" id="shareAddress" target="_blank">' + myValue + '</a>';
            }

            //合同编辑器
            else if (real_type == fieldTypeService.TEXT_COUNT_TYPE) {
                sHtml = '<a' + bgStyle + ' class="view-contract">' + "查看" + '</a>' + '<span>' + "丨" + '</span>' + '<a class="download-contract">' + '下载' + '</a>';
                sHtml = '<span '+ bgStyle +'><a style="color:#337ab7;" class="view-contract">查看</a>丨<a style="color:#337ab7;" class="download-contract">下载</a></span>';
            }

            //表对应关系（不显示为数字）
            else if (real_type == fieldTypeService.CORRESPONDENCE) {
                if (this.data.viewMode == 'editFromCorrespondence') {
                    sHtml = '<span' + bgStyle + '>' + params.value + '</span>';
                } else {
                    sHtml = '<a' + bgStyle + ' class="ag-text-style"><span id="correspondenceClick">' + params.value + '</span></a>';
                }
            }

            //图片附件
            else if (real_type == fieldTypeService.IMAGE_TYPE && colDef['field_content']['is_show_image'] == 1) {
                sHtml = '<a' + bgStyle + ' class="ag-text-style" id="file_view" title="查看详情">' + ( myValue.length || 0 ) + ' 张图片</a>';
            }

            //普通附件
            else if (real_type == fieldTypeService.ATTACHMENT) {
                sHtml = '<a' + bgStyle + ' class="ag-text-style" id="file_view" title="查看详情">' + ( myValue.length || 0 ) + ' 个附件</a>';
            }

            //视频附件
            else if( real_type == fieldTypeService.VIDEO_TYPE ){
                sHtml = '<a' + bgStyle + ' class="ag-text-style" id="file_view" title="查看详情">' + ( myValue.length || 0 ) + ' 段视频</a>';
            }

            //都做为文本处理
            else {
                if (fieldTypeService.childTable(dinput_type) || fieldTypeService.countTable(dinput_type,real_type)) { //子表或统计类型
                    if (this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence') {
                        sHtml = '<span' + bgStyle + '>' + params.value + '</span>';
                    } else {
                        sHtml = '<a' + bgStyle + ' class="ag-text-style"><span id="childOrCount">' + params.value + '</span></a>';
                    }
                } else {
                    if (colDef['base_buildin_dfield'] != '' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人') {
                        sHtml = '<a' + bgStyle + ' title="查看源数据" class="ag-text-style"><span id="relatedOrBuildin">' + params.value + '</span></a>';
                    } else {
                        sHtml = '<span' + bgStyle + '><span>' + params.value + '</span></span>';
                    }
                }
            }

            //二维表特殊字段处理
            if( params.colDef.field_content.is_report_table_entry ){
                sHtml = '<span' + bgStyle + '><a class="ag-text-style" id="reportTable2" title="二维表">' + params.value + '<a/></span>';
            }

            //分组无数据时容错
            if (params && params.colDef && params.colDef.headerName == 'Group') {
                sHtml = sHtml = '<span' + bgStyle + '>' + params.value + '</span>';
            }
            return sHtml;
        },
        //重置偏好以及重置筛选功能
        resetPreference: function () {
            let ediv = document.createElement('div');
            let eHeader = document.createElement('span');
            let eImg = document.createElement('i');
            eImg.className = 'icon-aggrid icon-aggrid-cancel resetFloatingFilter';
            eImg.title = '重置筛选';
            eImg.addEventListener( 'click',()=>{
                msgBox.confirm( '确定清空筛选数据？' ).then( r=>{
                    if( r ){
                        for( let k in this.data.searchValue ){
                            this.data.searchValue[k] = '';
                        }
                        for( let k in this.data.searchOldValue ){
                            this.data.searchOldValue[k] = '';
                        }
                        this.data.queryList = {};
                        this.actions.setFloatingFilterInput();
                        this.data.filterParam.filter = [];
                        this.actions.getGridData();
                    }
                } )
            } )
            if( !this.data.noNeedCustom ){
                ediv.appendChild( eHeader )
                eHeader.innerHTML = "初";
                eHeader.title = '初始化偏好'
                eHeader.className = "table-init-logo";
                eHeader.addEventListener('click', () => {
                    msgBox.confirm( '确定初始化偏好？' ).then( r=>{
                        if( r ){
                            dataTableService.delPreference( {table_id: this.data.tableId} ).then( res=>{
                                msgBox.showTips( '操作成功' );
                                let obj = {
                                    actions: JSON.stringify(['ignoreFields', 'group', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                                    table_id: this.data.tableId
                                };
                                dataTableService.getPreferences( obj ).then( res=>{
                                    dgcService.setPreference( res,this.data );
                                    //初始化偏好隐藏系统默认列
                                    this.actions.hideSysCols( res );
                                    HTTP.flush();
                                    //创建表头
                                    this.columnDefs = this.actions.createHeaderColumnDefs();
                                    this.agGrid.gridOptions.api.setColumnDefs( this.columnDefs );
                                    dgcService.calcColumnState(this.data,this.agGrid,["group",'number',"mySelectAll"]);
                                    this.customColumnsCom.actions.makeSameSate();
                                } );
                                HTTP.flush();
                            } );
                            HTTP.flush();
                        }
                    } )
                });
            }
            ediv.appendChild( eImg )
            return ediv;
        },
        //生成操作列（查看，编辑，历史，触发操作，行级操作），以及计算操作列的宽度
        operateCellRenderer: function (params) {
            let rowStatus = 0;
            let operateWord = 2;
            if (!params.data || ( params.node.rowGroupIndex <= this.rowGroupIndex ) || params.data && params.data.myfooter && params.data.myfooter == '合计') {
                return '';
            }
            if( this.data.viewMode == 'in_process' ){
                return '<div style="text-align: center;"><a class="gridView" style="color:#337ab7; cursor: pointer">查看</a></div>';
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
            let str = '<div style="text-align:center;"><a class="gridView">查看</a>';
            if (this.data.viewMode == 'normal' || this.data.viewMode == 'source_data' || this.data.viewMode == 'EditChild' || this.data.viewMode == 'deleteHanding') {
                if (this.data.isFixed || rowStatus == 2 || this.data.permission.edit == 0) {
                    str += ' | <span style="color: darkgrey;cursor: pointer">编辑</span>';
                    str += ' | <a style="color: darkgrey;cursor: pointer">历史</a>';
                } else {
                    str += ' | <a  class="gridEdit" >编辑</a>';
                    str += ' | <a  class="gridHistory">历史</a>';
                }
                operateWord = operateWord + 4;
            }
            if (this.data.viewMode == 'approveBatch') {
                str += ' | <a  class="gridEdit">编辑</a>';
                operateWord = operateWord + 2;
            }
            if (this.data.customOperateList) {
                for (let d of this.data.customOperateList) {
                    str += ` | <a class="customOperate" id="${ d["id"] }">${ d["name"] }</a>`;
                    operateWord = operateWord + (d["name"] ? d["name"].length : 0);
                }
            }
            if (this.data.rowOperation) {
                for (let ro of this.data.rowOperation) {
                    if (ro.frontend_addr && ro.frontend_addr == 'export_row') {
                        let selectedRows = JSON.stringify([params.data._id])
                        str += ` | <a class="rowOperation" id="${ ro["row_op_id"] }" href='/data/customize/ta_excel_export/?table_id=${ this.pageId }&selectedRows=${ selectedRows }'>${ ro["name"] }</a>`;
                        operateWord = operateWord + (ro["name"] ? ro["name"].length : 0);
                    } else {
                        str += ` | <a class="rowOperation" id="${ ro["row_op_id"] }" style="color:#337ab7;">${ ro["name"] }</a>`;
                        operateWord = operateWord + (ro["name"] ? ro["name"].length : 0);
                    }
                }
            }
            str += '</div>';
            this.data.operateColWidth=20*operateWord+20;
            return str
        },
        //设置搜索input值，解决拖动列排序后重新渲染floatingFilter的input导致显示为空
        setFloatingFilterInput: function () {
            for( let k in this.data.searchValue ){
                try{this.el.find( '.filter-input-'+k )[0].value = this.data.searchValue[k];}catch(e){}
            }
        },
        //floatingFilter拼参数，接收floatingFilter改变的参数，拼装成搜索需要的参数
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
        //设置快速搜索参数，进行搜索
        fastSearchData: function (data) {
            this.data.filterParam.fastFilter = data;
            this.actions.getGridData();
        },
        //设置高级查询参数，进行搜索
        postExpertSearch:function(data,id,name) {
            this.data.filterParam.expertFilter = data;
            this.data.filterParam.common_filter_id = id;
            this.data.filterParam.common_filter_name = name;
            this.actions.getGridData();
        },
        //初始化按钮，根据viewMode参数，生成不同模式需要的按钮
        renderBtn: function () {
            let btnGroup = dgcService.gridBtn( this.data.viewMode );
            let btns = this.el.find( '.dataGrid-btn-group' )[0].querySelectorAll('a');
            let html = '';
            for( let btn of btns ){
                let name = btn.className;
                if( btnGroup.indexOf( name )!=-1 && ( this.data.permission[dgcService.permission2btn[name]] || dgcService.permission2btn[name] == 'especial' ) ){
                    //工作流表无编辑模式
                    if( name == 'edit-btn' && this.data.flowId != '' ){
                        continue;
                    }
                    //新窗口
                    if( name == 'grid-new-window' && this.data.isNewWindow ){
                        continue;
                    }
                    html+=btn.outerHTML;
                }
            }
            let con = this.el.find( '.dataGrid-btn-group' )[0];
            con.innerHTML = html;
            $(con).addClass('flex');
            setTimeout( ()=>{
                con.style.display = 'flex';
                this.el.find( '.dataGrid-btn-group' )[0].style.display = 'flex';
            },1000 )
        },
        /**
         * 请求表头数据，等数据全部返回后渲染数据
         * （preferenceData：偏好，headerData：表头数据，sheetData：sheet分页数据，tableOperate：操作数据，prepareParmas：表单及工作流数据）
         */
        getHeaderData: function () {
            let obj1 = {
                actions: JSON.stringify(['ignoreFields', 'group', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                table_id: this.data.tableId
            }
            let obj2 = {
                table_id: this.data.tableId
            }
            if( this.data.viewMode == 'reportTable2' ){
                obj2['is_report'] = 1;
                obj2['parent_table_id'] = this.data.parentTableId;
                obj2['parent_real_id'] = this.data.parentRealId;
                obj2['field_id'] = this.data.fieldId;
                obj2['parent_temp_id'] = this.data.parentTempId;
            }
            let preferenceData = dataTableService.getPreferences(obj1);
            let headerData = dataTableService.getColumnList(obj2);
            let sheetData = dataTableService.getSheetPage( obj2 );
            let tableOperate = dataTableService.getTableOperation( obj2 );
            let prepareParmas = dataTableService.getPrepareParmas( obj2 );
            Promise.all([preferenceData, headerData, sheetData,tableOperate,prepareParmas]).then((res)=> {
                this.actions.setHeaderData( res );
                this.actions.getGridData();
            })
            //请求表单数据
            // this.actions.getGridData();
            HTTP.flush();
        },
        //设置表头数据
        setHeaderData: function ( res ) {
            if( res[0].is_report == 1 && this.data.firstReportTable ){
                //二维表
                this.data.viewMode = 'reportTable2';
                this.actions.getHeaderData();
                this.data.firstReportTable = false;
                return;
            }
            dgcService.setPreference( res[0],this.data );
            this.data.myGroup = (res[0]['group'] != undefined) ? JSON.parse(res[0]['group'].group) : [];
            this.data.fieldsData = res[1].rows || [];
            this.agGrid.data.fieldsData = this.data.fieldsData;
            this.data.permission = res[1].permission;
            this.data.namespace = res[1].namespace;
            this.data.headerColor = dgcService.createHeaderStyle( this.data.tableId,res[1].field_color );
            //获取表的表单工作流参数
            this.actions.setPrepareParmas( res[4] );
            //初始化按钮
            this.actions.renderBtn();
            //创建高级查询需要字段数据
            let r = dgcService.createNeedFields( this.data.fieldsData )
            this.data.expertSearchFields = r.search;
            //快速搜索需要字段数据
            this.data.fastSearchFields = r.fast;
            //定制列需要字段数据
            this.data.customColumnsFields = r.custom;
            //分组需要字段数据
            this.data.groupFields = r.group;
            //创建表头
            this.columnDefs = this.actions.createHeaderColumnDefs();

            let d = {
                columnDefs: this.columnDefs
            }
            //赋值
            this.agGrid.actions.setGridData(d);

            //第一次加载隐藏默认列
            this.actions.hideSysCols( res[0] );
            //创建sheet分页
            this.actions.createSheetTabs( res[2] );

            // this.actions.getGridData();
            //按钮点击事件
            this.actions.onBtnClick();
            //表级操作数据
            let temp = res[3]['rows'];
            for(let i =0;i<temp.length;i++){
                if (typeof (temp[i]) == 'object'){
                    temp[i]['addressss']=JSON.stringify({feAddress:temp[i]['feAddress'],beAddress:temp[i]['beAddress']})
                }
            }
            this.data.tableOperationData = temp;
            //渲染其他组件
            // this.actions.renderAgGrid();
        },
        //隐藏系统字段
        hideSysCols: function ( res ) {
            if( res.is_report == 0 && res.ignoreFields.ignoreFields == null && this.data.haveSystemsFields ){
                this.data.ignoreFields = ['f1','f2','f3','f4'];
                dataTableService.savePreference({
                    action: 'ignoreFields',
                    table_id: this.data.tableId,
                    ignoreFields: JSON.stringify( this.data.ignoreFields  )
                });
            }
        },
        //设置表表单、工作流数据
        setPrepareParmas: function (res) {
            this.data.prepareParmas = res.data;
            this.data.customOperateList = this.data.prepareParmas["operation_data"] || [];
            this.data.rowOperation = this.data.prepareParmas['row_operation'] || [];
            try{this.data.flowId = res["data"]["flow_data"][0]["flow_id"] || "";}catch(e){}
            for( let d of this.data.prepareParmas["flow_data"] ){
                if( d.selected == 1 ){
                    this.data.flowId = d.flow_id;
                }
            }
        },
        //请求新增表单统计数据
        getNewFormCountData: function () {
            PMAPI.getIframeParams(window.config.key).then((r) => {
                let data = r.data.d;
                dataTableService.getNewFormCountData( data ).then( res=>{
                    let resRows = [];
                    if(res.data.db.length != 0 && res.data.temp.length == 0){
                        resRows = res.data.db
                    }
                    if(res.data.db.length == 0 && res.data.temp.length != 0){
                        for(let obj of res.data.temp){
                            obj['data'] = {};
                            obj['data']['status'] = 1;
                        }
                        resRows = res.data.temp
                    }
                    if(res.data.db != 0 && res.data.temp != 0){
                        for(let obj of res.data.temp){
                            obj['data']={};
                            obj['data']['status']=1;
                        }
                        resRows = res.data.temp.concat(res.data.db);
                    }
                    this.data.rowData = resRows;
                    if( this.data.firstRender ){
                        //渲染其他组件
                        this.actions.renderAgGrid();
                        let d = {
                            rowData: this.data.rowData
                        }
                        //赋值
                        this.agGrid.actions.setGridData(d);
                    }else {
                        let d = {
                            rowData: this.data.rowData
                        }
                        //赋值
                        this.agGrid.actions.setGridData(d);
                    }
                } )
            })
        },
        //请求在途数据
        getInprocessData: function (refresh) {
            let postData = this.actions.createPostData();
            let post_arr = [];
            let body = dataTableService.getTableData( postData );
            let remindData = dataTableService.getReminRemindsInfo({table_id:this.data.tableId});
            post_arr = [body,remindData]
            Promise.all(post_arr).then((res)=> {
                this.data.rowData = res[0].rows || [];
                //固化数据
                this.data.isFixed = this.data.rowData[0] && this.data.rowData[0]["fixed"];
                this.data.total = res[0].total;
                //提醒赋值
                this.data.remindColor = res[1];
                this.data.common_filter_id = res[0].common_filter_id || '';
                if( this.data.firstRender ){
                    //渲染其他组件
                    this.actions.renderAgGrid();
                    let d = {
                        rowData: this.data.rowData
                    }
                    //赋值
                    this.agGrid.actions.setGridData(d);
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
                if(refresh){
                    msgBox.showTips( '数据刷新成功。' )
                    this.el.find( '.icon-aggrid-refresh' ).removeClass('refresh-rotate');
                }
            })
            HTTP.flush();
        },
        /**
         * 请求表格数据，等数据全部返回后渲染数据，也用于数据刷新
         * （body：数据，remindData：提醒数据，footer：footer数据）
         */
        getGridData: function (refresh) {
            //在途数据
            if( this.data.viewMode == 'in_process' || this.data.viewMode == 'reportTable2' ){
                this.actions.getInprocessData(refresh);
                return;
            }
            if( this.data.viewMode == 'newFormCount' ){
                HTTP.flush();
                this.actions.getNewFormCountData(refresh);
                return;
            }
            if( this.data.viewMode != 'normal' ){
                this.data.firstGetFooterData = false;
            }
            let postData = this.actions.createPostData();
            let post_arr = [];
            let body = dataTableService.getTableData( postData );
            let remindData = dataTableService.getReminRemindsInfo({table_id:this.data.tableId});
            post_arr = [body,remindData]
            if( !this.data.firstGetFooterData && this.data.viewMode != 'source_data' ){
                let footer = dataTableService.getFooterData( postData );
                post_arr.push( footer )
            }
            Promise.all(post_arr).then((res)=> {
                let time = this.data.firstRender ? 100 : 0;
                setTimeout( ()=>{
                    this.actions.setGridData( res );
                    //内置相关查看原始数据获取footer
                    if( this.data.viewMode == 'source_data' ){
                        let filterIds = []
                        for( let d of this.data.rowData ){
                            filterIds.push( d['_id'] );
                        }
                        let footerPostData = {
                            table_id: postData.source_table_id,
                            tableType: postData.tableType,
                            filter: JSON.stringify( {
                                _id: { $in: filterIds }
                            } )
                        }
                        this.actions.getFooterData( footerPostData );
                    }
                    if(this.data.fristGetCorrespondence && this.data.viewMode == 'viewFromCorrespondence'){
                        this.actions.checkCorrespondence();
                        this.data.fristGetCorrespondence = false;
                    }
                    if( this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence' ){
                        this.actions.checkCorrespondence( true );
                    }
                    if(this.data.viewMode == 'ViewChild' || this.data.viewMode == 'EditChild'){
                        Mediator.publish('form:songGridRefresh:'+this.data.tableId,this.data);
                    }
                    try {
                        this.data.showTabs(1);
                        this.hideLoading();
                    }catch(e){}
                },time )
                if(refresh){
                    msgBox.showTips( '数据刷新成功。' )
                }
                if(this.data.groupCheck) {
                    msgBox.hideLoadingSelf();
                }
            })
            HTTP.flush();
        },
        //设置grid数据
        setGridData: function ( res ) {
            this.data.rowData = res[0].rows || [];
            this.data.total = res[0].total != undefined ? res[0].total : this.data.total;
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
                //渲染其他组件
                this.actions.renderAgGrid();
            }else {
                this.actions.calcSelectData( 'get' );
            }
            let d = {
                rowData: this.data.rowData,
                footerData: this.data.footerData
            }
            //赋值
            this.agGrid.actions.setGridData(d);
            //对应关系回显
            if( this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence' ){
                this.actions.setCorrespondenceSelect();
            }
            if( this.data.pagination ){
                let currentPage = parseInt( Number( this.data.first )/Number( this.data.rows ) );
                this.pagination.actions.setPagination( this.data.total,currentPage + 1 );
            }
            this.actions.sortWay();
            //编辑模式原始数据
            if( this.el.find( '.edit-btn' )[0] ){
                this.data.originRowData = {};
                //originRowData用深拷贝，保存初始值
                this.data.rowData.forEach((row,index)=>{
                    this.data.originRowData[row['_id']]=JSON.parse(JSON.stringify(row));
                });
            }
            if(res[0].hasOwnProperty('error')){
                if(res[0].error == '您没有数据查看权限'){
                    this.el.find('.ag-body-viewport-wrapper').html('<div style="width: 100%;height: 100%;background: #fff;position: relative;z-index: 1;"><p style="position: absolute;top: 50%;left: 50%;' +
                            'width: 200px;height: 20px;line-height: 20px;text-align: center;margin-left: -100px;margin-top: -10px;font-size: 16px">'+res[0].error+'</p></div>')
                }
            }
        },
        //请求footer数据
        getFooterData: function (data) {
            let postData = data || this.actions.createPostData();
            dataTableService.getFooterData( postData ).then( res=>{
                this.data.footerData = dgcService.createFooterData( res );
                let d = {
                    footerData: this.data.footerData
                }
                //赋值
                try {
                    this.agGrid.actions.setGridData(d);
                    // this.data.showTabs(1);
                    // this.hideLoading();
                }catch(e){}

            } )
            HTTP.flush();
        },
        //获取设置选择数据（刷新时回显已经选择的数据）
        calcSelectData: function ( type ) {
            if( type == 'get' ){
                let arr = [];
                let rows = this.agGrid.gridOptions.api.getSelectedRows();
                for( let r of rows ){
                    if( r._id ){
                        arr.push( r._id );
                    }
                }
                this.data.selectData = arr;
            }
            if( type == 'set' ){
                this.agGrid.gridOptions.api.forEachNode((node) => {
                    if( !node["data"] ){//处理在group中，报错
                        return;
                    }
                    let id = node["data"]["_id"];
                    if( this.data.selectData.indexOf( id ) != -1 ){
                        node.setSelected(true);
                    }
                })
            }
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
                msgBox.alert( '保存成功' );
                this.actions.correspondenceSaved();
                this.actions.getGridData();
            } )
            HTTP.flush();
        },
        //对应关系保存成功(通知表单刷新用)
        correspondenceSaved: function () {
            Mediator.publish( 'correspondenceSaved:' + this.data.correspondenceField + ':' + this.data.tableId, true );
        },
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
        checkCorrespondence: function (setData) {
            let title = this.el.find( '.correspondence-check span' )[0].innerHTML;
            let obj = {
                rowData: title == '仅显示勾选项'?this.data.correspondenceSelectedData : this.data.rowData
            }
            if( setData ){
                obj = {
                    rowData: title == '仅显示勾选项'?this.data.rowData : this.data.correspondenceSelectedData
                }
            }
            this.agGrid.actions.setGridData( obj );
            if( !setData ){
                this.el.find( '.correspondence-check span' )[0].innerHTML = title == '仅显示勾选项'?'显示全部':'仅显示勾选项';
            }
            this.actions.setCorrespondenceSelect();
        },
        //行选择时触发
        onRowSelected: function ($event) {
            if( !$event["node"]["data"] ){
                return;
            }
            let select = $event.node.selected;
            let id = $event.node.data._id;

            //个人用户编辑表中的数据时,会发起对应的工作流,不让用户编辑
            if( $event["node"]["data"]["status"] && ( $event["node"]["data"]["status"] == 2 ) && select ){
                if( this.data.isShowTips ){
                    msgBox.alert("数据正在审批，无法操作。");
                    this.data.isShowTips = false;
                    setTimeout( ()=>{
                        this.data.isShowTips = true;
                    },500 )
                }
                $event["node"].setSelected( false,false );
                return;
            }
            //数据计算cache时,不让用户编辑
            if( $event["node"]["data"]["data_status"] && ( $event["node"]["data"]["data_status"] == 0 ) && select ){
                if( this.data.isShowTips ){
                    msgBox.alert("数据计算中，请稍候");
                    this.data.isShowTips = false;
                    setTimeout( ()=>{
                        this.data.isShowTips = true;
                    },500 )
                }
                $event["node"].setSelected( false,false );
                return;
            }

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
        /**
         * 根据viewMode不同，生成不同请求数据的参数
         * 拼装搜索的参数，排序参数
         */
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
                record_id: this.data.recordId,
                is_filter: this.data.filterParam.is_filter,
                filter: []
            }
            for( let k in json ){
                if( json[k] == 'undefined' ){
                    json[k] = '';
                }
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
            //二维表
            if( this.data.viewMode == 'reportTable2' ){
                json['is_report'] = 1;
            }
            if( this.data.viewMode == 'viewFromCorrespondence'||this.data.viewMode == 'editFromCorrespondence' ){
                // json['rows'] = 99999;
                // json['first'] = 0;
                json['is_temp'] = this.data.viewMode == 'editFromCorrespondence'? 1:0;
            }
            if( this.data.viewMode == 'ViewChild'||this.data.viewMode == 'EditChild'||this.data.viewMode == 'child' ){
                json["childInfo"]= {parent_page_id: this.data.parentTableId, parent_row_id: this.data.rowId};
                delete json['rowId']
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
            if( this.data.viewMode == 'approveBatch' ){
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
            if( this.data.viewMode == 'keyword' ){
                json['keyWord'] = this.data.keyword;
            }
            if( this.data.viewMode == 'deleteHanding' ){
                json['mongo'] = this.data.deleteHandingData;
            }
            if( this.data.filterParam.filter && this.data.filterParam.filter.length != 0 ){
                json['filter'] = _.cloneDeep(this.data.filterParam.filter ) || []
            }
            if( this.data.filterParam.fastFilter && this.data.filterParam.fastFilter.length != 0 ){
                json['filter'].push( this.data.filterParam.fastFilter[0] );
            }
            if( this.data.filterParam['common_filter_id'] ){
                json['filter'] = json['filter'] || [];
                //这个顺序要保证是先高级查询，再搜索的
                let len = this.data.filterParam.expertFilter.length - 1;
                for(let i = len; i>=0; i--){
                    json['filter'].unshift(this.data.filterParam.expertFilter[i]);
                }
                // for( let a of this.data.filterParam.expertFilter ){
                //     json['filter'].push( a );
                // }
                if( this.data.filterParam['common_filter_id'] != '临时高级查询' ){
                    json['common_filter_id'] = this.data.filterParam['common_filter_id'] || '';
                }
                if( this.data.filterParam.filter.length == 0 && this.data.filterParam.fastFilter.length == 0 ){
                    let dom = `<div class='query-tips'><span class="query-tips-delete"></span><span class="title">加载常用查询&lt;<span class="text">${this.data.filterParam['common_filter_name']}</span>&gt;</span></div>`;
                    this.el.find('.btn-nav-con').append(dom);
                    setTimeout(()=>{
                        this.el.find('.query-tips').css('display','none');
                    },3000)
                    this.el.find('.query-tips-delete').on('click', ()=> {
                        this.el.find('.query-tips').css('display','none');
                    })
                    // setTimeout(()=>{
                    //     this.el.find('.query-tips').css('display','none');
                    // },3000)
                    // msgBox.showTips( `加载常用查询&lt;${this.data.filterParam['common_filter_name']}&gt;` );
                }else {
                    delete json['common_filter_id'];
                    delete json['is_filter'];
                }
            }
            if( this.data.groupCheck ){
                json['is_group'] = 1;
                json['group_fields'] = JSON.stringify( this.data.myGroup );
                json['tableType'] = 'group';
            }
            //排序
            if( this.data.sortParam.sortField ){
                json = _.defaultsDeep( json,this.data.sortParam )
            }
            json = dgcService.returnQueryParams( json );
            this.data.filterParam.is_filter = 1;
            if( json.filter && json.filter != '' ){
                if( this.data.filterText != json.filter ){
                    this.data.first = 0;
                    json.first = 0;
                    this.data.filterText = json.filter;
                }
            }

            //部门日报的搜索
            if( this.data.departmentDiary && JSON.stringify( this.data.departmentFilter ) != '{}' ){
                if( json.filter ){
                    let obj = {$and:[]}
                    let f = JSON.parse( json.filter )
                    obj['$and'].push( f )
                    obj['$and'].push( this.data.departmentFilter )
                    json.filter = obj;
                }else {
                    json['filter'] = this.data.departmentFilter;
                }
                json.filter = JSON.stringify( json.filter )
            }
            return json;
        },
        //渲染agGrid（根据存在的按钮，为按钮事件，渲染分组定制列，分页等组件）
        renderAgGrid: function (cache) {
            //渲染定制列
            if( this.el.find('.custom-column-btn')[0] ){
                //如果有定制列修改偏好状态
                dgcService.calcColumnState(this.data,this.agGrid,["group",'number',"mySelectAll"]);
                let custom = {
                    gridoptions: this.agGrid.gridOptions,
                    fields: this.data.customColumnsFields,
                    fixCols: this.data.fixCols,
                    tableId: this.data.tableId,
                    agGrid: this.agGrid,
                    close: this.actions.calcCustomColumn,
                    setFloatingFilterInput: this.actions.setFloatingFilterInput
                }
                this.customColumnsCom  = new customColumns(custom);
                this.append(this.customColumnsCom, this.el.find('.custom-columns-panel'));

                //点击关掉定制列panel
                this.el.find( '.ag-body' ).on( 'click',()=>{
                    setTimeout( ()=>{
                        this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'-200px' } );
                    },400 )
                    this.data.closePanel = true;
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
                    myGroup:  this.actions.setMyGroup(this.data.myGroup),
                    groupFields: this.data.myGroup,
                    close: this.actions.calcGroup
                }
                this.groupGridCom = new groupGrid(groupLit);
                this.append(this.groupGridCom,this.el.find('.group-panel'));

                this.groupGridCom.actions.onGroupChange = this.actions.onGroupChange;
            }

            //渲染快速搜索
            // if(this.data.fastSearchFields && this.data.fastSearchFields.length != 0){
            //     let d = {
            //         fieldsData: this.data.fastSearchFields,
            //         fastSearchData:this.actions.fastSearchData,
            //     }
            //     this.append(new fastSearch(d), this.el.find('.fast-search-con'))
            // }
            //渲染分页
            let noPagination = ['in_process','newFormCount','reportTable2']
            if( noPagination.indexOf( this.data.viewMode ) == -1 ){
                this.data.pagination = true;
                let paginationData = {
                    total: this.data.total,
                    rows: this.data.rows,
                    tableId: this.data.tableId,
                    tableOperationData: this.data.tableOperationData,
                    isSuperUser: window.config.is_superuser || 0,
                    gridOptions: this.agGrid.gridOptions
                }
                this.pagination = new dataPagination(paginationData);
                this.pagination.actions.paginationChanged = this.actions.refreshData;
                this.append(this.pagination, this.el.find('.pagination'));
            }else {
                this.el.find( '.pagination' )[0].style.height = '0px';
                if( this.data.isShowSheet ){
                    this.el.find( '.ag-grid-con' )[0].style.height = 'calc(100% - 100px)';
                }else {
                    this.el.find( '.ag-grid-con' )[0].style.height = 'calc( 100% - 80px )';
                }
            }
            //高级查询
            if( this.el.find( '.expert-search-btn' )[0] && !cache ){
                this.actions.renderExpertSearch();
                this.actions.getExpertSearchData();
            }
            this.data.firstRender = false;
            if( this.data.viewMode != 'normal' ){
                this.data.showTabs(1);
                try{this.hideLoading()}catch(e){}
            }
            //新窗口右边提示
            if( this.data.gridTips ){
                this.el.find( '.grid-tips' )[0].style.display = 'flex';
            }
            console.timeEnd( '渲染时间' )
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
                width: 600,
                height: 360,
                title: '导出数据'
            }).then((data) => {
                if(data.type == 'export') {
                    let dom = `<div class='exports-tips'><span class="exports-tips-delete"></span><span class="title">导出成功</span></div>`;
                    this.el.find('.btn-nav-con').append(dom);
                    setTimeout(()=>{
                        this.el.find('.exports-tips').css('display','none');
                    },3000)
                    this.el.find('.exports-tips-delete').on('click', ()=> {
                        this.el.find('.exports-tips').css('display','none');
                    })
                }
            });
        },
        //分组触发
        onGroupChange: function (group ,changeChecked) {
            this.agGrid.gridOptions.columnApi.setColumnVisible( 'group' , true)
            this.data.myGroup = group;
            if(changeChecked){
                msgBox.showLoadingSelf();
            }
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
                for (let k = 0; k < this.data.myGroup.length; k++) {
                    for (let i = 0; i < field.length; i++) {
                        if (this.data.myGroup[k] == field[i].field) {
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
            this.data.first = data.first;
            this.actions.getGridData(true);
        },
        //渲染颜色
        setRowStyle: function ( param ) {
            if( !param["data"] ){//处理在分组时报错
                return;
            }
            let id = param["data"]["_id"];
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
            //分组样式
            if( this.data.groupCheck && !param["data"].children && this.groupGridCom.data.group && this.groupGridCom.data.group.length != 0 && param["data"].myfooter == undefined ){
                return {background:'#E6F7FF'};
            }
            //二维表样式
            //二维表单不可编辑区域上色
            if(param["data"] && param["data"]["can_edit"] == 0 && this.data.viewMode == 'reportTable2'){
                if(param["data"]["num"] == ""){
                    return;
                }
                if(param["data"]["num"].length <= 2){
                    return {background:'rgba(250,235,180,0.9)',fontWeight:'bold'};
                }else if(param["data"]["num"].length <= 4){
                    return {background:'rgba(250,235,180,0.6)',fontWeight:'bold'};
                }else{
                    return {background:'rgba(250,235,180,0.3)',fontWeight:'bold'};
                }
            }
        },
        //创建sheet分页数据
        createSheetTabs: function ( res ) {
            if( res.rows.length > 0 ){
                this.data.isShowSheet = true;
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
                    let saveArr = [];
                    for( let s of state ){
                        if( ignore.indexOf( s.colId ) == -1 ){
                            s.hide = arr.indexOf( s.colId ) == -1 && id != 0 ? true:false;
                        }
                        if( ignore.indexOf( s.colId ) == -1 && s.hide ){
                            saveArr.push( s.colId );
                        }
                    }
                    dataTableService.savePreference({
                        action: 'ignoreFields',
                        table_id: this.data.tableId,
                        ignoreFields: JSON.stringify( saveArr )
                    });
                    HTTP.flush();
                    gridoptions.columnApi.setColumnState( state );
                    if( !this.data.noNeedCustom ){
                        this.customColumnsCom.actions.makeSameSate();
                    }
                    this.actions.setFloatingFilterInput();
                } );
                this.el.find('.SheetPage ul li:first').addClass('active1');
                this.el.find('.SheetPage ul li').on('click',function () {
                    $(this).addClass('active1');
                    $(this).siblings().removeClass('active1');
                });
                console.log( "有sheet" )
                this.el.find( '.ag-grid-con' ).height( 'calc(100% - 140px)' );
                this.el.find( '.SheetPage' ).show();
            }else {
                console.log( "没有sheet" )
            }
        },
        //按钮点击事件
        onBtnClick: function () {
            this.actions.customColumnClick();
            this.actions.groupBtnClick();

            //宽度自适应
            if( this.el.find( '.grid-auto-width' )[0] ){
                this.el.find( '.grid-auto-width' ).on( 'click',()=>{
                    if( !this.data.isAutoWidth ){
                        this.data.lastGridState = this.agGrid.gridOptions.columnApi.getColumnState();
                        this.agGrid.actions.autoWidth();
                    }else {
                        let state = this.agGrid.gridOptions.columnApi.getColumnState();
                        for( let s of state ){
                            for( let ls of this.data.lastGridState ){
                                if( s.colId == ls.colId ){
                                    s.width = ls.width;
                                    break;
                                }
                            }
                        }
                        this.agGrid.gridOptions.columnApi.setColumnState( state );
                    }
                    this.el.find( '.grid-auto-width' ).find( 'span' ).html( !this.data.isAutoWidth?'恢复默认':'自适宽度' );
                    this.data.isAutoWidth = !this.data.isAutoWidth;
                } )
            }
            //搜索
            if( this.el.find( '.float-search-btn' )[0] ){
                this.el.find( '.float-search-btn' ).on( 'click',()=>{
                    if (this.data.isShowFloatingFilter && this.data.filterParam.filter.length != 0) {
                        for( let k in this.data.searchValue ){
                            this.data.searchValue[k] = '';
                        }
                        for( let k in this.data.searchOldValue ){
                            this.data.searchOldValue[k] = '';
                        }
                        this.data.queryList = {};
                        this.actions.setFloatingFilterInput();
                        this.data.filterParam.filter = [];
                        this.actions.getGridData();
                    }
                    let height = this.data.isShowFloatingFilter ? 0:30;
                    this.agGrid.gridOptions.api.setFloatingFiltersHeight(height);
                    this.data.isShowFloatingFilter = !this.data.isShowFloatingFilter;
                } )
            }
            //删除
            if( this.el.find('.grid-del-btn')[0] ){
                this.el.find( '.grid-del-btn' ).on( 'click',()=>{
                    this.actions.retureSelectData();
                    if( this.data.deletedIds.length == 0 ){
                        msgBox.alert( '请选择数据' );
                        return;
                    }
                    msgBox.confirm( '确定删除？' ).then( res=>{
                        if( res ){
                            this.actions.delTableData();
                        }
                    } )
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
                        isBatch: this.data.viewMode == 'createBatch'?1:0,
                        isSuperUser: window.config.is_superuser || 0,
                        viewMode: this.data.viewMode
                    }
                    let data = {
                        formData: this.data.formData,
                    }
                    let url = dgcService.returnIframeUrl( '/iframe/dataImport/',json );
                    let winTitle = '导入数据';
                    this.actions.openDialog( url,winTitle,600,650,data );
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
                    base_buildin_dfield: this.data.base_buildin_dfield,
                    gridTips: this.data.gridTips,
                    isNewWindow: true
                }
                let url = dgcService.returnIframeUrl('/datagrid/source_data_grid/', url_obj);
                if( this.data.departmentDiary ){
                    url = '/datagrid/custom_index/' + location.search + '&isNewWindow=true';
                }
                this.el.find('.grid-new-window')[0].href = url;
            }
            //新增数据
            if( this.el.find( '.new-form-btn' )[0] ){
                this.el.find( '.new-form-btn' ).on( 'click',()=>{
                    let obj = {
                        table_id: this.data.tableId,
                        parent_table_id: this.data.parentTableId,
                        parent_real_id: this.data.parentRealId,
                        parent_temp_id: this.data.parentTempId,
                        parent_record_id: this.data.parentRecordId,
                        btnType: 'new',
                        form_id:this.data.formId,
                        flow_id:this.data.flowId,
                    };
                    let url = dgcService.returnIframeUrl( '/iframe/addWf/',obj );

                    let title = '新增';
                    this.actions.openSelfIframe( url,title );
                } )
            }
            //在途刷新
            if( this.el.find( '.refresh-btn' )[0] ){
                this.el.find( '.refresh-btn' ).on( 'click',()=>{
                    this.el.find( '.icon-aggrid-refresh' ).addClass('refresh-rotate');
                    this.actions.getInprocessData(true);
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
            //编辑模式
            if( this.el.find( '.edit-btn' )[0] ){
                this.el.find( '.edit-btn' ).on( 'click',()=>{
                    if( this.data.firstCreateEditCol ){
                        this.data.firstCreateEditCol = false;
                        //创建编辑模式表头
                        let j = {table_id: this.data.tableId}
                        if( this.data.viewMode == 'reportTable2' ){
                            j['is_report'] = 1;
                            j['field_id'] = this.data.fieldId;
                        }
                        FormService.getStaticData(j).then( res=>{
                            for( let d of res.data ){
                                this.data.colControlData[d.dfield] = d;
                            }
                            this.columnDefsEdit = this.actions.createHeaderColumnDefs( true );
                            this.actions.toogleEdit();
                        } )
                        HTTP.flush();
                    }else {
                        this.actions.toogleEdit();
                    }
                } )
                this.el.find( '.edit-btn-cancel' ).on( 'click',()=>{
                    if( this.data.viewMode == 'reportTable2' ){
                        this.actions.onEditSave2(true);
                    }else {
                        this.actions.onEditSave(true);
                    }
                } )
                this.el.find( '.edit-btn-save' ).on( 'click',()=>{
                    //保存
                    if( this.data.viewMode == 'reportTable2' ){
                        this.actions.onEditSave2();
                    }else {
                        this.actions.onEditSave();
                    }
                } )
            }
            //点击这里
            if( this.el.find( '.showNormalGrid' )[0] ){
                this.el.find( '.showNormalGrid' ).on( 'click',()=>{
                    let obj = {
                        tableId: this.data.tableId,
                        tableName: this.data.tableName,
                        viewMode: 'normal'
                    }
                    let url = dgcService.returnIframeUrl( '/datagrid/source_data_grid/',obj );
                    let winTitle = obj.tableName;
                    this.actions.openSourceDataGrid( url,winTitle );
                } )
            }
        },
        //编辑模式切换
        toogleEdit: function () {
            if( !this.data.editMode ){
                this.data.lastGridState = this.agGrid.gridOptions.columnApi.getColumnState();
            }
            this.data.editMode = !this.data.editMode;
            this.el.find( '.dataGrid-btn-group' )[0].style.display = this.data.editMode ? 'none':'flex';
            this.el.find( '.dataGrid-edit-group' )[0].style.display = this.data.editMode ? 'flex':'none';
            let columns = this.data.editMode ? this.columnDefsEdit : this.columnDefs;
            this.agGrid.gridOptions.api.setColumnDefs( columns );
            this.agGrid.gridOptions.columnApi.setColumnState( this.data.lastGridState );
        },
        //编辑模式保存数据
        onEditSave: function (cancel) {
            //比对当前值与初始值的差别
            this.agGrid.gridOptions.api.stopEditing(false);
            let changedRows = this.actions.getChangedRows(this.agGrid.data.rowData);
            let i = 0;
            this.data.editRowTotal = 0;
            this.data.editRowNum = 0;
            for( let k in changedRows ){
                i++;
            }
            this.data.editRowTotal = i;
            if( cancel ){
                if( this.data.editRowTotal > 0 ){
                    msgBox.confirm( '数据已经修改，是否取消？' ).then( r=>{
                        if( r ){
                            this.actions.toogleEdit();
                            this.actions.getGridData();
                        }
                    } )
                }else {
                    this.actions.toogleEdit();
                }
                return;
            }
            if( this.data.editRowTotal == 0 ){
                this.actions.toogleEdit();
            }
            this.data.saveEditObjArr = [];
            for(let k in changedRows){
                let changed = changedRows[k];
                let real_id = changed['data']['real_id'];
                changedRows[real_id] = changed;
                FormService.getDynamicData({
                    table_id: this.data.tableId,
                    real_id: real_id,
                    is_view: 0
                }).then( res=>{
                    if(res){
                        let data = res['data'];
                        let real_id = data['real_id']['value'];
                        if(!changedRows[real_id]){
                            return;
                        }
                        let obj = {
                            real_id:data['real_id']['value'],
                            temp_id:data['temp_id']['value'],
                            parent_real_id:data['parent_real_id']['value'],
                            parent_table_id:data['parent_table_id']['value'],
                            parent_temp_id:data['parent_temp_id']['value']
                        };
                        let targetRow = changedRows[real_id];
                        let err = this.actions.judegEditVal( targetRow.data );
                        if( err.type ){
                            msgBox.alert( err.err );
                            return;
                        }
                        this.data.saveEditObjArr.push( this.actions.saveEdit(targetRow,obj) )
                        if( this.data.saveEditObjArr.length == this.data.editRowTotal ){
                            let saveArr = []
                            for( let o of this.data.saveEditObjArr ){
                                saveArr.push( dataTableService.saveEditFormData( o ) )
                            }
                            Promise.all(saveArr).then((res)=> {
                                let j = 0;
                                let wrong = 0;
                                let errorText = '';
                                for( let r of res ){
                                    if( r.succ == 1 ){
                                        j++;
                                    }else {
                                        wrong++;
                                        errorText += (wrong + '、' + r.error);
                                    }
                                }
                                if( wrong > 0 ){
                                    let err = wrong + '条数据保存失败，失败原因：' + errorText;
                                    msgBox.alert( err );
                                }else {
                                    msgBox.showTips( '执行成功！' )
                                    this.actions.toogleEdit();
                                }
                                this.actions.timeDelayRefresh();
                            })
                            HTTP.flush();
                        }
                    }
                } )
                HTTP.flush();
            }
        },
        //编辑数据保存时判断是否符合字段
        judegEditVal: function ( data ) {
            let err = {
                type: false,
                err:''
            }
            for( let k in this.data.colControlData ){
                let field = this.data.colControlData[k];
                //必填
                if( field.required && data[field.dfield] == '' ){
                    err['type'] = true;
                    err['err'] = '字段“' + field.label + '”是必填的，请修改。';
                    return err;
                }
                //数字类型
                if( fieldTypeService.numOrText( field.real_type ) && data[field.dfield] != undefined ){
                    if( field.numArea && field.numArea !== "" ){
                        let num = Number( data[field.dfield] );
                        data[field.dfield] = num;
                        //范围
                        if( num>field.numArea.max || num<field.numArea.min ){
                            err['type'] = true;
                            err['err'] = '字段“' + field.label + '”，当前值：' + num +'，数据错误，错误原因：' + field.numArea.error + '，请修改。';
                            return err;
                        }
                        //整数小数
                        let regReg = new RegExp(field.reg);
                        if (data[field.dfield] != "" && field.reg !== "") {
                            for (let r in field.reg) {
                                let regReg = eval(r);
                                let flag = regReg.test(num);
                                if (!flag) {
                                    err['type'] = true;
                                    err['err'] = '字段“' + field.label + '”，当前值：' + num +'，数据错误，错误原因：' + field.reg[r];
                                    return err;
                                }
                            }
                        }
                    }
                }
            }
            return err;
        },
        onCellValueChanged: function (event) {
            if(!this.data.cellChangeValue[event['colDef']['colId']]) {
                let obj = {};
                obj[event['data']['_id']] = event['newValue'];
                this.data.cellChangeValue[event['colDef']['colId']] = obj;
            }else{
                this.data.cellChangeValue[event['colDef']['colId']][event['data']['_id']]=event['newValue'];
            }
        },
        //二维表保存
        onEditSave2: function (cancel) {
            this.agGrid.gridOptions.api.stopEditing(false);
            setTimeout( ()=>{
                this.data.editRowTotal = 0;
                for( let k in this.data.cellChangeValue ){
                    this.data.editRowTotal++;
                    break;
                }
                if( cancel ){
                    if( this.data.editRowTotal > 0 ){
                        msgBox.confirm( '数据已经修改，是否取消？' ).then( r=>{
                            if( r ){
                                this.actions.toogleEdit();
                                this.actions.getGridData();
                            }
                        } )
                    }else {
                        this.actions.toogleEdit();
                    }
                    return;
                }
                //保存
                let json = {
                    table_id: this.data.tableId,
                    data: JSON.stringify(this.data.cellChangeValue),
                    project:this.data.project,
                    parent_table_id:this.data.parentTableId || "",
                    parent_real_id:this.data.parentRealId || "",
                    rowId:this.data.parentRealId || "",
                    is_filter:this.data.parentTableId?1:"",
                    is_report:1,
                    tableType:this.data.parentTableId?'count':"",
                    // fieldId:this.fieldId1 || ""
                };
                dataTableService.refreshReport(json).then(res=>{
                    if(res.success){
                        this.rowData = res.rows;
                        this.data.cellChangeValue={};
                        this.actions.getGridData();
                        msgBox.showTips( '保存成功' );
                        this.actions.toogleEdit();
                    }else {
                        msgBox.alert( res.error );
                    }
                });
            },500 )
        },
        saveEdit(targetRow,ids){
            let json = dgcService.abjustTargetRow(targetRow,ids);
            json['data'] = JSON.stringify(json['data']);
            json['focus_users'] = JSON.stringify(json['focus_users']);
            json['cache_new'] = JSON.stringify(json['cache_new']);
            json['cache_old'] = JSON.stringify(json['cache_old']);
            return json;
        },
        //比对当前值与初始值的差别
        getChangedRows(rowData){
            let changedRows = {};
            rowData.forEach((row,index)=>{
                let real_id = row['_id'];
                let originRow = this.data.originRowData[real_id];
                let changed = {};
                let data = {};
                for (let k in row) {
                    if (dgcService.checkObejctNotEqual(row[k],originRow[k])) {
                        //buildin字段做转化
                        if( !this.data.colControlData[k] ){
                            continue;
                        }
                        if(this.data.colControlData[k]['type'] == 'Buildin'||this.data.colControlData[k]['type'] == 'Radio'||this.data.colControlData[k]['type'] == 'Select'){
                            data[k] = this.data.colControlData[k]['options_objs'][row[k]];
                        } else if(Array.isArray(row[k])){
                            if(row[k].length == 0 && originRow[k].length == 0){
                                continue;
                            }
                            for(let i = 0,length = row[k].length;i < length; i++){
                                if(row[k][i]!=originRow[k][i]){
                                    data[k] = row[k];
                                    break;
                                }
                            }
                        }else {
                            data[k] = row[k];
                        }
                    }
                }
                if(Object.getOwnPropertyNames(data).length!= 0) {
                    data['real_id'] = real_id;
                    data['table_id'] = this.data.tableId;
                    changed['data'] = data;
                    changed['cache_old'] = this.data.originRowData[real_id];
                    changed['cache_new'] = row;
                    changed['table_id'] = this.data.tableId;
                    changed['focus_users'] = [];
                    changedRows[real_id] = changed;
                }
            });
            return changedRows;
        },
        //渲染高级查询
        renderExpertSearch: function () {
            let _this = this
            this.el.find( '.dataGrid-commonQuery' )[0].style.display = 'block';
            this.el.find( '.expert-search-btn' ).on( 'click',()=>{
                let d = {
                    tableId: this.data.tableId,
                    fieldsData: this.data.expertSearchFields,
                    commonQuery: this.data.commonQueryData,
                    // commonQuerySelectLength:this.el.find('.dataGrid-commonQuery-select option').length
                }
                PMAPI.openDialogByIframe(`/iframe/expertSearch/`,{
                    width:950,
                    height:600,
                    title:`高级查询`,
                    modal:true,
                },{d}).then(res=>{
                    this.data.onlyCloseExpertSearch = res.onlyclose || false;
                    if(res.type == 'temporaryQuery') {
                        if(res.addNameAry.length == 0){
                            // this.actions.getExpertSearchData(res.addNameAry);
                            this.actions.postExpertSearch(res.value,res.id,res.name);
                        }
                        this.el.find('.dataGrid-commonQuery-select').val(res.name);
                    }
                    if(res.appendChecked) {
                        this.data.temporaryCommonQuery = res.value
                        this.actions.appendQuerySelect()
                    }
                    if(res.saveCommonQuery || res.deleteCommonQuery) {
                        this.actions.getExpertSearchData(res.addNameAry);
                    }
                    if(res.onlyclose == true) {
                        this.actions.getExpertSearchData()
                    }
                })
            } )
            this.el.find('.dataGrid-commonQuery-select').bind('change', function() {
                if($(this).val() == '常用查询') {
                    _this.actions.postExpertSearch([],'');
                    _this.el.find('.query-tips').css('display','none');
                } else if($(this).val() == '临时高级查询') {
                    _this.actions.postExpertSearch(_this.data.temporaryCommonQuery,'临时高级查询','临时高级查询');
                } else {
                    // $(this).find('.Temporary').remove();
                    _this.data.commonQueryData.forEach((item) => {
                        if(item.name == $(this).val()){
                            _this.actions.postExpertSearch(JSON.parse(item.queryParams),item.id,item.name);
                        }
                    })
                }
            })
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
        delTableData: function (type) {
            let json = {
                table_id:this.data.tableId,
                temp_ids:JSON.stringify([]),
                real_ids:JSON.stringify( this.data.deletedIds ),
                is_batch: this.data.viewMode == 'createBatch'?1:0,
                flow_id: this.data.flowId,
                parent_table_id: this.data.parentTableId,
                parent_temp_id: this.data.parentTempId,
                parent_real_id: this.data.parentRealId,
                parent_record_id: this.data.parentRecordId
            }
            if( json.is_batch == 1 || this.data.viewMode == 'EditChild' ){
                json.temp_ids = json.real_ids;
                json['real_ids'] = JSON.stringify([]);
            }
            if( type == 1 ){
                json['abandon_validate'] = 1;
            }
            dataTableService.delTableData( json ).then( res=>{
                if( res.succ ){
                    msgBox.showTips( '删除成功' )
                    this.data.selectData = [];
                    //批量工作流删除后返回值处理
                    if( json.is_batch == 1 ){
                        let arr = [];
                        for( let i of this.data.batchIdList ){
                            if( this.data.deletedIds.indexOf( i )==-1 ){
                                arr.push( i )
                            }
                        }
                        this.data.batchIdList = arr;
                        this.actions.returnBatchData( this.data.batchIdList );
                    }
                    //延时刷新数据
                    this.actions.timeDelayRefresh();
                }else {
                    if( res.queryParams ){
                        msgBox.confirm( res.error + '是否前往处理？' ).then( r=>{
                            if( r ){
                                let info = res.table_info;
                                let obj = {
                                    tableId: info.table_id,
                                    tableName: info.label,
                                    viewMode: 'deleteHanding',
                                    deleteHandingData: res.queryParams
                                }
                                let url = dgcService.returnIframeUrl( '/datagrid/source_data_grid/',obj );
                                let winTitle = this.data.tableName + '->' + obj.tableName;
                                PMAPI.openDialogByIframe( url,{
                                    width: 1300,
                                    height: 800,
                                    title: winTitle,
                                    modal:true
                                },{obj}).then( (data)=>{
                                } )
                            }
                        } )
                    }else {
                        if(res.abandon_validate){
                            msgBox.confirm( res.error ).then( aa=>{
                                if( aa ){
                                    this.actions.delTableData( 1 );
                                }
                            } )
                        }else {
                            msgBox.alert( res.error )
                        }
                    }
                }
            } )
            HTTP.flush();
        },
        //定制列
        customColumnClick: function () {
            if( this.el.find('.custom-column-btn')[0] ){
                let that = this;
                this.el.find( '.custom-column-btn' ).on( 'click',_.debounce( ()=>{
                    that.actions.calcCustomColumn();
                },500 ) )
            }
        },
        //定制列事件
        calcCustomColumn: function () {
            this.data.isShowCustomPanel = !this.data.isShowCustomPanel;
            if( this.data.isShowCustomPanel ){
                this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':this.data.groupCheck ? '200px' : '0px' } );
            }else {
                this.data.closePanel = true;
                setTimeout( ()=>{
                    this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'-200px' } );
                },400 )
            }
            this.actions.changeAgGridWidth();
        },
        //分组点击
        groupBtnClick: function () {
            if( !this.el.find('.group-btn')[0] ){
                return;
            }
            let that = this;
            this.el.on('click','.group-btn',_.debounce( ()=>{
                that.actions.calcGroup();
            },500 ));
        },
        //分组打开关闭
        calcGroup: function () {
            if(!this.data.groupCheck) {
                this.el.find('.group-btn').find('span').html('数据');
                this.el.find( '.group-panel' ).eq(0).animate( { 'right':this.data.isShowCustomPanel?'200px':'0px' } );
                this.data.groupCheck = !this.data.groupCheck;
                this.actions.onGroupChange(this.data.myGroup)
            } else {
                this.data.closePanel = true;
                this.el.find('.group-btn').find('span').html('分组');
                setTimeout( ()=>{
                    this.el.find( '.group-panel' ).eq(0).animate( { 'right':'-200px' } );
                },300 )
                this.data.groupCheck = !this.data.groupCheck;
                this.agGrid.gridOptions.columnApi.setColumnVisible( 'group' , false);
                this.actions.getGridData();
            }
            this.actions.changeAgGridWidth();
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
            let grid = this.el.find( '#data-agGrid' );
            if( this.data.closePanel ){
                grid.width( 'calc(100% - ' + num + 'px)' );
            }else {
                setTimeout( ()=>{
                    grid.width( 'calc(100% - ' + num + 'px)' );
                },400 )
            }
            if( this.data.closePanel && ( this.data.groupCheck || this.data.isShowCustomPanel ) ){
                setTimeout( ()=>{
                    this.el.find( this.data.groupCheck?'.group-panel':'.custom-columns-panel' ).eq(0).animate( {'right':'0px'} );
                },400 )
            }
            this.data.closePanel = false;
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
        getExpertSearchData: function (addNameAry) {
            let obj = {'actions':JSON.stringify( ['queryParams'] ),'table_id':this.data.tableId};
            dataTableService.getPreferences( obj ).then( res=>{
                this.actions.setExpertSearchData( res,addNameAry );
            } );
            HTTP.flush();
        },
        setExpertSearchData: function ( res,addNameAry ) {
            this.el.find('.dataGrid-commonQuery-option').remove();
            this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option" fieldId="100" value="常用查询">常用查询</option>`)
            if(res.rows.length != 0){
                res.rows.forEach((row) => {
                    this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option" fieldId="${row.id}" value="${row.name}">${row.name}</option>`)
                });
            }
            if(this.data.filterParam['common_filter_name'] == '临时高级查询'){
                this.el.find('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option Temporary" fieldId="00" value="临时高级查询">临时高级查询</option>`)
            }
            if(this.data.filterParam['common_filter_name'] && this.data.onlyCloseExpertSearch) {
                this.el.find('.dataGrid-commonQuery-select').val(this.data.filterParam['common_filter_name']);
            }
            if(this.data.commonQueryData && res.rows && this.data.commonQueryData.length > res.rows.length){
                let inCheck = true;
                if(this.data.filterParam['common_filter_name'] != ''){
                    if(res.rows.length == 0){
                        inCheck = true;
                    } else {
                        for(let item of res.rows) {
                            if (item.name == this.data.filterParam['common_filter_name']) {
                                inCheck = false ;
                            }
                        }
                    }
                }
                if(inCheck) {
                    this.actions.postExpertSearch([],'');
                    this.el.find('.dataGrid-commonQuery-select').val('常用查询');
                }
            }
            this.data.commonQueryData = res.rows;
            if(addNameAry && addNameAry.length != 0){
                this.data.commonQueryData.forEach((item)=>{
                    for(let i = 0; i < addNameAry.length; i++) {
                        if(item.name == addNameAry[i]){
                            this.actions.postExpertSearch(JSON.parse(item.queryParams),item.id,item.name);
                            this.el.find('.dataGrid-commonQuery-select').val(item.name);
                        }
                    }
                })
            }

            //第一次请求footer数据
            if( this.data.firstGetFooterData ){
                this.actions.firstFooterCommonFilterId( res );
                this.data.firstGetFooterData = false;
                this.actions.getFooterData();
            }
        },
        //第一次请求footer数据获取id
        firstFooterCommonFilterId: function (res) {
            if( this.data.common_filter_id ){
                for( let r of res.rows ){
                    if( r.id == this.data.common_filter_id ){
                        this.data.filterParam = {
                            expertFilter: JSON.parse(r.queryParams),
                            filter:[],
                            fastFilter:[],
                            is_filter: 1,
                            common_filter_id: this.data.common_filter_id,
                            common_filter_name: r.name
                        }
                        $('.dataGrid-commonQuery-select').val(r.name);
                    }
                }
            }
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
            if( this.data.frontendSort ){
                this.agGrid.actions.refreshView();
            }
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
        onCellDoubleClicked: function (data) {
        },
        //点击cell
        onCellClicked: function (data) {
            if( !data.data || data.data.myfooter || this.data.doubleClick || this.data.editMode ){
                return;
            }
            //防止双击和单击的误操作
            this.data.doubleClick = true;
            setTimeout( ()=>{
                this.data.doubleClick = false;
            },200 )
            if(this.data.viewMode == 'reportTable2'){
                if(data.data.can_edit == 1){
                    data.column.cellEditor = "";
                }
                else{
                    data.column.cellEditor = true;
                }
            }
            console.log( "onCellClicked数据" )
            console.log( data )
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
            if(data.colDef.headerName != "操作" && !this.data.editMode){
                dgcService.rowClickSelect( data )
            }

            //数据计算cache不可操作
            if( data["data"]["data_status"] &&  data["data"]["data_status"]=='0'){
                msgBox.alert("数据计算中，请稍候");
                return;
            }

            //视频字段
            if(data.colDef.real_type == fieldTypeService.VIDEO_TYPE && data.event.srcElement.id == 'file_view'){
                let json = {
                    file_ids:JSON.stringify(data.value),
                    dinput_type:data.colDef.dinput_type
                };
                dataTableService.getAttachmentList( json ).then( res => {
                    ViewVideo.data.rows = res.rows;
                    ViewVideo.data.dinput_type = data.colDef.dinput_type;
                    ViewVideo.data.currentVideoId = data.value[0];
                    ViewVideo.data.is_view = true;
                    ViewVideo.data.videoSrc = `/download_attachment/?file_id=${data.value[0]}&download=0&dinput_type=${data.colDef.dinput_type}`;
                    PMAPI.openDialogByComponent(ViewVideo, {
                        width: 900,
                        height: 600,
                        title: '视频播放器'
                    })
                });
                HTTP.flush();
            }
            //图片查看
            if( data.colDef.real_type == fieldTypeService.IMAGE_TYPE ){
                let json = {};
                json["dfield"] = data.colDef.field;
                json["table_id"] = this.data.tableId;
                json[(data.data.action?"temp_id":"real_id")] = data.data._id;
                dataTableService.getAttachmentList( json ).then( res => {
                    let obj=dataTableService.setImgDataAndNum(res,{},'');
                    PictureAttachment.data.imgData=obj.imgData;
                    PictureAttachment.data.imgSelect=obj.imgSelect;
                    PictureAttachment.data.imgTotal=obj.imgTotal;
                    PictureAttachment.data.imgNum=obj.imgNum;
                    PictureAttachment.data.rows=obj.imgData.rows;
                    PMAPI.openDialogByComponent(PictureAttachment,{
                        title:'图片附件',
                        width: 900,
                        height:600
                    })
                })
                HTTP.flush();
            }
            //富文本字段
            if( data.colDef.real_type == fieldTypeService.UEDITOR ){
                QuillAlert.data.value=data.value.replace(/(\n)/g, '');
                PMAPI.openDialogByComponent(QuillAlert,{
                    title:'文本编辑器',
                    width:800,
                    height:500,
                    modal:true,
                })
            }
            //合同编辑器
            if( data.colDef.real_type == fieldTypeService.TEXT_COUNT_TYPE ){
                if(data.event.srcElement.className.indexOf('view-contract') != -1){
                    let obj = {
                        table_id:this.data.tableId,
                        id:data.colDef.id,
                        real_id:data.data._id,
                        value: data['value'],
                        mode:'view'
                    };
                    let contractConfig = _.defaultsDeep(contractEditorConfig,{data:obj});
                    PMAPI.openDialogByComponent(contractConfig,{
                        width:900,
                        height:600,
                        title:'合同查看'
                    });
                } else if(data.event.srcElement.className.indexOf('download-contract') != -1){
                    this.actions.downloadContract(data,0);
                }
            }


            //附件字段
            if( data.event.srcElement.id == 'file_view' && fieldTypeService.attachment(data.colDef.real_type) ){
                let dinput_type=data.colDef.real_type;
                let fileIds=data['value'];
                if(fileIds){
                    dataTableService.getAttachmentList({
                        file_ids: JSON.stringify(fileIds),
                        dinput_type:dinput_type
                    }).then(res=>{
                        let list = res["rows"];
                        for( let data of list ){
                            //附件名称编码转换
                            data.file_name = data.file_name;
                            let str = dataTableService.getFileExtension( data.file_name );
                            if( dataTableService.preview_file.indexOf( str.toLowerCase() ) != -1 ){
                                data["isPreview"] = true;
                                if( dataTableService.preview_file.indexOf(str.toLowerCase()) <4){
                                    data["isImg"] = true;
                                }else{
                                    data["isImg"] = false;
                                }
                            }else{
                                data["isPreview"] = false;
                            }
                        }
                        AttachmentList.data.list=list;
                        AttachmentList.data.dinput_type=dinput_type;
                        AttachmentList.data.is_view=true;
                        PMAPI.openDialogByComponent(AttachmentList,{
                            width: 900,
                            height: 600,
                            title: '附件列表'
                        })
                    })
                    HTTP.flush();
                }
            }
            //内置相关查看原始数据用
            if( data.event.srcElement.id == 'relatedOrBuildin' ){
                console.log( "内置相关穿透" )
                if( data.colDef.is_user ){
                    PersonSetting.showUserInfo({name:data.value});
                }else {
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
                    let winTitle = data.colDef.tableName + '->' + obj.tableName;
                    this.actions.openSourceDataGrid( url,winTitle );
                }
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
                    let winTitle = data.colDef.tableName + '->' + obj.tableName;
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
                    fieldId: data.colDef.id,
                    source_field_dfield: data.colDef.field_content.count_field_dfield || '',
                }
                let url = dgcService.returnIframeUrl( '/datagrid/source_data_grid/',obj );
                let winTitle = data.colDef.tableName + '->' + obj.tableName;
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
                    fieldId: data.colDef.id,
                    source_field_dfield: data.colDef.field_content.child_field_dfield || '',
                }
                let url = dgcService.returnIframeUrl( '/datagrid/source_data_grid/',obj );
                let winTitle = data.colDef.tableName + '->' + obj.tableName;
                this.actions.openSourceDataGrid( url,winTitle );
            }
            //二维表数据穿透
            if( data.event.target.id == 'reportTable2' ){
                //查找对应列的colId
                if(data.value == 0){
                    return
                }
                let ks = [];
                if(data.colDef.field_content.update_exp){
                    let reg = /\@f(\d+)\@/g;
                    let items = data.colDef.field_content.update_exp.match(reg);
                    for(let item of items) {
                        item = item.replace("@", "").replace("@", "");
                        ks.push(item);
                    }
                };
                let current_colId = data.colDef.colId;
                let val = data.value;
                let real_colId = '';
                let project = '';
                if(JSON.stringify(ks) == '[]') {
                    for (let k in data.data) {
                        if (val == data.data[k] && current_colId != k) {
                            real_colId = k;
                            break;
                        }
                    }
                }else{
                    for (let k of ks) {
                        if (val == data.data[k] && current_colId != k) {
                            real_colId = k;
                            break;

                        }
                    }
                }
                //查询信息
                let cols = data.columnApi._columnController.getAllGridColumns()
                let break_num = 0;
                let data_colDef;
                for(let i = 0;i<cols.length;i++){
                    //查找对应项目名称
                    if(cols[i].colDef.headerName == "项目名称"){
                        project = data.data[cols[i].colId];
                        break_num++;
                    }
                    //查找对应列所有信息
                    if(cols[i].colId == real_colId){
                        data_colDef = JSON.parse(JSON.stringify(cols[i]['colDef']));
                        break_num++;
                    }
                    if(break_num == 2){
                        break;
                    }
                }
                console.log( "二维表数据穿透" )
                let obj = {
                    tableId: data_colDef.source_table_id,
                    tableName: data_colDef.source_table_name,
                    parentTableId: this.data.tableId,
                    tableType: '',
                    rowId: data.data._id,
                    parentRealId: data.data._id,
                    fieldId: data_colDef.field_content.count_field,
                    project: project,
                    viewMode: 'reportTable2'
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
        //查看编辑权限判断
        viewOrEditPerm: function (type) {
            let obj = {
                view: '查看',
                edit: '编辑',
            }
            let test = obj[type];
            if( this.data.namespace == 'external' && ( type == 'view'||type == 'edit' ) ){
                msgBox.alert( '该表为外部数据表,不可' + test + '。' );
            }
            if( this.data.permission.view == 0 && type == 'view' ){
                msgBox.alert( '没有查看权限' );
            }
            if( this.data.permission.edit == 0 && type == 'edit' ){
                msgBox.alert( '没有编辑权限' );
            }
            if(this.data.cannotopenform == '1'){
                msgBox.alert( "已完成工作的子表不能" + obj[type] );
                return true
            }
            if(this.data.cannotopenform == '2'){
                msgBox.alert( "在途工作的表单不能" + obj[type] );
                return true
            }
        },
        //操作列点击事件
        gridHandle: function ( data ) {
            console.log( "操作" )
            console.log( data )
            console.log( this.data.namespace )
            if( data.event.srcElement.className == 'gridView' ){
                console.log( '查看' )
                let btnType = 'view';
                if( this.data.viewMode == 'in_process' || data["data"]["status"] == 2 || this.data.permission.edit == 0 || this.actions.viewOrEditPerm( 'view' ) ){
                    btnType = 'none';
                }
                let obj = {
                    table_id: this.data.tableId,
                    parent_table_id: this.data.parentTableId,
                    parent_real_id: this.data.parentRealId,
                    parent_temp_id: this.data.parentTempId,
                    parent_record_id: this.data.parentRecordId,
                    real_id: data.data._id,
                    temp_id: data.data.temp_id || '',
                    record_id: data.data.record_id || '',
                    btnType: btnType,
                    is_view:1,
                    in_process: this.data.viewMode == 'in_process' ? 1 : 0,
                    is_batch: (this.data.viewMode == 'createBatch'||this.data.viewMode == 'approveBatch') ? 1 : 0,
                    form_id:this.data.formId,
                    flow_id:data.data.flow_id || '',
                };
                let url = dgcService.returnIframeUrl( '/iframe/addWf/',obj );
                let title = '查看'
                this.actions.openSelfIframe( url,title );
            }
            if( data.event.srcElement.className == 'gridEdit' ){
                console.log( '编辑' )
                if( this.data.viewMode == 'in_process' || data["data"]["status"] == 2 || this.data.permission.cell_edit == 0 || this.actions.viewOrEditPerm( 'edit' ) ){
                    btnType = 'none';
                }
                let obj = {
                    table_id: this.data.tableId,
                    parent_table_id: this.data.parentTableId,
                    parent_real_id: this.data.parentRealId,
                    parent_temp_id: this.data.parentTempId,
                    parent_record_id: this.data.parentRecordId,
                    real_id: data.data._id,
                    temp_id: data.data.temp_id || '',
                    btnType: 'edit',
                    in_process: this.data.viewMode == 'in_process' ? 1 : 0,
                    is_batch: (this.data.viewMode == 'createBatch'||this.data.viewMode == 'approveBatch') ? 1 : 0,
                    form_id:this.data.formId,
                    flow_id:data.data.flow_id || '',
                };
                let url = dgcService.returnIframeUrl( '/iframe/addWf/',obj );
                let title = '编辑'
                this.actions.openSelfIframe( url,title );
            }
            if( data.event.srcElement.className == 'gridHistory' ){
                console.log( '历史' )
                let obj = {
                    table_id: this.data.tableId,
                    real_id: data.data._id
                }
                PMAPI.openDialogByIframe(`/iframe/historyApprove/`,{
                    width:1000,
                    height:600,
                    title:`历史`,
                    modal:true
                },{obj}).then(res=>{

                })
            }
            //半触发操作
            if( data.event.srcElement.className == 'customOperate' ){
                let id = data["event"]["target"]["id"];
                for (let d of this.data.customOperateList) {
                    if (d["id"] == id) {
                        this.actions.customOperate(d,data);
                    }
                }
            }
            //行级操作
            if( data.event.srcElement.className == 'rowOperation' ){
                let id = data["event"]["target"]["id"];
                for(let ro of this.data.rowOperation){
                    if(ro['row_op_id'] == id){
                        //在这里处理脚本
                        //如果前端地址不为空，处理前端页面
                        this.actions.doRowOperation(ro,data);
                    }
                }
            }
        },
        //半触发操作
        customOperate: function (d,data) {
            console.log( "半触发操作" )
            console.log( d )
            console.log( data )
            let obj = {
                flow_id : d["flow_id"],
                form_id : d["form_id"],
                id : d["id"],
                table_id : d['table_id'],
                btnType: 'new',
                data_from_row_id: data.data['_id'],
                operation_table_id: this.data.tableId,
                operation_id: d.id
            };
            let url = dgcService.returnIframeUrl( '/iframe/addWf/',obj );
            let title = d.name;
            this.actions.openSelfIframe( url,title );
        },
        //行级操作
        doRowOperation: function (r,$event) {
            if( r['frontend_addr'] !== ''){
                //执行前端操作
                this.actions.rowOperationFrontend({
                    rowId:$event.data['_id'],
                    table_id:this.data.tableId,
                    frontendAddress:r['frontend_addr'],
                    row_op_id:r['row_op_id']
                });
            }else if( r['pyscript_addr'] !== '' ){
                //执行后端操作
                let data = {
                    table_id:this.data.tableId,
                    selectedRows:JSON.stringify([$event['data']['_id']])
                }
                let address = 'data' + r['pyscript_addr'];
                dataTableService.rowOperationBackend( data,address ).then( res=>{
                    if(res.success == 1){
                        msgBox.showTips('已经向服务器发送请求');
                    }else if(res.success == 0){
                        msgBox.alert( '发送请求失败！错误是' + res['error'] );
                    }
                } )
            }
        },
        //行级操作前端操作
        rowOperationFrontend: function (data) {
            let customRowId = data['rowId'];
            let customTableId = data['table_id'];
            let row_op_id = data['row_op_id'];
            /*
             配置的前端地址格式——操作名（fun）:后台地址
             eg——execute:data/customize_router/?plugin_name=ServerPackageInfo.py
             */
            let fun=data['frontendAddress'].split(':')[0];
            let params=data['frontendAddress'].split(':')[1];

            let json = {};
            let url = '/iframe/rowOperation/';
            let winTitle = '';
            let w = 1400,h = 800
            switch( fun ){
                //行级操作-BI
                case 'bi':{
                    json = {
                        parent_table_id: customTableId,
                        rowId: customRowId,
                        operation_id: row_op_id,
                        allRowData: this.data.rowData,
                        columnsList: this.data.fieldsData,
                    }
                    console.log( '行级BI参数' )
                    console.log( json )
                    url = '/iframe/rowOperation/?operationType=bi';
                    winTitle = '行级BI';
                    break;
                }
                case 'sexecute':{
                    json = {
                        params: params,
                        rowId: customRowId,
                        operation_id: row_op_id,
                        allRowData: this.data.rowData,
                        field: 'f16',
                        tableId: this.data.tableId
                    }
                    w = 930
                    h = 500
                    console.log( '执行操作参数' )
                    console.log( json )
                    url = '/iframe/rowOperation/?operationType=excute';
                    winTitle = '执行操作';
                    break;
                }
                case 'cexecute':{
                    json = {
                        params: params,
                        rowId: customRowId,
                        operation_id: row_op_id,
                        allRowData: this.data.rowData,
                        field: 'f23',
                        tableId: this.data.tableId
                    }
                    w = 930
                    h = 500
                    console.log( '执行操作参数' )
                    console.log( json )
                    url = '/iframe/rowOperation/?operationType=excute';
                    winTitle = '执行操作';
                    break;
                }
            }
            PMAPI.openDialogByIframe( url,{
                width: w,
                height: h,
                title: winTitle,
                modal:true
            },json ).then( (data)=>{
            } )
        },
        //行双击
        onRowDoubleClicked: function (data) {
            console.log( "行双击查看" )
            console.log( data )
            //屏蔽分组行
            if( data.data.group||Object.is(data.data.group,'')||Object.is(data.data.group,0)||this.data.editMode||data.data.myfooter||this.actions.viewOrEditPerm( 'view' ) ){
                return;
            }
            let obj = {
                table_id: this.data.tableId,
                parent_table_id: this.data.parentTableId,
                parent_real_id: this.data.parentRealId,
                parent_temp_id: this.data.parentTempId,
                parent_record_id: this.data.parentRecordId,
                real_id: data.data._id,
                temp_id: data.data.temp_id || '',
                record_id: data.data.record_id || '',
                btnType: 'view',
                is_view:1,
                in_process: this.data.viewMode == 'in_process' ? 1 : 0,
                is_batch: (this.data.viewMode == 'createBatch'||this.data.viewMode == 'approveBatch') ? 1 : 0,
                form_id:this.data.formId,
                flow_id:data.data.flow_id || '',
            };
            if( this.data.viewMode == 'in_process' || data["data"]["status"] == 2 || this.data.permission.cell_edit == 0 ){
                obj.btnType = 'none';
            }
            let url = dgcService.returnIframeUrl( '/iframe/addWf/',obj );
            let title = '查看'
            this.actions.openSelfIframe( url,title );
            //行选择容错
            let ele= data.event.target;
            let node = data.node;
            node.setSelected(false, false);
            $(ele).removeClass('my-ag-cell-focus1');
            $(ele).removeClass('my-ag-cell-focus2');
        },
        //设置失效
        setInvalid: function () {
            if( this.pagination ){
                this.pagination.data.myInvalid = true;
            }
        },
        //打开穿透数据弹窗
        openSourceDataGrid: function ( url,title,w,h ) {
            //暂时刷新方法
            let defaultMax = false;
            PMAPI.openDialogByIframe( url,{
                width: w || 1400,
                height: h || 800,
                title: title,
                modal:true,
                defaultMax: defaultMax,
                customSize: defaultMax
            } ).then( (data)=>{
                //发送表单tableId（订阅刷新数据用）
                TabService.onCloseTab( this.data.tableId,this.data.tableId ).done((result) => {
                    if(result.success === 1){
                        // console.log("post open record success");
                    }else{
                        console.log("post open record failed")
                    }
                });
            } )
        },
        //打开弹窗
        openDialog: function ( url,title,w,h,data ) {
            //暂时刷新方法
            let defaultMax = false;
            PMAPI.openDialogByIframe( url,{
                width: w || 1400,
                height: h || 800,
                title: title,
                modal:true,
                defaultMax: defaultMax,
                customSize: defaultMax
            },data ).then( (data)=>{
                if( data.type == "batch" ){
                    this.data.batchIdList = data.ids;
                    this.actions.returnBatchData( data.ids );
                    this.actions.getGridData();
                }else if( data.type == 'export' ){
                    this.actions.timeDelayRefresh();
                }
            } )
        },
        //打开局部的弹窗
        openSelfIframe: function ( url,title,w,h ) {
            w = window.screen.width*0.8;
            h = window.screen.height*0.6;
            PMAPI.openDialogToSelfByIframe( url,{
                    width: w || 1400,
                    height: h || 800,
                    title: title,
                    modal:true,
                    defaultMax: true,
                    // customSize: true
            } ).then( (data)=>{
                if( data == 'success' || data.refresh ){
                    this.actions.timeDelayRefresh();
                }
            } )
        },
        //延时刷新
        timeDelayRefresh: function(){
            this.actions.setInvalid();
            try{this.pagination.actions.timeDelayRefresh();}catch(e){};
        },
        //返回批量工作流导入后数据
        returnBatchData: function (ids) {
        },
        //逐一下载合同
        downloadContract(data,i){
            if(!data.value){
                return;
            }
            if(i == data.value.length){
                return;
            }
            let value = data.value[i];
            HTTP.postImmediately('/customize/rzrk/download_contract/',{
                table_id:this.data.tableId,
                real_id:data.data._id,
                field_id:data.colDef.id,
                model_id:value.model_id,
                k2v:JSON.stringify(value.k2v),
                file_name:value.name
            }).then(res=>{
                if(res.success){
                    let url = '/download_attachment/?file_id='+JSON.parse(res.data).file_id+"&download=1";
                    window.open(url);
                    this.actions.downloadContract(data,i+1);
                }
            })

        },
        //数据改变
        rowDataChanged: function ($event) {
        },
        //渲染cache数据
        renderCacheData: function ( data ) {
            console.log( "cache数据" )
            console.log( data )
            console.log( window.config )
            this.data.cacheData = true;
            //表头
            let headerRes = [data.preferences,data.column_list,data.tab_page,data.operation,data.prepare_params];
            this.actions.setHeaderData( headerRes );
            //数据
            let gridRes = [data.table_data,data.reminds_infos,data.footer_data];
            this.data.firstGetFooterData = false;
            this.data.firstRender = false;
            this.data.common_filter_id = data.table_data.common_filter_id || '';
            this.actions.setGridData( gridRes );
            this.actions.renderAgGrid(true);
            //高级查询
            if( this.el.find( '.expert-search-btn' )[0] ){
                this.actions.renderExpertSearch();
                this.actions.setExpertSearchData( data.advanced_query )
                this.actions.firstFooterCommonFilterId(data.advanced_query);
                this.actions.createPostData();
            }
        }
    },
    afterRender: function () {
        this.showLoading();
        console.time( '渲染时间' )
        //发送表单tableId（订阅刷新数据用
        if( dgcService.needRefreshMode.indexOf( this.data.viewMode ) != -1 && !this.data.departmentDiary ){
            TabService.onOpenTab( this.data.tableId ).done((result) => {
                if(result.success === 1){
                    // console.log("post open record success");
                }else{
                    console.log("post open record failed")
                }
            });
        }
        try{dgcService.accuracy = window.config.sysConfig.accuracy || 1000;}catch(e){}
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
        }
        this.agGrid = new agGrid(gridData);
        this.append(this.agGrid , this.el.find('#data-agGrid'));

        this.floatingFilterCom = new FloatingFilter();
        this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;

        //渲染cache数据
        if( window.config.data_cached == 1 && this.data.viewMode == 'normal' ){
            console.log( '加载cache数据' )
            this.actions.renderCacheData( window.config.cached_data )
            try {
                this.data.showTabs(1);
                this.hideLoading();
            }catch(e){}
            console.timeEnd( '渲染时间' )
            return;
        }

        if( this.data.viewMode == 'normal' ){
            let data = window.config.cached_data;
            console.log( "只加载Header的cache数据" )
            console.log( data )
            console.log( window.config )
            //表头
            let headerRes = [data.preferences,data.column_list,data.tab_page,data.operation,data.prepare_params];
            this.actions.setHeaderData( headerRes );
            this.actions.getGridData();
            return;
        }

        if( this.data.viewMode == 'in_process' ){
            this.data.noNeedCustom = true;
        }
        if( this.data.viewMode == 'deleteHanding' ){
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
    }
}

class dataTableAgGrid extends Component {
    constructor(data,newConfig){
        for (let d in data) {
            config.data[d] = data[d];
        }
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default dataTableAgGrid;
