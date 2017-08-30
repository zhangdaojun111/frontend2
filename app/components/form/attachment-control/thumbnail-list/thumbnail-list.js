/**
 * Created by Yunxuan Yan on 2017/8/25.
 */

import template from './thumbnail-list.html';
import './thumbnail-list.scss';
import Component from "../../../../lib/component";

let config = {
    template:template,
    binds:[
        {
            event:'click',
            selector:'.left-button.enable',
            callback:function () {
                this.data.currentIndex--;
                this.actions.setMoveController();
                this.actions.loadThumbnail();
            }
        },{
            event:'click',
            selector:'.right-button.enable',
            callback:function () {
                this.data.currentIndex++;
                this.actions.setMoveController();
                this.actions.loadThumbnail();
            }
        }
    ],
    data:{
        currentIndex:0
    },
    actions:{
        addItem:function (item) {
            this.data.items.push(item);
            this.actions.setMoveController();
            this.actions.loadThumbnail();
        },
        deleteItem:function (fileId) {
            for(let i=0,length = this.data.items.length;i<length;i++){
                let item = this.data.items[i];
                if(item[fileId]){
                    this.data.items.splice(i,1);
                    if(i == this.data.currentIndex || this.data.currentIndex + 3 >= this.data.items.length){
                        this.data.currentIndex = (this.data.currentIndex + 3 >= this.data.items.length)
                            ?((this.data.currentIndex - 1 < 0)? 0:this.data.currentIndex - 1):this.data.currentIndex+1;
                        this.actions.setMoveController();
                        this.actions.loadThumbnail();
                    }
                    return;
                }
            }
        },
        setMoveController:function () {
            if(this.data.currentIndex > 0){
                this.el.find('.left-button').removeClass('disable').addClass('enable');
            } else {
                this.el.find('.left-button').removeClass('enable').addClass('disable');
            }
            if(this.data.currentIndex + 3 < this.data.items.length){
                this.el.find('.right-button').removeClass('disable').addClass('enable');
            } else {
                this.el.find('.right-button').removeClass('enable').addClass('disable');
            }
        },
        loadThumbnail:function () {
            for(let i = 0;i < 3;i++){
                let index = i+this.data.currentIndex;
                if(index < this.data.items.length){
                    this.el.find('.thumbnail-'+i).attr('src',Object.values(this.data.items[index])[0])
                        .attr('id',Object.keys(this.data.items[index])[0]);
                }else {
                    this.el.find('.thumbnail-'+i).removeAttr('src').removeAttr('id');
                }
            }
        }
    },
    afterRender:function () {
        for(let i = 0;i < 3; i++){
            let imgEle = $('<img class="thumbnail-'+i+'" style="width: 50px;height: 50px;padding: 5px">');
            this.el.find('.thumbnail-anchor').append(imgEle);
            imgEle.on('click',(event)=>{
                let src = "/download_attachment/?file_id='+fileId+'&download=0";
                this.el.find('.preview').attr('src',src).css('display','block');
                event.stopPropagation();
                $(document).click((event2)=>{
                    if(event2.target.classList.value != 'preview'){
                        this.el.find('.preview').css('display','none');
                    }
                })
            })
        }
        this.actions.setMoveController();
        this.actions.loadThumbnail();
    }
}

export default class ThumbnailList extends Component{
    constructor(data){
        super(config,{items:data});
    }
}
