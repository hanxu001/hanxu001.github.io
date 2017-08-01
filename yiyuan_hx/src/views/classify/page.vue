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
                title: '分类',
                current:'全部商品',
                page:1,
                per_page:20,
                total_page:0,
                categories:[],
                period_products:[],
                id:'',
                noneData:false,
                reappear:true,
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
            };
        },
        computed: {
            deviceHeight:{
                get:function() {
                    return this.$getConfig().env.deviceHeight;
                }
            }
        },

        mounted(){
            this.getData();
            this.handleRefresh();
        },

        methods: {
            leftClick(){
                weexModules.closePage();
            },
            getData:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/categories').then(function (res) {
                    if(res.error_code==0){
                        self.categories = res.categories;
                        self.itemNum = res.categories.length;
                    }
                })
            },
            onloading(event) {
                this.loading_display = true;
                if (this.page < this.total_page) {
                    this.page++;
                    this.classifyData();
                }
                else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.loadingHide();
                }
            },
            classifyData:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products',{
                    page: self.page,
                    per_page: self.per_page,
                    category_id: self.id
                }).then((response)=>{
                    if(response.error_code>=0){
                        weexModules.hideProcess();
                        self.reappear = true;
                        self.noneData = response.period_products.length<=0?true:false;

                        if(self.page == 1){
                            self.period_products = [];
                        }
                        self.total_page = response.total_page;
                        self.period_products.push.apply(self.period_products, response.period_products);
                    }

                    self.$refs.list.loadingHide();
                    self.$refs.list.refreshHide();
                },function (response) {
                    self.$refs.list.loadingHide();
                    self.$refs.list.refreshHide();
                });
            },
            handleRefresh(event) {
                this.page=1;
                this.classifyData();
            },
            onChoose:function (item) {
                weexModules.showProcess();
                this.reappear = false;
                this.current = item.name;
                if(item.name == '全部商品'){
                    this.id='';
                }
                else {
                    this.id=item.id;
                }
                this.handleRefresh();
            },
            gotodetails(id) {
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'product_detail.js?id=' + id);
            }
        }
    }
</script>