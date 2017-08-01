<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull,parseUrlParams} from 'utils/Utils';

    export default {
        data(){
            return {
                title:'往期揭晓',
                publish_data:[],
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                product_id :'',
                max_end_at :0,
                per_page :20,
                index:0,
                noneData:false,
            };
        },
        mounted(){
           this.handleRefresh();
        },

        methods: {
            getPublishData () {
                var self = this;
                this.product_id = parseUrlParams(this.$getConfig().bundleUrl)['id'];
                weexModules.httpGet(appConfig.getApiServerAddress() + '/api/period_products/history', {
                    product_id: self.product_id,
                    max_end_at: self.max_end_at,
                    per_page: self.per_page
                }).then(function (res) {
                    if (res.error_code == 0) {
                        if(self.max_end_at == 0){
                            self.publish_data = [];
                            if (res.period_products.length <= 0){
                                self.noneData = true ;
                            }else {
                                self.noneData = false ;
                            }
                        }
                        self.publish_data.push.apply(self.publish_data, res.period_products);
                        self.index = self.publish_data.length -1;
                    }

                    this.$refs.list.$emit("refreshDone");
                    this.$refs.list.$emit("loadingDone");
                })
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },
            onloading(event) {
                this.loading_display = true;
                this.max_end_at = this.publish_data[this.index]['end_at'];
                this.getPublishData();
            },
            handleRefresh(event) {
                this.refreshing = true;
                this.max_end_at=0;
                this.getPublishData();
            },
            getLocalTime(nS) {
                var date = new Date(parseInt(nS)),
                    y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate();
                var result = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + date.toTimeString().substr(0, 8);
                return result;
            },

            onclickDetails:function(id){

                weexModules.gotoPage(appConfig.getJsServerAddress()+'product_detail.js?id='+id) ;

            },
        }
    }
</script>