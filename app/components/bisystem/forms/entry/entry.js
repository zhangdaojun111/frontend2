/**
 * Created by birdyy on 2017/8/14.
 *
 */
import {BiBaseComponent} from '../../bi.base.component';
import template from './entry.html';
import './entry.scss';
import {componentsJson} from './loadFormChart.json';

// 将对象转化为数组
let components = [];
// Object.keys(componentsJson).map(key => {
//     components.push(componentsJson[key])
// });
for(let k of Object.keys(componentsJson)){
    console.log(k);
    if(window.config.query_mark !== 'home'){
           if(k == 'approval' || k == 'calendar'){
                continue
           }
        components.push(componentsJson[k])
    }else {
        components.push(componentsJson[k])
    }
}


let config = {
    template: template,
    data: {
        components:components,
    },
    actions: {},
    afterRender() {},
    firstRender() {}
};

export class FormEntryComponent extends BiBaseComponent {
    constructor(extendConfig) {
        super($.extend(true,{},config,extendConfig))
    }
}