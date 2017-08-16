import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './search-bar.scss';
import template from './search-bar.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
import msgbox from "../../../../lib/msgbox";


let config = {
    template:template,
    data:{
        list:[],
    },
    actions:{
        initList:function () {
            let $listParent = this.el.find('.history-list');
            console.log(this.data.list);
            for( let k of this.data.list){
                console.log(k);
                let $li = $("<li class='record-item'>");
                $li.attr('data_content',k.content);

                let $content = $("<span class='record-content'>");
                $content.attr("operate","search");
                $content.html(k.content);

                let $delete = $("<span class='delete-icon'>");
                $delete.attr("operate","delete");
                $delete.html('x');

                $li.append($content);
                $li.append($delete);
                $listParent.append($li);
            }

            //添加清除历史记录按钮
            let $deleteBtn = $("<li class='delete-all-history'>");
            $deleteBtn.html("清除所有搜索记录");
            $listParent.append($deleteBtn);
        },
    },
    afterRender:function () {
        this.actions.initList();
        // this.el.on('click','.record-item',(event) => {
        //     this.actions.doSearch(event);
        // })
    },
    beforeDestory:function () {
        
    }
    
};

class SearchBar extends Component {
    constructor(data){
        super(config);
        this.data.list = data;
    }
}

export {SearchBar};







// let destroyItem = {
//     name : "清除历史搜索记录",
//     id : "destroy-all-record"
// };


//为每条记录加入删除图标
// $container.find('ul.popup').find('li').each(function() {
//     let $delete = $("<span class='record-delete'>");
//     $delete.html('x');
//     $(this).append($delete);
// })