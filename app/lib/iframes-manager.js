/**
 *  根据常用菜单预加载iframes
 */
const IframesManager = {
    initIframes:function (data) {
        this.$wrap = $('.pre-loading-iframes');
        for(let k of data){
            this.addIframe(k);
        }
    },
    /**
     * 根据data添加iframes，data包含id和url
     * @param data
     */
    addIframe(data){
        if(data.id && data.url){
            console.log(this.$wrap,data);
            this.$wrap.append($(`<iframe id="${data.id}" src="${data.url}" >`));
        }
    },
    deleteIfrmae(id){
        if(id && id !== ''){
            this.$wrap.find(`#${id}`).remove();
        }
    },
    getIframe(id){
        if(id && id !== ''){
            return this.$wrap.find(`#${id}`);
        }
    }
};

export {IframesManager}