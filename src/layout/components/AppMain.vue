<template>
  <section class="app-main">
    <breadcrumb class="app-breadcrumb-container">
      <template #actions>
        <component 
          :is="currentPageActions" 
          v-if="$route.meta && $route.meta.pageActionsConfig"
          v-bind="$route.meta.pageActionsConfig"
        />
      </template>
    </breadcrumb>
    <div class="app-content">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </div>
  </section>
</template>
<script>


export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path;
    },
    currentPageActions() {
      const { meta } = this.$route;
      if (meta && meta.pageActionsConfig && meta.pageActionsConfig.type) {
        return () => import(`@/components/page-actions/${meta.pageActionsConfig.type}`);
      }
      return null;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar height*/
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-breadcrumb-container {
  flex-shrink: 0;
}

.app-content {
  flex: 1;
  overflow: auto;
  position: relative;
  //margin-top: 10px;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 