import Component from "../../../../lib/component";
import template from './data-table-agGrid.html';
import './data-table-agGrid.scss';

import agGrid from "../../agGrid/agGrid";
import {dataTableService} from "../../../../lib/service/dataGrid/data-table.service";
import {dgcService} from "../../../../lib/service/dataGrid/data-table-control.service";
import {fieldTypeService} from "../../../../lib/service/field-type-service";
import FloatingFilter from "../../data-table-toolbar/floating-filter/floating-filter";

let config = {
    template: template,
    data: {
        tableId:'8696_yz7BRBJPyWnbud4s6ckU7e',
        formId:'',
        tableType:'',
        parentTableId:'',
        parentRealId:'',
        parentTempId:'',
        parentRecordId:'',
        //定制列（固定列）
        fixCols: {l:[],r:[]},
        //定制列（列排序）
        orderFields: [],
        // 提醒颜色
        remindColor:{remind_color_info:{"f6": {
            "暂停中": "#c0c0c0",
            "待merge": "#0bafff",
            "新建": "#ff0000",
            "反馈": "#804040",
            "已完成": "#4848ff",
            "测试中": "#ffa64d",
            "开发中": "#00b500"
        }},info:''},
        //数据总数
        total:0,
        //展示的数据行数
        rows:100,
        //头部字段属性字典{f1： info}
        colsDict:{},
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
        //搜索参数
        searchValue: []
    },
    //原始字段数据
    fieldsData: [],
    //生成的表头数据
    columnDefs: [],
    actions: {
        //请求数据（表头，提醒，偏好）
        prepareData: function (){
            let json = {
                table_id: this.data.tableId
            }
            dataTableService.getTableData(json)
            //     .then( res=>{
            //     console.log( "返回数据————————" )
            //     console.log( res )
            // } )
        },
        createHeaderColumnDefs: function () {
            let columnDefs = [],
                headerArr = [],
                columnArr = [],
                otherCol = []
            for( let col of this.fieldsData ){
                headerArr.push( { data:col, header:col["name"].split('->') } )
            }

            for( let data of headerArr ){
                for( let i = 0,length = data.header.length;i<length;i++ ){
                    this.actions.getArr(i,0,columnArr,length,data,otherCol);
                }
            }

            for (let col of columnArr) {
                columnDefs.push(col);
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
            if( this.data.menuType ){

            }else {
                operate["width"]=this.data.operateColWidth;
                operate["cellStyle"]={'font-style': 'normal'};
                operate["cellRenderer"] = (params)=>{
                    return this.actions.operateCellRenderer( params )
                }

            }
            columnDefs.push( operate )
            return columnDefs;
        },
        getArr: function (i,n,column,len,data,otherCol) {
            if( i == n ){
                this.actions.createHeader( column,i,len,data,otherCol )
            }else{
                for( let col of column ){
                    if( data.header[n] == col['headerName'] && col['children']){
                        this.actions.getArr( i,n+1,col['children'],len,data,otherCol);
                    }
                }
            }
        },
        createHeader: function ( column,i,len,data,otherCol ) {
            let key = 0;
            for( let col of column ){
                if( col['headerName'] == data.header[i] ){
                    key++;
                }
            }
            if( key == 0 ){
                if( i != ( len - 1 ) ){
                    column.push( {
                        headerName: data.header[i],
                        groupId: data.header[i],
                        marryChildren: false,
                        children: []
                    } )
                }else{//多级表头最底层节点，作为一列

                    //id列不添加多级索引不添加
                    if (data.data["field"] == "_id" || data.data['dtype'] == 9) {
                        return;
                    }
                    let headClass = fieldTypeService.numOrText(data.data["real_type"])?'header-style-r':'header-style-l';

                    //解决后台配置字段之后类排序没有该字段导致该列不显示的BUG
                    if ( this.data.orderFields.indexOf( data.data["field"] ) == -1 ) {
                        otherCol.push(data.data["field"]);
                    }

                    let fixArr = this.data.fixCols.l.concat( this.data.fixCols.r );

                    let obj={
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
                        // suppressToolPanel: true,
                        // width: 160,
                        suppressMovable: fixArr.indexOf( data.data["field"] ) == -1 ? false : true,
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
                        real_accuracy:data.data["real_accuracy"],
                        tooltipField: fieldTypeService.noToolTips(data.data["dinput_type"])? '' : data.data["field"],
                        sortingOrder: ['desc', 'asc', null],
                        hide: false,
                        minWidth: 20,
                        filter: fieldTypeService.numOrText(data.data["real_type"]) ? "number" : "text",
                        headerClass: headClass,
                        cellStyle: {'font-style': 'normal'},
                        floatingFilterComponent: new FloatingFilter().actions.createFilter(fieldTypeService.searchType( data.data["real_type"] ),data.data["field"],this.data.searchValue,this.data.searchOldValue),
                        enableRowGroup: true,
                        // icons: {
                        //     sortAscending: '<img src="' + img1 + '" style="width: 15px;height:15px;"/>',
                        //     sortDescending: '<img src="' + img2 + '" style="width: 15px;height:15px;"/>'
                        // },
                        suppressSorting: false,
                        suppressResize: false,
                        suppressMovable: false,
                        cellRenderer: (params) => {
                            return this.actions.bodyCellRenderer( params );
                        }
                    }
                    column.push(obj);
                }
            }
        },
        bodyCellRenderer: function (params){
            if( params.data && params.data.myfooter && params.data.myfooter == "合计" ){
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
            // let someStyle = 'text-align:right;margin:-5px;padding-left:5px;padding-right:5px;display:inline-block;width:calc(100% + 10px);height:100%;';//默认的样式
            let someStyle = 'margin:-5px;padding-left:5px;padding-right:5px;display:inline-block;width:calc(100% + 10px);height:100%;';//默认的样式
            if (params.data) {
                rowId = params.data['_id']
            }
            //显示提醒颜色start---
            //判断是否为数字类型
            try {
                if(info){
                    let oInfo = JSON.parse(info);
                    for (let i in oInfo) {
                        if (i == rowId) {
                            try{
                                color = oInfo[i][colDef['colId']];
                            }catch (err){
                                color = 'transparent';
                            }
                        }
                    }
                }
                //判断是否为枚举类型
                for (let i in remindColorInfo) {
                    if (i == colDef['colId']&&remindColorInfo[i][myValue]) {
                        color = remindColorInfo[i][myValue];
                    }
                }
            }catch (err){}

            let opcity='0.3';
            if(color != undefined && color != 'transparent'){
                color= dgcService.colorRgb(color,opcity);
            }

            //是否是重要字段（入库之前检测下是否为空）
            if(colDef.main_type && colDef.main_type.id != null){
                //兼容日期规则控件
                if(myValue=='' || myValue==undefined ||(params.value[-1]!=undefined && params.value[-1]=='')){
                    let conditionAll=colDef.main_type["condition"];
                    for(let condition of conditionAll) {
                        let conditinField = '';
                        if (condition["optionfield"] != null) {
                            //通过id查找field
                            for (let col of this.cols) {
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
            // if( this.data.tableType == 'source_data' && source_field_dfield == colDef.field ){
            //     color='rgba(255,0,0,0.5)';
            // }
            if (params.value == undefined) {
                sHtml = '<span style="'+ someStyle + 'background-color:' + color + '"><span/>';
                return sHtml;
            }

            //前端表达式值计算
            if(colDef.dinput_type == fieldTypeService.SURFACE_EXPRESSION){
                let exp = colDef.field_content.update_exp;
                let row_data = params.data;
                let reg = /\@f\d+\@/g;
                let items = exp.match(reg);
                for (let i in items){
                    i = items[i].replace("@", "").replace("@", "");
                    let is_number = (this.data.colsDict[i]&&(this.data.colsDict[i].real_type==10||this.data.colsDict[i].real_type==11));
                    let f = i;
                    i = "@"+i+"@";
                    while(exp.indexOf(i)!=-1){
                        // this.cols
                        exp = exp.replace(i, is_number?row_data[f]:"'"+row_data[f]+"'");
                    }
                }
                exp = exp.replace("#", "this.functionLib.");
                while (exp.indexOf("#")!=-1){
                    exp = exp.replace("#", "this.");
                }
                params["value"] = eval(exp);
            }

            //编辑模式下处理不能编辑数据
            // if(this.isShowEditCancel && params.colDef && !params.colDef.editable){
            //     color='rgba(230,230,230,0.8)';
            // }

            //处理数字类型
            if( fieldTypeService.numOrText( real_type ) ){//数字类型
                let numVal = fieldTypeService.intOrFloat( real_type ) ? dgcService.formatter(params.value) : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                if( fieldTypeService.childTable( real_type ) || fieldTypeService.countTable( real_type ) ){//子表||统计类型
                    if(this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence'){
                        sHtml = '<span style="color:rgb(85,85,85);'+ someStyle + 'background-color:' + color + '"><span>' + numVal + '</span><span/>';
                    } else {
                        sHtml = '<span style="color:#337ab7;'+ someStyle + 'background-color:' + color + '"><span id="childOrCount">' + numVal + '</span><span/>';
                    }
                }else {
                    if( colDef['base_buildin_dfield'] !='' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人' ){
                        sHtml = '<a  title="查看源数据" style="'+ someStyle +'background-color:' + color + '"><span id="relatedOrBuildin">' + numVal + '</span><span/>';
                    } else {
                        sHtml = '<span style="'+ someStyle +'background-color:' + color + '"><span>' + numVal + '</span><span/>';
                    }
                }
            }

            //加密文本处理
            else if( real_type == fieldTypeService.SECRET_TEXT ){
                sHtml = '<span style="text-align: center;">******</span>';
            }

            //周期规则处理
            else if( real_type == fieldTypeService.CYCLE_RULE ){
                let val = params["data"][colDef["colId"]]["-1"] || "";
                if(val !== "") {
                    val = val.replace(/\n/g,"\n;\n");
                }
                if( colDef['base_buildin_dfield'] !='' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人' ){
                    sHtml = '<a  title="查看源数据" style="'+ someStyle +'background-color:' + color + '"><span id="relatedOrBuildin">'+ val +'</span></a>';
                }else {
                    sHtml = '<span style="'+ someStyle +'background-color:' + color + '"><span>'+ val +'</span></span>';
                }
            }

            //富文本编辑框
            else if( real_type == fieldTypeService.UEDITOR ){
                sHtml = '<a title="富文本" style="text-align: center;">查看详情</a>';
            }

            //大数字段处理
            else if( real_type == fieldTypeService.DECIMAL_TYPE ){
                if( fieldTypeService.childTable( real_type ) || fieldTypeService.countTable( real_type ) ){//子表||统计类型
                    let bigNum = params.value > 9007199254740992 ? dgcService.formatter(params.value.toString()) + '.00' : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                    sHtml = '<a style="float:right;color:#337ab7;" id="childOrCount">'+ bigNum +'</a>';
                }else {
                    let bigNum = params.value > 9007199254740992 ? dgcService.formatter(params.value.toString()) + '.00' : dgcService.formatter(Number(params.value).toFixed(colDef.real_accuracy))
                    if( colDef['base_buildin_dfield'] !='' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人' ){
                        sHtml = '<a  title="查看源数据" style="'+ someStyle +'background-color:' + color + '"><span id="relatedOrBuildin">'+ bigNum +'</span></a>';
                    }else {
                        sHtml = '<span style="'+ someStyle +'background-color:' + color + '"><span>'+ bigNum +'</span></span>';
                    }
                }
            }

            //地址类型
            else if( real_type == fieldTypeService.URL_TYPE ){
                sHtml = '<a href="'+myValue+'" style="float:left;color:#337ab7;" id="shareAddress" target="_blank">'+myValue+'</a>';
            }

            //合同编辑器
            else if( real_type == fieldTypeService.TEXT_COUNT_TYPE ){
                sHtml = '<a style="text-align: center;color:#337ab7;">' + "查看" + '</a>' + '<span style="color:#000">' + "丨" + '</span>' + '<a style="text-align: center;color:#337ab7;">' + '下载' + '</a>';
            }

            //表对应关系（不显示为数字）
            else if( real_type == fieldTypeService.CORRESPONDENCE ){
                if( this.data.viewMode == 'editFromCorrespondence'){
                    sHtml = '<span style="color:' + color + '">' + params.value + '</span>';
                }else{
                    sHtml = '<a style="'+ someStyle +'background-color:' + color + ' " ><span id="correspondenceClick">' + params.value + '</span></a>';
                }
            }

            //图片附件
            else if( real_type == fieldTypeService.IMAGE_TYPE && colDef['field_content']['is_show_image'] == 1 ){
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
            else if( real_type == fieldTypeService.ATTACHMENT || real_type == fieldTypeService.VIDEO_TYPE ){
                sHtml = '<a id="file_view" title="查看详情">'+ myValue.length || 0 +'个附件</a>';
            }

            //都做为文本处理
            else {
                if (fieldTypeService.childTable(colDef.dinput_type) || fieldTypeService.countTable(colDef.dinput_type,colDef['real_type'])) { //子表或统计类型
                    if(this.data.viewMode == 'viewFromCorrespondence' || this.data.viewMode == 'editFromCorrespondence'){
                        sHtml = '<span style="float:right;color:rgb(85,85,85);">' + params.value + '</span>';
                    }else {
                        sHtml = '<a style="color:#337ab7;'+ someStyle +'background-color:' + color + '" ><span id="childOrCount">' + params.value + '</span></a>';
                    }
                } else {
                    if( colDef['base_buildin_dfield'] !='' && colDef['source_table_id'] != '' && colDef['headerName'] != '创建人' && colDef['headerName'] != '最后修改人' ){
                        sHtml = '<a  title="查看源数据" style="'+ someStyle +'background-color:' + color + '"><span id="relatedOrBuildin">' + params.value + '</span></a>';
                    }else {
                        sHtml = '<span style="'+ someStyle +'background-color:' + color + '"><span>' + params.value + '</span></span>';
                    }
                }
            }

            //分组无数据时容错
            if( params && params.colDef && params.colDef.headerName=='Group' ){
                sHtml = sHtml = '<span>' + params.value + '</span>';
            }
            return sHtml;
        },
        //重置偏好
        resetPreference: function () {
            let eHeader = document.createElement('span');
            eHeader.innerHTML = "初";
            eHeader.className = "table-init-logo";

            eHeader.addEventListener('click', ()=> {
                alert("重置偏好")
            });
            return eHeader;
        },
        //生成操作列
        operateCellRenderer: function (params) {
            let rowStatus = 0;
            let operateWord=2;
            if( !params.data || ( params.node.rowGroupIndex <= this.rowGroupIndex ) || params.data&&params.data.myfooter&&params.data.myfooter == '合计' ){
                return '';
            }
            if( params.data.group||Object.is( params.data.group,'' )||Object.is( params.data.group,0 ) ){
                return '';
            }
            if(params.hasOwnProperty("data") && params["data"].hasOwnProperty("status")) {
                rowStatus = params["data"]["status"];
            }
            try {
                if(params["data"]["status"]){
                    rowStatus = params["data"]["status"];
                }
            }catch (e){
                rowStatus = 0;
            }
            let str = '<div style="text-align:center;"><a class="gridView" style="color:#337ab7;">查看</a>';
            if (this.data.viewMode == 'normal'||this.data.viewMode=='source_data') {
                if (this.data.isFixed || rowStatus == 2) {
                    str += ' | <span style="color: darkgrey;">编辑</span>';
                    str += ' | <a style="color: darkgrey;">历史</a>';
                } else {
                    str += ' | <a  class="gridEdit" style="color:#337ab7;">编辑</a>';
                    str += ' | <a  class="gridHistory" style="color:#337ab7;">历史</a>';
                }
                operateWord=operateWord+4;
            }
            if(this.data.viewMode == 'batchInApprove'){
                str += ' | <a  class="gridEdit" style="color:#337ab7;">编辑</a>';
                operateWord=operateWord+2;
            }
            if(this.data.customOperateList) {
                for (let d of this.data.customOperateList) {
                    str += ` | <a class="customOperate" id="${ d["id"] }" style="color:#337ab7;">${ d["name"] }</a>`;
                    operateWord=operateWord+(d["name"]?d["name"].length : 0);
                }
            }
            if(this.data.rowOperation) {
                for (let ro of this.data.rowOperation) {
                    if( ro.frontend_addr&&ro.frontend_addr=='export_row' ){
                        let selectedRows = JSON.stringify( [params.data._id] )
                        str += ` | <a class="rowOperation" id="${ ro["row_op_id"] }" href='/data/customize/ta_excel_export/?table_id=${ this.pageId }&selectedRows=${ selectedRows }' style="color:#337ab7;">${ ro["name"] }</a>`;
                        operateWord=operateWord+(ro["name"]?ro["name"].length : 0);
                    }else {
                        str += ` | <a class="rowOperation" id="${ ro["row_op_id"] }" style="color:#337ab7;">${ ro["name"] }</a>`;
                        operateWord=operateWord+(ro["name"]?ro["name"].length : 0);
                    }
                }
            }
            str += '</div>';
            return str
        }
    },
    afterRender: function (){
        this.actions.prepareData()
        let res = {
            "rows": [
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 1,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "769_SHNcPUwvCCmCoutcEDAT58",
                    "remind_setting": null,
                    "field": "_id",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "0",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "ID",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "5",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "2570_DnNcGyE6J7UUnmHKXaBDvg",
                    "remind_setting": null,
                    "field": "f1",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "5",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "创建时间",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 130
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "5",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "8087_qzs8CdeWM6GjHntRJRfCXo",
                    "remind_setting": null,
                    "field": "f2",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "5",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "更新时间",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 130
                },
                {
                    "source_table_id": "9040_HezGY74DU6jJ5hMGzwBYWh",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "f3",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "f7",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "7170_QT8H36TdYqvjMNvSffs32J",
                    "remind_setting": null,
                    "field": "f3",
                    "dtype": "5",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "人员信息",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 1,
                    "count_table_id": 0,
                    "name": "创建人",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "9040_HezGY74DU6jJ5hMGzwBYWh",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "f4",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "f7",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "1194_m3bZCfmnQWSdU3n7wouW4A",
                    "remind_setting": null,
                    "field": "f4",
                    "dtype": "5",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "人员信息",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 1,
                    "count_table_id": 0,
                    "name": "最后修改人",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 70
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "14",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "9659_KvWwK6BhFTgMrTYkiN9SuJ",
                    "remind_setting": null,
                    "field": "f5",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "14",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "编号",
                    "field_content": {
                        "digit": 2,
                        "start_num": 1,
                        "hyphen": "_",
                        "date_rule": 2,
                        "prefix_str": "SAPQX",
                        "is_reset": 0,
                        "date_hyphen": ""
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "6",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "9849_zVGcPUfR2w3ASAus8ahEgf",
                    "remind_setting": null,
                    "field": "f6",
                    "dtype": "4",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "状态",
                    "field_content": {
                        "7624_M4WxYExmY2oMj9AJPxyKjU": "关闭",
                        "7042_m7Pg7KQqNaAD8NafY676ad": "测试中",
                        "3172_iW6icMXdKvcYbinttTWeFS": "待merge",
                        "5089_b8rxPDWDKZSt7tUZCPQHr6": "反馈",
                        "8049_r9uf2bqHV57EY33S8i3QAm": "开发中",
                        "4369_vebrwLtQM5dj2sagptVkuT": "暂停中",
                        "2175_fPcbM98wbmhMM3yfRnjcie": "新建",
                        "9405_J5CMVbVSS4StGFLSrSMxmN": "已完成"
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {
                        "7624_M4WxYExmY2oMj9AJPxyKjU": "关闭",
                        "7042_m7Pg7KQqNaAD8NafY676ad": "测试中",
                        "3172_iW6icMXdKvcYbinttTWeFS": "待merge",
                        "5089_b8rxPDWDKZSt7tUZCPQHr6": "反馈",
                        "8049_r9uf2bqHV57EY33S8i3QAm": "开发中",
                        "4369_vebrwLtQM5dj2sagptVkuT": "暂停中",
                        "2175_fPcbM98wbmhMM3yfRnjcie": "新建",
                        "9405_J5CMVbVSS4StGFLSrSMxmN": "已完成"
                    },
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "6346_89E5Ghc3iv6H7zg5zunpkC",
                    "remind_setting": null,
                    "field": "f7",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "0",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "更新版本号",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 70
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "6",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "1945_VGvRkgHu2Y4kuQMx4z2n7k",
                    "remind_setting": null,
                    "field": "f8",
                    "dtype": "4",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "问题来源",
                    "field_content": {
                        "7371_mjGc53Y2juF68vwVDAncqm": "发布更新",
                        "3760_CGdpc7gGRDtuw7XXXMugwW": "frontend",
                        "3353_HDn95hSBxWL7cFEKX3rQDF": "topology",
                        "181_WpuWTW3hHxVpzVLQ8a4ibB": "datacenter",
                        "8403_zsMnhPSJMMoB2GDxiZ9QpC": "frontend-customize",
                        "6715_sTZFmx8BwjXKQbnc5ou5u2": "im_mvc",
                        "5655_hEWpZA8ons9WvTQk7yghE8": "adaptor",
                        "4236_dQXKbycbmpC8GhdDqoyjXH": "socketio",
                        "8157_eCwFX43Wb3gWLm5LEb8JJ8": "manager_lite",
                        "5859_MFSBqSedFn8EsRZ9dWTXT7": "customize",
                        "6908_a7AQsVDmLrHoC93nyqrnKU": "im_socket",
                        "1362_XkqM7RoJiumBt6CK6V8spn": "workflow_engine",
                        "949_spRB3wLtYsKxZxbvWZ85aA": "logic",
                        "3665_VkhV57bvN7ZTPTz8imFRu9": "dataquery",
                        "2660_HfbxnAbv6isYJVfNrGVLUY": "message"
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {
                        "7371_mjGc53Y2juF68vwVDAncqm": "发布更新",
                        "3760_CGdpc7gGRDtuw7XXXMugwW": "frontend",
                        "3353_HDn95hSBxWL7cFEKX3rQDF": "topology",
                        "181_WpuWTW3hHxVpzVLQ8a4ibB": "datacenter",
                        "8403_zsMnhPSJMMoB2GDxiZ9QpC": "frontend-customize",
                        "6715_sTZFmx8BwjXKQbnc5ou5u2": "im_mvc",
                        "5655_hEWpZA8ons9WvTQk7yghE8": "adaptor",
                        "4236_dQXKbycbmpC8GhdDqoyjXH": "socketio",
                        "8157_eCwFX43Wb3gWLm5LEb8JJ8": "manager_lite",
                        "5859_MFSBqSedFn8EsRZ9dWTXT7": "customize",
                        "6908_a7AQsVDmLrHoC93nyqrnKU": "im_socket",
                        "1362_XkqM7RoJiumBt6CK6V8spn": "workflow_engine",
                        "949_spRB3wLtYsKxZxbvWZ85aA": "logic",
                        "3665_VkhV57bvN7ZTPTz8imFRu9": "dataquery",
                        "2660_HfbxnAbv6isYJVfNrGVLUY": "message"
                    },
                    "width": 60
                },
                {
                    "source_table_id": "9040_HezGY74DU6jJ5hMGzwBYWh",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "f9",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "f7",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "6120_kNtpUbHBtX6F4GLv5bRiyn",
                    "remind_setting": null,
                    "field": "f9",
                    "dtype": "5",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "人员信息",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 1,
                    "count_table_id": 0,
                    "name": "处理人",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "6",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "5173_sNVRLS8h3y648i7BFqohbQ",
                    "remind_setting": null,
                    "field": "f10",
                    "dtype": "4",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "紧急程度",
                    "field_content": {
                        "1199_tD6FAqVFqjhR4x2NDh9W7A": "长期",
                        "2020_dq54VMHCNydZFAgvoW8Zgi": "紧急",
                        "6720_zUBFEZHyKrUbTmwRECNfZX": "一般",
                        "8817_H7UNLtjYeGXCQLMjkV5qMK": "重构",
                        "3330_Wf9PyBsDWAwf6iQgKf5arC": "重要"
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {
                        "1199_tD6FAqVFqjhR4x2NDh9W7A": "长期",
                        "2020_dq54VMHCNydZFAgvoW8Zgi": "紧急",
                        "6720_zUBFEZHyKrUbTmwRECNfZX": "一般",
                        "8817_H7UNLtjYeGXCQLMjkV5qMK": "重构",
                        "3330_Wf9PyBsDWAwf6iQgKf5arC": "重要"
                    },
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "2300_8x6kYn9ydZ7VBUw6tLjUN4",
                    "remind_setting": null,
                    "field": "f11",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "0",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "服务器地址",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 70
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "8479_6KQr5Zx5BRQvLPmUyGyMiQ",
                    "remind_setting": null,
                    "field": "f12",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "0",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "问题关键字",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 70
                },
                {
                    "source_table_id": "9040_HezGY74DU6jJ5hMGzwBYWh",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "f13",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "f7",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "3520_AvqFTbctahKgLSwh5CXrzJ",
                    "remind_setting": null,
                    "field": "f13",
                    "dtype": "5",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "人员信息",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 1,
                    "count_table_id": 0,
                    "name": "测试人",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "1",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "8193_SkvdpxYNTceTCzmUKX4G3C",
                    "remind_setting": null,
                    "field": "f14",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "1",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "问题描述",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "6",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "442_FgeqoxizzeveRiwbWkGx3W",
                    "remind_setting": null,
                    "field": "f15",
                    "dtype": "4",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "Bug类型",
                    "field_content": {
                        "5281_WztdCghLYS8SNQjstsupv3": "cache问题",
                        "320_a4FoHAaaPm24GirZW9iaLe": "配置问题",
                        "2506_dtAeJuqrBDdvoZaWpPrbHB": "非Bug",
                        "9835_ZrLVUkifND3AZVj8cd58e4": "界面问题",
                        "2237_XKy5tV7qzk6vHyH2v4RKTZ": "数据问题",
                        "3695_qvjUT2wmj5yNEWwUwSaV9c": "服务器问题",
                        "9440_oEz6aoSZbhNUEHgY9CKi8c": "性能瓶颈",
                        "6122_AGRwK3UZfM4Sy8HiDvdRY8": "功能问题",
                        "2662_TCGxpNFZ5T4cLtwWYo3fPa": "需求",
                        "3402_NcYGbWGt6HCmehbxD4Y4xU": "设计缺陷"
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {
                        "5281_WztdCghLYS8SNQjstsupv3": "cache问题",
                        "320_a4FoHAaaPm24GirZW9iaLe": "配置问题",
                        "2506_dtAeJuqrBDdvoZaWpPrbHB": "非Bug",
                        "9835_ZrLVUkifND3AZVj8cd58e4": "界面问题",
                        "2237_XKy5tV7qzk6vHyH2v4RKTZ": "数据问题",
                        "3695_qvjUT2wmj5yNEWwUwSaV9c": "服务器问题",
                        "9440_oEz6aoSZbhNUEHgY9CKi8c": "性能瓶颈",
                        "6122_AGRwK3UZfM4Sy8HiDvdRY8": "功能问题",
                        "2662_TCGxpNFZ5T4cLtwWYo3fPa": "需求",
                        "3402_NcYGbWGt6HCmehbxD4Y4xU": "设计缺陷"
                    },
                    "width": 70
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "6",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "2890_qRpWPM73PwuuqL7CDZKXHa",
                    "remind_setting": null,
                    "field": "f16",
                    "dtype": "4",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "出现频率",
                    "field_content": {
                        "7112_pnk6sjGmPfPbC4WY25tTM4": "总是",
                        "2451_idqvyGy8oMKPWRxATkL4HM": "随机",
                        "2935_qTdSaFTNo8ZfPwp7KYWyxL": "没有实验",
                        "6334_SsJ2U46NSNeZoEMM5BHkVf": "不适用",
                        "1286_QDFTcpm8yqo8xWfg9BDz7j": "无法重现"
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {
                        "7112_pnk6sjGmPfPbC4WY25tTM4": "总是",
                        "2451_idqvyGy8oMKPWRxATkL4HM": "随机",
                        "2935_qTdSaFTNo8ZfPwp7KYWyxL": "没有实验",
                        "6334_SsJ2U46NSNeZoEMM5BHkVf": "不适用",
                        "1286_QDFTcpm8yqo8xWfg9BDz7j": "无法重现"
                    },
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "6",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "5549_CGYnvEDxxrTFAHKnjFk3E9",
                    "remind_setting": null,
                    "field": "f17",
                    "dtype": "4",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "严重性",
                    "field_content": {
                        "2725_iUMCHgdrmKCECueRXMxMmV": "宕机",
                        "2845_yu9ShhhGhnV3hC4PiPE4pb": "细节",
                        "5244_aMetNYTDNTnAESXKYqes3D": "崩溃",
                        "5047_rDGWDpUYfcW8xCUUFKt2M4": "很严重"
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {
                        "2725_iUMCHgdrmKCECueRXMxMmV": "宕机",
                        "2845_yu9ShhhGhnV3hC4PiPE4pb": "细节",
                        "5244_aMetNYTDNTnAESXKYqes3D": "崩溃",
                        "5047_rDGWDpUYfcW8xCUUFKt2M4": "很严重"
                    },
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "3",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "5093_hWHDF37u2M5HD4n5hdMy8L",
                    "remind_setting": null,
                    "field": "f18",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "3",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "开始时间",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "3",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "1998_86r6ikgSEi9pxNkEP9uUj8",
                    "remind_setting": null,
                    "field": "f19",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "3",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "预计结束时间",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 82
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "3",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "1339_kCfKa3qjLpgos6xadcJETT",
                    "remind_setting": null,
                    "field": "f20",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "3",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "实际结束时间",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 82
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "9",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "2839_dM7LrutQyAfQCSpnFxCxkh",
                    "remind_setting": null,
                    "field": "f23",
                    "dtype": "2",
                    "main_type": {},
                    "dinput_type": "9",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "问题附件",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "1",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "8477_giNSX3CRV36kktVAaRpqqd",
                    "remind_setting": null,
                    "field": "f24",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "1",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "备注",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "9040_HezGY74DU6jJ5hMGzwBYWh",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "f25",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "f7",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "2574_rzJkNweoGEvzoubTvLVVaQ",
                    "remind_setting": null,
                    "field": "f25",
                    "dtype": "5",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "人员信息",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 1,
                    "count_table_id": 0,
                    "name": "问题负责人",
                    "field_content": {
                        "frontend_add": 0
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 70
                },
                {
                    "source_table_id": "",
                    "dcondition": {},
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "11",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "7754_ufUxirsNkSGVUkTbH2aiJ2",
                    "remind_setting": null,
                    "field": "f27",
                    "dtype": "1",
                    "main_type": {},
                    "dinput_type": "11",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "进度",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "7",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "1149_GHDQq6Guc6PkujnMBsBbwX",
                    "remind_setting": null,
                    "field": "f28",
                    "dtype": "4",
                    "main_type": {},
                    "dinput_type": "7",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "问题类型",
                    "field_content": {
                        "8481_DjJrRwVzVC3HAKQujvBtZT": "需求",
                        "392_6735kJkkiN6VNCi3DzVgGK": "Bug"
                    },
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {
                        "8481_DjJrRwVzVC3HAKQujvBtZT": "需求",
                        "392_6735kJkkiN6VNCi3DzVgGK": "Bug"
                    },
                    "width": 60
                },
                {
                    "source_table_id": "",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "9",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "4554_EsKVPc4mUeXFzPx7BzBiKJ",
                    "remind_setting": null,
                    "field": "f32",
                    "dtype": "2",
                    "main_type": {},
                    "dinput_type": "9",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "需求测试报告",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "ERDS开发任务",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 82
                }
            ],
            "success": 1,
            "permission": {
                "search": 1,
                "group": 1,
                "cell_edit": 1,
                "edit": 1,
                "custom_field": 1,
                "upload": 1,
                "in_work": 1,
                "add": 1,
                "new_window": 1,
                "custom_width": 1,
                "download": 1,
                "complex_search": 1,
                "calendar": 1,
                "delete": 0,
                "setting": 0,
                "view": 1
            },
            "menu_type": 0,
            "namespace": "standard",
            "field_color": {},
            "error": "",
            "vNum": null
        }
        this.fieldsData = res.rows || [];
        //创建表头数据
        this.columnDefs = this.actions.createHeaderColumnDefs()

        let data = {
            columnDefs: this.columnDefs,
            rowData: [
                {
                    "f1": "2017-07-28 10:44:49",
                    "f2": "2017-07-28 17:58:22",
                    "f3": "周仕超",
                    "f4": "文晶晶",
                    "f5": "SAPQX_20170728_35919",
                    "f6": "新建",
                    "f7": "",
                    "f8": "frontend",
                    "f9": "杨晓川",
                    "f18": "2017-07-28",
                    "f23": [],
                    "f20": "",
                    "f27": "",
                    "f25": "熊小涛",
                    "f24": "",
                    "f28": "需求",
                    "data_status": 1,
                    "_id": "597aa521296e5b0255def808",
                    "f32": [],
                    "f19": "",
                    "f12": "[frontend2][aggrid]高级查询",
                    "f13": "徐艳",
                    "f10": "重构",
                    "f11": "",
                    "f16": "不适用",
                    "f17": "很严重",
                    "f14": "[frontend2][aggrid]\n高级查询和列搜索\n1.高级搜索的括号&‘或’规则使用\n2.常用查询的保存和使用\n3.临时查询和重置\n4.高级查询的编辑和修改",
                    "f15": "需求"
                },
                {
                    "f1": "2017-07-27 15:22:42",
                    "f2": "2017-07-28 17:57:57",
                    "f3": "文晶晶",
                    "f4": "文晶晶",
                    "f5": "SAPQX_20170727_35893",
                    "f6": "新建",
                    "f7": "",
                    "f8": "frontend",
                    "f9": "杨晓川",
                    "f18": "2017-07-27",
                    "f23": [],
                    "f20": "",
                    "f27": "",
                    "f25": "熊小涛",
                    "f24": "",
                    "f28": "需求",
                    "data_status": 1,
                    "_id": "597994c2ea60616b6efea4b7",
                    "f32": [],
                    "f19": "",
                    "f12": "[frontend2][BI]上下层",
                    "f13": "王玉",
                    "f10": "重构",
                    "f11": "",
                    "f16": "总是",
                    "f17": "很严重",
                    "f14": "[frontend2][BI]上下层\n需要实现的功能：针对有父子表关系的上一层和下穿功能",
                    "f15": "需求"
                }
            ],
            floatingFilter: true
        }
        this.append(new agGrid(data), this.el.find('#data-agGrid'));
    }
}

class dataTableAgGrid extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default dataTableAgGrid;