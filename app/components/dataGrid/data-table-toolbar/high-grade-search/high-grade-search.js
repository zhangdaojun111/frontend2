import Component from "../../../../lib/component";
import template from './high-grade-search.html';
import highGradeCondition from './high-grade-search-condition/high-grade-search-condition'

import './high-grade-search.scss';

let config = {
    template: template,
    data: {

    },
    actions: {

    },
    afterRender: function() {
        this.append(new highGradeCondition(), this.el.find('.condition-search'));
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
            this.append(new highGradeCondition(), this.el.find('.condition-search'));
            console.log(this)
            new highGradeCondition().actions.rendItem()
        })
    }

}
class highGradeSearch extends Component {
    constructor() {
        super(config)
    }
}
export default highGradeSearch