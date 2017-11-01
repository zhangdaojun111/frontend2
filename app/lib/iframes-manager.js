/**
 *  根据常用菜单预加载iframes
 */

const IframesManager = {
    initIframes:function (data, dom) {
        this.$wrap = dom;
        this.addIframes(data);
    },
    /**
     * 根据data添加iframes，data包含id和url
     * @param data
     */
    addIframe(data){
        if(data.id && data.url){
            this.$wrap.append($(`<div class="item" style="display: none"><iframe id="${data.id}" _src="${data.url}"></iframe></div>`));
        }
    },

    addIframes(data){
        let html = [];
        for(let k of data){
            html.push(`<div class="item" style="display: none"><iframe id="${k.id}" _src="${k.url}"></iframe></div>`);
        }
        this.$wrap.append(html.join(''));
    },

    /**
     * 根据id删除预加载的iframe
     * @param id
     */
    deleteIfrmae(id){
        if(id && id !== ''){
            this.$wrap.find(`#${id}`).parent().remove();
        }
    },
    /**
     * 根据id获取iframe
     * @param id
     * @returns {*}
     */
    getIframe(id){
        if(id && id !== ''){
            return this.$wrap.find(`#${id}`).parent();
        }
    }
};

export {IframesManager}