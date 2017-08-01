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
                title:'晒单详情',
                shaidan_data:{},
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',

            };
        },

        mounted(){
            this.getShaidanData() ;
        },

        methods: {

            getShaidanData:function () {

                var self = this ;
                weexModules.getTempData('Shaidan_Detail').then(function(json){
                    self.shaidan_data = json.dataindex ;
                })
            },

            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            getLocalTime:function (nS) {
                var date=new Date(parseInt(nS)),
                    y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate();
                var result = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + date.toTimeString().substr(0, 8);
                return result;
            },

            onGoodsClick: function (id, e) {
                weexModules.gotoPage(appConfig.getJsServerAddress()+'product_detail.js?id='+ id) ;
            },
        }
    }
</script>