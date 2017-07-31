/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './month.grid.html';
import './month.grid.scss';

let config = {
    template: template,
    data: {
    },
    actions: {

    },
    afterRender: function() {

    }
};

class MonthGrid extends Component {
    constructor(data) {
        config.data = data.weekList;
        super(config);
    }
}

export default MonthGrid;