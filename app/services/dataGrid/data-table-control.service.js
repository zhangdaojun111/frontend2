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
            let text = ''
            if( params.data&&params.data.myfooter&&params.data.myfooter == '合计' ){
                text = '合计';
            }else {
                text = ( params.rowIndex + 1 );
            }
            return '<span style="text-align: center;font-size: 12px!important;display: block;overflow: visible;">' + text + '</span>';
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
                return "$ne";
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
                return "$regex";
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
    //创建高级查询、定制列、搜索需要字段数据
    createNeedFields: function (rows) {
        let search = [];
        let custom = [{name:'序号',field:'number',canhide:false,candrag:false,canFix:false},
            {name:'选择',field:'mySelectAll',canhide:false,candrag:false,canFix:false},
            {name:'操作',field:'myOperate',canhide:true,candrag:true,canFix:true}];
        let group = [];
        for( let r of rows ){
            if( r.field != "_id" && !fieldTypeService.canNotSearch( r.real_type ) ){
                let obj = {};
                obj['name'] = r.name;
                obj['searchField'] = r.field;
                obj['searchType'] = fieldTypeService.searchType( r.real_type );
                search.push( obj );
            }
            if( r.field != "_id" ){
                let obj = {
                    canhide:true,candrag:true,canFix:true
                };
                obj['name'] = r.name;
                obj['field'] = r.field;
                custom.push( obj );
            }
            let groupIgnore = ['number','mySelectAll','myOperate','group','_id'];
            if( groupIgnore.indexOf( r.field ) == -1 && fieldTypeService.cantGroup( r.real_type ) ){
                let obj = {
                    name: r.name,
                    field: r.field
                };
                group.push( obj );
            }
        }
        let obj = {
            search: search,
            custom: custom,
            group: group
        }
        return obj;
    },
    //dataGrid搜索filter
    returnQueryParams: function (queryParams) {
        if(queryParams.filter || queryParams.childInfo || queryParams.mongo || queryParams.filter_child){
            let temp = {};
            if(queryParams.filter.length != 0 && !queryParams.filter['_id']){
                temp = this.translateAdvancedQuery(queryParams.filter);
            }else if( queryParams.filter['_id'] ) {
                temp = queryParams.filter;
            }else {
                temp = {};
            }
            let obj = {};
            if(queryParams.childInfo){
                if( ( queryParams.filter && queryParams.filter.length == 1 ) || ( !queryParams.filter ) ){
                    temp['section_page_'+queryParams.childInfo.parent_page_id] = queryParams.parent_temp_id || queryParams.childInfo.parent_row_id;
                }else if( queryParams.filter && queryParams.filter.length > 1 ){
                    if(temp['$and']) {
                        temp['$and'][0]['section_page_'+queryParams.childInfo.parent_page_id] = queryParams.parent_temp_id || queryParams.childInfo.parent_row_id;
                    }
                    else{
                        temp['$or'][0]['section_page_'+queryParams.childInfo.parent_page_id] = queryParams.parent_temp_id || queryParams.childInfo.parent_row_id;
                    }
                }
                delete queryParams.childInfo
            }
            if(queryParams.mongo){
                for(let k in queryParams.mongo){
                    temp[k] = queryParams.mongo[k]
                }
                delete queryParams.mongo
            }
            queryParams.filter = JSON.stringify(temp);
            if( queryParams.filter == '{}' ){
                delete queryParams.filter;
            }
            return queryParams;
        }
    },
    translateAdvancedQuery: function (oldQueryList){
        let stack1 = [];
        let stack2 = [];
        for(let i in oldQueryList){
            let item = oldQueryList[i];
            let searchBy = item["cond"]['searchBy'];
            let tempDict = this.getMongoSearchDict(item);
            if(i=="0"){
                stack1.push(tempDict);
                if(stack1[0]['undefined']){
                    stack1[0]=stack1[0]['undefined'][0];
                }
                continue;
            }
            let relation = item["relation"];
            let lb = item['cond']['leftBracket'] ? item['cond']['leftBracket'] : 0;
            let rb = item['cond']['rightBracket'] ? item['cond']['rightBracket'] : 0;
            if(lb == '('){
                stack2.push(relation);
                stack2.push(lb);
                stack1.push(tempDict);
                if(stack1[0]['undefined']){
                    stack1[0]=stack1[0]['undefined'][0];
                }
            }else{
                let o1 = stack1.pop();
                let obj = {} ;
                obj[relation] = [o1,tempDict];
                stack1.push(obj);
                if(stack1[0]['undefined']){
                    stack1[0]=stack1[0]['undefined'][0];
                }
            }
            if(rb==')'){
                let operator1 = stack1.pop();
                let operator2 = stack1.pop();
                let operand = stack2.pop();
                let obj = {}
                if(operand == '('){
                    operand = stack2.pop();
                }
                obj[operand] = [operator1,operator2];
                stack1.push(obj);
                if(stack1[0]['undefined']){
                    stack1[0]=stack1[0]['undefined'][0];
                }
            }
        }
        return stack1[0];
    },
    getMongoSearchDict: function (searchDict){
        let cond = searchDict["cond"];
        let searchBy = cond["searchBy"];
        let searchBy_P = cond["searchBy"] + '_p';

        let operate = cond["operate"];
        let keyword = cond["keyword"];
        let tempDictAndPinyin = [];
        let tempDict = {};
        let tempDictPinyin = {};
        let result;
        if(operate=='exact') {
            tempDict[searchBy] = keyword;
            tempDictAndPinyin.push(tempDict);
            tempDictPinyin[searchBy_P] = keyword;
            tempDictAndPinyin.push(tempDictPinyin);
        }
        else{
            let temp = {};
            let tempPinyin = {};

            temp[operate] = keyword;
            tempDict[searchBy] = temp;
            tempDictAndPinyin.push(tempDict);

            tempPinyin[operate] = keyword;
            tempDictPinyin[searchBy_P] = tempPinyin;
            tempDictAndPinyin.push(tempDictPinyin);
        }
        if(typeof (cond["keyword"]) == "number" ){
            result =  tempDict;
        }else{
            if(operate == '$ne'){
                result = {
                    $and:tempDictAndPinyin
                }
            }else {
                result =  {
                    $or:tempDictAndPinyin
                }
            }
        }
        return result;
    },
    //替换的图标
    replacingIcons: {
        checkboxChecked: '<img src="'+require('../../assets/images/dataGrid/icon_checkbox_yes.png') +'" />',
        checkboxUnchecked: '<img src="'+require('../../assets/images/dataGrid/icon_checkbox_no.png') +'" />',
        checkboxIndeterminate: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMovePivot: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMoveGroup: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMovePin: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMoveAdd: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMoveHide: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMoveMove: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMoveLeft: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMoveRight: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        columnMoveValue: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        dropNotAllowed: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        rowGroupPanel: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        pivotPanel: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />',
        valuePanel: '<img src="'+require('../../assets/images/dataGrid/icon_intermedia.png') +'" />'
    },
    //返回fieds
    retureFields: function (id2fields,ids) {
        let arr = [];
        for( let i of ids ){
            arr.push( id2fields[i] );
        }
        return arr;
    },
    //返回sheet分页HTML
    returnSheetHtml: function ( sheets ) {
        let html = '<ul currentId="0">'
        for( let s of sheets ){
            let h = "<li sheetId='"+ s.id +"' sheetValue='"+ JSON.stringify(s.value) +"'>"+s.name+"</li>"
            html += h;
        }
        html += '</ul>'
        return html;
    },
    //按钮组
    gridBtn: function (viewMode) {
        let obj = {
            normal:['float-search-btn','expert-search-btn','group-btn','new-form-btn','grid-del-btn','grid-import-btn','grid-export-btn','custom-column-btn','grid-auto-width','grid-new-window'],
            ViewChild:['float-search-btn','expert-search-btn','group-btn','grid-export-btn','custom-column-btn','grid-auto-width']
        }
    }

}