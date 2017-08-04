import Component from "../../../../lib/component";
import template from './expert-search.html';
import expertCondition from './expert-search-condition/expert-search-condition'

import './expert-search.scss';

let config = {
    template: template,
    ulChecked: true,
    inputValue: null,
    searchInputList:[],
    optionHtmlOne : `<option value="$regex">包含</option>
                    <option value="exact">等于</option>
                    <option value="$ne">不等于</option>`,
    optionHtmlTwo : `<option value="$regex">包含</option>
                    <option value="exact">等于</option>
                    <option value="$gt">大于</option>
                    <option value="$lt">小于</option>
                    <option value="$ne">不等于</option>`,
    data: {
        //高级查询字段信息
        fieldsData: [],
        queryParams:[{
            "cond":{
                "keyword":"暂停中",
                "leftBracket":"(",
                "operate":"$ne",
                "rightBracket":")",
                "searchBy":"f6",
                "searchByName":"创建时间",
                "searchByNew":"f6"
            },
            "relation":"$and"
        },{
            "cond":{
                "keyword":"关闭",
                "leftBracket":"(",
                "operate":"$ne",
                "rightBracket":")",
                "searchBy":"f5",
                "searchByName":"姓名",
                "searchByNew":"f5"
            },
            "relation":"or"
        }],
    },
    actions: {
        rendSearchItem: function(){
            this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
            $('.condition-search-item').css('marginLeft','97px');
            $('.condition-search-radiobox').css('display','none');
            $('.delete').css('display','none');
        },
        showList: function() {
            $('.condition-search-ul').css('display','block');
            config.ulChecked = !config.ulChecked;
        },
        hideList: function() {
            $('.condition-search-ul').css('display','none');
            config.ulChecked = !config.ulChecked;
        },
        submitData: function (){
            let itemList = document.querySelectorAll('.condition-search-item');
            if (itemList.length <= 1) {
                let obj = {
                    cond: {},
                    relation:'$and'
                }
                obj['cond']['keyword'] = document.querySelector('.condition-search-input').value;
                obj['cond']['leftBracket'] = document.querySelector('.condition-search-select.left-select').value;
                obj['cond']['operate'] = document.querySelector('.condition-search-select.relation').value;
                obj['cond']['rightBracket'] = document.querySelector('.condition-search-select.right-select').value;
                obj['cond']['searchBy'] = document.querySelector('.condition-search-box-input').name;
                obj['cond']['searchByName'] = document.querySelector('.condition-search-box-input').value;
                obj['cond']['searchByNew'] = document.querySelector('.condition-search-box-input').name;
                config.searchInputList.push(obj);
            } else {
                for(let i = 0; i < itemList.length; i++) {
                    let obj = {
                        cond: {},
                        relation:'$and'
                    }
                    obj['cond']['keyword'] = document.querySelectorAll('.condition-search-input')[i].value;
                    obj['cond']['leftBracket'] = document.querySelectorAll('.condition-search-select.left-select')[i].value;
                    obj['cond']['operate'] = document.querySelectorAll('.condition-search-select.relation')[i].value;
                    obj['cond']['rightBracket'] = document.querySelectorAll('.condition-search-select.right-select')[i].value;
                    obj['cond']['searchBy'] = document.querySelectorAll('.condition-search-box-input')[i].name;
                    obj['cond']['searchByName'] = document.querySelectorAll('.condition-search-box-input')[i].value;
                    obj['cond']['searchByNew'] = document.querySelectorAll('.condition-search-box-input')[i].name;
                    if($('.condition-search-radio.or:eq(i)').prop(checked) == true) {
                        obj[relation] = '$or';
                    }
                    config.searchInputList.push(obj);
                }
            }
            console.log(config.searchInputList)
        },
        showSearchData: function(data) {
            let searchData = data;
            // let epCondition = new expertCondition();
            // epCondition.actions.delete();
            // $('.condition-search-container').html('');
            // debugger
            this.actions.rendSearchItem()
            for(let i = 0; i<searchData.length-1; i++) {
                this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
            }
            for(let j = 0;j<searchData.length;j++) {
                let html = this.actions.checkedRelationType(searchData[j]['cond']['searchByName']);
                document.querySelectorAll('.condition-search-select.relation')[j].innerHTML = html
                document.querySelectorAll('.condition-search-input')[j].value = searchData[j]['cond']['keyword'];
                document.querySelectorAll('.condition-search-select.left-select')[j].value = searchData[j]['cond']['leftBracket'];
                document.querySelectorAll('.condition-search-select.relation')[j].value = searchData[j]['cond']['operate'];
                document.querySelectorAll('.condition-search-select.right-select')[j].value = searchData[j]['cond']['rightBracket'];
                document.querySelectorAll('.condition-search-box-input')[j].name = searchData[j]['cond']['searchBy'];
                document.querySelectorAll('.condition-search-box-input')[j].value = searchData[j]['cond']['searchByName'];
                document.querySelectorAll('.condition-search-box-input')[j].name = searchData[j]['cond']['searchByNew'];
            }
        },
        checkedRelationType: function(value){
            let htmlStr;
            this.data.fieldsData.forEach((item)=> {
                if(item.name == value) {
                    switch (item.searchType) {
                        case "datetime": htmlStr = config.optionHtmlTwo; break;
                        case "text": htmlStr = config.optionHtmlOne; break;
                        case "number": htmlStr = config.optionHtmlOne; break
                    }
                }
            })
            return htmlStr;
        }
    },
    afterRender: function() {
        let epCondition = new expertCondition();
        this.actions.rendSearchItem();
        this.el.on('click','.condition-search-box-input', function() {
            if (config.ulChecked){
                $(this).next('.condition-search-ul').css('display','block');
                config.ulChecked = !config.ulChecked;
            } else {
                $(this).next('.condition-search-ul').css('display','none');
                config.ulChecked = !config.ulChecked;
            }
            epCondition.actions.setInputObject($(this),$(this).parent().parent().find('.condition-search-input'))
        }).on('click','.add',()=> {
            this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
        }).on('click','.condition-search-radio', function() {
            $(this).parent().find('.condition-search-radio').prop('checked',false)
            $(this).prop('checked',true)
        }).on('click','.searchButton', ()=> {
            this.actions.submitData()
        }).on('click','.common-search-item',()=> {
            this.actions.showSearchData(this.data.queryParams);
        })

    }

}
class expertSearch extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config)
    }
}
export default {
    expertSearch:expertSearch,
    show: function (d) {
        let component = new expertSearch(d);
        let el = $('<div>').appendTo(document.body);
        component.render(el);
        el.dialog({
            title: '高级查询',
            width: 1000,
            height: 600,
            close: function () {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    }
}