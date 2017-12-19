/**
 * Created by Yunxuan Yan on 2017/8/25.
 */

import template from './thumbnail-list.html';
import './thumbnail-list.scss';
import Component from "../../../../lib/component";
// import Preview from '../../../util/preview/preview';
import {PMAPI, PMENUM} from "../../../../lib/postmsg";

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
                this.actions.moveDot();
            }
        },{
            event:'click',
            selector:'.right-button.enable',
            callback:function () {
                this.data.currentIndex++;
                this.actions.setMoveController();
                this.actions.loadThumbnail();
                this.actions.moveDot();
            }
        }
    ],
    data:{
        currentIndex:0, //列表上第一个图片的index
        enableThumbnailIndex:1 //轮播上亮的点所代表的图片的index
    },
    actions:{
        addItem:function (item) {
            this.data.items.push(item);
            this.actions.setMoveController();
            this.actions.loadThumbnail();
            this.actions.addDot(this.el.find('.image-controller'),this.data.items.length-1);
        },
        addDot:function (imgControlEle,i) {
            let ele = $('<div class="dot disable" id="'+i+'"></div>');
            imgControlEle.append(ele);
            ele.on('click',()=>{
                this.data.enableThumbnailIndex = i;
                ele.removeClass('disable').addClass('enable');
                this.actions.moveList(i);
                this.actions.updateDotState();
            })
        },
        deleteItem:function (fileId) {
            for(let i=0,length = this.data.items.length;i<length;i++){
                let item = this.data.items[i];
                if(item[fileId]){
                    this.data.items.splice(i,1);
                    if(this.data.items.length == 0){
                        this.el.find('.thumbnail-list').remove();
                        return;
                    }
                    if(i == this.data.currentIndex || this.data.currentIndex + 3 >= this.data.items.length){
                        this.data.currentIndex = (this.data.currentIndex + 3 >= this.data.items.length)
                            ?((this.data.currentIndex - 1 < 0)? 0:this.data.currentIndex - 1):this.data.currentIndex+1;
                        this.actions.setMoveController();
                        this.actions.loadThumbnail();
                    }
                    //轮播控制更新
                    if(this.data.enableThumbnailIndex > i){
                        this.data.enableThumbnailIndex--;
                    }
                    this.actions.updateDotIds(i);
                    this.actions.updateDotState();
                    return;
                }
            }
        },
        updateDotIds:function (index) {
            this.el.find('.dot#'+index).remove();
            for(let i = index+1, length = this.data.items.length;i < length;i++){
                this.el.find('.dot#'+i).attr('id',i-1);
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
        },
        initImageController:function () {
            let imgControlEle = this.el.find('.image-controller');
            for(let i = 0,length = this.data.items.length; i < length; i++){
                this.actions.addDot(imgControlEle,i);
            }
            this.data.enableThumbnailIndex = this.data.length >=2 ?this.data.currentIndex+1:this.data.currentIndex;
            this.actions.updateDotState();
        },
        moveDot:function () {
            this.data.enableThumbnailIndex = this.data.items.length > this.data.currentIndex+1?this.data.currentIndex+1:this.data.currentIndex;
            this.actions.updateDotState();
        },
        updateDotState:function () {
            this.el.find('.dot.enable').removeClass('enable').addClass('disable');
            this.el.find('.dot#'+this.data.enableThumbnailIndex).removeClass('disable').addClass('enable');
            //设置控制点的宽度，用于调整其位置正中
            this.el.find('.image-controller').css('width',this.data.items.length*15+'px');
        },
        moveList:function (i) {
            if(this.data.items.length <=3){
                return;
            }
            //向右移
            if(i > this.data.currentIndex+2){
                this.data.currentIndex = i - 2;
            }
            //向左移
            if(i < this.data.currentIndex){
               this.data.currentIndex = i;
            }
            this.actions.setMoveController();
            this.actions.loadThumbnail();
        }
    },
    afterRender:function () {
        for(let i = 0;i < 3; i++){
            let imgEle = $('<img class="thumbnail-'+i+'" style="width: 50px;height: 50px;padding: 5px">');
            this.el.find('.thumbnail-anchor').append(imgEle);
            imgEle.on('click',(event)=>{
                if(!this.data.items[this.data.currentIndex+i]){
                    return;
                }
                PMAPI.openPreview({list:this.data.items,currentIndex:this.data.currentIndex+i,dinput_type:this.data.dinput_type});
                event.stopPropagation({list:this.data.items,currentIndex:this.data.currentIndex+i});
            })
        }
        this.actions.setMoveController();
        this.actions.loadThumbnail();
        this.actions.initImageController();
    }
}
let ThumbnailList = Component.extend(config)
export default ThumbnailList

