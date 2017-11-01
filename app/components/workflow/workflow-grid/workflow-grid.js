/**
 *@author qiumaoyun and luyang
 *工作流表格
 */
import Component from "../../../lib/component";
import template from './workflow-grid.html';
import './workflow-grid.scss'


let config = {
    template: template,
    data:{},

    actions: {
      
    },
    afterRender: function() {

    }
}

class WorkFlowGrid extends Component {
    // constructor(data){
    //     config.data = data;
    //     super(config);
    // }

    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default {
     showGrid(data) {

        let component = new WorkFlowGrid();
        let el = $('#workflow-grid');
        component.render(el);
     }
};
