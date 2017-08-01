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
                navBarHeight: 100,
                title: '收支明细',
                redtablis:['收入','兑换','提现'],
                current:0,//tab切换
                type:'profit',
                page:1,
                per_page:20,
                royalty_histories:[],
                withdraw_auditimg:appConfig.getImagesAddress()+'withdraw_audit.png',
                withdraw_loseimg:appConfig.getImagesAddress()+'withdraw_lose.png',
                withdraw_successimg:appConfig.getImagesAddress()+'withdraw_success.png',
                total_page:0,
                noneData:true,
                replaceToggle:true,
            };
        },

        mounted(){
            this.handleRefresh();
        },

        computed: {
            deviceHeight: {
                get: function() {
                    return this.$getConfig().env.deviceHeight;
                }
            },
        },

        methods: {
            ontab:function (index) {
                var self = this;
                weexModules.showProcess();
                self.replaceToggle = false;
                switch (index) {
                    case 0:     //收入
                        self.current=0;
                        self.type='profit';
                        self.handleRefresh();
                        break;
                    case 1:     //兑换
                        self.current=1;
                        self.type='exchange';
                        self.handleRefresh();
                        break;
                    case 2:     //提现
                        self.current=2;
                        self.type='take';
                        self.handleRefresh();
                        break;
                }
            },
            getRoyaltyHistories:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/royalty_histories',{page: self.page,
                    per_page:self.per_page,
                    type:self.type}).then((res)=>{
                    if (res.error_code == 0){
                        self.replaceToggle = true;
                        weexModules.hideProcess();
                        self.noneData = res.royalty_histories.length<=0?true:false;

                        if (self.page == 1) {
                            self.royalty_histories = [];
                        }
                        self.royalty_histories.push.apply(self.royalty_histories,res.royalty_histories);
                        self.total_page = res.total_page;
                    }else {
                        weexModules.toast(res.error_reason);
                    }
                    this.$refs.list.$emit("refreshDone");
                    this.$refs.list.$emit("loadingDone");
                });
            },

            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            handleRefresh(event){
                this.page = 1;
                this.getRoyaltyHistories();
            },

            onloading(event) {
                if (this.page < this.total_page) {
                    this.page++;
                    this.getRoyaltyHistories();
                }else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.$emit("loadingDone");
                }
            },
        }
    }
</script>