import Component from "../../../../lib/component";
import template from './data-pagination.html';
import './data-pagination.scss';

let config = {
    template: template,
    data: {
        pagination:true,
        //数据总条数
        total: 0,
        //每页显示数量
        rows: 100,
        //当前页数
        currentPage:1,
        //分页总数
        sumPage: 8,
        //分页后第一条是总数据多少条
        firstRow: 1,
        //rows可选项
        options:[100,200,300,400,500,5000]
    },
    actions: {
        //分页数据改变
        paginationChanged: function ( currentPage,rows,firstRow ) {
            
        }
    },
    afterRender: function (){

    }
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