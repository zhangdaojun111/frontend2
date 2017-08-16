import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './global-search.scss';
import template from './global-search.html';
import {GlobalService} from  '../../../services/main/globalService';
import Mediator from '../../../lib/mediator';
import {UserInfoService} from "../../../services/main/userInfoService"
import msgbox from "../../../lib/msgbox";
import {SearchBar} from './search-bar/search-bar';


let config ={
    template:template,
    data:{
        historyList:[{
            content:"test1",
            index:"0",
            py:"test1",
            display:"true",
        },{
            content:"test2",
            index:"1",
            py:"test2",
            display:"true",
        },{
            content:"test3",
            index:"2",
            py:"test3",
            display:"true",
        },{
            content:"test4",
            index:"3",
            py:"test4",
            display:"true",
        }],
        test_data_result:{"total": 19, "result": [{"ts_name": "", "count": 0, "name_py": "grrb", "row_num": 3515, "table_id": "1190_WsuRDjEJ9R6vHcHuR8hMzZ", "folder_id": 252, "company_name": "rzrk", "namespace": "standard", "id": "1190_WsuRDjEJ9R6vHcHuR8hMzZ", "label": "\u4e2a\u4eba\u65e5\u62a5"}, {"ts_name": "", "count": 0, "name_py": "SAPqx", "row_num": 2164, "table_id": "5613_CHEUbzmZMsjDFT3AiwPB46", "folder_id": 100, "company_name": "rzrk", "namespace": "standard", "id": "5613_CHEUbzmZMsjDFT3AiwPB46", "label": "SAP\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xsBuggl", "row_num": 250, "table_id": "9233_m6GFUdno6HBvXzXsEiB2cn", "folder_id": 90, "company_name": "rzrk", "namespace": "standard", "id": "9233_m6GFUdno6HBvXzXsEiB2cn", "label": "\u7ebf\u4e0aBug\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "xtgzqsxtqx", "row_num": 231, "table_id": "7962_xCgeDKXmMXYHvzGBDajHAP", "folder_id": 99, "company_name": "rzrk", "namespace": "standard", "id": "7962_xCgeDKXmMXYHvzGBDajHAP", "label": "\u8fc5\u6295\u4f30\u503c\u6e05\u7b97\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xmjhmx", "row_num": 184, "table_id": "771_uNRGnuYfkrjAfE4eH7cpzD", "folder_id": 89, "company_name": "rzrk", "namespace": "standard", "id": "771_uNRGnuYfkrjAfE4eH7cpzD", "label": "\u9879\u76ee\u8ba1\u5212\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xttzjyxtqx", "row_num": 176, "table_id": "3790_NwsLTLfYZrgYvkyfnw2otN", "folder_id": 96, "company_name": "rzrk", "namespace": "standard", "id": "3790_NwsLTLfYZrgYvkyfnw2otN", "label": "\u8fc5\u6295\u6295\u8d44\u4ea4\u6613\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "bjkq", "row_num": 157, "table_id": "8924_YrawF4zecr4e9ZHgU6aNoS", "folder_id": 249, "company_name": "rzrk", "namespace": "standard", "id": "8924_YrawF4zecr4e9ZHgU6aNoS", "label": "\u5317\u4eac\u8003\u52e4"}, {"ts_name": "", "count": 0, "name_py": "xtjgjyxtqx", "row_num": 121, "table_id": "9844_LF7p29NigQvFE43fuTQMGP", "folder_id": 102, "company_name": "rzrk", "namespace": "standard", "id": "9844_LF7p29NigQvFE43fuTQMGP", "label": "\u8fc5\u6295\u673a\u6784\u4ea4\u6613\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xtmxptqx", "row_num": 97, "table_id": "4402_2TTVdex3Xe2v5DjHWuMVXF", "folder_id": 98, "company_name": "rzrk", "namespace": "standard", "id": "4402_2TTVdex3Xe2v5DjHWuMVXF", "label": "\u8fc5\u6295\u6a21\u578b\u5e73\u53f0\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xtzhglxtqx", "row_num": 22, "table_id": "9578_6fJrcK6tcj7Nv6oCovE7vF", "folder_id": 363, "company_name": "rzrk", "namespace": "standard", "id": "9578_6fJrcK6tcj7Nv6oCovE7vF", "label": "\u8fc5\u6295\u7efc\u5408\u7ba1\u7406\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "qxsqjlb", "row_num": 16, "table_id": "6771_gJL2KhEvCv8h67ZodMXVH2", "folder_id": 22, "company_name": "rzrk", "namespace": "standard", "id": "6771_gJL2KhEvCv8h67ZodMXVH2", "label": "\u6743\u9650\u7533\u8bf7\u8bb0\u5f55\u8868"}, {"ts_name": "", "count": 0, "name_py": "qjgl", "row_num": 16, "table_id": "8462_Zcer5GV7egyKF2TCGUfkn9", "folder_id": 17, "company_name": "rzrk", "namespace": "standard", "id": "8462_Zcer5GV7egyKF2TCGUfkn9", "label": "\u8bf7\u5047\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "nbxqqr", "row_num": 5, "table_id": "8303_nXzZ8MApkZGKKTgyipch6E", "folder_id": 91, "company_name": "rzrk", "namespace": "standard", "id": "8303_nXzZ8MApkZGKKTgyipch6E", "label": "\u5185\u90e8\u9700\u6c42\u786e\u8ba4"}, {"ts_name": "", "count": 0, "name_py": "dddcmx", "row_num": 4, "table_id": "4978_RGU4hJp6cBGPHkxZxCMTEh", "folder_id": 325, "company_name": "rzrk", "namespace": "standard", "id": "4978_RGU4hJp6cBGPHkxZxCMTEh", "label": "\u6ef4\u6ef4\u6253\u8f66\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xtgtxtqx", "row_num": 3, "table_id": "6228_iGVzG7supQSx485gXTfUKF", "folder_id": 103, "company_name": "rzrk", "namespace": "standard", "id": "6228_iGVzG7supQSx485gXTfUKF", "label": "\u8fc5\u6295\u67dc\u53f0\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "SAPbfjl", "row_num": 1, "table_id": "1560_hv7qdJS4MLHbiDdWQp7HpC", "folder_id": 188, "company_name": "rzrk", "namespace": "standard", "id": "1560_hv7qdJS4MLHbiDdWQp7HpC", "label": "SAP\u62dc\u8bbf\u8bb0\u5f55"}, {"ts_name": "", "count": 0, "name_py": "xmglb", "row_num": 1, "table_id": "3758_jFgQgnxh42Ugkbrrfb7Tfh", "folder_id": 88, "company_name": "rzrk", "namespace": "standard", "id": "3758_jFgQgnxh42Ugkbrrfb7Tfh", "label": "\u9879\u76ee\u7ba1\u7406\u8868"}, {"ts_name": "", "count": 0, "name_py": "grfyhzx", "row_num": 1, "table_id": "7528_aeEEGfSyKxQvpKDy58EPDA", "folder_id": 372, "company_name": "rzrk", "namespace": "standard", "id": "7528_aeEEGfSyKxQvpKDy58EPDA", "label": "\u4e2a\u4eba\u8d39\u7528\u6c47\u603b\u65b0"}, {"ts_name": "", "count": 0, "name_py": "fybxsqb", "row_num": 1, "table_id": "9458_PcVT5cWJJ35xP3x6kCrPhT", "folder_id": 321, "company_name": "rzrk", "namespace": "standard", "id": "9458_PcVT5cWJJ35xP3x6kCrPhT", "label": "\u8d39\u7528\u62a5\u9500\u7533\u8bf7\u8868"}], "success": 1, "error": ""},
        test_attachment_result:{"total": 45, "result": [{"ts_name": "", "count": 0, "name_py": "dddcmx", "row_num": 1931, "table_id": "4978_RGU4hJp6cBGPHkxZxCMTEh", "folder_id": 325, "company_name": "rzrk", "namespace": "standard", "id": "4978_RGU4hJp6cBGPHkxZxCMTEh", "label": "\u6ef4\u6ef4\u6253\u8f66\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xsBuggl", "row_num": 1698, "table_id": "9233_m6GFUdno6HBvXzXsEiB2cn", "folder_id": 90, "company_name": "rzrk", "namespace": "standard", "id": "9233_m6GFUdno6HBvXzXsEiB2cn", "label": "\u7ebf\u4e0aBug\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "grrb", "row_num": 1503, "table_id": "1190_WsuRDjEJ9R6vHcHuR8hMzZ", "folder_id": 252, "company_name": "rzrk", "namespace": "standard", "id": "1190_WsuRDjEJ9R6vHcHuR8hMzZ", "label": "\u4e2a\u4eba\u65e5\u62a5"}, {"ts_name": "", "count": 0, "name_py": "bjkq", "row_num": 1346, "table_id": "8924_YrawF4zecr4e9ZHgU6aNoS", "folder_id": 249, "company_name": "rzrk", "namespace": "standard", "id": "8924_YrawF4zecr4e9ZHgU6aNoS", "label": "\u5317\u4eac\u8003\u52e4"}, {"ts_name": "", "count": 0, "name_py": "khfwqxx", "row_num": 789, "table_id": "7628_cMJHZWsgozKho6cJbPExeJ", "folder_id": 112, "company_name": "rzrk", "namespace": "standard", "id": "7628_cMJHZWsgozKho6cJbPExeJ", "label": "\u5ba2\u6237\u670d\u52a1\u5668\u4fe1\u606f"}, {"ts_name": "", "count": 0, "name_py": "fyykmx", "row_num": 170, "table_id": "9956_aQrnF2jvMizKz8m28b9CKF", "folder_id": 45, "company_name": "rzrk", "namespace": "standard", "id": "9956_aQrnF2jvMizKz8m28b9CKF", "label": "\u8d39\u7528\u7528\u6b3e\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xmjhmx", "row_num": 157, "table_id": "771_uNRGnuYfkrjAfE4eH7cpzD", "folder_id": 89, "company_name": "rzrk", "namespace": "standard", "id": "771_uNRGnuYfkrjAfE4eH7cpzD", "label": "\u9879\u76ee\u8ba1\u5212\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "szkq", "row_num": 146, "table_id": "6192_vBQJx2f8MFZeKqYtSpj4RR", "folder_id": 248, "company_name": "rzrk", "namespace": "standard", "id": "6192_vBQJx2f8MFZeKqYtSpj4RR", "label": "\u6df1\u5733\u8003\u52e4"}, {"ts_name": "", "count": 0, "name_py": "xttzjyxtqx", "row_num": 128, "table_id": "3790_NwsLTLfYZrgYvkyfnw2otN", "folder_id": 96, "company_name": "rzrk", "namespace": "standard", "id": "3790_NwsLTLfYZrgYvkyfnw2otN", "label": "\u8fc5\u6295\u6295\u8d44\u4ea4\u6613\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "qjgl", "row_num": 103, "table_id": "8462_Zcer5GV7egyKF2TCGUfkn9", "folder_id": 17, "company_name": "rzrk", "namespace": "standard", "id": "8462_Zcer5GV7egyKF2TCGUfkn9", "label": "\u8bf7\u5047\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "clfbxmxb", "row_num": 100, "table_id": "6260_pdXTsn3ArYdXNHPfqxEknT", "folder_id": 43, "company_name": "rzrk", "namespace": "standard", "id": "6260_pdXTsn3ArYdXNHPfqxEknT", "label": "\u5dee\u65c5\u8d39\u62a5\u9500\u660e\u7ec6\u8868"}, {"ts_name": "", "count": 0, "name_py": "fybxsqb", "row_num": 78, "table_id": "9458_PcVT5cWJJ35xP3x6kCrPhT", "folder_id": 321, "company_name": "rzrk", "namespace": "standard", "id": "9458_PcVT5cWJJ35xP3x6kCrPhT", "label": "\u8d39\u7528\u62a5\u9500\u7533\u8bf7\u8868"}, {"ts_name": "", "count": 0, "name_py": "xtjgjyxtqx", "row_num": 68, "table_id": "9844_LF7p29NigQvFE43fuTQMGP", "folder_id": 102, "company_name": "rzrk", "namespace": "standard", "id": "9844_LF7p29NigQvFE43fuTQMGP", "label": "\u8fc5\u6295\u673a\u6784\u4ea4\u6613\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "fyykhzb", "row_num": 60, "table_id": "3534_yFDbNfRfaxS8CYA5Cc3GC9", "folder_id": 46, "company_name": "rzrk", "namespace": "standard", "id": "3534_yFDbNfRfaxS8CYA5Cc3GC9", "label": "\u8d39\u7528\u7528\u6b3e\u6c47\u603b\u8868"}, {"ts_name": "", "count": 0, "name_py": "yzsyjl", "row_num": 50, "table_id": "5987_9LHoLSfmqQLh8m2EqWxHyL", "folder_id": 38, "company_name": "rzrk", "namespace": "standard", "id": "5987_9LHoLSfmqQLh8m2EqWxHyL", "label": "\u5370\u7ae0\u4f7f\u7528\u8bb0\u5f55"}, {"ts_name": "", "count": 0, "name_py": "fybxmx", "row_num": 46, "table_id": "6206_UXTy4AhAGqEyg2zyQouKXB", "folder_id": 316, "company_name": "rzrk", "namespace": "standard", "id": "6206_UXTy4AhAGqEyg2zyQouKXB", "label": "\u8d39\u7528\u62a5\u9500\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "cpbkhgl", "row_num": 40, "table_id": "580_X89m5rGNUUY5xrkPhKQhL5", "folder_id": 92, "company_name": "rzrk", "namespace": "standard", "id": "580_X89m5rGNUUY5xrkPhKQhL5", "label": "\u4ea7\u54c1\u90e8\u5ba2\u6237\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "SAPbfjl", "row_num": 37, "table_id": "1560_hv7qdJS4MLHbiDdWQp7HpC", "folder_id": 188, "company_name": "rzrk", "namespace": "standard", "id": "1560_hv7qdJS4MLHbiDdWQp7HpC", "label": "SAP\u62dc\u8bbf\u8bb0\u5f55"}, {"ts_name": "", "count": 0, "name_py": "clbxhzb", "row_num": 35, "table_id": "4363_poH9kNzmcSbbxxUsAK4fAZ", "folder_id": 44, "company_name": "rzrk", "namespace": "standard", "id": "4363_poH9kNzmcSbbxxUsAK4fAZ", "label": "\u5dee\u65c5\u62a5\u9500\u6c47\u603b\u8868"}, {"ts_name": "", "count": 0, "name_py": "xchcpmx", "row_num": 29, "table_id": "7504_HQr3ocP7hDQRZNyaNPk7PR", "folder_id": 328, "company_name": "rzrk", "namespace": "standard", "id": "7504_HQr3ocP7hDQRZNyaNPk7PR", "label": "\u643a\u7a0b\u706b\u8f66\u7968\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xtmxptqx", "row_num": 21, "table_id": "4402_2TTVdex3Xe2v5DjHWuMVXF", "folder_id": 98, "company_name": "rzrk", "namespace": "standard", "id": "4402_2TTVdex3Xe2v5DjHWuMVXF", "label": "\u8fc5\u6295\u6a21\u578b\u5e73\u53f0\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "jtsq", "row_num": 14, "table_id": "8505_72GHqJDiGPd8rvowdmKbvX", "folder_id": 52, "company_name": "rzrk", "namespace": "standard", "id": "8505_72GHqJDiGPd8rvowdmKbvX", "label": "\u6d25\u8d34\u7533\u8bf7"}, {"ts_name": "", "count": 0, "name_py": "nbxqqr", "row_num": 13, "table_id": "8303_nXzZ8MApkZGKKTgyipch6E", "folder_id": 91, "company_name": "rzrk", "namespace": "standard", "id": "8303_nXzZ8MApkZGKKTgyipch6E", "label": "\u5185\u90e8\u9700\u6c42\u786e\u8ba4"}, {"ts_name": "", "count": 0, "name_py": "cpld", "row_num": 11, "table_id": "441_k35sF92o647Np9mdNLmaGd", "folder_id": 388, "company_name": "rzrk", "namespace": "standard", "id": "441_k35sF92o647Np9mdNLmaGd", "label": "\u4ea7\u54c1\u96f7\u8fbe"}], "success": 1, "error": ""},
        searchContent:"",
        maxHistory:10,
    },
    searchBarRef:null,
    actions:{
        getData:function () {
            // UserInfoService.getSearchHistory().done((result) => {
            //     if(result.success === 1){
            //         this.data.historyList = result.data;
            //         this.actions.initAutoSelect();
            //     }else{
            //         console.log("get search history failed");
            //     }
            // }).fail((err) => {
            //     console.log("get search history failed",err);
            // })
            this.actions.initAutoSelect();
        },
        initAutoSelect:function () {
            let tempData = [];
            for (let item of this.data.historyList){
                if(item.content && item.content.trim() !== ''){
                    item.name = item.content;
                    item.id = item.index;
                }
                tempData.push(item);
            }

            let $parent = this.el.find(".global-search-main");
            let searchBar = new SearchBar(tempData);
            searchBar.render($parent);
            this.searchBarRef = searchBar;
        },
        setSearchContent:function (event) {
            console.log(event);
            this.data.searchContent = event.target.value;
            console.log(this.data.searchContent)
        },
        doSearch:function () {
            let content = this.data.searchContent;
            if(content && content !== ''){
                //调用search服务
                // let id = this.actions.getNewId();
                let searchData = {
                    keyword:content,                      //搜索文字
                    rows:24 ,                               //每页显示的个数
                    page:1,                               //页面分页的页数
                    // id:id                               //新增设置id，id不重复
                };
                //打开搜索结果页面
                this.actions.showResearchResult();
                //暂时隐藏搜索按钮
                this.el.find("a.icon-search").hide();
                //发起第一次搜索请求，查询数据
                GlobalService.sendSearch(searchData).done((result) => {
                    if(result.success === 1){
                        // let tempData = {
                        //     data:result.result,
                        //     total:result.total,
                        // };
                        let tempData = {
                            data:this.data.test_data_result.result,
                            total:this.data.test_data_result.total,
                        };
                        //发布数据查询结果
                        Mediator.emit("main:global-search:data",tempData);      //正式使用
                        console.log("emit",tempData);
                        this.actions.addSearchHistory();
                    }else{
                        console.log("查询失败",result);
                    }
                }).fail((err) => {
                    console.log("查询失败",err);
                });

                searchData.in_attachment = 1 ;
                searchData.rows = 18;

                //发起第二次搜索请求，搜索附件
                GlobalService.sendSearch(searchData).done((result) => {
                    if(result.success === 1){
                        let tempData = {
                            data:result.result,
                            total:result.total,
                        };
                        // Mediator.emit("main:global-search:attachment",tempData);         //正式使用
                        Mediator.emit("main:global-search:attachment",this.data.test_attachment_result);            //测试使用
                        this.el.find("a.icon-search").show();
                    }else{
                        this.el.find("a.icon-search").show();
                        console.log("查询失败",result);
                    }
                }).fail((err) => {
                    this.el.find("a.icon-search").show();
                    console.log("查询失败",err);
                });
            }else{
                msgbox.alert("搜索内容不能为空");
            }
        },
        addSearchHistory(){
            let content = this.data.searchContent;
            if(content && content !== ""){
                for (let history of this.data.historyList){
                    if(history.content === content){
                        return;
                    }
                }
                let newHistory = {
                    content:this.data.content,
                };
                this.data.historyList.unshift(newHistory);
                if(this.data.historyList.length > this.data.maxHistory){
                    this.data.historyList.pop();
                }
                for (let i in this.data.historyList) {
                    this.data.historyList[i].index = i;
                }
            }

            UserInfoService.saveGlobalSearchHistory(this.historyList).done((result) => {
                console.log("historyList save success",result);
                //使用autoSelect扩展接口更新list的显示
            }).fail((err) => {
                console.log("historyList save failed",err);
            })
        },
        isDeleteAllHistory:function () {
            msgbox.confirm("您确定要清除全局搜索所有的历史数据吗？").then((result) => {
                if (result === true) {
                    this.actions.deleteAllHistory();
                } else {
                    return false;
                }
            })
        },
        deleteAllHistory:function () {
            this.data.historyList = [];
            UserInfoService.saveGlobalSearchHistory(this.data.historyList)
                .done((result) => {
                    //删除页面中的list////////////////////////////////////////////////////
                    msgbox.alert("成功清除历史搜索记录！")
                })
        },
        deleteSingleHistory:function (item) {
            let name = "test1";         //动态获取
            for(let i in this.data.historyList){
                if(this.data.historyList[i].content === name){
                    this.data.historyList.splice(i,1);
                    //删除页面中的list////////////////////////////////////////////////////
                    UserInfoService.saveGlobalSearchHistory(this.data.historyList);
                    break;
                }
            }
        },
        showResearchResult:function(){
            Mediator.emit('menu:item:openiframe', {
                id: "search-result",
                name: "搜索结果",
                url: "/search_result/"
            });
        },
        deleteOneRecord:function (event) {

        },
        dealRecordClick:function (event) {
            console.log(event);
            let operate = event.target.attributes.operate.value;
            let content = event.currentTarget.attributes.data_content.value;
            console.log(operate,content);
            if(operate === 'search'){
                this.data.searchContent = content;
                this.actions.doSearch();
            }else{
                this.actions.deleteOneRecord(content);
            }
        },
        // getFocus:function () {
        //     console.log("get focus");
        //     this.el.find("div.record-container").show();
        //     this.el.find("input.search-input").removeAttr("placeholder");
        // },
        // loseFocus:function () {
        //     this.el.find("div.record-container").hide();
        //     console.log("aa");
        //     if(this.el.find("input.search-input").val() === ''){
        //         this.el.find("input.search-input").attr("placeholder","请输入要搜索的内容...");
        //     }
        // }
    },
    afterRender:function () {
        this.actions.getData();
        this.el.on("click","a.icon-search", () => {
            this.actions.doSearch();
        }).on("click",".delete-all-history", (event) => {
            this.actions.isDeleteAllHistory();
        }).on('click','.record-item',(event) => {
            this.actions.dealRecordClick(event);
        }).on('input','.search-content',(event) => {
            this.actions.setSearchContent(event);
        })
    },
    beforeDestroy:function () {

    }
};


class GlobalSearch extends  Component{
    constructor(){
        super(config);
    }
}

export {GlobalSearch}

