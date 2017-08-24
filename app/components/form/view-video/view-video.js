/**
 *@author yudeping
 *视频播放器
 */

import template from './view-video.html';
let css = ``;
let ViewVideo = {
    template: template.replace(/\"/g, '\''),
    data: {
        css : css.replace(/(\n)/g, ''),
    },
    actions:{

    },
    afterRender(){
        let _this=this;
    },
}
export default ViewVideo