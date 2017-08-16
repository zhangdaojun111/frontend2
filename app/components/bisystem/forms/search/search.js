/**
 * Created by birdyy on 2017/8/16.
 * title: chart 高级查询组件
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './search.html';
import {PMAPI} from '../../../../lib/postmsg';
import './search.scss';

let config = {
    template: template,
    data: {
        tableId:'',
        fieldsData: []
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {
        this.el.on('click', 'a', (event) => {
            let query = {
                tableId: this.data.tableId,
                fieldsData: this.data.fieldsData
            };
            PMAPI.openDialogByIframe(`/iframe/expertSearch/`,{
                width:950,
                height:600,
                title:`高级查询`,
                modal:true
            },{}).then(res=>{
                console.log(res);
            });
            return false;
        })
    }
};

export class FormSearchComponent extends BiBaseComponent {
    constructor() {
        super(config);
    }
}