/**
 * Created by Yunxuan Yan on 2017/8/11.
 */

import template from './screenshot-receiver.html'
import Component from "../../../../lib/component";
import './screenshot-receiver.scss';

export const screenShotConfig = {
    template: template,
    binds: [
        {
            event: 'click',
            selector: '.comfirm-n-save',
            callback: function () {
                if (this.data.file == '') {
                    return;
                }
                window.parent.postMessage({
                    type: '1',
                    key: this.key,
                    data: {
                        file: this.data.file
                    }
                }, location.origin);
            }
        }, {
            event: 'click',
            selector: '.cancel-to-rechoose',
            callback: function () {
                if (!this.data.imageEle) {
                    return;
                }
                this.data.imageEle.remove();
                t.el.find('.paste-tip').css('display', 'block');
                this.data.file = '';
            }
        }
    ],
    data: {
        file: '',
    },
    afterRender: function () {
        let t = this;
        this.el.on('paste', (event) => {
            if (this.data.file != '') {
                return;
            }
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (let index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    t.data.file = blob;
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        let ele = $('<img>');
                        ele.addClass('screenshot-image');
                        ele.attr('src', event.target.result);
                        t.el.find('.img-anchor').append(ele);
                        t.data['imageEle'] = ele;
                        t.el.find('.paste-tip').css('display', 'none');
                    }; // data url!
                    reader.readAsDataURL(blob);
                }
            }
        });
    }
}

