import '../../assets/scss/main.scss';
import '../../assets/scss/workflow/workflow-base.scss'
import AddFocus from '../../components/workflow/add-focus/add-focus'

let focus=location.search.slice(1).split('&')[0].split(',');
new AddFocus({data:{focus}}).render($('#add-follow'));
