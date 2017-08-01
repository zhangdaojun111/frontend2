import Component from "../../../../lib/component";
import template from './data-pagination.html';
import './data-pagination.scss';
import {Grid,GridOptions} from 'ag-grid/main';


let config = {
    template: template,
    data: {
        pagination:true,
        //数据总条数
        total:1000,
        //记录总页数
        myPageAll:11,
        currentPage:11,
    },
    actions: {
        //改变页面条数大小
        initPage:function (){
            // this.data[pagination] =
        },
        changeData: function () {
            
        }
    },
    afterRender: function (){
        // this.action.postData();

       $(".selectSize").on("change",()=>{

           }
       )

    },



}
class dataPagination extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d]
        }
        super(config);

    }

}

export default dataPagination;