/**
 * Created by zhr
 */
import operationDetails from '../../components/dataGrid/data-table-toolbar/operationDetails/operationDetails.js'
$(document).ready(function(){
    debugger
    console.log(window.config.key)
    let obj = {
        key: window.config.key
    }
    let opDetails = new operationDetails(obj);
    opDetails.render($('#operationDetails'));
})