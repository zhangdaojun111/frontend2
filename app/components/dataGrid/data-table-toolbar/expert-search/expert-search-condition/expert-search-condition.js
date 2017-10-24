
import Component from "../../../../../lib/component";
import template from './expert-search-condition.html';
import '../expert-search.scss';
import expertItem from './expert-search-item/expert-search-item';
import DateTimeControl from "../../../../form/datetime-control/datetime-control";
import DateControl from "../../grid-data-control/grid-data-control";
import TimeControl from "../../../../form/time-control/time-control";
import expertSearch from '../expert-search';
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
            // this.append(new DateTimeControl('', function(data){}),this.el.find('.condition-search-ul'));
            switch (type) {
                case "datetime":
                    // inputType = 'datetime-local'; break;
                    this.el.find('.condition-search-input').remove();
                    let dateTimeControl = new DateTimeControl({value: '', isAgGrid: true},{changeValue:function(data){}});
                    dateTimeControl.render(this.el.find('.condition-search-value'));
                    break;
                case "date":
                    // inputType = 'datetime-local'; break;
                    this.el.find('.condition-search-input').remove();
                    let dateControl = new DateControl({value: '', isAgGrid: true},{changeValue:function(data){}});
                    dateControl.render(this.el.find('.condition-search-value'));
                    break;
                case "time":
                    // inputType = 'datetime-local'; break;
                    this.el.find('.condition-search-input').remove();
                    let timeControl = new TimeControl({value: '', isAgGrid: true},{changeValue:function(data){}});
                    timeControl.render(this.el.find('.condition-search-value'));
                    break;
                case "text":
                    this.el.find('.condition-search-value').html(`<input class="condition-search-input" type="text">`);
                    break;
                case "number":
                    this.el.find('.condition-search-value').html(`<input class="condition-search-input" type="number">`);
                    // inputType = 'number';
                    break;
                case "person":
                    this.el.find('.condition-search-value').html(`<input class="condition-search-input" type="text">`)
                    // inputType = 'text';
                    break;
            }
            // this.inputNextObject.attr("type",inputType);
            // this.inputNextObject.attr("title",type);
        },
        setSelectValue: function(type) {
            let optionHtmlOne = `<option value="$regex">包含</option>
                                <option value="nor">不包含</option>
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
                case "datetime": this.el.find('.condition-search-select.relation').html(optionHtmlTwo); break;
                case "text": this.el.find('.condition-search-select.relation').html(optionHtmlOne); break;
                case "number": this.el.find('.condition-search-select.relation').html(optionHtmlThree); break
                case "person": this.el.find('.condition-search-select.relation').html(optionHtmlFour); break
            }
        },
        delete: function() {
            this.destroySelf();
        },
        //搜索事件
        inputSearch: function () {
            this.el.find( '.condition-search-li-input' ).on( 'input',_.debounce( ()=>{
                let val = this.el.find( '.condition-search-li-input' )[0].value;
                let lis = this.el.find( '.condition-search-li' );
                for( let li of lis ){
                    li.style.display = li.attributes.name.value.indexOf( val ) == -1 && val!='' ? 'none':'block'
                }
            },1000))
        },
    },
    afterRender: function() {
        let epSearch = new expertSearch();
        this.ulChecked = true;
        // this.data.inputList = this.el.find('.condition-search-input').val();
        // debugger
        let _this = this;
        this.el.on('click','.condition-search-li', function() {
            _this.actions.setInputValue($(this).attr('name'),$(this).attr('searchField'),$(this).attr('searchType'));
            _this.actions.setSelectValue($(this).attr('searchType'));
            _this.actions.setInputType($(this).attr('searchType'));
            _this.data.inputBoxName = $(this).attr('name');
            _this.data.inputBoxValue = $(this).attr('searchField');
            _this.data.relationSelect = _this.el.find('.condition-search-select.relation').val();
            _this.actions.hideList();
            _this.el.find('.condition-search-li-input').val('')
            _this.el.find( '.condition-search-li' ).css('display','block')
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
            // epSearch.actions.showAddBtn();
        });
        this.actions.inputSearch();
    }
}
class expertCondition extends Component {
    // constructor(data) {
    //     for (let d in data) {
    //         config.data[d] = data[d]
    //     }
    //     super(config)
    // }
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}
export default expertCondition