

// FIELD_TYPE_MAPPING = {
//     TEXT_TYPE: [this.TEXT, this.TEXTAREA, this.UEDITOR, this.DATE, this.TIME, this.DATETIME, this.YEAR, this.INCREMENT_NUMBER, this.SECRET_TEXT, this.CYCLE_RULE],
//     NUMBER_TYPE: [this.FLOAT_TYPE,this.INT_TYPE,this.DECIMAL_TYPE],
//     ATTACHMENT_TYPE: [this.ATTACHMENT, this.IMAGE_TYPE],
//     ABOUT_TYPE: [this.TEXT],
//     SELECT_TYPE: [this.SELECT, this.SINGLE_SELECT, this.MULTI_SELECT, this.YEAR_MONTH_TYPE],
//     BUILD_IN: [this.SELECT],
//     MULTI_BUILD_IN: [this.SELECT],
//     CHILD_TABLE_TYPE: [this.NORMAL_CHILD, this.CHILD_TABLE],
//     EXPRESSION_TYPE: [this.NORMAL_EXPRESSION, this.TERM_EXPRESSION, this.SURFACE_EXPRESSION],
//     MULTI_INDEX_TYPE: [this.TEXT],
//     QUERY_COUNT_TYPE: [this.QUERY_COUNT],
//     CORRESPONDENCE_TYPE: [this.CORRESPconst ONDENCE],
//     ABOUT_RELATION_TYPE: [this.ABOUT_RELATION],
//     MULTI_CHOICE_BUILD_IN: [this.MULTI_SELECT],
//     TABLE_COUNT_TYPE: [this.TABLE_COUNT],
//     EDIT_CONTROL_TYPE:[this.EDIT_CONTROL]
// }

// //数字类型的list
// const NUMBER_TYPE_LIST = [this.FLOAT_TYPE, this.INT_TYPE, this.DECIMAL_TYPE];
//
// //枚举字段类型
// const SELECT_LIST = this.FIELD_TYPE_MAPPING["SELECT_TYPE"];
//
// //时间字段类型
// const TIME_FIELD_LIST = [this.DATE, this.TIME, this.DATETIME, this.YEAR];
//
// //不能分组
// const CANT_GROUP = [this.UEDITOR,this.MULTI_SELECT,this.ATTACHMENT,this.TERM_EXPRESSION,
//     this.NORMAL_EXPRESSION,this.SURFACE_EXPRESSION,this.IMAGE_TYPE,this.CYCLE_RULE,this.URL_TYPE];

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
        return data == this.FLOAT_TYPE || data == this.INT_TYPE || data == this.CORRESPONDENCE
    },
    childTable: function (data) {//子表
        return data == this.NORMAL_CHILD
    },
    countTable: function (data) {//统计
        return data == this.QUERY_COUNT || data == this.TABLE_COUNT
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
        let arr = [this.TEXT_COUNT_TYPE,this.URL_TYPE,this.CYCLE_RULE,this.TEXT_COUNT_TYPE,this.SECRET_TEXT,this.IMAGE_TYPE]
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
        let arr = [this.SECRET_TEXT,this.TEXT_COUNT_TYPE,this.URL_TYPE]
        return arr.indexOf( data ) == -1
    }
}