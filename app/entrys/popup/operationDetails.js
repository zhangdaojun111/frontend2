/**
 * Created by zhr
 */
import operationDetails from '../../components/dataGrid/data-table-toolbar/operation-details/operation-details.js'
$(document).ready(function(){
    console.log(window.config.key)
    let obj = {
        key: window.config.key
    }
    let opDetails = new operationDetails(obj);
    opDetails.render($('#operationDetails'));
})