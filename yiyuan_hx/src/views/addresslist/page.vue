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

                title:'收货地址',
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                noneData:false,
                delete_img: appConfig.getImagesAddress()+'delete.png',
                edit_img: appConfig.getImagesAddress()+'edit.png',
                page:1,
                per_page:12,
                total_page:0,
                user_addresses: [],
                refreshing: false,
                loading_display: false,
                is_selected:false ,
            };
        },

        mounted(){


        },

        methods: {

            pageRefresh:function () {
                this.getAddressListData() ;
                this.getSelectedStatus();
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },
            rightBarClick(){

                if (this.user_addresses.length <5) {
                    weexModules.gotoPage(appConfig.getJsServerAddress()+'add_address.js') ;
                }else {
                    weexModules.toast('最多添加5个地址');
                }
            },
            getSelectedStatus:function () {

                weexModules.getTempData('need_selectedAddress').then( res => {

                    if (res&&res.hasOwnProperty('selected')&&res.selected){
                        this.is_selected = res.selected ;
                    }
                })
            },
            getAddressListData:function () {

                var self = this ;

                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/users/address',{page:this.page}).then(res =>{

                    if ( res.error_code == 0){

                        if (self.page == 1 ){

                            if (res.user_addresses.length == 0 ){

                                self.noneData = true ;
                            }else {
                                self.noneData = false ;
                                self.user_addresses = [] ;
                            }
                        }

                        self.user_addresses.push.apply(self.user_addresses,res.user_addresses) ;
                        self.total_page = res.total_page ;
                    }else {
                        weexModules.toast(res.error_reason) ;
                    }
                    this.$refs.list.$emit("loadingDone");
                    this.$refs.list.$emit("refreshDone") ;
                }) ;
            },

            editClick:function (index) {
                var data = this.user_addresses[index];
                weexModules.setTempData('address_Detail',{dataindex:data}) ;
                weexModules.gotoPage(appConfig.getJsServerAddress()+'add_address.js');
            },

            deleteClick:function (index) {
                var user_add = this.user_addresses[index];
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/users/delete_address',{id:user_add.id}).then( res =>{

                    if(res.error_code == 0){
                        weexModules.toast('删除成功');
                        self.user_addresses.splice(index, 1);
                    }else {
                        weexModules.toast(res.error_reason);
                    }

                }) ;
            },

            addressClick:function (index) {

                //weexModules.toast(this.is_selected) ;
                if(this.is_selected){
                    var data = this.user_addresses[index];
                    weexModules.setTempData('selectedAddress',{dataIndex:data}) ;
                    weexModules.closePage() ;
                }else {
                    this.editClick(index) ;
                }
            } ,

            goDefault:function (index) {
                var address = this.user_addresses[index];

                //address['user_address_id'] = address.id;
                address.default_status = 1 ;
//                for(var i = 0; i < this.user_addresses.length; i++){
//                    var tabItem = this.user_addresses[i];
//                    if(i == index){
//                        tabItem.default_status=1;
//                    }
//                    else {
//                        tabItem.default_status=0;
//                    }
//                }

                weexModules.httpPost(appConfig.getApiServerAddress()+'/api/users/add_address',{
                    default_status:address.default_status,
                    user_address_id:address.id,
                    receiver_name:address.receiver_name,
                    mobile:address.mobile,
                    district_id:address.district_id,
                    city_id:address.city_id,
                    province_id:address.province_id,
                    street_address:address.street_address,
                }).then( response => {

                    if (response.error_code < 0) {
                        weexModules.toast('修改默认地址失败');
                    } else {
                        //this.getAddresses(this.page);
                        this.getAddressListData();
                        weexModules.toast('修改默认地址成功');
                    }
                }) ;

            },
            handleRefresh(event){
                this.refreshing = true;
                this.page = 1;
                this.getAddressListData();
            },
            onloading(event) {
                this.loading_display = true;
                if (this.page < this.total_page) {
                    this.page++;

                    this.getAddressListData() ;
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