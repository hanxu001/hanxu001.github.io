<style>
  .bar {
    width: 750px;
    /*position: fixed;*/
  }
  .status_bar {
  }

  .nav_bar {
    flex-direction: row;
    justify-content: space-between;
  }

  .common-div {

    align-items: center;
    justify-content: center;
    /*测试点击区域加边框*/
    /*border-width: 2px;*/
    /*border-color: beige;*/
    /*border-style: solid;*/
  }

  .left-div {
    flex: 0.3;
    padding-left: 10px;
    flex-direction: row;
    justify-content: flex-start;
  }
  .right-div {
    flex: 0.3;
    padding-right: 10px;
    flex-direction: row;
    justify-content: flex-end;
  }

  .center-div {
    flex: 0.4;
  }
  .center-text {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
  }

  .common-text{
    font-size: 32px;
  }
  .left-text{
    text-align: left;
  }
  .right-text{
    text-align: right;
  }
  .image{
    width: 44px;
    height: 44px;
  }




</style>
<template>

  <div class="bar" :style="{ height:navheight+'px'}">
    <div class="bar status_bar" :style="{ height:navStatusHeight+'px',backgroundColor: backgroundColor}"></div>
    <div class="bar nav_bar" :style="{ height:navBarHeight+'px', backgroundColor: backgroundColor}">
      <div class="common-div left-div" :style="{ height:navBarHeight+'px'}" @click="leftItemClick">
        <image class="image" v-if="leftImageUrl" :src="leftImageUrl" ></image>
        <text class="common-text left-text" :style="{color:leftTitleColor,marginLeft:leftImageUrl?'10px':'0'}">{{leftTitle}}</text>
      </div>
      <div class="common-div center-div" :style="{ height:navBarHeight+'px'}">
        <text class="center-text" :style="{color:titleColor}">{{title}}</text>
      </div>
      <div class="common-div right-div" :style="{ height:navBarHeight+'px'}" @click="rightItemClick">
        <text class="common-text right-text" :style="{color:rightTitleColor,marginRight:rightImageUrl?'10px':'0'}">{{rightTitle}}</text>
        <image class="image" :src="rightImageUrl" v-if="rightImageUrl"></image>
      </div>

    </div>
  </div>
</template>

<script>
    export default{

        props: {
            navStatusHeight: {default: 0},//状态栏高度 android 没有，ios有20乘以一个比例
            navBarHeight: {default: 100},//导航栏高度 ios有40乘以一个比例
            navheight: {default: 100},  //导航整体高度 android 和导航栏一致，ios 是导航栏+状态栏
            title:{default:''},          //标题
            titleColor:{default:'white'}, //标题颜色
            leftTitle:{default:''},      //左边标题
            leftTitleColor:{default:'white'},//左边标题颜色
            leftImageUrl:{default:''},       //左边图片链接

            rightTitle:{default:''},      //右边标题
            rightTitleColor:{default:'white'},//右边标题颜色
            rightImageUrl:{default:''},       //右边图片链接
            backgroundColor:{default:'#fc0048'}
        },
        data(){
            return {}
        },
        components: {},
        created: function () {
        },
        methods:{
            leftItemClick(){
                this.$emit('leftitemclick', {});
            },
            rightItemClick() {
                this.$emit('rightitemclick', {});
            }
        }
    }
</script>

