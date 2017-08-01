<style src="./style.css" scoped></style>
<template src="./template.html"></template>

<script>
    import app from 'utils/AppConfig';
    import {getUrlJoinParams, parseUrlParams, isNull} from 'utils/Utils'
    import weexModules from 'utils/WeexModules'
    import duoBaoBanner from './duoBaoBanner'
    var modal = weex.requireModule('modal')
    var navigator = weex.requireModule('navigator')
    var event = weex.requireModule('event')

    export default {
        data (){
            return {
                loadingImg: 'http://test.365yf.cc/hybrid/yiyuan/images/header_anime.gif',
                leftImageSrc: app.getImagesAddress() + 'common_icon_title_back.png',
                title: '夺宝记录',
                header_left_click: 'header-click',
                header_right_click: 'header-click-not',
                header_middle_click:'header-click-not',
                period_product_users_being: [],
                period_product_users_doing: [],
                period_product_users_did: [],
                type: 1,
                page_being: 1,
                total_page_being:0,
                page_did:1,
                total_page_did:0,
                page_doing:1,
                total_page_doing:0,
                per_page: 10,
                no_data: false,
                no_data_being:false,
                no_data_doing:false,
                no_data_did:false,
                refresh_display: 'hide',
                loading_display: 'hide',
                loading_visible: true,
                loading_visible_being:true,
                loading_visible_doing:true,
                loading_visible_did:true,
                user_id: 16003,
                nonedata_img:app.getImagesAddress()+'blankpage.png',
                api_url : '/api/users/period_history',
            }
        },
        components: {
            duoBaoBanner,
        },
        mounted(){

        },
        created(){
            weexModules.setVue(this);

            var  self = this;
            var data = weexModules.getParams();
            console.log("created: "+JSON.stringify(data));
            this.user_id = data.user_id;
            console.log("user_id: "+this.user_id);
            this.handleRefresh();
        },
        computed: {},
        methods: {
            headerClick(id) {

                this.type = id;
                switch (id) {
                    case 1:
                        this.header_left_click = 'header-click';
                        this.header_right_click = 'header-click-not';
                        this.header_middle_click ='header-click-not';
                        this.loading_visible=this.loading_visible_being;
                        this.no_data = this.no_data_being;
                        break;
                    case 2:
                        this.header_left_click = 'header-click-not';
                        this.header_right_click = 'header-click-not';
                        this.header_middle_click ='header-click';
                        this.loading_visible=this.loading_visible_doing;
                        this.no_data = this.no_data_doing;
                        break;
                    case 3:
//                        console.log("user_id: "+this.user_id);
                        this.header_left_click = 'header-click-not';
                        this.header_right_click = 'header-click';
                        this.header_middle_click ='header-click-not';
                        this.loading_visible=this.loading_visible_did;
                        this.no_data = this.no_data_did;
                        break;
                }
//                if(isNull(this.period_product_users)||this.period_product_users.length==0){
//
//
//                }
                this.handleRefresh();
            },
            handleRefresh() {
                this.refresh_display = 'show';
                if(this.type==1){
                    this.page_being = 1;
                }
                else{
                    this.page_did=1;
                }
                this.getData();
            },
            getData() {

                var self = this;
                var page = 1;
                if(self.type==1){
                    page = self.page_being;
                }
                else if(self.type==2){
                    page = self.page_doing;
                }
                else{
                    page = self.page_did;
                }

                weexModules.httpGet(this.api_url, {
                    page: page,
                    per_page: self.per_page,
                    status: self.type,
                },).then(function (response) {

                    event.showProcess(false);
                    self.refresh_display = 'hide';
                    self.loading_display = 'hide';

                    if (page == 1) {
                        if(self.type==1){
                            self.period_product_users_being = [];
                        }
                        else if(self.type==2){
                            self.period_product_users_doing = [];
                        }
                        else{
                            self.period_product_users_did = [];
                        }
                    }

                    if(self.type==1){
                        self.period_product_users_being.push.apply(self.period_product_users_being, response.period_product_users);

                        //没有数据 显示提示
                        if (response.error_code < 0 || isNull(self.period_product_users_being) || self.period_product_users_being.length<=0) {
                            self.no_data = true;
                        } else {
                            self.no_data = false;
                        }
                        self.no_data_being = self.no_data;
                    }
                    else if(self.type==2){
                        self.period_product_users_doing.push.apply(self.period_product_users_doing, response.period_product_users);
                        //没有数据 显示提示
                        if (response.error_code < 0 || isNull(self.period_product_users_doing) || self.period_product_users_doing.length<=0) {
                            self.no_data = true;
                        } else {
                            self.no_data = false;
                        }
                        self.no_data_doing = self.no_data;
                    }
                    else{

                        self.period_product_users_did.push.apply(self.period_product_users_did, response.period_product_users);

                        //没有数据 显示提示
                        if (response.error_code < 0 || isNull(self.period_product_users_did) || self.period_product_users_did.length<=0) {
                            self.no_data = true;
                        } else {
                            self.no_data = false;
                        }
                        self.no_data_did = self.no_data;
                    }


//                    if(/*app.iOS(self)*/true) {
                        if (self.type == 1) {
                            self.total_page_being = response.total_page;
                            if (self.total_page_being > 1) {
                                self.loading_visible = true;
                            }
                            else {
                                self.loading_visible = false;
                            }
                            self.loading_visible_being = self.loading_visible;
                        }
                        else if(self.type==2){
                            self.total_page_doing = response.total_page;
                            if (self.total_page_doing > 1) {
                                self.loading_visible = true;
                            }
                            else {
                                self.loading_visible = false;
                            }
                            self.loading_visible_did = self.loading_visible;
                        }
                        else {
                            self.total_page_did = response.total_page;
                            if (self.total_page_did > 1) {
                                self.loading_visible = true;
                            }
                            else {
                                self.loading_visible = false;
                            }
                            self.loading_visible_did = self.loading_visible;
                        }
//                    }
//                    else{
//                        self.loading_visible=true;
//                    }
//                    console.log('weexModules '+self.period_product_users_did);
//                    modal.toast({message:self.loading_visible, duration:1});
                });

            },
            quickBuyClick() {
                weexModules.closePage();
                weexModules.openAppFunction('app://main/home');
            },
            hideLoading(){
                setTimeout(() => {
                    this.loading_display = 'hide'
                }, 222)
            },
            loadMore() {
                this.loading_display = 'show';
                if(this.type==1){
                    if(this.page_being<this.total_page_being){
                        this.page_being++;
                        this.getData();
                    }
                    else{
                        modal.toast({
                            message: '已到最后', duration: 1
                        });
                        this.hideLoading();
                    }
                }
                else if(this.type==3){
                    if(this.page_did<this.total_page_did){
                        this.page_did++;
                        this.getData();
                    }
                    else{
                        modal.toast({
                            message: '已到最后', duration: 1
                        });
                        this.hideLoading();
                    }
                }else{
                    if(this.page_doing<this.total_page_doing){
                        this.page_doing++;
                        this.getData();
                    }
                    else{
                        modal.toast({
                            message: '已到最后', duration: 1
                        });
                        this.hideLoading();
                    }
                }

            },
            participation(data){
                console.log("XX type:"+JSON.stringify(data))

                if (data.type ==1) {    //用id
                    weexModules.gotoPage(app.getJsServerAddress() + 'product_detail.js?id=' + data.id)
                } else{      //用product_id
                    weexModules.gotoPage(app.getJsServerAddress() + 'product_detail.js?product_id=' + data.product_id)
                }
            },
            leftClick() {
                var params = {
                    'animated': 'true',
                };
                navigator.pop(params, function () {
                });
            },
        }
    }
</script>
