<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sidebar-item-icon']} />);
      } else {
        vnodes.push(<svg-icon icon-class={icon} class="sidebar-item-icon" />);
      }
    }

    if (title) {
      vnodes.push(<span slot='title' class="sidebar-item-title">{(title)}</span>);
    }
    return vnodes;
  }
};
</script>

<style scoped>
.sidebar-item-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  text-align: center;
  margin-right: 5px;
  /* color: #ffffff; */
}
</style> 