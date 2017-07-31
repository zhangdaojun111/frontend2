
import '../assets/scss/main.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import Login from '../components/login/login';
import {HTTP} from '../lib/http';


import WorkFlow from '../components/workflow/WorkFlow';
import WorkFlowCreate from '../components/workflow/workflow-create/workflow-create';
// import WorkFlowBtn from "../components/workflow/workflow-create/workflow-btn/workflow-btn"

let data={"data": [{"node": [{"endPoint": "LeftMiddle", "parent": "", "startPoint": "RightMiddle,TopCenter,BottomCenter", "positionleft": 120, "state": 0, "source2target": [["start1486190036888125RightMiddle", "1486190267944365LeftMiddle"]], "text": "\u53d1\u8d77\u4eba", "type": "0", "id": "start1486190036888125", "positiontop": 2000}, {"endPoint": "LeftMiddle", "parent": "", "handler_type": "0", "startPoint": "RightMiddle,TopCenter,BottomCenter", "positionleft": 220, "handler_id": "56debd2cea5f684e6ed444f2", "state": 0, "source2target": [["1486190267944365RightMiddle", "14861902674578LeftMiddle"]], "text": "\u5f20\u91d1", "isConfig": true, "type": "0", "id": "1486190267944365", "positiontop": 2000}, {"endPoint": "LeftMiddle", "parent": "", "handler_type": "0", "startPoint": "RightMiddle,TopCenter,BottomCenter", "positionleft": 320, "handler_id": "56debd29ea5f684e6ed444ea", "state": 0, "source2target": [["14861902674578RightMiddle", "maodian1490844554724375LeftMiddle"]], "text": "\u5f20\u5b66\u6210", "isConfig": true, "type": "0", "id": "14861902674578", "positiontop": 2000}, {"state": 0, "isConfig": true, "type": "2", "id": "1486190266984589", "parent": ""}, {"endPoint": "LeftMiddle", "parent": "", "startPoint": "RightMiddle,TopCenter,BottomCenter", "positionleft": 640, "state": 0, "positiontop": 2000, "text": "\u7ed3\u675f", "type": "0", "id": "end1486190036888527"}, {"endPoint": "LeftMiddle", "parent": "1486190266984589", "handler_type": "0", "startPoint": "RightMiddle,TopCenter,BottomCenter", "positionleft": 480, "handler_id": "571e1686b236eb7dcf4e6fce", "state": 0, "source2target": [["1486190292112358RightMiddle", "maodian1490844554786422LeftMiddle"]], "text": "\u6731\u5b66\u4e1c", "isConfig": true, "type": "0", "id": "1486190292112358", "positiontop": 1983.34375}, {"endPoint": "LeftMiddle", "parent": "1486190266984589", "handler_type": "0", "startPoint": "RightMiddle,TopCenter,BottomCenter", "positionleft": 480, "handler_id": "58d333b4cdd9849d506cfa8b", "state": 0, "source2target": [["1486190291248321RightMiddle", "maodian1490844554786422LeftMiddle"]], "text": "\u90d1\u6d69", "isConfig": true, "type": "0", "id": "1486190291248321", "positiontop": 2016.640625}, {"info": "\u5e76\u884c", "endPoint": "LeftMiddle", "parent": "", "startPoint": "RightMiddle,TopCenter,BottomCenter", "positionleft": 410, "state": 0, "source2target": [["maodian1490844554724375RightMiddle", "1486190292112358LeftMiddle"], ["maodian1490844554724375RightMiddle", "1486190291248321LeftMiddle"]], "text": "", "type": "0", "id": "maodian1490844554724375", "positiontop": 2005}, {"endPoint": "LeftMiddle", "parent": "", "startPoint": "RightMiddle,TopCenter,BottomCenter", "positionleft": 590, "state": 0, "source2target": [["maodian1490844554786422RightMiddle", "end1486190036888527LeftMiddle"]], "text": "", "type": "0", "id": "maodian1490844554786422", "positiontop": 2005}], "updateuser2focususer": {}, "current_user_id": "59798dd6107a73586c37f28f", "relation_page_stand_field": {}, "base_field": [], "frontendid2requiredfields": {"frontendid2fieldid": {"1486190267944365": ["4297_V2avRiMeN7XehFLh9Rshba", "5591_vidQAksvZTcv8xrXC7E76R", "367_P5Wb2tUbPPFyEF3cDYQpKa", "2640_u8NqcayjSYrdsVmYxBBobm", "833_bijHDb4pbd2nuMFpeHBfuE", "8128_aPWVZV5zFNY62yyUTzXzc6", "6943_wSD5MuisG3YYnPc7y6JwtM", "9754_Lctni6QfUvSwQHWedXrVdM", "1135_DUAcCwGMyta2czvQNe2vNk", "3669_AHW6aNZkdHTPjcSn8ZwntM", "3156_ZaZQediEFz9G7ykzBLpbmM", "7112_Mf5tX2UnnpZqyVmy9Cepjh"], "1486190292112358": ["4297_V2avRiMeN7XehFLh9Rshba", "5591_vidQAksvZTcv8xrXC7E76R", "367_P5Wb2tUbPPFyEF3cDYQpKa", "2640_u8NqcayjSYrdsVmYxBBobm", "833_bijHDb4pbd2nuMFpeHBfuE", "8128_aPWVZV5zFNY62yyUTzXzc6", "6943_wSD5MuisG3YYnPc7y6JwtM", "9754_Lctni6QfUvSwQHWedXrVdM", "1135_DUAcCwGMyta2czvQNe2vNk", "3669_AHW6aNZkdHTPjcSn8ZwntM", "3156_ZaZQediEFz9G7ykzBLpbmM", "7112_Mf5tX2UnnpZqyVmy9Cepjh"], "start1486190036888125": ["4297_V2avRiMeN7XehFLh9Rshba", "5591_vidQAksvZTcv8xrXC7E76R", "367_P5Wb2tUbPPFyEF3cDYQpKa", "2640_u8NqcayjSYrdsVmYxBBobm", "833_bijHDb4pbd2nuMFpeHBfuE", "8128_aPWVZV5zFNY62yyUTzXzc6", "6943_wSD5MuisG3YYnPc7y6JwtM", "9754_Lctni6QfUvSwQHWedXrVdM", "1135_DUAcCwGMyta2czvQNe2vNk", "3669_AHW6aNZkdHTPjcSn8ZwntM", "3156_ZaZQediEFz9G7ykzBLpbmM", "7112_Mf5tX2UnnpZqyVmy9Cepjh"], "14861902674578": ["4297_V2avRiMeN7XehFLh9Rshba", "5591_vidQAksvZTcv8xrXC7E76R", "367_P5Wb2tUbPPFyEF3cDYQpKa", "2640_u8NqcayjSYrdsVmYxBBobm", "833_bijHDb4pbd2nuMFpeHBfuE", "8128_aPWVZV5zFNY62yyUTzXzc6", "6943_wSD5MuisG3YYnPc7y6JwtM", "9754_Lctni6QfUvSwQHWedXrVdM", "1135_DUAcCwGMyta2czvQNe2vNk", "3669_AHW6aNZkdHTPjcSn8ZwntM", "3156_ZaZQediEFz9G7ykzBLpbmM", "7112_Mf5tX2UnnpZqyVmy9Cepjh"], "1486190291248321": ["4297_V2avRiMeN7XehFLh9Rshba", "5591_vidQAksvZTcv8xrXC7E76R", "367_P5Wb2tUbPPFyEF3cDYQpKa", "2640_u8NqcayjSYrdsVmYxBBobm", "833_bijHDb4pbd2nuMFpeHBfuE", "8128_aPWVZV5zFNY62yyUTzXzc6", "6943_wSD5MuisG3YYnPc7y6JwtM", "9754_Lctni6QfUvSwQHWedXrVdM", "1135_DUAcCwGMyta2czvQNe2vNk", "3669_AHW6aNZkdHTPjcSn8ZwntM", "3156_ZaZQediEFz9G7ykzBLpbmM", "7112_Mf5tX2UnnpZqyVmy9Cepjh"]}, "frontendid2field": {"1486190267944365": ["f11", "f5", "f12", "f9", "f14", "f15", "f7", "f16", "f13", "f6", "f8", "f10"], "1486190292112358": ["f11", "f5", "f12", "f9", "f14", "f15", "f7", "f16", "f13", "f6", "f8", "f10"], "start1486190036888125": ["f11", "f5", "f12", "f9", "f14", "f15", "f7", "f16", "f13", "f6", "f8", "f10"], "14861902674578": ["f11", "f5", "f12", "f9", "f14", "f15", "f7", "f16", "f13", "f6", "f8", "f10"], "1486190291248321": ["f11", "f5", "f12", "f9", "f14", "f15", "f7", "f16", "f13", "f6", "f8", "f10"]}}, "node_attachments": [], "temp_ids": [], "show_other_fields": 0, "content": "<table data-sort=\"sortDisabled\"><tbody><tr class=\"firstRow\"><td width=\"244\" valign=\"top\"><span data-id=\"4297_V2avRiMeN7XehFLh9Rshba\" style=\"border:2px\">\u7a0b\u5e8f\u6a21\u5757</span></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><label id=\"4297_V2avRiMeN7XehFLh9Rshba\" style=\"border:2px\"><input type=\"text\" data-fill-in=\"0\" style=\"box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;padding:6px 12px;border:1px solid #ccc;\" name=\"4297_V2avRiMeN7XehFLh9Rshba\" data-required=\"0\"/></label></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><span data-id=\"5591_vidQAksvZTcv8xrXC7E76R\" style=\"border:2px\">\u670d\u52a1\u5668IP</span></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><label id=\"5591_vidQAksvZTcv8xrXC7E76R\" style=\"border:2px\"><input type=\"text\" data-fill-in=\"0\" style=\"box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;padding:6px 12px;border:1px solid #ccc;\" name=\"5591_vidQAksvZTcv8xrXC7E76R\" data-required=\"0\"/></label></td></tr><tr><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><span data-id=\"367_P5Wb2tUbPPFyEF3cDYQpKa\" style=\"border:2px\">\u4ee3\u7801\u5730\u5740</span></td><td valign=\"top\" style=\"word-break: break-all;\" rowspan=\"1\" colspan=\"3\"><label id=\"367_P5Wb2tUbPPFyEF3cDYQpKa\" style=\"border:2px\"><textarea data-fill-in=\"0\" name=\"367_P5Wb2tUbPPFyEF3cDYQpKa\" style=\"width:100%;min-height:150px;vertical-align:text-top;\" data-required=\"0\"></textarea></label></td></tr><tr><td width=\"244\" valign=\"top\"><span data-id=\"2640_u8NqcayjSYrdsVmYxBBobm\" style=\"border:2px\">\u5f00\u53d1\u8d1f\u8d23\u4eba</span></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><label id=\"2640_u8NqcayjSYrdsVmYxBBobm\" style=\"border:2px\"><select data-fill-in=\"1\" style=\"box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;border:1px solid #ccc;\" name=\"2640_u8NqcayjSYrdsVmYxBBobm\" data-multiselect=\"0\" data-build-in=\"1\" data-required=\"0\"><option value=\"\">--\u8bf7\u9009\u62e9--</option></select></label></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><span data-id=\"833_bijHDb4pbd2nuMFpeHBfuE\" style=\"border:2px\">\u6d4b\u8bd5\u8d1f\u8d23\u4eba</span></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><label id=\"833_bijHDb4pbd2nuMFpeHBfuE\" style=\"border:2px\"><select data-fill-in=\"1\" style=\"box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;border:1px solid #ccc;\" name=\"833_bijHDb4pbd2nuMFpeHBfuE\" data-multiselect=\"0\" data-build-in=\"1\" data-required=\"0\"><option value=\"\">--\u8bf7\u9009\u62e9--</option></select></label></td></tr><tr><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><span data-id=\"8128_aPWVZV5zFNY62yyUTzXzc6\" style=\"border:2px\">\u5347\u7ea7\u8d1f\u8d23\u4eba</span></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><label id=\"8128_aPWVZV5zFNY62yyUTzXzc6\" style=\"border:2px\"><select data-fill-in=\"1\" style=\"box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;border:1px solid #ccc;\" name=\"8128_aPWVZV5zFNY62yyUTzXzc6\" data-multiselect=\"0\" data-build-in=\"1\" data-required=\"0\"><option value=\"\">--\u8bf7\u9009\u62e9--</option></select></label></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><br/></td><td width=\"244\" valign=\"top\"><br/></td></tr><tr><td width=\"244\" valign=\"top\"><span data-id=\"6943_wSD5MuisG3YYnPc7y6JwtM\" style=\"border:2px\">\u6d4b\u8bd5\u5468\u671f</span></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><label id=\"6943_wSD5MuisG3YYnPc7y6JwtM\" style=\"border:2px\"><input type=\"text\" data-fill-in=\"0\" style=\"box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;padding:6px 12px;border:1px solid #ccc;\" name=\"6943_wSD5MuisG3YYnPc7y6JwtM\" data-required=\"0\"/></label></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><span data-id=\"9754_Lctni6QfUvSwQHWedXrVdM\" style=\"border:2px\">\u5347\u7ea7\u65f6\u95f4</span></td><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><label id=\"9754_Lctni6QfUvSwQHWedXrVdM\" style=\"border:2px\"><input data-fill-in=\"0\" data-reg=\"{}\" type=\"text\" style=\"box-sizing:border-box;width:240px;height:34px;line-height:34px;border-radius:5px;padding:6px 12px;border:1px solid #ccc;\" class=\"laydate-icon init_date\" name=\"9754_Lctni6QfUvSwQHWedXrVdM\" data-required=\"0\"/></label></td></tr><tr><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><span data-id=\"1135_DUAcCwGMyta2czvQNe2vNk\" style=\"border:2px\">\u5347\u7ea7\u539f\u56e0</span></td><td valign=\"top\" style=\"word-break: break-all;\" rowspan=\"1\" colspan=\"3\"><label id=\"1135_DUAcCwGMyta2czvQNe2vNk\" style=\"border:2px\"><textarea data-fill-in=\"0\" name=\"1135_DUAcCwGMyta2czvQNe2vNk\" style=\"width:100%;min-height:150px;vertical-align:text-top;\" data-required=\"0\"></textarea></label></td></tr><tr><td width=\"244\" valign=\"top\"><span data-id=\"3669_AHW6aNZkdHTPjcSn8ZwntM\" style=\"border:2px\">\u5347\u7ea7\u64cd\u4f5c\u6b65\u9aa4</span></td><td valign=\"top\" rowspan=\"1\" colspan=\"3\" style=\"word-break: break-all;\"><label id=\"3669_AHW6aNZkdHTPjcSn8ZwntM\" style=\"border:2px\"><textarea data-fill-in=\"0\" name=\"3669_AHW6aNZkdHTPjcSn8ZwntM\" style=\"width:100%;min-height:150px;vertical-align:text-top;\" data-required=\"0\"></textarea></label></td></tr><tr><td width=\"244\" valign=\"top\"><span data-id=\"3156_ZaZQediEFz9G7ykzBLpbmM\" style=\"border:2px\">\u5347\u7ea7\u662f\u5426\u6210\u529f\u7684\u5224\u5b9a\u6807\u51c6</span></td><td valign=\"top\" rowspan=\"1\" colspan=\"3\" style=\"word-break: break-all;\"><label id=\"3156_ZaZQediEFz9G7ykzBLpbmM\" style=\"border:2px\"><textarea data-fill-in=\"0\" name=\"3156_ZaZQediEFz9G7ykzBLpbmM\" style=\"width:100%;min-height:150px;vertical-align:text-top;\" data-required=\"0\"></textarea></label></td></tr><tr><td width=\"244\" valign=\"top\" style=\"word-break: break-all;\"><span data-id=\"7112_Mf5tX2UnnpZqyVmy9Cepjh\" style=\"border:2px\">\u6545\u969c\u56de\u6eda\u65b9\u6848</span></td><td valign=\"top\" rowspan=\"1\" colspan=\"3\" style=\"word-break: break-all;\"><label id=\"7112_Mf5tX2UnnpZqyVmy9Cepjh\" style=\"border:2px\"><textarea data-fill-in=\"0\" name=\"7112_Mf5tX2UnnpZqyVmy9Cepjh\" style=\"width:100%;min-height:150px;vertical-align:text-top;\" data-required=\"0\"></textarea></label></td></tr></tbody></table><p><br/></p>", "relation_page_to_page": {}, "stamps": [], "table_id": "4001_AggkcxSrKwLrXptWL9iKFg", "exclude_field": [], "frontendid2eventname": {}, "node_width": "60", "id": 252, "approve_any": 0}], "success": 1, "error": ""};

let workFlow = new WorkFlow(data);

let workFlowcreate = new WorkFlowCreate();


// let WorkFlowmain = new WorkFlowMain();


$('#workflow').on('click','#draw',function(){
    workFlow.drawWorkFlow();
})


$('#workflow').on('click','#zoomIn',function(){
    workFlow.zoomInNodeflow();
})

$('#workflow').on('click','#zoomOut',function(){
    workFlow.zoomOutNodeflow();
})

$('#workflow').on('click','#newWin',function(){
    workFlow.maximizeNodeflow();
})

workFlowcreate.render($('#workflow-create'));

workFlow.render($('#workflow'));
// WorkFlowmain.render($('#workflowMain'));

