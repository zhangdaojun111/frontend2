/**
 *@author yudeping
 *枚举选项快捷添加
 */

import template from './picture-attachment.html';
let css = `.imgList {
    width: 15%;
    height: 100%;
    border: 1px solid #d4d4d4;
    float: left;
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
    height: 80px;
    border: 1px solid #d4d4d4;
}
.imgList div a {
    display: inline-block;
    margin-left: 5px;
    color: blueviolet;
}
.imgContain {
    position: relative;
    width: 80%;
    height: 100%;
    border: 1px solid #d4d4d4;
    float: left;
    overflow: hidden;
}
.changeBtn {
    width: 100px;
    height: 100px;
    position: absolute;
    top: calc(50% - 50px);
    z-index: 999;
    border: 1px solid #d4d4d4;
    text-align: center;
    line-height: 100px;
    font-size: 30px;
    background: #ddd;
    opacity: 0.4;
}
.changeBtn:hover {
    opacity: 0.7;
    cursor: pointer;
}

#myImg {
    width: auto;
    height: auto;
    visibility: hidden;
    position: absolute;
}
#ImgToShow {
    display: block;
    position: absolute;
}`;
let PictureAttachment = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
        imgData:'',
        imgSelect:'',
        res:'',
    },
    actions:{
        setImageNum(imgData,val){
            for (let i = 0; i < imgData.rows.length; i++) {
                if (imgData.rows[i]["file_id"] == val) {
                    this.data.imgNum=i;
                    return i;
                }
            }
            return null;
        },
        setImgData(imgData){
            for (let i = 0; i < imgData.rows.length; i++) {
                imgData.rows[i]["isSelect"] = (i == this.data.imgNum);
            }
        },
        //图片预览调整尺寸
        sizeImageWin(){
            let oldWidth = this.el.find("#myImg").width();
            let oldHeight = this.el.find("#myImg").height();
            let fWidth = this.el.find(".imgContain").width();
            let fHeight = this.el.find(".imgContain").height();

            if (( oldWidth >= fWidth && oldHeight < fHeight ) || ( oldWidth < fWidth && oldHeight < fHeight && ( oldWidth / fWidth >= oldHeight / fHeight ) ) || ( oldWidth >= fWidth && oldHeight >= fHeight && ( oldWidth / fWidth >= oldHeight / fHeight ) )) {
                this.el.find("#ImgToShow").css({
                    "width": fWidth,
                    "height": "auto",
                    "top": ( fHeight - fWidth / oldWidth * oldHeight ) / 2,
                    "left": 0
                });
            } else {
                this.el.find("#ImgToShow").css({
                    "width": "auto",
                    "height": fHeight,
                    "top": 0,
                    "left": ( fWidth - fHeight / oldHeight * oldWidth ) / 2
                });
            }
        },
        setImgDataAndNum(res,imgData,imgSelect){
            imgData = res;
            this.data.imgTotal = res.rows.length;
            if(imgData){
                for( let i=0;i<imgData.rows.length;i++ ){
                    imgData.rows[i]["isSelect"] = false;
                }
                if( imgData.rows[0] ){
                    imgData.rows[0]["isSelect"] = true;
                    imgSelect = imgData.rows[0].file_id;
                }
            }
            this.data.imgNum = 0;
            return {imgSelect:imgSelect,imgData:imgData};
        },
        imgClickChange(val) {
            let imgNum = this.actions.setImageNum(this.data.imgData,val)||this.data.imgNum;
            this.data.imgSelect = this.data.imgData.rows[imgNum].file_id;
            this.actions.setImgData(this.data.imgData);
            this.actions.sizeImageWin();
            this.reload();
        },
        getImageNum(num){
            if (num == 1) {
                this.data.imgNum = (this.data.imgNum == 0)? this.data.imgTotal - 1 : this.data.imgNum - 1;
            } else {
                this.data.imgNum = (this.data.imgNum == this.data.imgTotal - 1)? 0 : this.data.imgNum + 1;
            }
            return this.data.imgNum;
        }
    },
    afterRender(){
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        let _this=this;
        this.el.find('.select-img').each((index,obj)=>{
           $(obj).get(0).style.background=$(obj).data('imgSelect') == _this.data.imgSelect? '#d4d4d4' : '#fff';
        });
        this.actions.sizeImageWin();
        this.el.on('click','.img-click',function(){
            console.log($(this).data('fileId'));
            _this.actions.imgClickChange($(this).data('fileId'));
        })
        this.el.on('click','.changeBtn',function(){
            let num =$(this).data('num');
            let imgNum = _this.actions.getImageNum(num);
            _this.data.imgSelect = _this.data.imgData.rows[imgNum].file_id;
            _this.actions.setImgData(_this.data.imgData);
            _this.reload();
        })
    },
    beforeDestory(){
        this.data.style.remove();
    }
}
export default PictureAttachment