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
                title:'中奖状态',
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                product:{},
                order:{},
                default_address:{},
                saber:true,
                mylines:1,
                mobile:'',
                share_success:false,
                myshaip_address:'',
                myreceiver:'',
                mymobile:'',
                myship_address:'',
                icon_complete_transaction:appConfig.getImagesAddress()+'icon_complete_transaction.png',
            };
        },

        mounted(){

        },

        methods: {

            pageRefresh:function () {
                this.mylines = 1;
                this.getCacheLuckyData();
            },

            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            getCacheLuckyData:function () {

                var self = this ;

                weexModules.getTempData('lucky_data').then(res => {

                    if (res&&res.hasOwnProperty('dataindex')) {

                        self.product = res.dataindex;
                        self.getLuckStatusData(self.product.id);
                    }
                });

                weexModules.getTempData('selectedAddress').then( res => {

                    if (res&&res.hasOwnProperty('dataIndex')){

                        this.myshaip_address = res.dataIndex ;
                        this.mymobile = this.myshaip_address.mobile ;
                        this.myreceiver = this.myshaip_address.receiver_name ;
                        this.user_address_id = this.myshaip_address.id ;
                        this.myship_address = this.myshaip_address.ship_address;
                    }

                }) ;
            },

            getLuckStatusData:function (id) {
                var self = this ;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/orders/lucky_detail',{period_product_id:id}).then(res => {

                    if (res.error_code == 0){
                        self.order = res.order ;
                        self.default_address = res.default_address;
                        self.mylines=Math.ceil(res.order.ship_address.length/20);
                    }
                }) ;
            },

            goChoose:function () {
                weexModules.setTempData('need_selectedAddress',{selected:true}) ;
                weexModules.gotoPage(appConfig.getJsServerAddress()+'addresslist.js') ;
            },

            goShai:function (i) {
                if (i==0){

//                    var vitem = this.product ;
//
//                    weexModules.setTempData('lucky_data',{dataindex:vitem}) ;

                    weexModules.gotoPage(appConfig.getJsServerAddress()+'zhongjiang_shaidan.js?id='+this.product.id) ;
                }
            },

            goEnsure:function () {

                var self = this ;

                if (this.user_address_id < 0 &&this.default_address&&this.default_address.hasOwnProperty("id")) {
                    this.user_address_id = this.default_address.id;
                }
                weexModules.httpPost(appConfig.getApiServerAddress() + '/api/orders/edit_address',{
                    order_no:this.order.order_no,
                    user_address_id:this.user_address_id
                }).then(res => {
                    if(res.error_code>=0){
                        self.saber=false;
                    }
                })

            },
            goEnsureMobile:function () {
                if (!isPhoneNumber(this.mobile)) {
                    weexModules.toast({'message': '手机号码不能为空并且长度为11位数字', duration: 5});
                    return;
                }

                var self = this ;
                weexModules.httpPost(appConfig.getApiServerAddress() + '/api/orders/edit_address',{
                    order_no:this.order.order_no,
                    user_address_id:this.user_address_id,
                    mobile:this.mobile
                }).then(res => {

                    if(res.error_code>=0){
                        self.saber=false;
                    }
                })
            },

            input:function (e) {
                this.mobile = e.value ;
            },
        }
    }
</script>