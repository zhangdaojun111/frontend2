import Component from "../../../lib/component";
import {HTTP} from "../../../lib/http";
import {FormService} from '../../../services/formService/formService';


let config={
    template:`<hearder class="search-bar"></hearder>
              <nav class="ui-nav">            
              </nav>
              {{#if authority}}
                <p style="font-size:20px">您没有查看权限</p>
              {{else}} 
              <section class="ui-section">
                
              </section>
              {{/if}} 
            `,
    data:{

    },
    actions:{

    },
    firstAfterRender(){
        let _this=this;
        FormService.getStaticData({field_id:this.data.fieldId}).then(res=>{
            console.log(res);
            _this.data=res['data'][0];
        });
        HTTP.flush();

        // FormService.getFormData({
        //     field_id:this.data.fieldId
        // }).then(res=>{
        //    console.log('1111111');
        //    console.log(res);
        // });
    }
}

export default class BuildChoose extends Component{
    constructor(data){
        super(config,data);
    }
}