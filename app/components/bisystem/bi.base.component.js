/**
 * Created by birdyy on 2017/7/31.
 * name: bi基础类
 * desc: 用来扩展component
 */

import '../../assets/scss/core/reset.scss';
import Component from '../../lib/component';
import "../../assets/scss/bisystem/quill.snow.css";
import "../../assets/scss/bisystem/font/font-awesome.css";
import Handlebars from 'handlebars';

export class BiBaseComponent extends Component{
    constructor(config) {
        super(config)
    }
}
