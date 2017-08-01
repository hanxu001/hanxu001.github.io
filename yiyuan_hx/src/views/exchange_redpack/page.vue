<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';

    import redpackList from 'components/redpack-list.vue'
    import modalsBox from 'components/modals-box.vue'
//    import page from './page'

    export default {
        data(){
            return {
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                navBarHeight: 100,
                title: '兑换红包',
                page:1,
                per_page:20,
                coupons:[],
                bg_state:true,
                alert_state:false,
                num:1,
                total_page:0,
                noneData:false,
                mynum:0,
            };
        },

        mounted(){
            this.handleRefresh();
        },

        components:{
            redpackList,modalsBox
        },

        computed: {
            deviceHeight: {
                get: function() {
                    return this.$getConfig().env.deviceHeight;
                }
            },
        },

        methods: {
            getExchangeList:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/user_coupons/exchange_list',{
                    type:'hongbao',
                    page:self.page,
                    per_page:self.per_page
                }).then((res)=>{
                    if (res.error_code == 0){
                        if(isNull(res.coupons)){
                            self.noneData = true;
                        }else {
                            self.noneData = false;
                        }
                        if (self.page == 1) {
                            self.coupons = [];
                        }
                        self.coupons.push.apply(self.coupons,res.coupons);
                        self.total_page = res.total_page;
                    }else {
                        weexModules.toast(res.error_reason);
                    }
                    this.$refs.list.$emit("refreshDone");
                    this.$refs.list.$emit("loadingDone");
                });
            },

            handleRefresh(event){
                this.page = 1;
                this.getExchangeList();
            },

            onloading(event) {
                if (this.page < this.total_page) {
                    this.page++;
                    this.getExchangeList();
                }else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.$emit("loadingDone");
                }
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            exchangeButClick(array) {
                console.log("exchangeButClick id:"+array[0]+" amount:"+array[1]);

                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/user_coupons/exchange',{
                    coupon_id:array[0],
                    num:self.num
                }).then((res)=>{
                    self.alert_state=true;
                    self.mynum=array[1];

                    if (res.error_code == 0) {
                        self.bg_state=true;
                    }else {
                        self.bg_state=false;
//                        weexModules.toast(res.error_reason);
                    }
                });
            },
            onClose:function(){
                this.alert_state=false;
            },
            onButton:function(){
                if(this.bg_state){
                    this.alert_state=false;
                }else {
                    weexModules.gotoPage(appConfig.getJsServerAddress() + 'my_integral.js');
                }
            },
        }
    }
</script>