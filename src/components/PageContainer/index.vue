<template>
  <div class="page-container">
    <div class="page-container__body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageContainer',
}
</script>

<style lang="scss">
.page-container {
  &__heading {
    margin-bottom: 8px;
  }
  &__body {
    background: $--color-white;
  }
}
</style>
