import Component from "../../../lib/component";
import './searchBar.scss';
import {FormService} from "../../../services/formService/formService";
import DropDown from "../../form/vender/dropdown/dropdown";
let config={
    template:`<div class="wrap">
                <div class="ui-box-1">
                    
                </div>
                <input type="text">
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
        }
    },
    actions:{

    },
    firstAfterRender(){
        let _this=this;
        FormService.getColumnList(_this.data.tableId).then(res=>{
            _this.data.rows=res.rows;
            let d={
                options:[],
                index:1,
                showValue:'请选择',
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
            _this.append(dropDown,_this.el.find('.ui-box-1'));
            _this.append(dropDown2,_this.el.find('.ui-box-1'));
        })
    }
}
export default class SearchBar extends Component{
    constructor(data){
        super(config,data);
    }
}