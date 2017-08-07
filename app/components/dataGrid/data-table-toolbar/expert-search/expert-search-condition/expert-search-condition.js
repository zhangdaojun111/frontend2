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
    rendItemNum:0,
    epSreach: {},
    data: {
        expertItemData: [],
    },
    actions: {
        rendItem: function () {
            let _this = this;
            this.data.expertItemData.forEach((row) => {
                // this.append(new expertItem(row), $('.expert-search').find('.condition-search-ul')[config.rendItemNum]);
                this.append(new expertItem(row), this.el.find('.condition-search-ul'));
            });
            config.rendItemNum ++ ;
            $('.condition-search-li').on('click', function() {
                _this.actions.setInputValue($(this).find('.name').html(),$(this).find('.searchField').html());
                _this.actions.setSelectValue($(this).find('.searchType').html());
                _this.actions.setInputType($(this).find('.searchType').html());
                config.epSreach.actions.hideList();
            })
        },
        setInputObject: function(object,nextObject) {
            config.inputObject = object;
            config.inputNextObject = nextObject;
        },
        setInputValue: function(value,name) {
            config.inputObject.val(value);
            config.inputObject.attr('name',name);
        },
        setInputType: function(type) {
            let inputType;
            switch (type) {
                case "datetime": inputType = 'date'; break;
                case "text": inputType = 'text'; break;
                case "number": inputType = 'number'; break
            }
            config.inputNextObject.attr("type",inputType);
        },
        setSelectValue: function(type) {
            let optionHtmlOne = `<option value="$regex">包含</option>
                                <option value="exact">等于</option>
                                <option value="$ne">不等于</option>`;
            let optionHtmlTwo = `<option value="$regex">包含</option>
                                <option value="exact">等于</option>
                                <option value="$gt">大于</option>
                                <option value="$lt">小于</option>
                                <option value="$ne">不等于</option>`
            switch (type) {
                case "datetime": config.inputNextObject.parent().find('.condition-search-select.relation').html(optionHtmlTwo); break;
                case "text": config.inputNextObject.parent().find('.condition-search-select.relation').html(optionHtmlOne); break;
                case "number": config.inputNextObject.parent().find('.condition-search-select.relation').html(optionHtmlOne); break
            }
        },
        delete: function() {
            this.destroySelf();
        }
    },
    afterRender: function() {
        this.actions.rendItem();
        config.epSreach = new expertSreach.expertSearch ();
        this.el.on('click','.delete',()=>{
            this.actions.delete();
        });
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