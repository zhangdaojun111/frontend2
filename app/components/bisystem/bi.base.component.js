/**
 * Created by birdyy on 2017/7/31.
 * name: bi基础类
 * desc: 用来扩展component
 */

import '../../assets/scss/core/reset.scss';
import '../../assets/scss/core/common.scss';
import '../../assets/scss/core/jquery-ui-theme.scss';
import '../../assets/scss/core/base.scss';
import "../../assets/scss/bisystem/quill.snow.css";
import Component from '../../lib/component';
import Handlebars from 'handlebars';

export class BiBaseComponent extends Component{
    constructor(config) {
        super(config)
    }
}
