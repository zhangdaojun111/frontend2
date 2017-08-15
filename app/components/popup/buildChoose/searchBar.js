import Component from "../../../lib/component";
import Mediator from "../../../lib/mediator";
import './searchBar.scss';
import {FormService} from "../../../services/formService/formService";
import DropDown from "../../form/vender/dropdown/dropdown";
let config={
    template:`<div class="wrap">
                <div class="ui-box-1">
                    
                </div>
                <input type="text" class="searchBar"/>
                <button class="select">查询</button>
                <button class="confirm" >确定</button>
            </div>`,
    data:{
        searchTerms:{
            options:[
                { label:"包含",  value:"regex"},
                { label:"大于",  value:"gt"},
                { label:"小于",  value:"lt"},
                { label:"等于",  value:"exact"},
                { label:"不等于",value:"ne"}
            ],
            showValue:'包含',
            index:2,
            value:'regex'
        }
    },
    actions:{

    },
    async firstAfterRender(){
        let _this=this;
        _this.set('childDropDown',[]);
        let res=await FormService.getColumnList(_this.data.tableId)
        _this.data.rows=res.rows;
        let d={
            options:[],
            index:1,
            showValue:'请选择',
            value:'',
        }
        d.options.push({
            label: "请选择",
            value: "0"
        });
        for(let i of res['rows']) {
            d.options.push({
                label: i["name"],
                value: i["name"]
            });
        }
        let dropDown=new DropDown(d);
        let dropDown2=new DropDown(_this.data.searchTerms);
        _this.childDropDown.push(dropDown);
        _this.childDropDown.push(dropDown2);
        _this.append(dropDown,_this.el.find('.ui-box-1'));
        _this.append(dropDown2,_this.el.find('.ui-box-1'));
        _this.el.on('click','.select',async function(){
            let selectedTerm =_this.childDropDown[1]['data'].value;
            let selectedField =_this.childDropDown[0]['data'].value;
            let keyword=_this.el.find('.searchBar').val();
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
            let res=FormService.searchByChooser(json)
            _.debounce(function(){Mediator.publish('form:chooseSelect',res['data'])},300)();
        })
        _this.el.on('click','.confirm',function(){
           _.debounce(function(){Mediator.publish('form:chooseConfirm','isConfirm')},300)();
        });
    }
}
export default class SearchBar extends Component{
    constructor(data){
        super(config,data);
    }
}