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
        remindColor:{remind_color_info:{},info:{}}
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
            console.log( params )
            if( params.data && params.data.myfooter && params.data.myfooter == "合计" ){
                return params.value || '';
            }
            let myValue = params['value'];//当前单元格数值
            let remindColorInfo = this.remindColor['remind_color_info'];//枚举提醒颜色
            let info = this.remindColor['info'];//数字提醒颜色
            let colDef = params.colDef;//当前单元格数据
            let rowId;     //当前rowId
            let sHtml;      //要显示的html元素的字符串
            let color = "transparent"; //颜色
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
            }catch (err){

            }

            let opcity='0.3';
            if(color != undefined && color != 'transparent'){
                color= dgcService.colorRgb(color,opcity);
            }
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