<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, isPhoneNumber,isAuthCode,checkCallbackData} from 'utils/Utils';
    
    export default {
        data(){
            return {
                title:'个人中心',
                right_item_src:appConfig.getImagesAddress()+'personal_setting.png',
                user:{
                    "avatar_small_url": appConfig.getImagesAddress()+'personal_avatar_default.png',
                    "username": "游客",
                    "money": 0,
                    "mobile": ""
                },
                image_address:appConfig.getImagesAddress(),
                is_low_version:false,
                packetitem:[
                    {num:0,name:'我的积分',icon:appConfig.getImagesAddress()+'personal_integral.png',unit:'分'},
                    {num:0,name:'我的红包',icon:appConfig.getImagesAddress()+'personal_envelope.png',unit:'个'},
                    {num:0.00,name:'我的佣金',icon:appConfig.getImagesAddress()+'personal_commission.png',unit:'元'},
                ],
                Myidetailstems:[
                    {icon:appConfig.getImagesAddress()+'personal_duobaoRecord.png',name:'夺宝记录'},
                    {icon:appConfig.getImagesAddress()+'personal_winRecord.png',name:'中奖纪录'},
                    {icon:appConfig.getImagesAddress()+'personal_address.png',name:'收货地址'},
                    {icon:appConfig.getImagesAddress()+'personal_bask.png',name:'我的晒单'}
                ],
                shareitem:[
                    {shareimg:appConfig.getImagesAddress()+'icon_qq_friend.png',sharename:'QQ好友'},
                    {shareimg:appConfig.getImagesAddress()+'icon_qq_qzone.png',sharename:'QQ空间'},
                    {shareimg:appConfig.getImagesAddress()+'icon_weixin_friend_circle.png',sharename:'朋友圈'},
                    {shareimg:appConfig.getImagesAddress()+'icon_weixin_friend.png',sharename:'微信好友'}
                ],
                menus:[],
                serviceDatas:false,
                lpopup:false,
                share_info:{},
            };
        },

        mounted(){
            var self = this;

            this.getUserInfo();
            this.getMenus();
            this.getShareInfo();
            this.getSoftwareConfig();
            this.getScoreHistories();
            this.getUnreadCount();

            var globalEvent = weex.requireModule('globalEvent');
            globalEvent.addEventListener('event_count_unread',function (e) {
                self.getUnreadCount();
            });
        },
        methods: {
            editProfile(){
                weexModules.gotoPage(appConfig.getJsServerAddress()  + 'person_profile.js?user_id='+this.user.id);
            },
            naviBarRightItemClick(){
                weexModules.gotoPage(appConfig.getJsServerAddress()+'setting.js');
            },
            recharge: function () {
                weexModules.openAppFunction(appConfig.getWebViewAddress()+'/m/users/recharge');
            },
            onpack:function (index) {
                console.log("onpack:"+index);
                switch (index) {
                    case 0://我的积分
                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'my_integral.js');
                        break;
                    case 1://我的红包
                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'my_redpack.js');
                        break;
                    case 2://我的佣金
//                        event.openURL(servers.getJsAddress() + '/my_commission.js?user_id='+this.user.id);
                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'my_commission.js');
                        break;
                }
            },
            onpushMyidetails: function (index) {
                console.log("onpushMyidetails:"+index);
                switch (index) {
                    case 0:     //夺宝记录
                        weexModules.gotoPage(appConfig.getJsServerAddress()  + 'indiana_recoder.js?user_id='+this.user.id);
                        break;
                    case 1: //中奖纪录
                        weexModules.gotoPage(appConfig.getJsServerAddress()  + 'zhongjiang-redcord.js');
                        break;
                    case 2:     //收货地址
                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'addresslist.js');
                        break;
                    case 3:
                        //我的晒单，待添加
                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'my_shaidan.js');
                        break;
                }
            },
            onpushhelp: function (item) {
                if (item.url == 'app:\/\/software\/share') {
                    console.log("onpushhelp:"+item.url);
                    this.lpopup = true;
                    return;
                }
                if(item.url=='url:\/\/m\/customer_messages\/index'){
                    weexModules.openAppFunction('app://message/read/all');
                    this.serviceDatas=false;
                }
                weexModules.openAppFunction(item.url);
            },
            getMenus:function(){
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/users/menus',{type:'self'}).then((res)=>{
                    if ( res.error_code == 0){
                        self.menus = res.menus;
                    }else {
                        weexModules.toast(res.error_reason);
                    }
                });
            },
            pageRefresh:function () {
                console.log("person pageRefresh");
                this.getUserInfo();
                this.getScoreHistories();
            },

            getUserInfo:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/users').then((res)=>{
                    if(checkCallbackData(res)){
                        if (res.error_code == 0){
                            self.user = res;
                            self.packetitem[1].num=res.coupon_num;
                            console.log("111 royalty_amount:"+res.royalty_amount);
                            if(res.royalty_amount == 0){
                                self.packetitem[2].num='0.00';
                            }else{
                                self.packetitem[2].num=res.royalty_amount.toFixed(2);
                                console.log("222 royalty_amount:"+self.packetitem[2].num);
                            }
                        } else{
                            weexModules.toast(res.error_reason);
                        }
                    }
                });
            },
            getScoreHistories(){
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/score_histories/self').then((res)=>{
                    if (res.error_code == 0) {
                       self.packetitem[0].num=res.balance;
                    }
                });
            },
            lpopuphide:function(){
                this.lpopup = false;
            },
            lshareonclick: function (index) {
                var self = this;
                switch (index) {
                    case 0://QQ好友
                        weexModules.openAppFunction('app://share/qq/friend',self.share_info).then(this.sharedFc.bind(this));
                        break;
                    case 1://QQ空间
                        weexModules.openAppFunction('app://share/qq/zone',self.share_info).then(this.sharedFc.bind(this));
                        break;
                    case 2://朋友圈
                        weexModules.openAppFunction('app://share/wx/moments',self.share_info).then(this.sharedFc.bind(this));
                        break;
                    case 3://微信好友
                        weexModules.openAppFunction('app://share/wx/friend',self.share_info).then(this.sharedFc.bind(this));
                        break;
                }
            },
            sharedFc: function (response) {
                if (response.hasOwnProperty('status')&&response.status >= 0) {
                    this.lpopup = false;
                    this.postShareReward();
                }else {
                    this.lpopup = false;
                }
            },
            getShareInfo:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/software/share_info').then((res)=>{
                    if (res.error_code == 0) {
                        self.share_info = res;
                    }else {
                        weexModules.toast(res.error_reason);
                    }
                });
            },
            getSoftwareConfig:function(){
                var self = this;
                weexModules.openAppFunction('app://config/software').then(function(json){
                    self.is_low_version = !json.status;
                });
            },
            getUnreadCount:function () {
                var self = this;
                weexModules.openAppFunction('app://message/count/unread').then(function(json){
                    if(json.status == 0 && json.count > 0){
                        self.serviceDatas = true;
                    } else {
                        self.serviceDatas = false;
                    }
                });
            },
        }
    }
</script>