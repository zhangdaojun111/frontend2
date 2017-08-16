/**
 * Created by birdyy on 2017/8/16.
 * chart 配置表单获取数据源，x轴，y轴数据
 */
import {HTTP} from "../../lib/http";

export const ChartFormService = {
    /**
     * 从服务器获取图表数据源
     * @return 数据源promise
     */
    async getChartSource() {
            let res = await HTTP.getImmediately('/bi/get_new_table_info');
            return Promise.resolve(res);
    }


}
