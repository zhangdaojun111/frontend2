/**
 * Created by zhr
 */

import Component from "../../../../lib/component";
import template from './fast-search.html';
import './fast-search.scss';
let config = {
    template: template,
    inputObject: null,
    inputNextObject: null,
    rendItemNum:0,
    ulChecked: true,
    data: {
        expertItemData: [],
        inputValue:'',
        leftSelect:'0',
        rightSelect:'0',
        relationSelect:'',
        inputBoxName:'',
        inputBoxValue:'',
    },
    actions: {
        showList: function() {
            this.el.find('.condition-search-ul').css('display','block');
            this.ulChecked = !this.ulChecked;
        },
        hideList: function() {
            this.el.find('.condition-search-ul').css('display','none');
            this.ulChecked = !this.ulChecked;
        },
        setInputObject: function(object,nextObject) {
            this.inputObject = object;
            this.inputNextObject = nextObject;
        },
        setInputValue: function(value,name,type) {
            this.inputObject.val(value);
            this.inputObject.attr('name',name);
            this.inputObject.attr('title',type);
        },
        setInputType: function(type) {
            let inputType;
            switch (type) {
                case "datetime": inputType = 'datetime-local'; break;
                case "text": inputType = 'text'; break;
                case "number": inputType = 'number'; break;
                case "person": inputType = 'text'; break;
            }
            this.inputNextObject.attr("type",inputType);
            this.inputNextObject.attr("title",type);
        },
        setSelectValue: function(type) {
            let optionHtmlOne = `<option value="$regex">包含</option>
                                <option value="exact">等于</option>
                                <option value="$ne">不等于</option>`,
                optionHtmlTwo = `<option value="$regex">包含</option>
                                <option value="exact">等于</option>
                                <option value="$gt">大于</option>
                                <option value="$lt">小于</option>
                                <option value="$ne">不等于</option>`,
                optionHtmlThree =  `<option value="exact">等于</option>
                                <option value="$gt">大于</option>
                                <option value="$lt">小于</option>
                                <option value="$ne">不等于</option>`,
                optionHtmlFour = `<option value="exact">等于</option>
                                  <option value="$ne">不等于</option>`;
            switch (type) {
                case "datetime": this.inputNextObject.parent().find('.condition-search-select.relation').html(optionHtmlTwo); break;
                case "text": this.inputNextObject.parent().find('.condition-search-select.relation').html(optionHtmlOne); break;
                case "number": this.inputNextObject.parent().find('.condition-search-select.relation').html(optionHtmlThree); break
                case "person": this.inputNextObject.parent().find('.condition-search-select.relation').html(optionHtmlFour); break
            }
        },
    },
    afterRender: function() {
        
    }
}
class fastSearch extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config)
    }
}
export default fastSearch