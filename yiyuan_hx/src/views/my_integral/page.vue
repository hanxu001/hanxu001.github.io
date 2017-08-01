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
                navBarHeight: 100,
                title: '我的积分',
                rightItemTitle: '积分明细',
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                integralitem:[
                    {titile:'消费积分',num:0,buttext:'去消费'},
                    {titile:'分享积分',num:0,buttext:'去分享'},
                    {titile:'签到积分',num:0,buttext:'去签到'},
                    {titile:'邀请积分',num:0,buttext:''},
                ],
                lpopup:false,
                share_info:{},
                myIntegral:{},
                buttons:[],
                shareitem:[
                    {shareimg:appConfig.getImagesAddress()+'icon_qq_friend.png',sharename:'QQ好友'},
                    {shareimg:appConfig.getImagesAddress()+'icon_qq_qzone.png',sharename:'QQ空间'},
                    {shareimg:appConfig.getImagesAddress()+'icon_weixin_friend_circle.png',sharename:'朋友圈'},
                    {shareimg:appConfig.getImagesAddress()+'icon_weixin_friend.png',sharename:'微信好友'}
                ],
            };
        },

        mounted(){
//            this.getScoreHistories();
            this.getShareInfo();
        },

        methods: {
            onparticulars:function (button) {
                console.log("onparticulars:"+button.url);
                if(!isNull(button.url)){
                    weexModules.openAppFunction(button.url);
                }
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
                console.log("分享回调 vue:"+response);
                if (response.hasOwnProperty('status')&&response.status >= 0) {
                    this.lpopup = false;
                    this.postShareReward();

                    console.log("上报状态");
                }else {
                    this.lpopup = false;
                }
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },
            ongodo:function (index) {
                var self = this;
                switch (index) {
                    case 0:     //去消费
                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'exchange_redpack.js');
                        break;
                    case 1:     //去分享
                        self.lpopup='true';
                        break;
                    case 2:     //去签到
//                        event.openURL(app.getWebViewAddress() + '/m/users/sign_in');
                        weexModules.openAppFunction(appConfig.getWebViewAddress()+'/m/users/sign_in');
                        break;
                }
            },
            getScoreHistories:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress() + '/api/score_histories/self').then((res) =>{
                    if(res.error_code == 0){
                        console.log("我的积分 if:"+res.error_code);
                        self.myIntegral=res;
                        self.buttons=res.buttons;

                        self.integralitem[0].num=res.reward_score;
                        self.integralitem[1].num=res.share_score;
                        self.integralitem[2].num=res.sign_score;
                        self.integralitem[3].num=res.invite_score;
                    }else{
                        console.log("我的积分 else:"+res.error_code);
                        weexModules.toast(res.error_reason);
                    }
                });
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
            lpopuphide:function(){
                this.lpopup = false;
            },
            rightClick:function(){
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'integral_detail.js');
            },
            postShareReward:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/users/share_reward',{share_code:this.share_info.share_code,share_result:1}).then((res)=>{
                    if (res.error_code == 0) {
                        this.getScoreHistories();//重新刷新我的积分
                    }else {
                        weexModules.toast(res.error_reason);
                    }
                });
            },
            pageRefresh:function () {
                this.getScoreHistories();
            },
        }
    }
</script>