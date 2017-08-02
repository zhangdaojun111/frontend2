import {fieldTypeService} from "./field-type-service";
export const dgcService = {
    /*16进制颜色转为RGB格式*/
    colorRgb: function (str,opcity) {
        var sColor = ''+str.toLowerCase();
        if(sColor){
            if( sColor.length === 4 ){
                var sColorNew = "#";
                for(var i=1; i<4; i+=1){
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for( var i=1; i<7; i+=2 ){
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
            }
            return "rgba(" + sColorChange.join(",")+","+opcity + ")";
        }else{
            return sColor;
        }
    },
    //格式化参数
    formatter: function (num) {
        var source = String(num).split(".");//按小数点分成2部分
        if (this.accuracy == 1000) {
            source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");//只将整数部分进行都好分割
        } else {
            source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{4})+$)', 'ig'), "$1 ");//只将整数部分进行都好分割(这个空格是万分位时用的)
        }
        return source.join(".");//再将小数部分合并进来
    },
    selectCol: {headerName: "",
        width: 30,
        checkboxSelection: true,
        colId: "mySelectAll",
        hide: false,
        field: "mySelectAll",
        suppressSorting: true,
        suppressResize: true,
        suppressMovable: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        supressToolPanel: true,
        suppressFilter: true,
        cellStyle: {
            'padding-left': '0px',
            'padding-right': '0px',
            'text-align': 'center',
            'font-style': 'normal'
        },
        headerClass:'header-select'
    },
    numberCol: {
        //生成编号
        cellRenderer: (params)=>{
            if( params.data&&params.data.myfooter&&params.data.myfooter == '合计' ){
                return '合计';
            }
            return '<span style="text-align: center;font-size: 12px;display: block;">' + ( params.rowIndex + 1 ) + '</span>';
        },
        headerName: '',
        colId: "number",
        hide: false,
        field: "number",
        width: 30,
        headerClass:'ag-grid-number',
        suppressSorting: true,
        suppressResize: true,
        suppressMovable: true,
        suppressMenu: true,
        suppressFilter: true,
        cellStyle: {
            'text-align': 'center',
            'padding': '0px'
        }
    },
    operationCol: {
        headerName: '操作',
        colId: "myOperate",
        hide: false,
        field: "myOperate",
        suppressSorting: true,
        suppressResize: false,
        suppressMovable: false,
        suppressFilter: true,
        suppressMenu: true,
        cellRenderer: (params)=>{}
    },
    //搜索类型
    // 判断搜索类型
    getMongoSearch: function(data) {
        switch(data){
            case "EQUALS":
                return "exact";
            case "NOT_EQUAL":
            case "NOT_EQUALS":
                return "$ne";
            case "GREATER_THAN":
                return "$gt";
            case "GREATER_THAN_OR_EQUAL":
                return "$gte";
            case "LESS_THAN":
                return "$lt";
            case "LESS_THAN_OR_EQUAL":
                return "$lte";
            case "CONTAINS":
            case "STARTS_WITH":
            default:
                return "$regex";
        }
    },
    //创建footer数据
    createFooterData: function (res) {
        let arr = [];
        let obj = res.rows[0] || {};
        obj["myfooter"] = '合计';
        arr.push(obj);
        let footerData = arr;
        return footerData;
    },
    clearFooterUndefined: function (columnDefs_bottom,rowData_footer) {
        let arr = [];
        if(columnDefs_bottom){
            for (let data of columnDefs_bottom) {
                if (["myGroups", "myOperate", "mySelectAll", "myOperate_1", "number"].indexOf(data["field"]) == -1) {
                    arr.push(data["field"]);
                }
            }
            let arrLength = arr.length;
            for (let i = 0; i < arrLength; i++) {
                if ( rowData_footer[0][arr[i]] === undefined || rowData_footer[0][arr[i]] === NaN ) {
                    rowData_footer[0][arr[i]] = '';
                }
            }
        }
    },
    //创建高级查询需要字段数据
    createHightGridSearchFields: function (rows) {
        let arr = [];
        for( let r of rows ){
            if( r.field == "_id" || fieldTypeService.canNotSearch( r.real_type ) ){
                continue;
            }
            let obj = {};
            obj['name'] = r.name;
            obj['searchField'] = r.field;
            obj['searchType'] = fieldTypeService.searchType( r.real_type );
            arr.push( obj )
        }
        return arr;
    }
}