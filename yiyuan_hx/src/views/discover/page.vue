<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith} from 'utils/Utils';
    import page from './page'

    export default {
        data(){
            return {
                title: '发现',
                icon_right:appConfig.getImagesAddress()+'icon_right.png',
                menus:[],
                icon_sd:appConfig.getImagesAddress()+'icon_share_history.png',
                period_products:[],
            };
        },

        mounted(){
            this.getMenus();
            this.getShare_history();
        },

        methods: {

            getMenus:function () {

                var self = this ;

                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/users/menus',{type:'discover'}).then((res)=>{

                    if ( res.error_code == 0) {

                        self.menus = res.menus ;

//                        weexModules.toast({
//                            'message':'获取成功' , duration:2
//                        }) ;

                    }else {
                        weexModules.toast(res.error_reason);
                    }
                }) ;
            },

            gosd:function () {
                weexModules.gotoPage(appConfig.getJsServerAddress()+'shaidan.js');
            },

            gourl:function (item) {

                weexModules.hasLogin().then(res => {

                    if(res){
                        weexModules.openAppFunction(item.url) ;

                    }else {
                        weexModules.gotoPage(appConfig.getJsServerAddress()+'login.js') ;

                    }
                });
            },

            getShare_history:function () {
                var self = this ;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products/share_history',{page:1,per_page:10}).then((res) => {
                    if(res.error_code == 0){
                        self.period_products = [];
                        self.period_products = res.period_products;
                    }
                    else {
                        weexModules.toast( res.error_reason);
                    }
                });
            },

            refreshData:function () {
                this.getShare_history();
            },

        }
    }
</script>