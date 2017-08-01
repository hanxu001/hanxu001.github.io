<template>
  <div class="wrap">
    <yc-navbar :navheight="navheight"
               :navBarHeight="navBarHeight"
               :navStatusHeight="navStatusHeight"
               :title="title"
               :titleColor="titleColor"
               :leftTitle="leftItemTitle"
               :leftTitleColor="leftItemColor"
               :leftImageUrl="leftImageSrc"
               :rightTitle="rightItemTitle"
               :rightTitleColor="rightItemColor"
               :backgroundColor="backgroundColor"
               :rightImageUrl="rightImageSrc"
               @leftitemclick="navLeftClick"
               @rightitemclick="navRightClick"
    ></yc-navbar>
    <div class="wrap content" :style="{marginTop: navheight}">
      <slot></slot>
    </div>


  </div>
</template>
<style scoped>
  .wrap {
    position: absolute;
    width: 750px;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:#f2f3f7;
    /*flex: 1;*/
  }
  .content {
    flex: 1;
  }

</style>
<script>
    import yc_navbar2 from './osc-navbar.vue';
    import {navbarHeight, navHeight, statusBarHeight} from 'utils/Utils';
    export default{
        props: ['backgroundColor', 'title', 'titleColor', 'leftItemTitle', 'leftItemColor', 'leftImageSrc', 'rightItemTitle',
            'rightItemColor', 'rightImageSrc'],
        data(){
            return {
                navStatusHeight: 0,
                navheight: 100,
                navBarHeight: 100,
            }
        },
        components: {
            'yc-navbar': yc_navbar2
        },
        created: function () {
            this.navStatusHeight = statusBarHeight(this);
            this.navBarHeight = navbarHeight(this, this.navBarHeight);
            this.navheight = navHeight(this, this.navheight);
        },
        methods:{
            navLeftClick(){
                this.$emit('naviBarLeftItemClick',{});
            },
            navRightClick(){
                this.$emit('naviBarRightItemClick',{});
            }

        }
    }
</script>



<!--<template>-->
<!--<div class="root">-->
<!--<div v-if="isIOS" :style="{width: '750px', height: '40px', backgroundColor: backgroundColor}"></div>-->
<!--<osc-navbar-->
<!--:dataRole="dataRole"-->
<!--:height="height"-->
<!--:backgroundColor="backgroundColor"-->
<!--:title="title"-->
<!--:titleColor="titleColor"-->
<!--:leftItemSrc="leftItemSrc"-->
<!--:leftItemTitle="leftItemTitle"-->
<!--:leftItemColor="leftItemColor"-->
<!--:rightItemSrc="rightItemSrc"-->
<!--:rightItemTitle="rightItemTitle"-->
<!--:rightItemColor="rightItemColor"-->
<!--@naviBarRightItemClick="naviBarRightItemClick"-->
<!--@naviBarLeftItemClick="naviBarLeftItemClick"></osc-navbar>-->
<!--<div class="wrapper">-->
<!--<slot></slot>-->
<!--</div>-->
<!--</div>-->
<!--</template>-->

<!--<style scoped>-->
<!--.root {-->
<!--width: 750px;-->
<!--position: absolute;-->
<!--display: flex;-->
<!--flex-direction: column;-->
<!--}-->

<!--.wrapper {-->
<!--width: 750px;-->
<!--}-->
<!--</style>-->

<!--<script>-->
<!--function isIOS() {-->
<!--return  weex.config.env ? weex.config.env.platform === 'iOS' : false;-->
<!--}-->
<!--export default {-->
<!--data () {-->
<!--return {-->
<!--isIOS: isIOS()-->
<!--}-->
<!--},-->

<!--props: {-->
<!--dataRole: {default: 'none'},-->
<!--backgroundColor: {default: '#0099FF'},-->
<!--height: {default: 88},-->
<!--title: {default: ''},-->
<!--titleColor: {default: 'white'},-->
<!--rightItemSrc: {default: ''},-->
<!--rightItemTitle: {default: ''},-->
<!--rightItemColor: {default: 'white'},-->
<!--leftItemSrc: {default: ''},-->
<!--leftItemTitle: {default: ''},-->
<!--leftItemColor: {default: 'white'}-->
<!--},-->

<!--methods: {-->
<!--naviBarRightItemClick (e) {-->
<!--this.$emit('naviBarRightItemClick', e)-->
<!--},-->

<!--naviBarLeftItemClick (e) {-->
<!--this.$emit('naviBarLeftItemClick', e)-->
<!--}-->
<!--}-->
<!--}-->
<!--</script>-->
