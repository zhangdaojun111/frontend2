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
        let ulChecked = true;
        $('.condition-search-box-input').on('click',($event)=> {
            if (ulChecked){
                debugger
                console.log($event)
                $(this).next('.condition-search-ul').css('display','block')
                ulChecked = !ulChecked;
            } else {
                $(this).next('.condition-search-ul').css('display','none')
                ulChecked = !ulChecked;
            }
        })
        // this.el.on('click','.condition-search-box-input',()=>{
        //     console.log(this)
        //     if (ulChecked){
        //         this.el.find('.condition-search-ul').css('display','block')
        //         ulChecked = !ulChecked;
        //     } else {
        //         this.el.find('.condition-search-ul').css('display','none')
        //         ulChecked = !ulChecked;
        //     }
        // }).on('click','.add',()=> {
        //     this.append(new highGradeCondition(), this.el.find('.condition-search'))
        // })
    }
}
class highGradeSearch extends Component {
    constructor() {
        super(config)
    }
}
export default highGradeSearch