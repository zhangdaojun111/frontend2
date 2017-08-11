import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';

let config={
    template:`   <div class="clearfix">
                    {{#if unvisible}}
                        <p class="info">权限受限</p>
                    {{else if be_control_condition}}
                        <p class="info">被修改条件限制</p>
                    {{else}}
                         <a href="javascript:void(0);" class="ui-forms-a">查看详情</a>
                         {{#if required}}
                                <span id="requiredLogo" class="required" ></span>
                         {{/if}}
                         <input type="hidden">
                     {{/if}}       
               </div>`,
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        _this.el.on('click','.ui-forms-a',_.debounce(function(){
            Mediator.publish('form:openSongGrid:'+_this.data.tableId,_this.data);
        },300))
    },
    beforeDestory:function(){
    }
}
export default class Songrid extends Component{
    constructor(data){
        super(config,data);
        console.log('songGrid');
        console.log(this.data);
    }
}