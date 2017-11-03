/**
 * Created by zj on 2017/11/1.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import FollowerDialog from '../../components/workflow/approval-workflow/followerDialog/followerDialog';

let el = document.getElementsByTagName('div');
console.log(el);

let followerDialog = new FollowerDialog();

followerDialog.render($('#followerDialog'));