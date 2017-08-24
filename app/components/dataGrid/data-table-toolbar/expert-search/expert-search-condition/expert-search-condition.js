
import Component from "../../../../../lib/component";
import template from './expert-search-condition.html';
import '../expert-search.scss';
import expertItem from './expert-search-item/expert-search-item';
import expertSearch from '../expert-search';
let config = {
    template: template,
    inputObject: null,
    inputNextObject: null,
    rendItemNum:0,
    ulChecked: true,
    epSearch: {},
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
        rendItem: function () {
            let _this = this;
            this.data.expertItemData.forEach((row) => {
                // this.append(new expertItem(row), $('.expert-search').find('.condition-search-ul')[config.rendItemNum]);
                this.append(new expertItem(row), this.el.find('.condition-search-ul'));
            });
            this.rendItemNum ++ ;
            // this.el.find('.condition-search-li').on('click', function() {
            //     _this.actions.setInputValue($(this).find('.name').html(),$(this).find('.searchField').html());
            //     _this.actions.setSelectValue($(this).find('.searchType').html());
            //     _this.actions.setInputType($(this).find('.searchType').html());
            //     _this.actions.hideList();
            // })
        },
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
        delete: function() {
            this.destroySelf();
        }
    },
    afterRender: function() {
        this.actions.rendItem();
        // this.epSearch = new expertSearch.expertSearch ();
        this.ulChecked = true;
        // this.data.inputList = this.el.find('.condition-search-input').val();
        // debugger
        let _this = this;
        this.el.on('click','.condition-search-li', function() {
            _this.actions.setInputValue($(this).find('.name').html(),$(this).find('.searchField').html(),$(this).find('.searchType').html());
            _this.actions.setSelectValue($(this).find('.searchType').html());
            _this.actions.setInputType($(this).find('.searchType').html());
            _this.data.inputBoxName = $(this).find('.name').html();
            _this.data.inputBoxValue = $(this).find('.searchField').html();
            _this.data.relationSelect = _this.el.find('.condition-search-select.relation').val();
            _this.actions.hideList();
        }).on('change','.condition-search-select.relation',function(){
            _this.data.relationSelect = $(this).val();
        }).on('change','.condition-search-select.left-select',function(){
            _this.data.leftSelect = $(this).val();
        }).on('change','.condition-search-select.right-select',function(){
            _this.data.rightSelect = $(this).val();
        }).on('change','.condition-search-input',function(){
            _this.data.inputValue = $(this).val();
        }).on('click','.condition-search-box-input', function() {
            if (_this.ulChecked){
                _this.actions.showList();
            } else {
                _this.actions.hideList();
            }
            _this.actions.setInputObject($(this),$(this).parent().parent().find('.condition-search-input'))
        }).on('click','.condition-search-delete',()=>{
            this.actions.delete();
            let length = $('.condition-search-add').length;
            $('.condition-search-add').eq(length-1).css('display','inline-block');
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