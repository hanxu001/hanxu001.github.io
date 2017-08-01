<template>
  <div class="root">
    <div v-if="isIOS" :style="{width: '750px', height: '40px', backgroundColor: backgroundColor}"></div>
    <div class="wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
  .root {
    width: 750px;
    height: 1334px;
    display: flex;
    flex-direction: column;
  }

  .wrapper {
    width: 750px;
  }
</style>

<script>

  function isIOS() {
      return  weex.config.env ? weex.config.env.platform === 'iOS' : false;
  }
  export default {
    data () {
      return {
        isIOS: isIOS()
      }
    },

    props: {
      backgroundColor: {default: '#eeeeee'}
    },
      methods:{

      }
  }
</script>
