/**
 * Created by birdyy on 2017/7/31.
 * name: bi基础类
 * desc: 用来扩展component
 */

import '../../assets/scss/core/reset.scss';
import '../../assets/scss/core/common.scss';
import '../../assets/scss/core/jquery-ui-theme.scss';
import '../../assets/scss/core/base.scss';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import Component from '../../lib/component';

export class BiBaseComponent extends Component{
    constructor(config) {
        super(config)
    }

    /**
     *组件消息传递
     * @param name '消息标识符', data数据传递
     */
    messager(name,data) {
        this.el.trigger(name,data)
    }
}
