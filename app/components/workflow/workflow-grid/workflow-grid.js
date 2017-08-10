import Component from "../../../lib/component";
import template from './workflow-grid.html';
import './workflow-grid.scss'
import dataGrid from '../../../components/dataGrid/data-table-page/data-table-page'
import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    data:{},

    actions: {
      
    },
    afterRender: function() {
       // this.append(new dataGrid(),$("#dataGrid") )
    }
}

class WorkFlowGrid extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}

export default {
     showGrid(data) {
        let component = new WorkFlowGrid();
        let el = $('#workflow-grid');
        component.render(el);
     }
};
