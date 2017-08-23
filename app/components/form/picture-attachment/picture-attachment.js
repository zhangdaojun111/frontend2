/**
 *@author yudeping
 *枚举选项快捷添加
 */

import template from './picture-attachment.html';
let css = ``;
let PictureAttachment = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
        imgData:'',
        imgSelect:'',
    },
    actions:{
        //图片预览调整尺寸
        sizeImageWin(){
            let oldWidth = $("#myImg").width();
            let oldHeight = $("#myImg").height();
            let fWidth = $(".imgContain").width();
            let fHeight = $(".imgContain").height();

            if (( oldWidth >= fWidth && oldHeight < fHeight ) || ( oldWidth < fWidth && oldHeight < fHeight && ( oldWidth / fWidth >= oldHeight / fHeight ) ) || ( oldWidth >= fWidth && oldHeight >= fHeight && ( oldWidth / fWidth >= oldHeight / fHeight ) )) {
                $("#ImgToShow").css({
                    "width": fWidth,
                    "height": "auto",
                    "top": ( fHeight - fWidth / oldWidth * oldHeight ) / 2,
                    "left": 0
                });
            } else {
                $("#ImgToShow").css({
                    "width": "auto",
                    "height": fHeight,
                    "top": 0,
                    "left": ( fWidth - fHeight / oldHeight * oldWidth ) / 2
                });
            }
        },
        setImgDataAndNum(res,imgData,imgSelect){
            imgData = res;
            this.imgTotal = res.rows.length;
            if(imgData){
                for( let i=0;i<imgData.rows.length;i++ ){
                    imgData.rows[i]["isSelect"] = false;
                }
                if( imgData.rows[0] ){
                    imgData.rows[0]["isSelect"] = true;
                    imgSelect = imgData.rows[0].file_id;
                }
            }
            this.imgNum = 0;
            return {imgSelect:imgSelect,imgData:imgData};
        }
    },
    afterRender(){
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        let _this=this;
        this.el.find('.select-img').each((index,obj)=>{
           $(obj).get(0).style.background=$(obj).data('imgSelect') == _this.data.imgSelect? '#d4d4d4' : '#fff';
        });
        let obj=this.actions.setImgDataAndNum(res,this.data.imgData,this.data.imgSelect);
        this.data.imgData=obj.imgData;
        this.data.imgSelect=obj.imgSelect;
        this.data.rows=this.data.imgData.rows;
        this.actions.sizeImageWin();
    },
    beforeDestory(){
        this.data.style.remove();
    }
}
export default PictureAttachment