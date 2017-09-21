/**
 *@author yudeping
 *枚举选项快捷添加
 */

import template from './picture-attachment.html';
let css = `.imgList {
    min-width: 25%;
    width: auto;
    height: 100%;
    float: left;
    margin-left:14px;
    overflow-y: scroll;
}
.textList {
    width: 100%;
    height: 100%;
    border: 1px solid #d4d4d4;
    margin: auto;
    position: relative;
}
.imgList div {
    //height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #F2F2F2;
}
.select-img a{
    position: absolute;
    top: 4px;
    right:0;
    outline-style:none;
    display: inline-block;
    margin-left: 5px;
    margin-right: 10px;
}
.imgContain {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid #d4d4d4;
    float: left;
    overflow: hidden;
}
// .changeBtn {
//     width: 100px;
//     height: 100px;
//     position: absolute;
//     top: calc(50% - 50px);
//     z-index: 999;
//     border: 1px solid #d4d4d4;
//     text-align: center;
//     line-height: 100px;
//     font-size: 30px;
//     background: #ddd;
//     opacity: 0.4;
// }
// .changeBtn:hover {
//     opacity: 0.7;
//     cursor: pointer;
// }
.showImg{
    width:100%;
    height:100%;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;
}
#myImg {
    width: auto;
    height: auto;
    visibility: hidden;
    position: absolute;
}
#ImgToShow {
    display: block;
    max-width:100%;
    max-height:100%;
}
,
`;
let PictureAttachment = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
        imgData:'',
        imgSelect:'',
        res:'',
        seletNum:0,
    },
    actions:{
        //设置背景色
        setBackground(){
            this.el.find('.select-img').each((index,obj)=>{
                let color=$(obj).data('imgselect') == this.data.imgSelect? '#F2F2F2' : '#fff';
                $(obj).css('background-color',color);
            });
        },
        //创建img地址
        createUrl(fieldId){
            let url=`/download_attachment/?file_id=${fieldId}&download=0`
            this.data.imgShow.attr('src',url)
            this.data.myImg.attr('src',url)
        },
        //切换图片
        changeImg(id,index){
            this.actions.createUrl(id);
            this.data.imgSelect=id;
            this.data.seletNum=index;
            this.actions.setBackground();
        }
    },
    afterRender(){
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        let _this=this;
        this.actions.setBackground();
        this.data.imgShow=this.el.find('#ImgToShow');
        this.data.myImg=this.el.find('#myImg');
        this.data.len=this.data.rows.length;
        this.el.on('click','.select-img',function(){
            _this.actions.changeImg($(this).data('imgselect'),$(this).index());
        })
        // this.el.on('click','.changeBtn',function(){
        //     let num =$(this).data('num');
        //     if(num==1){
        //         if(_this.data.seletNum-1 >= 0){
        //             _this.actions.changeImg(_this.data.rows[_this.data.seletNum-1]['file_id'],_this.data.seletNum-1);
        //         }else{
        //             _this.actions.changeImg(_this.data.rows[_this.data.rows.length-1]['file_id'],_this.data.rows.length-1);
        //         }
        //     }else{
        //         if(_this.data.seletNum+1 <= _this.data.rows.length-1){
        //             _this.actions.changeImg(_this.data.rows[_this.data.seletNum+1]['file_id'],_this.data.seletNum+1);
        //         }else{
        //             _this.actions.changeImg(_this.data.rows[0]['file_id'],0);
        //         }
        //     }
        // })
    },
    beforeDestory(){
        this.data.style.remove();
    }
}
export default PictureAttachment