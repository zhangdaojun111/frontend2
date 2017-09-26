import {HTTP} from '../../lib/http';
import msgbox from '../../lib/msgbox';

export const FormService = {
    //子表内置父表的id集合（前端填充）tableid : ids
    idsInChildTableToParent: {},
    //父表的this.form.value
    frontendParentFormValue: [],
    //父表子表关系
    frontendRelation: [],
    //父表的this.newData
    frontendParentNewData: {},

    selectObj: {'select': 'options', 'radio': 'group', 'multi-select': 'options'},
    continue_key: ["parent_real_id", "parent_table_id", "parent_temp_id", "real_id", "table_id", "temp_id"],
    need_key: ["id", "dfield", "effect", "expression", "dinput_type", "real_type"],
    dataSelectFrom: {
        "Radio": "group",      //"field_content",无序
        "Select": "options",
        "MultiSelect": "options",
        "Buildin": "options",
        // "Year": "options",
        "MultiLinkage": "dataList",
        "SettingTextarea": "settingTextarea"
    },

    /**
     *  组装子表所需列表或表单中内置或相关的父表中数据
     *  @param kvDict 父子数据字段对应的关系 {f1: f2 ,temp_id:section_page_id }
     *  @param formDataFromParent 父表中填写的数据
     *  @param frontendParentTableId父表id
     */
    packageParentDataForChildData(kvDict, formDataFromParent, frontendParentTableId) {
        let result = {};
        for (let key in kvDict) {
            //父表dfield已经填写的value
            let val;
            //父表的this.newData
            let newDataFromParent = this.frontendParentNewData[frontendParentTableId];
            //父表类型
            if (newDataFromParent.hasOwnProperty(key)) {
                let type = newDataFromParent[key]["type"];
                if (key != "temp_id" && key != "real_id") {
                    //要填充的value
                    val = formDataFromParent[key];
                    //判断父表类型
                    if (type == 'select' || type == 'buildin') {
                        for (var k in newDataFromParent[key]["options"]) {
                            if (newDataFromParent[key]["options"][k]["value"] == val) {
                                val = newDataFromParent[key]["options"][k]["label"];
                                break;
                            }
                        }
                    } else if (type == 'radio') {
                        for (var k in newDataFromParent[key]["group"]) {
                            if (newDataFromParent[key]["group"][k]["value"] == val) {
                                val = newDataFromParent[key]["group"][k]["label"];
                                break;
                            }
                        }
                    } else if (type == 'multi-select') {
                        let resultVal = '';
                        for (let v of val) {
                            for (var k in newDataFromParent[key]["options"]) {
                                if (newDataFromParent[key]["options"][k]["value"] == v) {
                                    resultVal = resultVal + newDataFromParent[key]["options"][k]["label"] + '，';
                                    break;
                                }
                            }
                        }
                        val = resultVal.substr(0, resultVal.length - 1);
                    }
                } else {
                    val = formDataFromParent[key];
                }
                result[key] = val;
            }
        }
        return result;
    },

    //获取统计数据
    getCountData(json) {
        let res = HTTP.post('get_count_data', json);
        HTTP.flush();
        return res;
    },
    get_exp_value(eval_exps) {
        let res = HTTP.post('eval_exp_fun', eval_exps);
        HTTP.flush();
        return res;
    },
    //获取默认值数据
    getDefaultValue(json) {
        let res = HTTP.post('get_workflow_default_values', json);
        HTTP.flush();
        return res;
    },
    //获取相关数据
    getAboutData(json) {
        let res = HTTP.post('get_about_data', json);
        HTTP.flush();
        return res;
    },
    execFieldPlugin(json) {
        let res = HTTP.post('exec_field_plugin', json);
        HTTP.flush();
        return res;
    },
    //获取表单参数
    getPrepareParmas(json) {
        let res = HTTP.post('prepare_params', json);
        HTTP.flush();
        return res;
    },

    //身份证验证
    checkCard(card) {
        let result = true;
        //校验长度，类型
        if (isCardNo(card) === false) {
            result = false;
        }
        //检查省份
        if (checkProvince(card) === false) {
            result = false;
        }
        //校验生日
        if (checkBirthday(card) === false) {
            result = false;
        }
        //检验位的检测
        if (checkParity(card) === false) {
            result = false;
        }

        return result;

        //检查号码是否符合规范，包括长度，类型
        function isCardNo(card) {
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
            if (reg.test(card) === false) {
                return false;
            }
            return true;
        }

        //检验省份
        function checkProvince(card) {
            const vcity = {
                11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
                21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
                33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
                42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
                51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
                63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
            };
            var province = card.substr(0, 2);
            if (vcity[province] == undefined) {
                return false;
            }
            return true;
        }

        //检查生日是否正确
        function checkBirthday(card) {
            var len = card.length;
            //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
            if (len == '15') {
                var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                var arr_data = card.match(re_fifteen);
                var year = arr_data[2];
                var month = arr_data[3];
                var day = arr_data[4];
                var birthday = new Date('19' + year + '/' + month + '/' + day);
                return verifyBirthday('19' + year, month, day, birthday);
            }
            //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
            if (len == '18') {
                var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                var arr_data = card.match(re_eighteen);
                var year = arr_data[2];
                var month = arr_data[3];
                var day = arr_data[4];
                var birthday = new Date(year + '/' + month + '/' + day);
                return verifyBirthday(year, month, day, birthday);
            }
            return false;
        }

        //校验日期
        function verifyBirthday(year, month, day, birthday) {
            var now = new Date();
            var now_year = now.getFullYear();
            //年月日是否合理
            if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
                //判断年份的范围（3岁到100岁之间)
                var time = now_year - year;
                if (time >= 3 && time <= 100) {
                    return true;
                }
                return false;
            }
            return false;
        }

        //校验位的检测
        function checkParity(card) {
            //15位转18位
            card = changeFivteenToEighteen(card);
            var len = card.length;
            if (len == '18') {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var cardTemp = 0, i, valnum;
                for (i = 0; i < 17; i++) {
                    cardTemp += card.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[cardTemp % 11];
                if (valnum == card.substr(17, 1)) {
                    return true;
                }
                return false;
            }
            return false;
        }

        //15位转18位身份证号
        function changeFivteenToEighteen(card) {
            if (card.length == '15') {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var cardTemp = 0, i;
                card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
                for (i = 0; i < 17; i++) {
                    cardTemp += card.substr(i, 1) * arrInt[i];
                }
                card += arrCh[cardTemp % 11];
                return card;
            }
            return card;
        }

    },
    //验证组织机构合法性方法（因为原始方法的false是合法，true是不合法。所以return的时候，要取反）
    orgcodevalidate(value) {
        if (value != "") {
            var values = value.split("-");
            var ws = [3, 7, 9, 10, 5, 8, 4, 2];
            var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var reg = /^([0-9A-Z]){8}$/;
            if (!reg.test(values[0])) {
                return false;
            }
            var sum = 0;
            for (var i = 0; i < 8; i++) {
                sum += str.indexOf(values[0].charAt(i)) * ws[i];
            }
            var C9 = 11 - (sum % 11);
            var YC9 = values[1] + '';
            if (C9 == 11) {
                C9 = '0';
            } else if (C9 == 10) {
                C9 = 'X';
            } else {
                C9 = C9 + '';
            }
            var result = (YC9 != C9);
            return !result;
        }
    },
    //小写转大写
    xxzdx(n) {
        //由于已经在输入框检测了是否为数字，所以在此不检测是否为纯数字1234
        var unit = "仟佰拾亿仟佰拾万仟佰拾点  ", str = "";
        n += "00";
        var p = n.indexOf('.');
        //截取小数点前面的数字
        if (p >= 0) {
            n = n.substring(0, p) + n.substr(p + 1, 2);
        }
        //将unit截取到当前数字的位数，改算法最大支持到9999亿
        unit = unit.substr(unit.length - n.length);
        //判断第i个数字的大小，并且从零壹贰叁肆伍陆柒捌玖中获取到与之数值对应的汉字，并且和位数拼接
        for (var i = 0; i < n.length; i++) {
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        }
        //从最后一个判断汉子是"零"，空，或者“点”
        while (str.charAt(str.length - 1) == "零" || str.charAt(str.length - 1) == " " || str.charAt(str.length - 1) == "点") {
            str = str.replace(/ $/g, "")
                .replace(/零$/g, "")
                .replace(/点$/g, "")
        }
        return str.replace(/零(仟|佰|拾|角)/g, "零")
            .replace(/(零)+/g, "零")
            .replace(/零(万|亿|元)/g, "$1")
            .replace(/(亿)万|(拾)/g, "$1$2")
            .replace(/^壹拾/g, "拾")
            .replace(/^元零?|零分/g, "")
            .replace(/零$/g, "")
            .replace(/ /g, "");
    },
    //条件表达式
    tjbds(expression) {
        let exp;
        if (typeof expression === 'string') {
            exp = JSON.parse(expression);
        }
        let else_data;
        for (let i in exp) {
            for (let j in exp[i]) {
                if (j != "else") {
                    //解析 and -> &&  or -> ||
                    if (eval(j.replace("and", "&&").replace("or", "||"))) {
                        return eval(exp[i][j])
                    }
                } else {
                    else_data = eval(exp[i][j]);
                }
            }
        }
        return else_data
    },
    //计算时间
    jssj(expression) {
        let tianshu = expression / 1000 / 3600 / 24;
        return tianshu.toFixed(1).toString();
    },
    //获取当前时间
    dqsj() {
        return new Date().getTime();
    },
    //返回yyyy-mm-dd
    getNowDate() {
        let v = new Date();
        let y = v.getFullYear().toString();
        let m = (v.getMonth() + 1).toString();
        let d = v.getDate().toString();
        if (m.length == 1) {
            m = "0" + m;
        }
        if (d.length == 1) {
            d = "0" + d;
        }
        return y + '-' + m + '-' + d;
    },
    //@function(fun_ghl_dqrq) start
    /**
     *@frontend param:{"fun_type": 2, "is_system": 1, "name": "\u5f53\u524d\u65e5\u671f", "fun_str": "<p>fun_ghl_dqrq() {</p><p>&nbsp; &nbsp; &nbsp; &nbsp; let v = new Date();</p><p>&nbsp; &nbsp; &nbsp; &nbsp; let y = v.getFullYear().toString();</p><p>&nbsp; &nbsp; &nbsp; &nbsp; let m = (v.getMonth() + 1).toString();</p><p>&nbsp; &nbsp; &nbsp; &nbsp; let d = v.getDate().toString();</p><p>&nbsp; &nbsp; &nbsp; &nbsp; if(m.length==1){</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; m = &quot;0&quot;+m;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; }</p><p>&nbsp; &nbsp; &nbsp; &nbsp; if(d.length==1){</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; d = &quot;0&quot;+d;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; }</p><p>&nbsp; &nbsp; &nbsp; &nbsp; return y + &#39;-&#39; + m + &#39;-&#39; + d;</p><p>&nbsp; &nbsp; }</p><p><br/></p>", "eval_name": "fun_ghl_dqrq", "fun_node": "\u83b7\u53d6\u5f53\u524d\u65e5\u671f \u683c\u5f0f\u4e3a\u201cyyyy-mm-dd\u201d", "is_sys": 0, "fun_code": "fun_ghl_dqrq() {\n        let v = new Date();\n        let y = v.getFullYear().toString();\n        let m = (v.getMonth() + 1).toString();\n        let d = v.getDate().toString();\n        if(m.length==1){\n            m = \"0\"+m;\n        }\n        if(d.length==1){\n            d = \"0\"+d;\n        }\n        return y + '-' + m + '-' + d;\n    }\n\n"}
     *@函数说明:获取当前日期 格式为“yyyy-mm-dd”
     */
    fun_ghl_dqrq() {
        let v = new Date();
        let y = v.getFullYear().toString();
        let m = (v.getMonth() + 1).toString();
        let d = v.getDate().toString();
        if (m.length == 1) {
            m = "0" + m;
        }
        if (d.length == 1) {
            d = "0" + d;
        }
        return y + '-' + m + '-' + d;
    },
    //@function(fun_ghl_dqrq) end
    //@function(fun_ghl_xxzdx) start
    /**
     *@frontend param:{"fun_type": 0, "is_system": 1, "name": "\u5c0f\u5199\u8f6c\u5927\u5199", "fun_str": "<p>fun_ghl_xxzdx(num, fenwei) {</p><p>&nbsp; var strOutput = &quot;&quot;;</p><p>&nbsp; var strUnit = &#39;\u4edf\u4f70\u62fe\u4ebf\u4edf\u4f70\u62fe\u4e07\u4edf\u4f70\u62fe\u5143\u89d2\u5206&#39;;</p><p>&nbsp; num += &quot;00&quot;+fenwei;</p><p>&nbsp; var intPos = num.indexOf(&#39;.&#39;);</p><p>&nbsp; if (intPos &gt;= 0)</p><p>&nbsp; &nbsp; num = num.substring(0, intPos) + num.substr(intPos + 1, 2);</p><p>&nbsp; strUnit = strUnit.substr(strUnit.length - num.length);</p><p>&nbsp; for (var i=0; i &lt; num.length; i++)</p><p>&nbsp; &nbsp; strOutput += &#39;\u96f6\u58f9\u8d30\u53c1\u8086\u4f0d\u9646\u67d2\u634c\u7396&#39;.substr(num.substr(i,1),1) + strUnit.substr(i,1);</p><p>&nbsp; &nbsp; return strOutput.replace(/\u96f6\u89d2\u96f6\u5206$/, &#39;\u6574&#39;).replace(/\u96f6[\u4edf\u4f70\u62fe]/g, &#39;\u96f6&#39;).replace(/\u96f6{2,}/g, &#39;\u96f6&#39;).replace(/\u96f6([\u4ebf|\u4e07])/g, &#39;$1&#39;).replace(/\u96f6+\u5143/, &#39;\u5143&#39;).replace(/\u4ebf\u96f6{0,3}\u4e07/, &#39;\u4ebf&#39;).replace(/^\u5143/, &quot;\u96f6\u5143&quot;);</p><p>};</p><p><br/></p>", "eval_name": "fun_ghl_xxzdx", "fun_node": "\u91d1\u878d\u7c7b\u7684\u5c0f\u5199\u8f6c\u5927\u5199\uff1a\n*\u5217\uff1axxzdx(p1,p2) \u53c2\u6570\u4e3a\u4e24\u4e2ap1\u4e3a\u8981\u8f6c\u5927\u5199\u7684\u6570\u5b57\uff0cp2\u4e3a\u5206\u4f4d\n*xxzdx(1, \u201c0000\u201d) \u7ed3\u679c\u4e3a\u58f9\u4e07\n", "is_sys": 0, "fun_code": "fun_ghl_xxzdx(num, fenwei) {\n  var strOutput = \"\";\n  var strUnit = '\u4edf\u4f70\u62fe\u4ebf\u4edf\u4f70\u62fe\u4e07\u4edf\u4f70\u62fe\u5143\u89d2\u5206';\n  num += \"00\"+fenwei;\n  var intPos = num.indexOf('.');\n  if (intPos >= 0)\n    num = num.substring(0, intPos) + num.substr(intPos + 1, 2);\n  strUnit = strUnit.substr(strUnit.length - num.length);\n  for (var i=0; i < num.length; i++)\n    strOutput += '\u96f6\u58f9\u8d30\u53c1\u8086\u4f0d\u9646\u67d2\u634c\u7396'.substr(num.substr(i,1),1) + strUnit.substr(i,1);\n    return strOutput.replace(/\u96f6\u89d2\u96f6\u5206$/, '\u6574').replace(/\u96f6[\u4edf\u4f70\u62fe]/g, '\u96f6').replace(/\u96f6{2,}/g, '\u96f6').replace(/\u96f6([\u4ebf|\u4e07])/g, '$1').replace(/\u96f6+\u5143/, '\u5143').replace(/\u4ebf\u96f6{0,3}\u4e07/, '\u4ebf').replace(/^\u5143/, \"\u96f6\u5143\");\n};\n\n"}
     *@函数说明:金融类的小写转大写：
     *列：xxzdx(p1,p2) 参数为两个p1为要转大写的数字，p2为分位
     *xxzdx(1, “0000”) 结果为壹万
     */
    fun_ghl_xxzdx(num, fenwei) {
        var strOutput = "";
        var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
        num = (1 + fenwei) * num;
        num += "00";
        var intPos = num.indexOf('.');
        if (intPos >= 0)
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (var i = 0; i < num.length; i++)
            strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
        return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    },
    //@function(fun_ghl_xxzdx) end
    //@function(fun_ghl_dqsj) start
    /**
     *@frontend param:{"fun_type": 2, "is_system": 1, "name": "\u5f53\u524d\u65e5\u671f\u65f6\u95f4", "fun_str": "<p>fun_ghl_dqsj() {</p><p>&nbsp;&nbsp;&nbsp;&nbsp;let v = new Date();</p><p>&nbsp;&nbsp;&nbsp;&nbsp;let y = v.getFullYear().toString();</p><p>&nbsp;&nbsp;&nbsp;&nbsp;let m = (v.getMonth() + 1).toString();</p><p>&nbsp;&nbsp;&nbsp;&nbsp;let d = v.getDate().toString();</p><p>&nbsp;&nbsp;&nbsp;&nbsp;let H = v.getHours().toString();<br/></p><p>&nbsp;&nbsp;&nbsp;&nbsp;let M = v.getMinutes().toString();</p><p>&nbsp;&nbsp;&nbsp;&nbsp;let S = v.getSeconds().toString();</p><p>&nbsp; &nbsp; &nbsp; &nbsp; if(m.length==1){</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; m = &quot;0&quot;+m;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; }</p><p>&nbsp; &nbsp; &nbsp; &nbsp; if(d.length==1){</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; d = &quot;0&quot;+d;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; }</p><p>&nbsp; &nbsp; &nbsp; &nbsp; return y+&#39;-&#39;+m+&#39;-&#39;+d+&quot; &quot;+H+&#39;:&#39;+M+&#39;:&#39;+S;</p><p>&nbsp; &nbsp; }</p><p><br/></p>", "eval_name": "fun_ghl_dqsj", "fun_node": "\u5f53\u524d\u65f6\u95f4 \u683c\u5f0f\u4e3ayyyy-mm-dd HH:MM:SS", "is_sys": 0, "fun_code": "fun_ghl_dqsj() {\n    let v = new Date();\n    let y = v.getFullYear().toString();\n    let m = (v.getMonth() + 1).toString();\n    let d = v.getDate().toString();\n    let H = v.getHours().toString();\n    let M = v.getMinutes().toString();\n    let S = v.getSeconds().toString();\n        if(m.length==1){\n            m = \"0\"+m;\n        }\n        if(d.length==1){\n            d = \"0\"+d;\n        }\n        return y+'-'+m+'-'+d+\" \"+H+':'+M+':'+S;\n    }\n\n"}
     *@函数说明:当前时间 格式为yyyy-mm-dd HH:MM:SS
     */
    fun_ghl_dqsj() {
        let v = new Date();
        let y = v.getFullYear().toString();
        let m = (v.getMonth() + 1).toString();
        let d = v.getDate().toString();
        let H = v.getHours().toString();
        let M = v.getMinutes().toString();
        let S = v.getSeconds().toString();
        if (m.length == 1) {
            m = "0" + m;
        }
        if (d.length == 1) {
            d = "0" + d;
        }
        return y + '-' + m + '-' + d + " " + H + ':' + M + ':' + S;
    },
    //@function(fun_ghl_dqsj) end

    //获取列头信息待删除
    getColumnList(id) {
        let res = HTTP.get('get_column_list', {table_id: id});
        HTTP.flush();
        return res;
    },
    //获取手绘表单str
    getFormContent(json) {
        let res = HTTP.post('get_form_content', json);
        // HTTP.flush();
        return res;
    },
    //获取选择器数据
    searchByChooser(json) {
        let res = HTTP.post('selector', json);
        HTTP.flush();
        return res;
    },
    //保存表单
    saveAddpageData(json) {
        let res = HTTP.post('add_update_table_data', json);
        HTTP.flush();
        return res;
    },
    //表达式后台计算
    expEffect(json) {
        let res = HTTP.post('eval_exp_fun', json);
        HTTP.flush();
        return res;
    },
    //获取系统表单配置
    getSysConfig() {
        let res = HTTP.get('sysConfig');
        HTTP.flush();
        return res;
    },
    //获取用户打印页眉偏好
    getPrintSetting() {
        let res = HTTP.post('user_preference', {action: 'get', pre_type: 0});
        HTTP.flush();
        return res;
    },
    //获取表单数据
    getFormData(json) {
        let res;
        if (json['form_id']) {
            res = Promise.all([this.getStaticDataImmediately(json), this.getDynamicData(json), this.getFormContent({form_id: json['form_id']})]);
        }
        else {
            res = Promise.all([this.getStaticDataImmediately(json), this.getDynamicData(json)]);
        }
        HTTP.flush();
        return res;
    },
    //获取表单静态数据
    getStaticData(json) {
        return HTTP.post('get_form_static_data', json)
    },
    //获取表单动态数据
    getDynamicData(json) {
        return HTTP.post('get_form_dynamic_data', json)
    },
    //立即获得表单静态数据
    getStaticDataImmediately(json) {
        let res = HTTP.postImmediately({url:'/get_form_static_data/', data:json});
        return res;
    },
    //立即获得表单动态数据
    getDynamicDataImmediately(json) {
        let res = HTTP.post('get_form_dynamic_data',json);
        HTTP.flush();
        return res;
    },
    uploadAttachment(url, json, processCallback, successCallback,errorCallback) {
        HTTP.ajaxImmediately({
            type: "POST",
            url: url,
            data: json,
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', processCallback, false);
                }
                return myXhr;
            },
            success: function (data) {
                successCallback(data);
            },
            error: function (error) {
                msgbox.alert(error);
                if(errorCallback){
                    errorCallback(error);
                }
            },
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        })
    },
    deleteUploaded(json) {
        return HTTP.postImmediately('/delete_attachment/', json);
    },
    getAttachment(json) {
        let res = HTTP.post('query_attachment_list', json);
        HTTP.flush();
        return res;
    },
    getThumbnails(json) {
        let res = HTTP.post('get_thumbnails', json);
        HTTP.flush();
        return res;
    },

    //重新拼装下拉框格式
    //multiBuildType 特殊多选内置分支判断
    //multi 是否多选
    createSelectJson(json, multi, multiBuildType) {
        let data = {list: [], choosed: []};
        if (json.is_view) {
            data['editable'] = false;
        } else {
            data['editable'] = true;
        }
        data['width'] = json['width'];
        let options;
        if (multiBuildType && multiBuildType == 1) {
            options = json.is_view ? json.isViewOptions : (json.options2 || json.options);
        } else {
            options = json['options'];
        }
        if (options.length > 0 && options[0]['value'] == '') {
            options.shift();
        }
        for (let key in options) {
            if (json['value']) {
                if (multi && json['value'].length > 0) {
                    for (let i in json['value']) {
                        if (json['value'][i] == options[key]['value']) {
                            data.choosed.push({
                                id: options[key]['value'] || '',
                                name: options[key]['label'] || '',
                            });
                        }
                    }
                } else if (json['value'] == options[key]['value']) {
                    data.choosed.push({
                        id: options[key]['value'] || '',
                        name: options[key]['label'] || '',
                    });
                }
            }
            data.list.push({
                id: options[key]['value'] || '',
                name: options[key]['label'] || '',
                py: _.isArray(options[key]['py']) ? options[key]['py'].join(',') : '',
            });
        }
        data.multiSelect = multi ? true : false;
        return data;
    }
}
