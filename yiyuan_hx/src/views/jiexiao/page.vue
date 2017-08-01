<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';

    export default {
        data(){
            return {
                title: '最新揭晓',
                period_products:[],
                page:1,
                per_page:10,
                bgImage:appConfig.getImagesAddress()+'jiexiao_jiaobiao1.png',
                daojishiImage:appConfig.getImagesAddress()+'jiexiao_win.png',
                now:'',
            };
        },

        mounted(){
            this.handleRefresh(null);
        },

        methods: {
            getCloseProductList:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products/close',{
                    page:self.page,
                    per_page:self.per_page
                }).then((res) =>{
                    if(res.error_code == 0){

                        self.now = res.now_at * 1000;

                        if (self.page == 1&&res.period_products.length>0){
                            self.period_products = [];
                        }
                        self.period_products.push.apply(self.period_products,res.period_products);
                        self.total_page = res.total_page;

                        this.$refs.list.loadingHide();
                        this.$refs.list.refreshHide();
                    }else{
                        weexModules.toast(res.error_reason);
                    }
                },function (err) {
                    this.$refs.list.loadingHide();
                    this.$refs.list.refreshHide();
                });
            },
            handleRefresh(event){
                this.page = 1;
                this.getCloseProductList();
            },
            onloading(event) {
                if(this.page < this.total_page){
                    this.page ++;
                    this.getCloseProductList();
                }else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.loadingHide();
                }

            },
            loadMore(e){
                this.onloading(e);
            },
            gotodetails(id) {
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'product_detail.js?id=' + id);
            },
            getLocalTime(nS) {
                var date = new Date(parseInt(nS)),
                    y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate();
                var result = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + date.toTimeString().substr(0, 8);
                return result;
            },
            timerFinish(index) {
                var item=this.period_products[index];
                item.status=2;
                Vue.set(this.period_products, index, this.period_products[index]);

                this.getResult(index,item);
            },
            getResult(index,item){
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products/detail?id='+item.id).then((res)=>{
                    if(res.error_code == 0){
                        item.status=3;
                        item.user=res.period_product.user;
                        Vue.set(this.period_products, index, this.period_products[index]);
                    }else{
                        weexModules.toast(res.error_reason);
                    }
                })
            },
        }
    }
</script>