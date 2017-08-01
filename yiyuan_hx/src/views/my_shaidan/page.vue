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
                title: '我的晒单',
                left_item_src: appConfig.getImagesAddress() + 'common_icon_title_back.png',
                noneData: false,
                dimg: appConfig.getImagesAddress() + 'icon_like_normal.png',
                simg: appConfig.getImagesAddress() + 'icon_like_select.png',
                page: 1,
                per_page: 10,
                total_page: 0,
                items: [],
                refreshing: false,
                loading_display: false,
                onlinethat: appConfig.getImagesAddress() + 'onlinethat.png',
                review: appConfig.getImagesAddress() + 'review.png',
                defeated: appConfig.getImagesAddress() + 'defeated.png',
            }
        },

        mounted(){
            this.getMyShaidanData() ;
        },

        methods: {

            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            getMyShaidanData:function () {
                var self = this ;

                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products/self_share',{page: self.page, per_page: self.per_page}).then(res =>{

                    if ( res.error_code == 0){

                        if (res.period_products.length == 0) {
                            self.noneData = true ;
                        }else {
                            self.noneData = false ;
                            self.items = [] ;
                        }

                        self.items.push.apply(self.items,res.period_products) ;
                        self.total_page = res.total_page ;

                    }else if (res.error_code == -100) {

                        self.noneData = true ;

                        weexModules.toast(res.error_reason) ;
                        weexModules.gotoPage(appConfig.getJsServerAddress()+'login.js') ;


                    }else {
                        weexModules.toast(res.error_reason) ;
                    }
                    this.$refs.list.$emit("loadingDone");
                    this.$refs.list.$emit("refreshDone") ;
                })
            },
            selectClick:function (index) {
                var vitem = this.items[index] ;
                weexModules.httpPost(appConfig.getApiServerAddress()+'/api/period_products/like_share',{id:vitem.id}).then(res => {

                    if (res.error_code == 0){
                        if (!vitem.is_like_share){
                            vitem.share_like_num ++ ;
                        }

                        vitem.is_like_share = true ;
                    }else if (res.error_code == -100){
                        //this.jump('/login.js') ;

                        weexModules.gotoPage(appConfig.getJsServerAddress()+'login.js') ;
                    }
                });
            },
            onItemClick:function (index) {
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
                console.log("handleRefresh");
                this.refreshing = true;
                this.page = 1;
                this.getMyShaidanData();
            },
            onloading(event) {
                this.loading_display = true;
                if (this.page < this.total_page) {
                    this.page++;
                    this.getMyShaidanData() ;
                }
                else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.$emit("loadingDone");
                    setTimeout(() => {
                        this.loading_display = false;
                    }, 444)
                }
            },
        }
    }
</script>