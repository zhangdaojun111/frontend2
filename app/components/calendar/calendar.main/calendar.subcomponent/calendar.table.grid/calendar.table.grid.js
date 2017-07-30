/**
 * Created by zj on 2017/7/28.
 */
import Component from "../../../../../lib/component";
import template from './calendar.table.grid.html';
import './calendar.table.grid.scss';

let config = {
    template: template,
    data: {
        bodyData: Object,
        type: '',
    },
    actions: {

    },
    afterRender: function() {

        if (this.data.type === 'day') {
            this.el.css({display: "inline-block", width: "calc(100% - 1px)", height: "100%"});
            $('.grid-content').css({'max-height': "827px", border: "1px solid #ddd", overflow: "auto"});
        } else if(this.data.type === 'month') {
            this.el.css({display: "inline-block", width: "calc(100%/7)", height: "100%"});
                $('.task-list').css({'max-height': "110px", overflow: "auto"});
        } else if (this.data.type === 'week') {
            this.el.css({display: "inline-block", width: "calc((100% - 1px)/7)", height: "100%"});
            $('.grid-content').css({'max-height': "790px", border: "1px solid #ddd", overflow: "auto"});
        }
    }
};

class TableGrid extends Component {
    constructor(data) {
        config.data.headData = data['headTitle'];
        config.data.bodyData = data['bodyData'];
        config.data.type = data.type;
        super(config);
    }
}

export default TableGrid;