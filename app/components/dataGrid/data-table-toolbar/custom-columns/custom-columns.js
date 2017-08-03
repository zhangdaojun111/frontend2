import Component from "../../../../lib/component";
import template from './custom-columns.html';
import './custom-columns.scss';

let config = {
    template: template,
    data: {
        gridoptions: null,
        fields: []
    },
    actions: {},
    afterRender: function (){
        console.log( this.data.gridoptions )
        console.log( this.data.fields )
        $( "#dragCustom" ).sortable({
            items: "li:not(.ui-state-disabled)"
        });
        $( "#dragCustom" ).disableSelection();
    }
}

class customColumns extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default customColumns;