/**
 * Created by zhr
 * Iframe我的工作详情
 */
import operationDetails from '../../components/dataGrid/data-table-toolbar/operation-details/operation-details.js'
$(document).ready(function(){
    let obj = {
        key: window.config.key
    }
    let opDetails = new operationDetails(obj);
    opDetails.render($('#operationDetails'));
})