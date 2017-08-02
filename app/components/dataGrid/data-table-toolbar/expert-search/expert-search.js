import Component from "../../../../lib/component";
import template from './expert-search.html';
import expertCondition from './expert-search-condition/expert-search-condition'

import './expert-search.scss';

let config = {
    template: template,
    ulChecked: true,
    data: {
        //高级查询字段信息
        fieldsData: []
    },
    actions: {
        showList: function() {
            $('.condition-search-ul').css('display','block');
            config.ulChecked = !config.ulChecked;
        },
        hideList: function() {
            $('.condition-search-ul').css('display','none');
            config.ulChecked = !config.ulChecked;
        }
    },
    afterRender: function() {
        this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search'));
        let ulChecked = true;
        this.el.on('click','.condition-search-box-input', ()=> {
            if (config.ulChecked){
                this.actions.showList();
            } else {
                this.actions.hideList();
            }
        }).on('click','.add',()=> {
            this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search'));
            $('.condition-search-li').on('click', function() {
                console.log('111111');
            })
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