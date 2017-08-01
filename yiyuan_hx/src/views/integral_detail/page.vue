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
                left_item_src:appConfig.getImagesAddress()+'common_icon_title_back.png',
                navBarHeight: 100,
                title: '积分明细',
                redtablis:['获取记录','消费记录'],
                current:0,//tab切换
                score_histories:[],
                page:1,
                per_page:20,
                total_page:0,
                noneData:false,
                replaceToggle:true,
            };
        },

        mounted(){
            this.handleRefresh();
        },

        computed: {
            deviceHeight: {
                get: function() {
                    return this.$getConfig().env.deviceHeight-220;
                }
            },
        },

        methods: {
            ontab:function (index) {
                var self = this;
                weexModules.showProcess();
                self.replaceToggle = false;
                switch (index) {
                    case 0:     //获取记录
                        self.current=0;
                        self.handleRefresh();
                        break;
                    case 1:     //消费记录
                        self.current=1;
                        self.handleRefresh();
                        break;
                }
            },
            getScoreHistories:function () {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/score_histories',{
                    page: self.page,
                    per_page: self.per_page,
                    type:(self.current==0?"reward":"consume")
                }).then((res)=>{
                    if (res.error_code == 0){
                        weexModules.hideProcess();
                        self.replaceToggle = true;
                        self.noneData = res.score_histories.length<=0?true:false;

                        if (self.page == 1) {
                            self.score_histories = [];
                        }
                        self.score_histories.push.apply(self.score_histories, res.score_histories);
                        self.total_page = res.total_page;
                        console.log("添加后数组长度"+self.score_histories.length+" current:"+self.current+" noneData:"+self.noneData);
                    }else {
                        weexModules.toast(res.error_reason);
                    }
                    self.$refs.list.loadingHide();
                    self.$refs.list.refreshHide();
                });

            },
            handleRefresh(event){
                this.page = 1;
                this.getScoreHistories();
            },
            onloading(event) {
                if (this.page < this.total_page) {
                    this.page++;
                    this.getScoreHistories();
                }else {
                    weexModules.toast('别扯了，已经到最后了！');
                    this.$refs.list.$emit("loadingDone");
                }
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },
        }
    }
</script>