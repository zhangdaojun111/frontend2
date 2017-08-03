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
    inputObject: null,
    inputNextObject: null,
    epSreach: {},
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
                _this.actions.setInputType($(this).find('.searchType').html());
                config.epSreach.actions.hideList();
            })
        },
        setInputObject: function(object,nextObject) {
            config.inputObject = object;
            config.inputNextObject = nextObject;
        },
        setInputValue: function(value) {
            config.inputObject.val(value);
        },
        setInputType: function(type) {
            let inputType;
            switch (type) {
                case "datetime": inputType = 'date'; break
                case "text": inputType = 'text'; break
                case "number": inputType = 'number'; break
            }
            config.inputNextObject.attr("type",inputType);
        }
    },
    afterRender: function() {
        this.actions.rendItem();
        config.epSreach = new expertSreach.expertSearch ();
        $('.condition-search .condition-search-item:first-child').find('.condition-search-checkbox').css('dispaly','none');
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