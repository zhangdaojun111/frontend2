/**
 * Created by birdyy on 2017/8/15.
 * form配件抽象类
 */
import {BiBaseComponent} from '../../bi.base.component';
export class FormFittingAbstract extends BiBaseComponent{
    /**
     * 获取配件的value
     */
    getValue() {}
    /**
     * 设置配件的value
     */
    setValue() {}
    /**
     * 只有radio，checkbox类型配件需要
     */
    onChange() {}
}