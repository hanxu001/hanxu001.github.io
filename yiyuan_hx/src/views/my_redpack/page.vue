<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';
    import redpackList from 'components/redpack-list.vue'

    export default {
        data(){
            return {
                left_item_src: appConfig.getImagesAddress() + 'common_icon_title_back.png',
                navBarHeight: 100,
                title: '我的红包',
                rightItemTitle: '兑换',
                current: 0,
                noneData: false,
                user_coupons_y: [],
                user_coupons_n: [],
                redtablis: ['有效红包', '无效红包'],
                page: 1,
                per_page: 20,
                total_page: 0,
                status: 0,
                replaceToggle: true,
            };
        },
        components: {
            redpackList
        },

        mounted(){
            this.handleRefresh();
        },

        methods: {
            handleRefresh(event){
                this.page = 1;
                this.getUserCoupons();
            },
            onloading(event) {
                if (this.page < this.total_page) {
                    this.page++;
                    this.getUserCoupons();
                } else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.$emit("loadingDone");
                }
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },
            ontab: function (index) {
                var self = this;
                self.replaceToggle = false;
                weexModules.showProcess();
                switch (index) {
                    case 0:     //有效红包
                        self.current = 0;
                        self.status = 0;
                        self.page = 1;
                        self.getUserCoupons();
                        break;
                    case 1:     //无效红包
                        self.current = 1;
                        self.status = -1;
                        self.page = 1;
                        self.getUserCoupons();
                        break;
                }
            },
            getUserCoupons: function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress() + '/api/user_coupons', {
                    status: self.status,
                    page: self.page,
                    per_page: self.per_page
                }).then((res) => {
                    self.replaceToggle = true;
                    if (res.error_code == 0) {
                        self.noneData = res.user_coupons.length <= 0 ? true : false;
                        if (self.page == 1) {
                            if (self.status == 0) {
                                self.user_coupons_y = [];
                            } else {
                                self.user_coupons_n = [];
                            }
                        }
                        console.log("数组长度" + res.user_coupons.length);
                        if (self.status == 0) {
                            self.user_coupons_y.push.apply(self.user_coupons_y, res.user_coupons);
                        } else {
                            self.user_coupons_n.push.apply(self.user_coupons_n, res.user_coupons);
                        }
                        console.log("添加后数组长度" + self.user_coupons_y.length + " status:" + self.status);
                        this.total_page = res.total_page;
                    } else {
                        weexModules.toast(res.error_reason);
                    }
                    this.$refs.list.$emit("refreshDone");
                    this.$refs.list.$emit("loadingDone");
                    weexModules.hideProcess();
                });
            },
            rightClick: function () {
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'exchange_redpack.js');
            },
            goUseClick: function (can) {
                console.log("去使用");
                if (can == 1) {//无效红包
                    return;
                }
                weexModules.gotoPage('app://main/home');
            }
        }
    }
</script>