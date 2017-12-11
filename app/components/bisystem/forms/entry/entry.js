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
for(let k of Object.keys(componentsJson)){
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


let FormEntryComponent = BiBaseComponent.extend(config);

export {FormEntryComponent}