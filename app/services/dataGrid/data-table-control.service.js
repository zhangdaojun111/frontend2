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
    accuracy: 1000,
    //格式化参数
    formatter: function (num) {
        let source = String(num).split(".");//按小数点分成2部分
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
        }
    },
    numberCol: {
        //生成编号
        cellRenderer: (param)=>{
            let text = ''
            if( param.data&&param.data.myfooter&&param.data.myfooter == '合计' ){
                text = '合计';
            }else {
                text = ( param.rowIndex + 1 );
            }
            let bg = '';
            if( param["data"] && param["data"]["status"] && param["data"]["status"] == 2 ){
                bg = '#FECB6C';
            }
            if( param["data"]["data"] && param["data"]["data"]["status"] && param["data"]["data"]["status"] == 1 ){
                bg = 'rgba(255,84,0,.2)';
            }
            //如果是在工作计算cache中的数据显示特殊颜色
            if( param["data"] && param["data"]["data_status"] && param["data"]["data_status"] == 0 ){
                bg = '#FFEFEF';
            }
            return '<span style="text-align: center;line-height: 30px;font-size: 12px!important;display: block;overflow: visible;background: ' + bg + ';">' + text + '</span>';
        },
        headerName: '',
        colId: "number",
        hide: false,
        field: "number",
        width: 40,
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
    //分组列
    groupCol: { headerName: '分组', field: 'group' ,pinned:'left',hide:true,suppressSorting: true,suppressMovable:true,cellRenderer: 'group', suppressMenu: true, tooltipField:'group',suppressFilter: true},
    //在途状态
    in_process_state: { headerName: '状态',field:'operation',hide:false, width: 120,suppressFilter: true, suppressSorting: true,suppressMenu: true,minWidth: 50,cellRenderer: (param)=>{
        if( param.data['myfooter'] ){
            return '';
        }
        let type = param.data.type;
        let obj = {
            is_add: "添加",
            is_del: "删除",
            is_edit: "编辑"
        }
        return '<div style="text-align:center;"><span>'+ obj[type] +'</span></div>';
    }},
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
        let obj = {};
        if( res&&res.rows&&res.rows[0] ){
            obj = res.rows[0];
        }
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
        let fast = [];
        //快速搜索数据
        for( let f of rows ){
            if( f.dsearch == 1 ){
                for( let r of search ){
                    if( f.field == r.searchField ){
                        fast.push( r );
                        break;
                    }
                }
            }
        }
        let obj = {
            search: search,
            custom: custom,
            group: group,
            fast: fast
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
                console.log( queryParams.childInfo )
                if( ( queryParams.filter && queryParams.filter.length == 1 ) || ( queryParams.filter.length == 0 ) || !queryParams.filter ){
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
                    if( temp['$and'] ){
                        temp['$and'].push( queryParams.mongo[k] );
                    }else if( temp['$or'] ){
                        temp['$or'].push( queryParams.mongo[k] );
                    }else {
                        temp[k] = queryParams.mongo[k];
                    }
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
        checkboxChecked: '<i class="icon-aggrid-cus checkbox-check"></i>',
        checkboxUnchecked: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        checkboxIndeterminate: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMovePivot: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMoveGroup: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMovePin: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMoveAdd: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMoveHide: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMoveMove: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMoveLeft: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMoveRight: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        columnMoveValue: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        dropNotAllowed: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        rowGroupPanel: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        pivotPanel: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        valuePanel: '<i class="icon-aggrid-cus checkbox-uncheck"></i>',
        sortAscending: '<i class="icon-aggrid-cus sort-1"></i>',
        sortDescending: '<i class="icon-aggrid-cus sort-2"></i>',
        groupExpanded: '<i class="icon-aggrid-cus group-expand"></i>',
        groupContracted: '<i class="icon-aggrid-cus group-close"></i>',
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
    //需要订阅刷新的情况
    needRefreshMode: ['normal','child','count','deleteHanding'],
    //按钮组
    gridBtn: function (viewMode) {
        let obj = {
            normal:['float-search-btn','expert-search-btn','group-btn','new-form-btn','grid-del-btn','grid-import-btn','grid-export-btn','custom-column-btn','grid-auto-width','edit-btn','grid-new-window'],
            ViewChild:['float-search-btn','expert-search-btn','group-btn','grid-export-btn','custom-column-btn','grid-auto-width'],
            EditChild:['float-search-btn','expert-search-btn','group-btn','new-form-btn','grid-del-btn','grid-import-btn','grid-export-btn','custom-column-btn','grid-auto-width'],
            child:['float-search-btn','expert-search-btn','group-btn','new-form-btn','grid-del-btn','grid-import-btn','grid-export-btn','custom-column-btn','grid-auto-width'],
            createBatch: ['grid-del-btn','grid-import-btn','custom-column-btn'],
            approveBatch: ['custom-column-btn'],
            source_data: ['custom-column-btn','grid-auto-width'],
            count: ['float-search-btn','expert-search-btn','group-btn','new-form-btn','grid-del-btn','grid-import-btn','grid-export-btn','custom-column-btn','grid-auto-width'],
            viewFromCorrespondence: ['correspondence-check','float-search-btn','expert-search-btn','group-btn','grid-export-btn','custom-column-btn','grid-auto-width'],
            editFromCorrespondence: ['correspondence-check','float-search-btn','expert-search-btn','group-btn','grid-export-btn','custom-column-btn','grid-auto-width','correspondence-save'],
            in_process: ['float-search-btn','refresh-btn','grid-new-window'],
            keyword: ['keyword-tips','custom-column-btn','grid-new-window'],
            deleteHanding: ['delete-tips','grid-del-btn','custom-column-btn'],
            newFormCount: ['custom-column-btn'],
            reportTable2: ['new-form-btn','refresh-btn','edit-btn','custom-column-btn','grid-auto-width'],
        }
        return obj[viewMode];
    },
    //权限对应按钮
    permission2btn: {
        'float-search-btn':'search',
        'expert-search-btn':'complex_search',
        'group-btn':'group',
        'new-form-btn':'add',
        'grid-del-btn':'delete',
        'grid-import-btn':'upload',
        'grid-export-btn':'download',
        'custom-column-btn':'custom_field',
        'grid-auto-width':'custom_width',
        'grid-new-window':'new_window',
        'edit-btn':'cell_edit',
        'correspondence-check':'especial',
        'refresh-btn':'especial',
        'correspondence-save':'especial',
        'keyword-tips':'especial',
        'delete-tips':'especial'
    },
    //行选择
    rowClickSelect: function (data) {
        let ele= data.event.target;
        let node = data.node;
        if(ele.className.indexOf( "my-ag-cell-focus2" )!=-1){//第三次点击
            node.setSelected(false, false);
            $(ele).removeClass('my-ag-cell-focus1');
            $(ele).removeClass('my-ag-cell-focus2');
        }else if(ele.className.indexOf( "my-ag-cell-focus1" )!=-1){//第二次点击
            node.setSelected(true, false);
            $(ele).addClass('my-ag-cell-focus1 my-ag-cell-focus2');
        }else{//第一次点击
             // ele.className = 'my-ag-cell-focus1';
            $(ele).addClass('my-ag-cell-focus1')
        }
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
    //创建表头提醒class
    createHeaderStyle: function (tableId,obj) {
        let style = document.createElement('style'),
            head = document.head || document.getElementsByTagName('head')[0];
        style.type = 'text/css';
        let html = '.header-style-r {text-align: right;}.header-style-l {text-align: left;}';
        let classObj = {};
        let i = 1;
        for( let k in obj ){
            let css = ('.hrader-bgColor-'+ i + '{background-color:'+ this.colorRgb(k,0.7) +';}');
            for( let f of obj[k] ){
                classObj[f] = ('hrader-bgColor-'+i);
            }
            html = html + css;
            i++;
        }
        style.innerHTML = html;
        head.appendChild(style);
        return classObj;
    },
    //设置偏好数据
    setPreference: function (res,data) {
        if (res['colWidth']) {
            data.colWidth = res['colWidth'].colWidth;
            if (typeof ( data.colWidth ) == 'string') {
                data.colWidth = JSON.parse(res['colWidth'].colWidth);
            }
        }
        // if (res['pageSize'] && res['pageSize'].pageSize) {
        //     data.rows = res['pageSize'].pageSize;
        // }
        if (res['ignoreFields']&&res['ignoreFields']['ignoreFields']) {
            data.ignoreFields = JSON.parse(res['ignoreFields']['ignoreFields']);
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
            data.orderFields = JSON.parse(res['fieldsOrder']['fieldsOrder']);
        }
        if (res['pinned'] && res['pinned']['pinned']) {
            data.fixCols = JSON.parse(res['pinned']['pinned']);
        }
        // console.log("rows")
        // console.log(data.rows)
        // console.log("colWidth")
        // console.log(data.colWidth)
        // console.log("ignoreFields")
        // console.log(data.ignoreFields)
        // console.log("fixCols")
        // console.log(data.fixCols)
        // console.log("orderFields")
        // console.log(data.orderFields)
    },
    //根据偏好返回agGrid sate
    calcColumnState: function (data,agGrid,defaultArr) {
        let gridState = agGrid.gridOptions.columnApi.getColumnState();
        // console.log('gridState')
        // console.log(gridState)
        let indexedGridState = {};
        for(let state of gridState) {
            indexedGridState[state['colId']] = state;
        }
        for( let w in data.colWidth ){
            if( w == 'number' ){
                indexedGridState[w]['width'] = 40;
                continue;
            }
            if( indexedGridState[w] ){
                indexedGridState[w]['width'] = data.colWidth[w];
            }
        }
        let arr = [];
        for( let d of defaultArr ){
            let obj = indexedGridState[d]||{};
            obj['pinned']= data.fixCols.l.length > 0 ? 'left' : null;
            if( d == 'group' ){
                obj['hide'] = true;
            }
            arr.push( obj );
        }
        //左侧固定
        for( let col of data.fixCols.l ){
            let state = indexedGridState[col]||{};
            state['hide'] = data.ignoreFields.indexOf( col ) != -1;
            state['pinned'] = 'left';
            arr.push(state);
        }
        //中间不固定
        let fixArr = data.fixCols.l.concat( data.fixCols.r );
        for( let d of data.orderFields ){
            if( d == '_id'||data == 'group' ){
                continue;
            }
            if( d != 0 && fixArr.indexOf( data ) == -1 ){
                let state = indexedGridState[d]||{};
                state['hide'] = data.ignoreFields.indexOf( d ) != -1;
                state['pinned'] = null;
                arr.push(state);
            }
        }
        if(data.orderFields.length == 0){
            for(let state of gridState){
                let id = state['colId'];
                if(id != 'number' && id != 'mySelectAll' && id != 'group'){
                    state['hide'] = data.ignoreFields.indexOf(id)!=-1;
                    state['pinned'] = null;
                    arr.push(state);
                }
            }
        }
        //右侧固定
        for( let col of data.fixCols.r ){
            let state = indexedGridState[col]||{};
            state['hide'] = data.ignoreFields.indexOf( col ) != -1;
            state['pinned'] = 'right';
            arr.push(state);
        }
        //操作列宽度
        for( let d of arr ){
            if( d.colId && d.colId == 'myOperate' ){
                d['width'] = data.operateColWidth;
            }
        }
        let new_arr = []
        for( let d of arr ){
            if( d.colId!=undefined ){
                new_arr.push( d );
            }
        }
        // console.log( "状态" )
        // console.log( new_arr )
        agGrid.gridOptions.columnApi.setColumnState( new_arr );
    },
    //判断Object是否相等
    checkObejctNotEqual(obj1,obj2){
        let o1=Object.assign({},obj1);
        let o2=Object.assign({},obj2);
        if(Object.prototype.toString.call(o1)!='[object Object]'){
            if(o1 != o2){
                return true;
            }else{
                return false;
            }
        };
        if(JSON.stringify(o1) == JSON.stringify(o2)){
            return false;
        }else{

            return true;
        }
    },
    abjustTargetRow(targetRow,ids){
        let pRealId = ids['parent_real_id'];
        let pTableId = ids['parent_table_id'];
        let pTempId = ids['parent_temp_id'];
        let tempId = ids['temp_id'];
        this.fillIdsInObj(targetRow['data'],pRealId,pTableId,pTempId,tempId);
        this.fillIdsInObj(targetRow['cache_new'],pRealId,pTableId,pTempId,tempId);
        this.fillIdsInObj(targetRow['cache_old'],pRealId,pTableId,pTempId,tempId);
        this.fillIdsInObj(targetRow,pRealId,pTableId,pTempId);
        return targetRow;
    },
    fillIdsInObj(obj,pRealId,pTableId,pTempId,temp_id){
        if(!obj){
            return;
        }
        if(temp_id){
            obj['temp_id']=temp_id||'';
        }
        obj['parent_real_id']=pRealId||'';
        obj['parent_table_id']=pTableId||'';
        obj['parent_temp_id']=pTempId||'';
    }
}