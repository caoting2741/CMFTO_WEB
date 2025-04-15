import Vue from 'vue';
import '../assets/styles/element-variables.scss';
import {
  Button,
  Form,
  FormItem,
  Input,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Card,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Select,
  Option,
  DatePicker,
  TimePicker,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  Message,
  MessageBox,
  Notification,
  Loading,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Icon,
  Upload,
  Tooltip,
  Divider,
  Image,
  Badge,
  Progress,
  Scrollbar,
  Skeleton,
  SkeletonItem,
  Descriptions,
  DescriptionsItem
} from 'element-ui';

// 设置 Element UI 组件全局默认大小为 small
Vue.prototype.$ELEMENT = { size: 'mini' };

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Switch);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Tooltip);
Vue.use(Divider);
Vue.use(Image);
Vue.use(Badge);
Vue.use(Progress);
Vue.use(Scrollbar);
Vue.use(Skeleton);
Vue.use(SkeletonItem);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message; 