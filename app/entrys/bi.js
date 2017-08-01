import '../assets/scss/bisystem/bisystem.nav.scss';
import {CanvasCellsComponent} from '../components/bisystem/canvas/canvas.cells';
import ViewsComponent from "../components/bisystem/views/views";


let CanvasCells = new CanvasCellsComponent();
CanvasCells.render($('#bi-container'));

   let Views = new ViewsComponent();

   Views.render($('#views'));



