<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';
//    import page from './page'

    export default {
        data(){
            return {
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                right_back:appConfig.getImagesAddress()+'icon_right.png',
                moneybag_img:appConfig.getImagesAddress()+'icon_moneybag.png',
                navBarHeight: 100,
                title: '提现申请',
                royalty_amount:0,
                withdraw_but_toggle:false,
                myindex:0,
                mytype:'balance',
                amount:0,
                account_id:'',
                account_name:'',
                close_icon:appConfig.getImagesAddress()+'icon_close_x.png',
                mldals_success:appConfig.getImagesAddress()+'mldals_success_bg.png',
                input_ref:null
            };
        },

        mounted(){
            this.getWeeklyRank();
        },
        methods: {
            getWeeklyRank:function (){
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/royalty_histories/weekly_rank').then((res)=>{
                    if (res.error_code == 0) {
                        if(res.royalty_amount == 0){
                            self.royalty_amount = "0.00";
                        }else{
                            self.royalty_amount =res.royalty_amount.toFixed(2);
                        }
                    }else {
                        weexModules.toast(res.error_reason);
                    }
                });
            },
            withdrawButClick:function (index) {
                if(index==1){
                    this.myindex=1;
                    this.mytype='alipay';
                    if(this.royalty_amount < 100){
                        weexModules.toast('余额不足');
                        return;
                    }
                    this.withdraw_but_toggle=true;
                }else {
                    this.myindex=0;
                    this.mytype='balance';
                    if(this.royalty_amount < 1){
                        weexModules.toast('余额不足');
                        return;
                    }
                    this.withdraw_but_toggle=true;
                }
            },
            onclose:function () {
                //隐藏键盘(这个有错误，无法执行下面操作)
//                this.$refs[this.input_ref].blur() ;
                this.withdraw_but_toggle=false;
            },
            onbutton:function (i) {
                var self = this;
                if(i==0){
                    if(isNull(self.amount) || self.amount < 1){
                        weexModules.toast('输入金额不能为空且必须大于1');
                        return;
                    }

                    if(self.amount>1000){
                        weexModules.toast('最多兑换1000金币');
                        return;
                    }
                }
                if(i == 1){
                    if(isNull(self.amount) ||self.amount < 100){
                        weexModules.toast('输入金额不能为空且必须大于100');
                        return;
                    }
                    if(self.amount>1000){
                        weexModules.toast('提现金额不能大于1000');
                        return;
                    }
                    if(isNull(self.account_id) || !self.checkId(self.account_id)){
                        weexModules.toast('支付宝账号不合法');
                        return;
                    }
                    if(isNull(self.account_name) || self.account_name.length > 16){
                        weexModules.toast('姓名不能为空且长度不能超过16位');
                        return;
                    }
                }

//                console.log("当前输入金额:"+self.amount+" 当前余额:"+this.royalty_amount);
                if(self.amount>this.royalty_amount){
                    weexModules.toast("余额不足");
//                    console.log("余额不足");
                    return;
                }

                //隐藏键盘
                this.$refs[this.input_ref].blur();

                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/royalty_histories/take',{
                    type:self.mytype,
                    amount:self.amount,
                    account_id:self.account_id,
                    account_name:self.account_name
                }).then((res)=>{
                    if (res.error_code == 0) {
                        if(i==0){
                            weexModules.toast("兑换金币成功");
                        }else{
                            weexModules.toast("申请支付宝提现成功");
                        }

                        this.getWeeklyRank();//刷新余额
                        self.withdraw_but_toggle=false;
                    }else {
                        weexModules.toast(res.error_reason);
                    }
                });
            },
            onmyinput:function (index,event){
                this.input_ref = 'input'+index;

                var self = this;
                console.log("index:"+index+' onmyinput value:'+event.value);
                if(index==1){
//                    self.amount=self.inputFilter(event.value,"input_amount");
                    self.amount=event.value;
                    console.log("amount:"+self.amount);
                } else if(index==2){
                    self.account_id=event.value;
                } else if(index==3){
                    self.account_name=event.value;
                }
            },
            onFocus:function (id,e) {
                this.input_ref = 'input'+id ;
            },
            checkId: function(s){
                var regu = "^[0-9a-zA-Z_]{4,15}$";
                var re = new RegExp(regu);
                if (re.test(s)) {
                    return true;
                }else{
                    return false;
                }
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },
        }
    }
</script>