const path = require('path');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');

module.exports = {
    form: path.resolve(APP_PATH, 'entrys/form.js'),
    openForm: path.resolve(APP_PATH, 'entrys/popup/openForm.js'),
    choose: path.resolve(APP_PATH, 'entrys/popup/choose.js'),
    createWorkflow: path.resolve(APP_PATH, 'entrys/createWorkflow.js'),
    approvalWorkflow: path.resolve(APP_PATH, 'entrys/approvalWorkflow.js'),
    addSigner: path.resolve(APP_PATH, 'entrys/popup/addSigner.js'),
    addfocus: path.resolve(APP_PATH, 'entrys/popup/addfocus.js'),
    addWf: path.resolve(APP_PATH, 'entrys/popup/addWf.js'),
    approvalDialog: path.resolve(APP_PATH, 'entrys/popup/approvalDialog.js'),
    multiapp: path.resolve(APP_PATH, 'entrys/popup/multiapp.js'),
    dataGrid: path.resolve(APP_PATH, 'entrys/dataGrid.js'),
    customDataGrid: path.resolve(APP_PATH, 'entrys/popup/customDataGrid.js'),
    dataImport: path.resolve(APP_PATH, 'entrys/popup/dataImport.js'),
    expertSearch: path.resolve(APP_PATH, 'entrys/popup/expertSearch.js'),
    contractEditor: path.resolve(APP_PATH, 'entrys/popup/contractEditor.js'),
    searchImport: path.resolve(APP_PATH, 'entrys/popup/searchImport.js'),
    historyApprove: path.resolve(APP_PATH, 'entrys/popup/historyApprove.js'),
    operationDetails: path.resolve(APP_PATH, 'entrys/popup/operationDetails.js'),
    jurisdiction: path.resolve(APP_PATH, 'entrys/popup/jurisdiction.js'),
    workflowPage: path.resolve(APP_PATH, 'entrys/popup/workflowPage.js'),
    rowOperation: path.resolve(APP_PATH, 'entrys/popup/rowOperation.js'),
    sourceDataGrid: path.resolve(APP_PATH, 'entrys/popup/sourceDataGrid.js'),
    login: path.resolve(APP_PATH, 'entrys/login.js'),
    bi: path.resolve(APP_PATH, 'entrys/bi.js'),
    bimanager: path.resolve(APP_PATH, 'entrys/bimanager.js'),
    calendar: path.resolve(APP_PATH, 'entrys/calendar.js'),
    calendarSetRemind: path.resolve(APP_PATH, 'entrys/popup/calendarSetRemind.js'),
    calendarSet: path.resolve(APP_PATH, 'entrys/calendar.set.js'),
    calendarCreate: path.resolve(APP_PATH, 'entrys/calendar.create.js'),
    calendarOpenForm: path.resolve(APP_PATH, 'entrys/popup/calendarOpenForm.js'),
    calendarOpenSetting: path.resolve(APP_PATH, 'entrys/popup/calendarOpenSetting.js'),
    calendarExport: path.resolve(APP_PATH, 'entrys/popup/calendarExport.js'),
    calendarOpenRemind: path.resolve(APP_PATH, 'entrys/popup/calendarOpenRemind.js'),
    main: path.resolve(APP_PATH, 'entrys/main.js'),
    register: path.resolve(APP_PATH, 'entrys/register.js'),
    resultDisplay: path.resolve(APP_PATH, 'entrys/resultDisplay.js'),
    findPassword: path.resolve(APP_PATH, 'entrys/findPassword.js'),
    approvalOpinion: path.resolve(APP_PATH, 'entrys/popup/approvalOpinion.js'),
    followerDialog: path.resolve(APP_PATH, 'entrys/popup/followerDialog.js'),
};