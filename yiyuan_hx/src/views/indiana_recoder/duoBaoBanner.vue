<template>
    <div :class="[period_product_users.length<4?'deviceHeight':'']">
        <div class="main-div" v-for="item in period_product_users" >
            <div class="detail-div" :product_id="item.period_product.product_id" @click="canyuClick(1,item.period_product.product_id,item.period_product.id)">
            <image class="left-image" :src="item.period_product.image_small_url"/>
            <div class="right-div">
                <text class="name-text">{{item.product_name}}</text>
                <text class="common-text">本期期号:{{item.period_product.id}}</text>
                <div style="flex-direction: row;">
                    <text class="common-text">我已参与:</text>
                    <text class="common-num">{{item.num}}</text>
                    <text class="common-text">人次</text>
                </div>
                <image class="lucy-image" :src="image_address" v-if="type==3 && user_id==item.period_product.user.id"/>
            </div>
        </div>
            <!--进行中进度条-->
            <div class="sub-div" v-if="type==1">
                <div class="processing-div">
                    <text class="processing-text">抢宝进度{{item.period_product.progress_percent}}%</text>
                    <div class="process-div">
                        <div class="process-sub-div" :style="{width: 4 * item.period_product.progress_percent}"></div>
                    </div>
                </div>
                <text class="continue-text" :product_id="item.period_product.id" type="1"  @click="canyuClick(1,item.period_product.product_id,item.period_product.id)">继续抢购</text>
            </div>
            <!--揭晓中-->
            <div class="sub-div" v-if="type==2">
                <text class="common-num">正在揭晓中</text>
                <text class="continue-text" :product_id="item.period_product.product_id" type="2" @click="canyuClick(2,item.period_product.product_id,item.period_product.id)">再次参与</text>
            </div>
            <!--已揭晓用户信息-->
            <div class="sub-div" v-if="type==3">
                <text :class="['common-text',deviceWidth<=750?'textwidth':'textwidth']">获奖者:{{item.period_product.user.username}}</text>
                <div style="flex-direction: row;">
                    <text class="common-text1">参与:</text><text class="num">{{item.period_product.user_buy_num}}</text><text class="renci">人次</text>
                </div>
                <text class="continue-text" :product_id="item.period_product.product_id" type="2" @click="canyuClick(2,item.period_product.product_id,item.period_product.id)">再次参与</text>
            </div>
        </div>
    </div>
</template>

<script>
    import app from 'utils/AppConfig';

    module.exports = {
        props: ['period_product_users', 'type', 'user_id'],
        data(){
            return {
                image_address:app.getImagesAddress()+'product_current_lucky.png',
            }
        },
        created: function () {

        },
        computed: {
            deviceWidth: {
                get: function() {
                    return this.$getConfig().env.deviceWidth;
                }
            },
            deviceHeight: {
                get: function() {
                    return this.$getConfig().env.deviceHeight;
                }
            }
        },
        methods: {
            canyuClick (type,product_id,id) {
//                console.log("XX type:"+type+", id:"+id)
//                switch (type) {
//                    case 1:
//                        break;
//                    case 2:
//                        type=1;
//                        break;
//                    case 3:
//                        type=2
//                        break;
//                }


                this.$emit('participation', {type:type,id:id,product_id:product_id});
            }
        }
    }

</script>

<style>
    .lucy-image {
        width: 128px;
        height: 78px;
        position: absolute;
        top:10px;
        right: 30px;

    }
    .main-div {
        background-color: #e9e9e9;
        padding-bottom: 10px;
        height: 300px;
    }
    .detail-div {
        padding-left: 20px;
        padding-top: 20px;
        flex-direction: row;
        background-color: white;
        padding-bottom: 20px;
        margin-bottom: 2px;
    }
    .left-image {
        width: 150px;
        height: 150px;

    }
    .right-div {
        flex: 1;
        padding-left: 20px;
        flex: 1;
    }
    .name-text {
        lines:1;
        font-size:34px;
        text-overflow: ellipsis;
    }
    .common-text {
        font-size:34px;
        padding-top: 10px;
        color: #989898;
    }
    .common-text1 {
        font-size:34px;
        padding-top: 10px;
        color: #989898;
    }
    .common-num {
        font-size:34px;
        padding-top: 10px;
        color:#fc0048;
    }
    .sub-div {
        justify-content: space-between;
        padding-left: 20px;
        padding-top: 10px;
        flex-direction: row;
        align-items: center;
        background-color: white;
        flex: 1;
    }
    .renci {
        font-size:34px;
        padding-top: 10px;
        color: #989898;
    }
    .num {
        font-size:34px;
        padding-top: 10px;
        color:#fc0048;
    }
    .processing-div {
        flex: 1;
    }

    .processing-text{
        font-size:34px;
        color:#fc0048;
        padding-bottom: 10px;
    }
    .process-div {
        background-color: #e9e9e9;
        width: 400px;
        height: 20px;
        border-radius: 10px;
    }
    .process-sub-div {
        height: 20px;
        background-color:#fc0048;
        width: 200px;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .continue-text {
        font-size:34px;
        margin-right: 30px;
        background-color:#fc0048;
        color: white;
        border-radius: 10px;
        text-align: center;
        line-height: 40px;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .textwidth{
        width:250px;
        line:2;
    }
    .deviceHeight{
        height: 1200px;
    }
</style>