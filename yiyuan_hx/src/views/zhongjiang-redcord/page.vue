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

                title: '中奖记录',
                left_item_src: appConfig.getImagesAddress() + 'common_icon_title_back.png',
                luck_image: appConfig.getImagesAddress() + 'product_current_lucky.png',
                page: 1,
                per_page: 5,
                total_page: 0,
                period_products: [],
                noneData:false,
            };
        },

        mounted(){
            this.getZhongjiangData();
        },

        methods: {

            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            getZhongjiangData: function () {

                var self = this;

                weexModules.httpGet(appConfig.getApiServerAddress() + '/api/users/lucky', {
                    page: self.page,
                    per_page: self.per_page
                }).then(res => {
                    if (res.error_code == 0) {
                        if (self.page == 1) {
                            if (res.period_products.length == 0) {
                                self.noneData = true;
                            } else {
                                self.noneData = false;
                                self.period_products = [];
                            }
                        }
                        self.period_products.push.apply(self.period_products, res.period_products);
                        self.total_page = res.total_page;
                    } else if (res.error_code == -100) {

                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'login.js');
                    } else {
                        weexModules.toast(res.error_reason);
                    }
                    self.$refs.list.loadingHide();
                    self.$refs.list.refreshHide();

                }, error => {
                    self.$refs.list.loadingHide();
                    self.$refs.list.refreshHide();
                });
            },
            chakanClick: function (index) {

                var vitem = this.period_products[index];
                weexModules.setTempData('lucky_data', {dataindex: vitem});
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'lucky_detail.js');
            },

            handleRefresh(event){
                this.page = 1;
                this.getZhongjiangData();
            },
            onloading(event) {
                if (this.page < this.total_page) {
                    this.page++;
                    this.getZhongjiangData();
                }
                else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.loadingHide();
                }
            },
        }
    }
</script>