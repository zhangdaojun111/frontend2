/**
 * Created by zhr
 */
import Component from "../../../../lib/component";
import template from './jurisdiction.html';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {AutoSelect} from '../../../util/autoSelect/autoSelect';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import {HTTP} from "../../../../lib/http";
import './jurisdiction.scss'

let jurisdiction = Component.extend({
    template: template,
    choosedList:[],
    data: {
        choosed:[],
        selectAry:[],
        userPerm:{}
    },
    binds:[
        {
            event:'click',
            selector:'.jurisdiction-btn',
            callback: _.debounce(function(){
                PMAPI.closeIframeDialog(window.config.key, {
                    type:'save',
                    choosedList:this.choosedList,
                });
            }, 0)
        }
    ],
    actions: {
        afterGetMsg:function() {
            //引用选择插件
            let _this = this;
            let selectData = {
                list: this.data.selectAry,
                displayType: 'static',
                choosed: this.data.choosed,
                editable: true,
                displayChoosed: true,
                onSelect:function(choosed) {
                    _this.choosedList = [];
                    for(let item of choosed) {
                        _this.choosedList.push(item['id']);
                    }
                }
            }
            this.append(new AutoSelect(selectData),this.el.find('.jurisdiction-select'))
        }
    },
    afterRender: function() {
        PMAPI.getIframeParams(window.config.key).then((res) => {
            for (let item in res.data.obj) {
                this.data[item] = res.data.obj[item]
            }
            this.actions.afterGetMsg()
        })
    }
})
// class jurisdiction extends Component {
//     constructor(data,newConfig){
//         super($.extend(true,{},config,newConfig,{data:data||{}}));
//     }
// }
export default jurisdiction