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
                title:'晒单',
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                noneData:false,
                dimg:appConfig.getImagesAddress()+'icon_like_normal.png',
                simg:appConfig.getImagesAddress()+'icon_like_select.png',
                page:1,
                per_page:12,
                total_page:0,
                items: [],
                product_id:'',
                is_like:true
            };
        },

        created(){
            weexModules.setVue(this);

            var  self = this;
            var data = weexModules.getParams();
            this.product_id = data.id;
            if (!isNull(this.product_id)){
                self.title='往期晒单';
            }else {
                self.title='晒单';
            }
        },
        mounted(){

            this.getPeriodProducts() ;
        },

        methods: {

            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            getPeriodProducts:function () {
                if(this.page == 1) {
                    weexModules.showProcess();
                }
                var self = this ;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products/share_history',{
                    page: self.page,
                    per_page: self.per_page,
                    product_id:self.product_id
                }).then(res =>{
                    weexModules.hideProcess();
                    if ( res.error_code == 0){

                        if(self.page == 1){
                            if (res.period_products.length == 0) {
                                self.noneData = true ;
                            }else {
                                self.noneData = false ;
                                self.items = [] ;
                            }
                        }
                        self.items.push.apply(self.items,res.period_products) ;
                        self.total_page = res.total_page ;
                    }else {
                        weexModules.toast(res.error_reason) ;
                    }
                    this.$refs.list.loadingHide();
                    this.$refs.list.refreshHide() ;
                }, error => {
                    this.$refs.list.loadingHide();
                    this.$refs.list.refreshHide() ;
                });
            },
            selectClick:function (index) {
                var vitem = this.items[index];
                weexModules.httpPost(appConfig.getApiServerAddress() + '/api/period_products/like_share', {id: vitem.id}).then(res => {

                    if (res.error_code == 0) {
                        if (!vitem.is_like_share) {
                            vitem.share_like_num++;
                            this.is_like = true;
                            vitem.is_like_share = true;
                            weexModules.toast(this.is_like);
                        } else if (res.error_code == -100) {

                            weexModules.gotoPage(appConfig.getJsServerAddress() + 'login.js');
                        }
                    }
                    ;
                })
            },

            onItemsClick:function (index) {
              var data = this.items[index];
              weexModules.setTempData('Shaidan_Detail',{dataindex:data}) ;
              weexModules.gotoPage(appConfig.getJsServerAddress()+'shaidan_details.js');
            },
            onImageClick:function (index) {
                var data = this.items[index];
                weexModules.setTempData('Shaidan_Image',{dataindex:data}) ;
                weexModules.gotoPage(appConfig.getJsServerAddress()+'gallary.js');
            },

            handleRefresh(event){
                this.page = 1;
                this.getPeriodProducts();
            },
            onloading(event) {
                if (this.page < this.total_page) {
                    this.page++;
                    this.getPeriodProducts() ;
                }
                else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.loadingHide();

                }
            },
        }
    }
</script>