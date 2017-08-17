/**
 * @author zhaoyan
 * 打开全局查询结果展示界面
 */

import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import {ResearchResult} from "../components/main/search-display/search-display";

let component = new ResearchResult();
component.render($("#search-display-window"));