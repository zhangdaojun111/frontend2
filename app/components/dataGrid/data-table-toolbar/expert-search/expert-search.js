import Component from "../../../../lib/component";
import template from './expert-search.html';
import expertCondition from './expert-search-condition/expert-search-condition'

import './expert-search.scss';

let config = {
    template: template,
    data: {
        //高级查询字段信息
        fieldsData: []
    },
    actions: {

    },
    afterRender: function() {
        console.log( "字段信息" )
        console.log( this.data.fieldsData );
        this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search'));
        let ulChecked = true;
        this.el.on('click','.condition-search-box-input', function (){
            if (ulChecked){
                $(this).next('.condition-search-ul').css('display','block');
                ulChecked = !ulChecked;
            } else {
                $(this).next('.condition-search-ul').css('display','none');
                ulChecked = !ulChecked;
            }
        }).on('click','.add',()=> {
            this.append(new highGradeCondition({highGradeItemData:this.data.fieldsData}), this.el.find('.condition-search'));
            // new highGradeCondition(this.data).actions.rendItem()
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