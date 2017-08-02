/**
 * Created by birdyy on 2017/8/1.
 */
import {HTTP} from '../../lib/http';

export const canvasCellService = {
    $http: HTTP,
    getCellLayout() {
        this.$http.getImmediately('/bi/get_view_layout/?view_id=30&canvasType=pc', (res) => {
            console.log(res);
        })
    }
}

