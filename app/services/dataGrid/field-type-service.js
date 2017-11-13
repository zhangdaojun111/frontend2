export const fieldTypeService = {
    //与后台数据的字段类型对应
    //dtype
    TEXT_TYPE : "0",//文本
    NUMBER_TYPE : "1",//数字
    ATTACHMENT_TYPE : "2",//附:
    ABOUT_TYPE : "3",//相关
    SELECT_TYPE : "4",//选择
    BUILD_IN : "5",//内置
    MULTI_BUILD_IN : "6",//多级内置
    CHILD_TABLE_TYPE : "7",//子表
    EXPRESSION_TYPE : "8",//表达式
    MULTI_INDEX_TYPE : "9",//多级索引类型
    QUERY_COUNT_TYPE : "10",//统计类型
    CORRESPONDENCE_TYPE : "11",//对应关系
    ABOUT_RELATION_TYPE : "12",//相关关系
    REPRESENT_TYPE : "13",//代表字段类型
    MULTI_CHOICE_BUILD_IN : "14",//多选内置
    VBA_TYPE : "15",//VBA
    TABLE_COUNT_TYPE : "16",//表级统计字段
    EDIT_CONTROL_TYPE : "17",//合同编辑器

    //dinput_type||real_type
    TEXT : "0",//文本框
    TEXTAREA : "1",//文本区
    UEDITOR : "2",//富文本编辑器
    DATE : "3",//日期框
    TIME : "4",//时间框
    DATETIME : "5",//日期时间框
    SELECT : "6",//下拉框
    SINGLE_SELECT : "7",//单选框
    MULTI_SELECT : "8",//复选框
    ATTACHMENT : "9",//附件
    FLOAT_TYPE : "10",//小数
    INT_TYPE : "11",//整数
    YEAR : "12",//年份框
    NORMAL_CHILD : "13",//普通子表字段
    INCREMENT_NUMBER : "14",//自增编号
    QUERY_COUNT : "15",//统计查询
    CORRESPONDENCE : "16",//表对应关系
    ABOUT_RELATION : "17",//相关对应关系
    CHILD_TABLE : "18",//子表设置
    REPRESENT : "19",//代表字段
    TERM_EXPRESSION : "20",//条件表达式
    NORMAL_EXPRESSION : "21",//普通表达式
    SURFACE_EXPRESSION : "22",//前端表达式
    IMAGE_TYPE : "23",//图片专用附件（jpg、png、gif、TIFF）
    TABLE_COUNT : "24",//表级统计类型
    SECRET_TEXT : "25",//加密文本
    DECIMAL_TYPE : "26",//大数（decimal）
    CYCLE_RULE : "27",//周期规则
    URL_TYPE : "29",//地址类型
    YEAR_MONTH_TYPE : "30",//只显示年月的下拉框
    EMAIL_TYPE : "31",
    ACCOUNT_CODE : "32",
    VIDEO_TYPE : "33",
    TEXT_COUNT_TYPE : "34",//合同编辑器
    EDIT_CONTROL : "35",

    numOrText: function (data) {//(数字或者文本)用real_type判断
        return data == this.FLOAT_TYPE || data == this.INT_TYPE
    },
    childTable: function (data) {//子表
        return data == this.NORMAL_CHILD
    },
    countTable: function (dinput_type,real_type) {//统计
        return dinput_type == this.QUERY_COUNT || dinput_type == this.TABLE_COUNT || real_type == this.EDIT_CONTROL
    },
    editControlTable: function (data) {//高级跳转字段
        return data == this.EDIT_CONTROL
    },
    noToolTips: function (data) {//dataGrid中没有toolTips
        let arr = [this.IMAGE_TYPE,this.UEDITOR,this.TEXT_COUNT_TYPE,this.SECRET_TEXT,this.IMAGE_TYPE]
        return arr.indexOf( data ) != -1
    },
    intOrFloat: function (data) {//整数||小数
        return data == this.INT_TYPE
    },
    //不能搜索字段
    canNotSearch : function (data) {
        let arr = [this.UEDITOR,this.TEXT_COUNT_TYPE,this.URL_TYPE,this.CYCLE_RULE,this.TEXT_COUNT_TYPE,this.SECRET_TEXT,
            this.IMAGE_TYPE,this.IMAGE_TYPE,this.VIDEO_TYPE,this.CYCLE_RULE,this.ATTACHMENT]
        return arr.indexOf( data ) != -1;
    },
    //返回搜索的类型
    searchType: function (data) {
        if( data == this.DATE ){
            return 'date'
        }else if( data == this.TIME ){
            return 'time'
        }else if( data == this.DATETIME ){
            return 'datetime'
        }else if( this.numOrText(data) ){
            return 'number'
        }else if( this.canNotSearch(data) ){
            return 'none'
        }else {
            return 'text'
        }
    },
    //不能分组字段
    cantGroup: function (data) {
        let arr = [this.SECRET_TEXT,this.TEXT_COUNT_TYPE,this.URL_TYPE,this.IMAGE_TYPE,this.ATTACHMENT,this.VIDEO_TYPE,this.MULTI_SELECT];
        return arr.indexOf( data ) == -1
    },
    //后端排序字段
    backSortField: function (data) {
        let arr = [this.DECIMAL_TYPE];
        return arr.indexOf( data ) != -1;
    },
    //附件
    attachment: function( data ){
        // let arr = [this.ATTACHMENT,this.IMAGE_TYPE];
        let arr = [this.ATTACHMENT];
        return arr.indexOf( data ) != -1;
    },
    //字段对其位置
    textAline: function ( data ) {
        let right = ['10','11','16','26']
        let center = ['2','3','4','5','9','12','23','30','33','34','35']
        if( right.indexOf( data )!=-1 ){
            return 'right';
        }
        if( center.indexOf( data )!=-1 ){
            return 'center';
        }
        return 'left';
    }
}
export let FIELD_TYPE_MAPPING = {
    TEXT_TYPE: [fieldTypeService.TEXT, fieldTypeService.TEXTAREA, fieldTypeService.UEDITOR, fieldTypeService.DATE, fieldTypeService.TIME, fieldTypeService.DATETIME, fieldTypeService.YEAR, fieldTypeService.INCREMENT_NUMBER, fieldTypeService.SECRET_TEXT, fieldTypeService.CYCLE_RULE],
    NUMBER_TYPE: [fieldTypeService.FLOAT_TYPE,fieldTypeService.INT_TYPE,fieldTypeService.DECIMAL_TYPE],
    ATTACHMENT_TYPE: [fieldTypeService.ATTACHMENT, fieldTypeService.IMAGE_TYPE],
    ABOUT_TYPE: [fieldTypeService.TEXT],
    SELECT_TYPE: [fieldTypeService.SELECT, fieldTypeService.SINGLE_SELECT, fieldTypeService.MULTI_SELECT, fieldTypeService.YEAR_MONTH_TYPE],
    BUILD_IN: [fieldTypeService.SELECT],
    MULTI_BUILD_IN: [fieldTypeService.SELECT],
    CHILD_TABLE_TYPE: [fieldTypeService.NORMAL_CHILD, fieldTypeService.CHILD_TABLE],
    EXPRESSION_TYPE: [fieldTypeService.NORMAL_EXPRESSION, fieldTypeService.TERM_EXPRESSION, fieldTypeService.SURFACE_EXPRESSION],
    MULTI_INDEX_TYPE: [fieldTypeService.TEXT],
    QUERY_COUNT_TYPE: [fieldTypeService.QUERY_COUNT],
    CORRESPONDENCE_TYPE: [fieldTypeService.CORRESPconst],
    ABOUT_RELATION_TYPE: [fieldTypeService.ABOUT_RELATION],
    MULTI_CHOICE_BUILD_IN: [fieldTypeService.MULTI_SELECT],
    TABLE_COUNT_TYPE: [fieldTypeService.TABLE_COUNT],
    EDIT_CONTROL_TYPE:[fieldTypeService.EDIT_CONTROL]
}