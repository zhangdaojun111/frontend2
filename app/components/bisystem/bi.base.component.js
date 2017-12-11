/**
 * Created by birdyy on 2017/7/31.
 * name: bi基础类
 * desc: 用来扩展component
 */

import '../../assets/scss/bisystem/bi.common.scss';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import Component from '../../lib/component';

export class BiBaseComponent extends Component{
    constructor(extendConfig) {
        super($.extend(true,{},extendConfig));
    }

    /**
     *组件消息传递
     * @param name '消息标识符', data数据传递
     */
    messager(name,data) {
        this.el.trigger(name,data);
    }
}
