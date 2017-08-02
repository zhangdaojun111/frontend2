/**
 * Created by zhaohaoran on 2017/8/2.
 */
import Component from "../../../../../lib/component";
import template from './expert-search-condition.html';
import '../expert-search.scss';
import expertItem from './expert-search-item/expert-search-item';
import expertSreach from '../expert-search';
let config = {
    template: template,
    data: {
        expertItemData: [],
    },
    actions: {
        rendItem: function () {
            let _this = this;
            this.data.expertItemData.forEach((row) => {
                this.append(new expertItem(row), $('.expert-search').find('.condition-search-ul'));
            });
            $('.condition-search-li').on('click', function() {
                _this.actions.setInputValue($(this).find('.name').html());
            })
        },
        setInputValue: function(value) {
            $('.condition-search-box-input').val(value);
            epSreach.actions.hideList();
        }
    },
    afterRender: function() {
        this.actions.rendItem();
        let epSreach = new expertSreach.expertSearch ();
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