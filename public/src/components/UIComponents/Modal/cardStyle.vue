<template>
  <div class="background-opacity">
    <div class="content">
      <div class="row">
        <div class="col-xs-12">
          <slot name="header"></slot>
        </div>
        <div class="col-xs-6">
          <slot name="content01"></slot>
        </div>
        <div class="col-xs-6">
          <slot name="content02"></slot>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'card-style'
}
</script>
<style>
</style>
