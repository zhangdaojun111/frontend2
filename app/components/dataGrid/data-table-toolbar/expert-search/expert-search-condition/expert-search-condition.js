/**
 * Created by zhr
 */
import Component from "../../../../../lib/component";
import template from './expert-search-condition.html';
import '../expert-search.scss';
import expertItem from './expert-search-item/expert-search-item';
import DateTimeControl from "../../../../form/datetime-control/datetime-control";
import DateControl from "../../grid-data-control/grid-data-control";
import {AutoSelect} from '../../../../util/autoSelect/autoSelect';
import TimeControl from "../../../../form/time-control/time-control";
import expertSearch from '../expert-search';
let config = {
    template: template,
    data: {
        expertItemData: [],
        expertSelect: [],
        inputValue:'',
        leftSelect:'0',
        rightSelect:'0',
        relationSelect:'',
    },
    actions: {
        // 加载下拉搜索条件
        renderItem: function (){
            this.data.expertItemData.forEach((item)=>{
                let obj = {};
                obj['id'] = item['searchField'];
                obj['name'] = item['name'];
                obj['py'] = item['searchType'];
                this.data.expertSelect.push(obj);
            })
            this.actions.loadSelect();
        },
        // 加载下拉组件
        loadSelect: function(){
            let _this = this;
            let selectData = {
                list: this.data.expertSelect,
                choosed: [],
                multiSelect: false,
                editable: true,
                width:'172px',
                onSelect:function(choosed) {
                    if(choosed.length != 0){
                        _this.actions.itemOnSelect(choosed)
                    }
                }
            }
            this.append(new AutoSelect(selectData),this.el.find('.condition-search-box'))
        },
        // 下拉组件点击事件
        itemOnSelect: function(item){
            let id = item[0]['id'];
            let name = item[0]['name'];
            let type = this.actions.itemType(id);
            this.actions.setInputValue(name,id,type);
            this.actions.setSelectValue(type);
            this.actions.setInputType(type);
        },
        // 获取点击的搜索条件的type
        itemType: function (id){
            let type = null;
            this.data.expertItemData.forEach((item)=>{
                if(id == item['searchField']) {
                    type = item['searchType'];
                }
            })
            return type
        },
        //设置搜索条件框的值
        setInputValue: function(value,name,type) {
            this.el.find('.result').val(value);
            this.el.find('.result').attr('name',name);
            this.el.find('.result').attr('search-type',type);
        },
        //设置搜索值框的类型
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
        // 设置关系选择框的数据
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
        this.actions.renderItem();
        let epSearch = new expertSearch();
        this.ulChecked = true;
        // this.data.inputList = this.el.find('.condition-search-input').val();
        // debugger
        let _this = this;
        this.el.on('change','.condition-search-select.relation',function(){
            _this.data.relationSelect = $(this).val();
        }).on('change','.condition-search-select.left-select',function(){
            _this.data.leftSelect = $(this).val();
        }).on('change','.condition-search-select.right-select',function(){
            _this.data.rightSelect = $(this).val();
        }).on('change','.condition-search-input',function(){
            _this.data.inputValue = $(this).val();
        }).on('click','.condition-search-delete',()=>{
            this.actions.delete();
            // epSearch.actions.showAddBtn();
        });
        this.actions.inputSearch();
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