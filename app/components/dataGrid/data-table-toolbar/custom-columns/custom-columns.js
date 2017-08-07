import Component from "../../../../lib/component";
import template from './custom-columns.html';
import './custom-columns.scss';

let config = {
    template: template,
    data: {
        gridoptions: null,
        fields: [],
        icons: {
            check: require('../../../../assets/images/dataGrid/icon_checkbox_yes.png'),
            uncheck: require('../../../../assets/images/dataGrid/icon_checkbox_no.png'),
            rightkong: require('../../../../assets/images/dataGrid/icon_right_kong.png'),
            leftkong: require('../../../../assets/images/dataGrid/icon_left_kong.png'),
            rightshi: require('../../../../assets/images/dataGrid/icon_right_shi.png'),
            leftkshi: require('../../../../assets/images/dataGrid/icon_left_shi.png'),
        }
    },
    actions: {
        //使状态同步
        makeSameSate: function () {
            let state = this.data.gridoptions.columnApi.getColumnState();
            let html = '';
            let lis = this.el.find( '#dragCustom' ).find( 'li' );
            for( let s of state ){
                for( let li of lis ){
                    if( li.attributes.field.value == s.colId ){
                        li.querySelectorAll('img')[0].src = s.hide ? this.data.icons.uncheck : this.data.icons.check;
                        li.querySelectorAll('img')[1].src = s.pinned == 'left' ? this.data.icons.leftkshi : this.data.icons.leftkong;
                        li.querySelectorAll('img')[2].src = s.pinned == 'right' ? this.data.icons.rightshi : this.data.icons.rightkong;
                        html += li.outerHTML;
                        break;
                    }
                }
            }
            this.el.find( '#dragCustom' )[0].innerHTML = html;
        },
        //返回agGrid状态
        returnState: function () {
            let state = this.data.gridoptions.columnApi.getColumnState();
            return state
        },
        //设置agGrid状态
        setState: function (s) {
            this.data.gridoptions.columnApi.setColumnState( s );
        },
    },
    afterRender: function (){
        console.log( this.data.gridoptions )
        console.log( this.data.fields )
        $( "#dragCustom" ).sortable({
            items: "li:not(.custom-disabled)"
        });
        $( "#dragCustom" ).disableSelection();
        // console.log( this.data.gridoptions.columnApi.getColumnState() )
        // $( this.el.find( '#dragCustom li img' )[0] ).attr( 'src',this.data.icons.check )
        // let lis = this.el.find( '#dragCustom li img' )
        // for( let l of lis ){
        //
        // }
        this.actions.makeSameSate();
        let That = this;
        this.el.find( '.custom-checkbox' ).on( 'click',function(){
            console.log( "____" )
            console.log( "____" )
            let field = $( this ).eq(0).parent().attr( 'field' );
            console.log( "+++++++++++++++" )
            console.log( "+++++++++++++++" )
            console.log( That.actions )
            let state = That.actions.returnState();
            for( let s of state ){
                console.log( "++++++++++++++" )
                console.log( s )
                if( s.colId && s.colId == field ){
                    s.hide = !s.hide;
                }
            }
            That.actions.setState( state );
            That.actions.makeSameSate();
        } )
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