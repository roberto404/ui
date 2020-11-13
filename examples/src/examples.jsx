
/* !- Example: Style */

import StyleAvatar from './style/avatar';
import StyleButtons from './style/buttons';
import StyleScreen from './style/screen';
import StyleMui from './icon/mui';
import StyleLa from './icon/la';
import StyleGrid from './style/grid';


/* !- Example: Form */

import FormBasic from './form/basic';
import FormFields from './form/fields';
import FormFormat from './form/format';
import FormSubmit from './form/submit';
import FormConnect from './form/connect';
import FormFlat from './form/flat';
import FormPlain from './form/plain';
import FormCollection from './form/collection';
import FormSlider from './form/slider';
import FormDropzone from './form/dropzone';
import FormCalendar from './form/calendar';


/* !- Example: Grid */

import GridStatic from './grid/static';
import GridConnect from './grid/connect';
import GridDynamic from './grid/dynamic';
import GridPaginate from './grid/paginate';
import GridFilters from './grid/filters';
import GridSearch from './grid/search';
import GridExtra from './grid/extra';
import GridComplex from './grid/complex';
import GridList from './grid/list';
import GridCasual from './grid/casual';
import GridFilelist from './grid/filelist';
import GridPivotTable from './grid/pivotTable';
import GridPivotTableComplex from './grid/pivotTableComplex';
import GridWithoutGrid from './grid/withoutGrid';
import GridNestedList from './grid/nestedList';
import GridNestedListMenu from './grid/nestedListMenu';
import GridNestedListAccordion from './grid/nestedListAccordion';


/* !- Example: Layer */

import LayerActions from './layer/actions';


/* !- Example: Caroussel */

import CarousselSlides from './caroussel/slides';
import CarousselCaroussel from './caroussel/caroussel';
import CarousselDynamic from './caroussel/dynamic';


/* !- Example: Calendar */

import CalendarStatic from './calendar/static';
import CalendarWeek from './calendar/week';
import CalendarDynamic from './calendar/dynamic';
import CalendarCaroussel from './calendar/caroussel';
import CalendarFilters from './calendar/filters';


/* !- Example: Card */

import CardCard from './card/card';
import CardMarker from './card/marker';
import CardResponsible from './card/responsible';


/* !- Example: Chart */

import ChartCoordinate from './chart/coordinate';
import ChartComplex from './chart/complex';
import ChartBar from './chart/barChart';


/* !- Example: Map */

import MapGoogle from './map/gmaps';
// import Example from './map/mapbox/static';
// import Example from './map/mapbox/dynamic';


/* !- Example: Drag and drop */

import DndBasic from './dragAndDrop/basic';


/* !- Example: Sticky */

import Sticky from './sticky/sticky';


/* !- Example: Drag and drop */

import ViewBasic from './view/basic';
import ViewTab from './view/tab';


/* !- Example: Stepper */

import Stepper from './stepper/stepper';

/* !- Example: Utils */

import Print from './print';


export default {
  form: {
    basic: FormBasic,
    fields: FormFields,
    submit: FormSubmit,
    connect: FormConnect,
    flat: FormFlat,
    plain: FormPlain,
    collection: FormCollection,
    slider: FormSlider,
    dropzone: FormDropzone,
    format: FormFormat,
    calendar: FormCalendar,
  },
  grid: {
    static: GridStatic,
    connect: GridConnect,
    dynamic: GridDynamic,
    paginate: GridPaginate,
    filters: GridFilters,
    search: GridSearch,
    extra: GridExtra,
    complex: GridComplex,
    list: GridList,
    filelist: GridFilelist,
    casual: GridCasual,
    pivotTable: GridPivotTable,
    pivotTableComplex: GridPivotTableComplex,
    withoutGrid: GridWithoutGrid,
    nestedList: GridNestedList,
    nestedListMenu: GridNestedListMenu,
    nestedListAccordion: GridNestedListAccordion,
  },
  layer: {
    actions: LayerActions,
  },
  caroussel: {
    slides: CarousselSlides,
    caroussel: CarousselCaroussel,
    dynamic: CarousselDynamic,
  },
  calendar: {
    static: CalendarStatic,
    week: CalendarWeek,
    dynamic: CalendarDynamic,
    caroussel: CalendarCaroussel,
    filters: CalendarFilters,
  },
  card: {
    card: CardCard,
    responsible: CardResponsible,
    marker: CardMarker,
  },
  chart: {
    coordinate: ChartCoordinate,
    complex: ChartComplex,
    bar: ChartBar,
  },
  view: {
    basic: ViewBasic,
    tab: ViewTab,
  },
  sticky: {
    sticky: Sticky,
  },
  stepper: {
    stepper: Stepper,
  },
  dragAndDrop: {
    basic: DndBasic,
  },
  map: {
    google: MapGoogle,
  },
  style: {
    avatar: StyleAvatar,
    buttons: StyleButtons,
    grid: StyleGrid,
    screen: StyleScreen,
    mui: StyleMui,
    la: StyleLa,
  },
  misc: {
    print: Print,
  },
};
