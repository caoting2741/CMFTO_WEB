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
      vnodes.push(<i class={[icon, 'sidebar-item-icon']} />);
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
  text-align: center;
}
</style> 