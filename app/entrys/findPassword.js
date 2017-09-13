/**
 * @author zhaoyan
 * 打开密码找回界面
 */

import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import {FindPassword} from "../components/find-password/find-pw";

let component = new FindPassword();
component.render($("#find-password-main-window"));