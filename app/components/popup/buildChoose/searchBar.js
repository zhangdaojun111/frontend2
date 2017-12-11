/**
 *@author yudeping
 *选择器搜索模块
 */

import Component from "../../../lib/component";
import Mediator from "../../../lib/mediator";
import {FormService} from "../../../services/formService/formService";
import {AutoSelect} from "../../util/autoSelect/autoSelect";
import template from './searchBar.html'

let config = {
    template: template,
    data: {
        searchTerms: {
            list: [
                {name: "包含", id: "regex"},
                {name: "大于", id: "gt"},
                {name: "小于", id: "lt"},
                {name: "等于", id: "exact"},
                {name: "不等于", id: "ne"}
            ],
            choosed: [{name: "包含", id: "regex"}],
            multiSelect: false,
            width: 180,
        },
        columnValue: '',
        regValue: '',
    },
    actions: {},
    async afterRender() {
        let _this = this;
        let res = await FormService.getColumnList(this.data.tableId)
        this.data.rows = res.rows;
        let d = {
            list: [{
                name: "请选择",
                id: "请选择"
            }],
            choosed: [{
                name: '请选择',
                id: '请选择',
            }],
            multiSelect: false,
            width: 180,
        }
        for (let i of res['rows']) {
            d.list.push({
                id: i["name"],
                name: i["name"]
            });
        }
        d.onSelect = (data) => {
            if (data.length > 0) {
                _this.data.columnValue = data[0].id;
            }
        };
        this.data.searchTerms.onSelect = (data) => {
            if (data.length > 0) {
                _this.data.regValue = data[0].id;
            }
        }
        let dropDown = new AutoSelect({data:d});
        let dropDown2 = new AutoSelect({data:this.data.searchTerms});
        this.append(dropDown, this.el.find('.ui-box-1'));
        this.append(dropDown2, this.el.find('.ui-box-2'));
        this.el.on('click', '.select', async function () {
            if (_this.data.columnValue == '请选择') {
                alert('请选择');
                return;
            }
            let selectedTerm = _this.data.regValue;
            let selectedField = _this.data.columnValue;
            let keyword = _this.el.find('.searchBar').val();
            let queryParams = [{
                "relation": "and",
                "cond": {
                    searchBy: selectedField || "",
                    operate: selectedTerm || "",
                    keyword: keyword || ""
                }
            }];
            let json = {
                table_id: _this.data.tableId,
                queryParams: JSON.stringify(queryParams)
            };
            let res = await FormService.searchByChooser(json)
            _.debounce(function () {
                Mediator.publish('form:chooseSelect', res['data'])
            }, 300)();
        })
    }
}
export default class SearchBar extends Component {
    constructor(newConfig){
        super($.extend(true,{},config,newConfig));
    }
}