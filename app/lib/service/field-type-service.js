//与后台数据的字段类型对应

//dtype
const TEXT_TYPE = "0";//文本
const NUMBER_TYPE = "1";//数字
const ATTACHMENT_TYPE = "2";//附件
const ABOUT_TYPE = "3";//相关
const SELECT_TYPE = "4";//选择
const BUILD_IN = "5";//内置
const MULTI_BUILD_IN = "6";//多级内置
const CHILD_TABLE_TYPE = "7";//子表
const EXPRESSION_TYPE = "8";//表达式
const MULTI_INDEX_TYPE = "9";//多级索引类型
const QUERY_COUNT_TYPE = "10";//统计类型
const CORRESPONDENCE_TYPE = "11";//对应关系
const ABOUT_RELATION_TYPE = "12";//相关关系
const REPRESENT_TYPE = "13";//代表字段类型
const MULTI_CHOICE_BUILD_IN = "14";//多选内置
const VBA_TYPE = "15";//VBA
const TABLE_COUNT_TYPE = "16";//表级统计字段
const EDIT_CONTROL_TYPE = "17";//合同编辑器

//dinput_type||real_type
const TEXT = "0";//文本框
const TEXTAREA = "1";//文本区
const UEDITOR = "2";//富文本编辑器
const DATE = "3";//日期框
const TIME = "4";//时间框
const DATETIME = "5";//日期时间框
const SELECT = "6";//下拉框
const SINGLE_SELECT = "7";//单选框
const MULTI_SELECT = "8";//复选框
const ATTACHMENT = "9";//附件
const FLOAT_TYPE = "10";//小数
const INT_TYPE = "11";//整数
const YEAR = "12";//年份框
const NORMAL_CHILD = "13";//普通子表字段
const INCREMENT_NUMBER = "14";//自增编号
const QUERY_COUNT = "15";//统计查询
const CORRESPONDENCE = "16";//表对应关系
const ABOUT_RELATION = "17";//相关对应关系
const CHILD_TABLE = "18";//子表设置
const REPRESENT = "19";//代表字段
const TERM_EXPRESSION = "20";//条件表达式
const NORMAL_EXPRESSION = "21";//普通表达式
const SURFACE_EXPRESSION = "22";//前端表达式
const IMAGE_TYPE = "23";//图片专用附件（jpg、png、gif、TIFF）
const TABLE_COUNT = "24";//表级统计类型
const SECRET_TEXT = "25";//加密文本
const DECIMAL_TYPE = "26";//大数（decimal）
const CYCLE_RULE = "27";//周期规则
const URL_TYPE = "29";//地址类型
const YEAR_MONTH_TYPE = "30";//只显示年月的下拉框
const EMAIL_TYPE = "31"
const ACCOUNT_CODE = "32"
const VIDEO_TYPE = "33"
const TEXT_COUNT_TYPE = "34"//合同编辑器
const EDIT_CONTROL = "35"

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
    numOrText: function (data) {//(数字或者文本)用real_type判断
        return data == FLOAT_TYPE || data == INT_TYPE || data == CORRESPONDENCE
    },
    childTable: function (data) {//子表
        return data == NORMAL_CHILD
    },
    countTable: function (data) {//统计
        return data == QUERY_COUNT || data == TABLE_COUNT
    },
    editControlTable: function (data) {//高级跳转字段
        return data == EDIT_CONTROL
    },
    noToolTips: function (data) {//dataGrid中没有toolTips
        let arr = [IMAGE_TYPE,UEDITOR,TEXT_COUNT_TYPE,CYCLE_RULE,SECRET_TEXT]
        return arr.indexOf( data ) != -1
    }
}