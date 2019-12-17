<template>
  <div class="page-header">
    <div class="page-header__container">
      <div class="page-header__body">
        <slot></slot>
        <div class="page-header__center">
          <slot name="center"></slot>
        </div>
        <div class="page-header__right">
          <slot name="right"></slot>
        </div>
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
  background: $--color-white;
  margin-bottom: 4px;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
  &__right {
    padding: 10px 0;
  }
}
</style>
