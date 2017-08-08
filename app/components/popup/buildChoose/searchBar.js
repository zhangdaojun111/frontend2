import Component from "../../../lib/component";
import './searchBar.scss';
import {FormService} from "../../../services/formService/formService";
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
                options:_this.data.rows,
            }
        })
    }
}
export default class SearchBar extends Component{
    constructor(data){
        super(config,data);
    }
}