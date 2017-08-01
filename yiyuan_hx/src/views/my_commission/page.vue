<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {isNull, startsWith,checkCallbackData} from 'utils/Utils';
//    import page from './page'

    export default {
        data(){
            return {
                main_data:[],
                royalty_amount:'0.00',
                users:[],
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                navBarHeight: 100,
                title: '我的佣金',
                rightItemTitle:'收支明细',
                downwardImg:appConfig.getImagesAddress()+'icon_downtwo.png',
                shareitem:[
                    {shareimg:appConfig.getImagesAddress()+'icon_qq_friend.png',sharename:'QQ好友'},
                    {shareimg:appConfig.getImagesAddress()+'icon_qq_qzone.png',sharename:'QQ空间'},
                    {shareimg:appConfig.getImagesAddress()+'icon_weixin_friend_circle.png',sharename:'朋友圈'},
                    {shareimg:appConfig.getImagesAddress()+'icon_weixin_friend.png',sharename:'微信好友'}
                ],
                rankingimg1:appConfig.getImagesAddress()+'icon_ranking_one.png',
                rankingimg2:appConfig.getImagesAddress()+'icon_ranking_two.png',
                rankingimg3:appConfig.getImagesAddress()+'icon_ranking_three.png',
                lpopup:false,
                share_info:{},
                noneData:false,
                nonedata_img:appConfig.getImagesAddress()+'blankpage.png',
            };
        },

        mounted(){
            this.getWeeklyRank();
            this.getShareInfo();
        },
        methods: {
            goWithdraw:function () {
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'withdraw.js');//提现申请
            },
            goRule:function () {
                weexModules.openAppFunction(appConfig.getWebViewAddress()+'/m/about/rule');
            },
            run:function () {
                this.lpopup='true';
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
            naviBarLeftItemClick:function(){
                weexModules.closePage();
            },
            rightClick:function(){
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'commission_detail.js');
            },
            getWeeklyRank:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/royalty_histories/weekly_rank').then((res)=>{
                    if(checkCallbackData(res)){
                        if (res.error_code == 0) {
                            if(isNull(res.users)){
                                self.noneData = true;
                            }else {
                                self.noneData = false;
                            }
                            self.main_data=res;
                            if(res.royalty_amount == 0){
                                self.royalty_amount = "0.00";
                            }else{
                                self.royalty_amount =res.royalty_amount.toFixed(2);
                            }
                            self.users=res.users;
                        }else {
                            weexModules.toast(res.error_reason);
                        }
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
            refreshData:function () {
                this.getWeeklyRank();
            },
            handleRefresh:function () {
                this.getWeeklyRank();
            },
        },
    }
</script>