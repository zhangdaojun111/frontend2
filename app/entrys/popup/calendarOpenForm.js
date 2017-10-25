/**
 * Created by zj on 2017/8/9.
 */

// import '../assets/scss/form.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import FormEntrys from '../form';

console.log(window.config.real_id);
FormEntrys.initForm({
    table_id: window.config.table_id,
    real_id: window.config.real_id,
    seqId:'',
    el:$('body'),
});