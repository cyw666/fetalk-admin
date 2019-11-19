<template>
  <div class="page-header">
    <div class="page-header__container">
      <div class="page-header__body">
        <slot></slot>
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
}
</script>

<style lang="scss">
.page-header {
  background: #fff;
  // padding: 18px 0 18px;
  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
}
</style>
