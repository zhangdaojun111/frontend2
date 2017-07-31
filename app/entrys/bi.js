import CanvasCellsComponent from '../components/bisystem/canvas.cells/canvas.cells';
import AsideNav from '../components/bisystem/aside/bisystem.nav';

let CanvasCells = new CanvasCellsComponent();
let AsideBiNav = new AsideNav();

CanvasCells.render($('#bi-container'));
AsideBiNav.render($('#aside'));
