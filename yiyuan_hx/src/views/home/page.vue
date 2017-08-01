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
                title: '首页',
                left_item_src:appConfig.getImagesAddress()+'home_classify.png',
                right_item_src:'',
                is_clicked:false,
                award_title_img:appConfig.getImagesAddress()+'home_jiexiao_title.png',
                home_ten_product:appConfig.getImagesAddress()+'home_ten_products.png',
                home_hundred_product:appConfig.getImagesAddress()+'home_hundred_products.png',
                dbkb:appConfig.getImagesAddress()+'home_dbkb.png',
                refreshing: false,
                loading_display: false,
                medias: [],
                itemlclassify:[
                    {
                        classname: '邀请赚钱',
                        imgurl: appConfig.getImagesAddress() + 'home_earn.png',
                    },
                    {
                        classname: '充值',
                        imgurl: appConfig.getImagesAddress() + 'home_recharge.png',
                    },
                    {
                        classname: '签到',
                        imgurl: appConfig.getImagesAddress() + 'home_past.png',
                    },
                    {
                        classname: '帮助中心',
                        imgurl: appConfig.getImagesAddress() + 'home_help.png',
                    }
                ],
                fontSize:6,
                page:1,
                total_page:1,
                goodlist:[],
                header1:true,
                header2:false,
                header3:false,
                header4:false,
                header_url:appConfig.getApiServerAddress() + '/api/period_products',
                api_period_products:appConfig.getApiServerAddress() + '/api/period_products',
                api_period_products_new:appConfig.getApiServerAddress() + '/api/period_products/new',
                slider_current_index: 0,
                period_products:[],
                marqueeList:[],
                icon_toggle:true,
                desc:1,
                vip:appConfig.getImagesAddress() + 'home_earn.png',
            };
        },

        mounted(){
            var self = this;
            self.handleRefresh();
            self.getBanner();
            self.marqueedata();
            setInterval(function () {
                self.marqueedata();
//                if (self.marqueeList.length > 20) {
//                    self.marqueeList.splice(0, 5);
//                }
            }, 25000);
            self.step=this.isIOS();
            var globalEvent = weex.requireModule('globalEvent');
            globalEvent.addEventListener('event_notice_message',function (e) {
                self.getNoticeUnreadCount();
            });

        },

        methods: {

            pageRefresh:function () {

                var self = this ;

                weexModules.hasLogin().then(function (res) {
                    if(res){

                        self.is_clicked = true ;
                        self.right_item_src = appConfig.getImagesAddress()+'home_notification_default.png';
                    }
                    else{
                        self.is_clicked = false ;
                        self.right_item_src = '';
                    }
                });

                this.getNoticeUnreadCount() ;
            } ,
            //手动刷新
            handleRefresh(event){
                this.refreshing = true;
                this.page = 1;
                this.headerTabClick(1);
                this.getPeriodProducts();
                this.getNoticeUnreadCount();
            },
            onloading(event) {
                this.loading_display = true;
                if (this.page < this.total_page) {
                    this.page++;
                    this.getGoodList({page:this.page});
                }else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.$emit("loadingDone");
                    this.$refs.list.loadingHide();
                    setTimeout(() => {
                        this.loading_display = false;
                    }, 444)
                }
            },
            //获取轮播图资源
            getBanner:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/medias',{location:'home_banner'}).then((res) =>{
                    if(res.error_code == 0){
                        self.medias = res.medias;
                    }
                })
            },
            change(e) {
                this.slider_current_index = e.index;
            },
            //轮播图点击事件
            goDb(){
                if (isNull(this.medias[this.slider_current_index].client_url)){
                    return;
                }
                else{
                    weexModules.openAppFunction(this.medias[this.slider_current_index].client_url);
                }
            },
            //商品列表
            getGoodList(parameters){
                var self = this;
                weexModules.httpGet(self.header_url,parameters).then((res) => {
                    if (res.error_code >= 0) {
                        weexModules.hideProcess();
                        if (self.page == 1) {
                            self.goodlist = [];
                        }
                        self.total_page = res.total_page;
                        self.goodlist.push.apply(self.goodlist, res.period_products);
                    }
                     self.refreshing = false;
                     self.loading_display = false;
                     self.$refs.list.$emit("refreshDone");
                     self.$refs.list.$emit("loadingDone");
                     self.$refs.list.loadingHide();
                     self.$refs.list.refreshHide();

                }, function (res) {
                    self.$refs.list.loadingHide();
                    self.$refs.list.refreshHide();
                });
            },
            headerTabClick(type){
                weexModules.showProcess();
                this.page = 1;
                this.header2 = false;
                this.header3 = false;
                this.header4 = false;
                this.header1 = false;
                switch (type) {
                    case 1:
                        this.header1 = true;
                        this.header_url = this.api_period_products;
                        this.getGoodList({page:this.page});
                        break;
                    case 2:
                        this.header2 = true;
                        this.header_url = this.api_period_products_new;
                        this.getGoodList({page:this.page});
                        break;
                    case 3:
                        this.header3 = true;
                        this.header_url = this.api_period_products;
                        this.getGoodList({page:this.page,rank:'progress_percent'});
                        break;
                    case 4:
                        this.header4 = true;
                        this.header_url = this.api_period_products;
                        this.icon_toggle = !this.icon_toggle;
                        this.desc = this.icon_toggle?1:0;
                        this.getGoodList({page:this.page,rank:'max_num',desc:this.desc});
                        break;
                }
            },
            onGoodsClick(id){
                weexModules.gotoPage(appConfig.getJsServerAddress()+'product_detail.js?product_id=' + id)
            },
            onpushurl(index){
                var item = this.itemlclassify[index];
                if (item.classname === '邀请赚钱') {
                    weexModules.hasLogin().then(function (res) {
                        if(res){
                            weexModules.gotoPage(appConfig.getJsServerAddress()+'my_commission.js');
                        }
                        else{
                            weexModules.gotoPage(appConfig.getJsServerAddress()+'login.js');
                        }
                    });
                } else if (item.classname === '充值') {
                    weexModules.hasLogin().then(function (res) {
                        if(res){
                            weexModules.openAppFunction(appConfig.getWebViewAddress() + '/m/users/recharge',{urlType:'recharge'});
                        }
                        else{
                            weexModules.gotoPage(appConfig.getJsServerAddress()+'login.js');
                        }
                    });
                } else if (item.classname === '签到') {
                    weexModules.hasLogin().then(function (res) {
                        if(res){
                            weexModules.openAppFunction(appConfig.getWebViewAddress() + '/m/users/sign_in');
                        }
                        else{
                            weexModules.gotoPage(appConfig.getJsServerAddress()+'login.js');
                        }
                    })
                } else if (item.classname === '帮助') {
                    weexModules.openAppFunction(appConfig.getWebViewAddress() + '/m/about/help');
                }
            },
            onItemClick(id) {
                weexModules.gotoPage(appConfig.getJsServerAddress()+'product_detail.js?id='+id);
            },
            //最新揭晓商品
            getPeriodProducts:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products/close',{page:1,per_page:3}).then((res) =>{
                    if(res.error_code ==0){
                        self.period_products = res.period_products;
                    }
                    var now = res.now_at * 1000;
                    for(var i=0;i<self.period_products.length;i++){
                        var item=self.period_products[i];
                        item.now = now ;
                        if (item.end_at > now) {
                            item.user = {username: ''};
                            item.show_countdown = true;
                        }else {
                            item.show_countdown = false;
                        }
                        console.log("item.show_countdown:"+item.show_countdown);
                    }
                    self.$refs.list.loadingHide();
                    self.$refs.list.refreshHide();
                }, function (res) {
                    self.$refs.list.loadingHide();
                    self.$refs.list.refreshHide();
                });
            },
            //最新揭晓倒计时
            timerFinish(index){
                var item=this.period_products[index];
                item.show_countdown = false;
                console.log("倒计时结束: item.show_countdown:"+item.show_countdown+" index:"+index);

                Vue.set(this.period_products, index, this.period_products[index]);

                if(item.user.username==''){
                    item.user.username='即将揭晓...';
                    this.getResult(index,item);
                }
            },
            getResult(index,item){
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products/detail?id='+item.id).then((res)=>{
                    if(res){
                        var resdata = res.period_product.user.username;
                        item.user.username = resdata.substring(0,10)+'...';
                        Vue.set(self.period_products, index, self.period_products[index]);
                    }
                })
            },
            //铃铛消息/左
            leftButtonClick:function () {
                weexModules.gotoPage(appConfig.getJsServerAddress()+'classify.js');
            },
            //铃铛消息/右
            rightButtonClick:function () {

                if (this.is_clicked){
                    weexModules.openAppFunction('app://message/show');
                }
            },
            //跑马灯数据
            marqueedata(){
                let self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_products/lucky',{page: self.page,
                    per_page: 20}).then((res)=>{
                    self.marqueeList.push.apply(self.marqueeList, res.period_products);
                })
            },
            //获取通知未读数量
            getNoticeUnreadCount(){
                var self = this;
                weexModules.openAppFunction("app://notice/count/unread").then((res) =>{
                    if (this.is_clicked){
                        if(res.count>0){
                           // weexModules.toast(res.count);
                            self.right_item_src = appConfig.getImagesAddress()+'home_notification_news.png';
                        }else{
                            self.right_item_src = appConfig.getImagesAddress()+'home_notification_default.png';
                        }
                    }
                })
            },

        }
    }
</script>