<style scoped>
  .list_box{
    width:750px;
    height: 256px;
    margin-top:2px;
    background-color:#ffffff;
    padding-top:24px;
    padding-bottom:35px;
    flex-direction: row;

  }
  .list_img{
    width:130px;
    height:130px;
    border-radius:65px;
    margin-left:24px;
    margin-right:30px;
  }
  .list_bom{
    flex-direction: row;
  }
  .list_titles{
    font-size: 32px;
    color: #393939;
    margin-bottom:4px;
  }
  .list_text1{
    margin-bottom:32px;
    font-size: 26px;
    color: #909090;
  }
  .list_text_red{
    font-size:36px;
    color: #FF7676;
  }
  .list_text2{
    margin-top:6px;
    font-size: 26px;
    color: #7A7A7A;
  }
  .list_bomdiv{
    width:175px;
    /*align-items: flex-end;*/
  }
  .list_bomdiv1{
    width:388px;
    justify-content: center;
    align-items: center;
  }
  .list_bomdiv_wire{
    width:2px;
    height:65px;
    background-color: #E7E7E7;
    position: absolute;
    left: 0;
    top:0;
  }
  .recommend_img{
    width:80px;
    height:80px;
    position: absolute;
    right:0;
    top: 0;
  }
</style>

<template>
  <div class="list_box">
    <image class="list_img" :src="logo"></image>
    <div class="list_div">
      <text class="list_titles">{{name}}</text>
      <text class="list_text1">{{describe}}</text>
      <div class="list_bom">
        <div class="list_bomdiv">
          <text class="list_text_red">{{interest}}</text>
          <text class="list_text2">{{period_type==1?'日':'月'}}利率</text>
        </div>
        <div class="list_bomdiv1">
          <div class="list_bomdiv_wire"></div>
          <text class="list_text_red">{{amount}}</text>
          <text class="list_text2">额度</text>
        </div>
      </div>
    </div>
    <image class="recommend_img" :src="tip_img" v-if="tip_show"></image>
  </div>
</template>

<script>
  export default {
    props: {
        logo:{default: ''},//商家logo
        name:{default: '玖富叮当贷-让借款轻松起来'},//商家名称
        describe:{default: '一步授权淘宝，3分钟获取信用额度'},//商家描述
        interest:{default: '0.8%'},//月利率
        amount:{default: '200-5000元'},//额度
        tip_show:{default:false},
        tip_img:{default:''},
        period_type:{default:''}
    },
      methods:{

      }
  }
</script>
