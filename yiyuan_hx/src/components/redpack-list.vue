<template>
    <div class="redpack_lists">
        <image class="redpack_listbg" :src="listbg_img"></image>
        <div class="rplist_con" @click="goUse(current)">
            <div class="rplist_con_left">
                <text :class="[current==1?'gray_text':'red_text']">{{title}}</text>
                <text class="black_text">{{instructions}}</text>
            </div>
            <div class="rplist_con_right" :style="{'padding-top':(exchange?0:36)+'px'}">
                <div class="fl_row">
                    <text :class="[current==1?'gray_text':'red_text']"
                          style="font-size:56px;margin-top: 15px;">￥</text>
                    <text :class="[current==1?'gray_text':'red_text']" style="font-size:100px;">{{amount}}</text>
                </div>
                <div class="fl_row consume_box" v-if="exchange">
                    <text style="font-size:28px;color:#4d4d4d;">消耗</text>
                    <text style="font-size:28px;color:#fc0048;">{{score}}</text>
                    <text style="font-size:28px;color:#4d4d4d;">积分</text>
                </div>
            </div>
        </div>
        <div class="rplist_bom" v-if="exchange">
            <text style="font-size:28px;color:#979797;">有效期：{{validity_time}}天</text>
            <div @click="exchangeBut(id,amount)" class="exchange_but">
                <text style="font-size:30px;color:white;">兑换</text>
            </div>
        </div>
        <div class="rplist_bom" v-if="!exchange">
            <text style="font-size:28px;color:#979797;">{{end_at_date}}</text>
            <text v-if="current==0" class="red_text" @click="goUse(current)">去使用></text>
        </div>
        <image v-if="current==1&&status==1" class="watermark" :src="use_img"/>
        <image v-if="current==1&&status!=1" class="watermark" :src="overdue_img"/>
    </div>
</template>
<!--我的红包列表组件-->
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';

    export default {
        props: ['exchange','id','amount','score','instructions','title','end_at_date','current','status'],
        data(){
            return {
                validity_time: '7',
                listbg_img: appConfig.getImagesAddress() + 'redpack_listbg1.png',//list背景
                use_img: appConfig.getImagesAddress() + 'icon_redpack_use.png',//已使用水印
                overdue_img: appConfig.getImagesAddress() + 'icon_redpack_overdue.png',//已过期水印
            };
        },
        mounted(){

        },

        methods: {
            goUse (current) {
                this.$emit('goUseClick',[current]);
            },

            exchangeBut(id,amount) {
                this.$emit('exchangeButClick',[id,amount]);
            }
        }
    }
</script>

<style scoped>
    .exchange_but {
        width: 120px;
        height: 48px;
        background-color: #fc0048;
        border-radius: 24px;
        justify-content: center;
        align-items: center;
    }

    .consume_box {
        flex-direction: row;
    }

    .redpack_lists {
        width: 750px;
        height: 270px;
    }

    .redpack_listbg {
        position: absolute;
        left: 25px;
        top: 0;
        height: 250px;
        width: 700px;
    }

    .rplist_con {
        flex-direction: row;
        justify-content: space-between;
        padding-left: 80px;
        padding-right: 80px;
        padding-bottom: 30px;

    }

    .rplist_bom {
        height: 56px;
        align-items: center;
        padding-left: 80px;
        padding-right: 80px;
        flex-direction: row;
        justify-content: space-between;
    }

    .red_text {
        color: #fc0048;
        font-size: 40px;
    }

    .gray_text {
        color: #999;
    }

    .black_text {
        margin-top: 24px;
        font-size: 30px;
        color: #4d4d4d;
    }

    .rplist_con_left {
        padding-top: 40px;
    }

    .rplist_con_right {
        align-items: flex-end;
    }

    .fl_row {
        flex-direction: row;
        align-items: center;
    }

    .watermark {
        width: 122px;
        height: 122px;
        position: absolute;
        right: 52px;
        bottom: 40px;
    }
</style>