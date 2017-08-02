/**
 * Created by dell on 2017/8/2.
 */
import Component from "../../../../../lib/component";
import template from './expert-search-condition.html'
import '../expert-search.scss';
import expertItem from './expert-search-item/expert-search-item'
let config = {
    template: template,
    data: {
        expertItemData: [],
    },
    actions: {
        getConditionData: function (data) {
            this.data.expertItemData = data;
            this.actions.rendItem();
        },
        rendItem: function () {
            this.data.expertItemData.forEach((row) => {
                this.append(new expertItem(row), $('.expert-search').find('.condition-search-ul'));
            });
        }
    },
    afterRender: function() {
        console.log( "++++++++++" )
        console.log( "++++++++++" )
        console.log( "++++++++++" )
        console.log( this.data.expertItemData )
        this.actions.rendItem()
    }
}
class expertCondition extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config)
    }
}
export default expertCondition