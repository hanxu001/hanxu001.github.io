<style scoped>
    .modals{
        position: fixed;
        left:0;
        top:0;
        width:750px;
        height: 3000px;
        flex: 1;
    }
    .modals_bg{
        position: absolute;
        left:0;
        top:0;
        width:750px;
        height: 2000px;
        background-color:#000;
        opacity:0.5;
    }
    .modalscon{
        width:370px;
        justify-content: center;
        align-items: center;
        margin-left: 190px;
        margin-top: 300px;
    }
    .close_box{
        margin-bottom:28px;
        align-items: flex-end;
    }
    .close{
        width:32px;
        height:32px;
    }
    .modalscons{
        padding-left:20px;
        padding-right:20px;
        padding-bottom:40px;
        background-color: white;
        justify-content:center;
        align-items:center;
        border-radius:30px;
    }
    .red_title{
        padding-top:34px;
        font-size:36px;
        color:#fc0048;
    }
    .con_title{
        text-align: center;
        padding-top:30px;
        font-size:28px;
        color:#000;
    }
    .button{
        margin-top:48px;
        width:138px;
        height:48px;
        background-color:#fc0048;
        border-radius:24px;
        justify-content: center;
        align-items: center;
    }
    .button1{
        margin-top:68px;
        width:190px;
        height:62px;
        background-color:#fc0048;
        border-radius:32px;
        justify-content: center;
        align-items: center;
    }
    .but_text{
        font-size:30px;
        color:#fff;
    }
    .mldals_subg{
        width:370px;
        height:314px;
        position: absolute;
        left:0;
        top:0;
    }
    .input_box{
        margin-top:60px;
    }
    .input_box1{
        margin-top:22px;
    }
    .input1{
        height:70px;
        width:428px;
        text-align: center;
        border-bottom-style: solid;
        border-bottom-color:#ccc;
        border-bottom-width:2px;
    }
    .input2{
        height:78px;
        width:428px;
        text-align: left;
        border-bottom-style: solid;
        border-bottom-color:#ccc;
        border-bottom-width:2px;
    }
    .vice_titel{
        margin-top:28px;
        font-size:28px;
        color:#4d4d4d;
    }
</style>

<template>
    <div class="modals">
        <div class="modals_bg" @click="onclose"></div>
        <div class="modalscon">
            <div class="close_box" :style="{width:mldalswidth}">
                <image @click="onclose" :src="close_icon" class="close"/>
            </div>
            <div class="modalscons" :style="{width:mldalswidth}">
                <image v-if="bg_state" class="mldals_subg" :src="mldals_success"/>
                <text class="red_title">{{title}}</text>
                <text v-if="vicetitle!=''" class="vice_titel">{{vicetitle}}</text>
                <text v-if="content!=''" class="con_title">{{content}}</text>
                <div class="input_box" v-if="content=='' && input_type==0">
                    <input type="tel" class="input1" :placeholder="最多可兑换+royalty_amount+金币"/>
                </div>
                <div class="input_box1" v-if="content=='' && input_type==1">
                    <input type="tel" class="input2" :placeholder="可提现金额+royalty_amount"/>
                    <input type="text" class="input2" :placeholder="支付宝账号"/>
                    <input type="text" class="input2" :placeholder="姓名"/>
                </div>
                <div v-if="but_state==0" @click="onbutton" class="button">
                    <text class="but_text">{{button_text}}</text>
                </div>
                <div v-if="but_state==1" @click="onbutton" class="button1">
                    <text class="but_text">{{button_text}}</text>
                </div>
            </div>
            <div style="height:70px;"></div>
        </div>
    </div>
</template>

<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';

    export default {
        props: ['title','content','bg_state','button_text'],
        data(){
            return {
                vicetitle:'',
                royalty_amount:'',
                mldalswidth:'370px',//弹窗默认宽度
                input_type:0,//输入框类型，0一个/1三个
                but_state:0,//按钮类型，0小/1大
                close_icon:appConfig.getImagesAddress()+'icon_close_x.png',
                mldals_success:appConfig.getImagesAddress()+'mldals_success_bg.png'
            };
        },

        mounted(){

        },

        computed: {
            deviceHeight: {
                get: function() {
                    return this.$getConfig().env.deviceHeight;
                }
            }
        },

        methods: {
            onclose:function () {
                this.$emit('onClose');
            },
            onbutton:function () {
                this.$emit('onButton');
            },
//            onmyinput:function () {
//                this.$emit('onMyInput');
//            }
        }
    }
</script>
