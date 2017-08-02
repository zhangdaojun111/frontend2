/**
 * Created by dell on 2017/8/2.
 */
import Component from "../../../../../lib/component";
import template from './high-grade-search-condition.html'
import '../high-grade-search.scss';
import highGradeItem from './high-grade-search-item/high-grade-search-item'
let config = {
    template: template,
    data: {
        highGradeItemData: [],
    },
    actions: {
        getConditionData: function (data) {
            this.data.highGradeItemData = data;
            this.actions.rendItem();
        },
        rendItem: function () {
            this.data.highGradeItemData.forEach((row) => {
                this.append(new highGradeItem(row), $('.high-search').find('.condition-search-ul'));
            });
        }
    },
    afterRender: function() {

    }
}
class highGradeCondition extends Component {
    constructor() {
        super(config)
    }
}
export default highGradeCondition