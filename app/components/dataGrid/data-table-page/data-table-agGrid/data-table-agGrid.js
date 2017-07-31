import Component from "../../../../lib/component";
import template from './data-table-agGrid.html';
import './data-table-agGrid.scss';

import agGrid from "../../agGrid/agGrid";
import {dataTableService} from "../../../../lib/service/dataGrid/data-table.service";
import {dgcService} from "../../../../lib/service/dataGrid/data-table-control.service";
import {fieldTypeService} from "../../../../lib/service/field-type-service";
// import {dataTableService} from "../../service/data-table-control.service";

let config = {
    template: template,
    data: {
        tableId:'343_2mDLTzHJd9eyb6vfThtZLo',
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
        remindColor:{remind_color_info:{},info:{}},
        //数据总数
        total:0,
        //展示的数据行数
        rows:100,
        //头部字段属性字典{f1： info}
        colsDict:{}
    },
    //原始字段数据
    fieldsData: [],
    //生成的表头数据
    columnDefs: [],
    actions: {
        //请求数据（表头，提醒，偏好）
        prepareData: function (){
            let json = {
                tableId: this.data.tableId
            }
            dataTableService.getTableData("111")
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
                        minWidth: 10,
                        filter: fieldTypeService.numOrText(data.data["real_type"]) ? "number" : "text",
                        headerClass: headClass,
                        cellStyle: {'font-style': 'normal'},
                        // floatingFilterComponentFramework: FloatingFilterComponent,
                        // floatingFilterComponent: FloatingFilterComponent,
                        // floatingFilterComponentParams:{
                        //     suppressFilterButton: true,
                        //     colInfo: data.data,
                        //     searchOldValue: this.searchOldValue,
                        //     searchValue: this.searchValue
                        // },
                        enableRowGroup: true,
                        enableValue: true,
                        // icons: {
                        //     sortAscending: '<img src="' + img1 + '" style="width: 15px;height:15px;"/>',
                        //     sortDescending: '<img src="' + img2 + '" style="width: 15px;height:15px;"/>'
                        // }
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
                            // if (oInfo[i].indexOf(colDef['colId']) != -1) {
                            try{
                                color = oInfo[i][colDef['colId']];
                                // color = remindColorInfo[colDef['colId']]['color'];
                            }catch (err){
                                color = 'transparent';
                            }
                            // }
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
                    if(viewMode == 'viewFromCorrespondence' || viewMode == 'editFromCorrespondence'){
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
                if( viewMode == 'editFromCorrespondence'){
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
                    if(viewMode == 'viewFromCorrespondence' || viewMode == 'editFromCorrespondence'){
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
                    "id": "3358_2M5pWJzXfaAQLmNNGJkRpJ",
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
                    "table_name": "个人日报",
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
                    "id": "4743_dapycVCRLJrLughEqcvSGS",
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
                    "table_name": "个人日报",
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
                    "id": "2067_KaLaVPHG8vcekX37PbyFcH",
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
                    "table_name": "个人日报",
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
                    "id": "7_NKMW6X5ZXXHoXNaCBAx9qg",
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
                    "table_name": "个人日报",
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
                    "id": "6110_XJhzrmot3NsvVo6WTmmgkQ",
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
                    "table_name": "个人日报",
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
                    "real_type": "3",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "213_tsxRaXuUEMXLEFWkp4bwKL",
                    "remind_setting": null,
                    "field": "f5",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "3",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "填写日期",
                    "field_content": {
                        "timeType": "all"
                    },
                    "dsearch": 0,
                    "table_name": "个人日报",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "9040_HezGY74DU6jJ5hMGzwBYWh",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "f6",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "f7",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "6725_gNSy4ksbBGhVAhYdurThJL",
                    "remind_setting": null,
                    "field": "f6",
                    "dtype": "5",
                    "main_type": {},
                    "dinput_type": "6",
                    "source_table_name": "人员信息",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 1,
                    "count_table_id": 0,
                    "name": "填写人",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "个人日报",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
                },
                {
                    "source_table_id": "9040_HezGY74DU6jJ5hMGzwBYWh",
                    "dcondition": {
                        "num_condition": 0
                    },
                    "base_buildin_dfield": "f6",
                    "is_stand": 0,
                    "is_correspondence_num": 0,
                    "real_type": "0",
                    "source_field_dfield": "f14",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "5451_BMkcv5nT9XK2g6QBFjqYuH",
                    "remind_setting": null,
                    "field": "f7",
                    "dtype": "3",
                    "main_type": {},
                    "dinput_type": "0",
                    "source_table_name": "人员信息",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "所在部门",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "个人日报",
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
                    "id": "2771_CGeEeRyBRdWWkK3ZAvGAWo",
                    "remind_setting": null,
                    "field": "f8",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "1",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "今日完成工作",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "个人日报",
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
                    "real_type": "1",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "7937_Sg4nvPG7qVrwrFwoBHexcj",
                    "remind_setting": null,
                    "field": "f9",
                    "dtype": "0",
                    "main_type": {},
                    "dinput_type": "1",
                    "source_table_name": "",
                    "sort": 0,
                    "is_offer_py": 0,
                    "is_user": 0,
                    "count_table_id": 0,
                    "name": "未完成工作",
                    "field_content": {},
                    "dsearch": 0,
                    "table_name": "个人日报",
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
                    "real_type": "1",
                    "source_field_dfield": "",
                    "real_accuracy": 0,
                    "child_table_id": 0,
                    "id": "9166_yL68EB3pCT3DcZMD4QxR26",
                    "remind_setting": null,
                    "field": "f10",
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
                    "table_name": "个人日报",
                    "correspondence_table_id": 0,
                    "enum_info": {},
                    "width": 60
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
                    "f1": "2017-07-17 17:14:05",
                    "f2": "2017-07-17 17:14:05",
                    "_id": "596c7fddfb48a50708e231d4",
                    "f4": "杨晓川",
                    "f5": "2017-07-17",
                    "f6": "杨晓川",
                    "f7": ["开发部-北京",
                        "前端组",
                        "前端组-成都"]
                }
            ]
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