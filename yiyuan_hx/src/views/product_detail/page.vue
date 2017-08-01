<style src="./style.css" scoped></style>
<template src="./template.html"></template>
<script>
    import appConfig from 'utils/AppConfig';
    import weexModules from 'utils/WeexModules';
    import {parseUrlParams, isNumber, isNull, getTimeStr} from 'utils/Utils'
    var timer = null;
    var dom = weex.requireModule('dom');
    export default {
        data(){
            return {
                title: '商品详情',
                left_item_src: appConfig.getImagesAddress() + 'common_icon_title_back.png',
                product_detail_twxq: appConfig.getImagesAddress() + 'product_detail_twxq.png',
                product_detail_wqjx: appConfig.getImagesAddress() + 'product_detail_wqjx.png',
                product_detail_wqsd: appConfig.getImagesAddress() + 'product_detail_wqsd.png',
                product_data: {},
                period_product: {},
                thumb_images: [],
                lucy_user: {},//变量为null出bug
                period_product_users: [],
                status_text: '状态未知',
                show_countdown: true,
                show_published: true, //是否显示已揭晓
                lucy_user_flag: true,
                period_product_id: '',
                max_created_at: 0,
                mynums: [],
                saber: false,
                show_saber: false,
                buy_num: 1,
                show_bottom_buy: false,
                show_get_away: false,
                shown_text: false,
                id: '',
                product_id: '',
                user_input_timeout: false,
                bottom_toggle: true,
                close_icon: appConfig.getImagesAddress() + 'icon_x.png',
                top_4_data: [],
                top_4_data1: [{num: 5, top_4_toggle: true, top_4_can: true}, {
                    num: 10,
                    top_4_toggle: true,
                    top_4_can: true
                }, {num: 50, top_4_toggle: true, top_4_can: true}, {
                    num: 100,
                    top_4_toggle: true,
                    top_4_can: true
                }, {num: '包尾', top_4_toggle: true, top_4_can: true}],
                top_4_data10: [{num: 10, top_4_toggle: true, top_4_can: true}, {
                    num: 50,
                    top_4_toggle: true,
                    top_4_can: true
                }, {num: 100, top_4_toggle: true, top_4_can: true}, {
                    num: 500,
                    top_4_toggle: true,
                    top_4_can: true
                }, {num: '包尾', top_4_toggle: true, top_4_can: true}],
                top_4_data100: [{num: 200, top_4_toggle: true, top_4_can: true}, {
                    num: 500,
                    top_4_toggle: true,
                    top_4_can: true
                }, {num: 1000, top_4_toggle: true, top_4_can: true}, {
                    num: 5000,
                    top_4_toggle: true,
                    top_4_can: true
                }, {num: '包尾', top_4_toggle: true, top_4_can: true}],
                top_4_can: true,
                barrageList:[],
                barrage_second:2,
                barrage_num:1,
                barrage_toggle:false,
                barrage_index:0,
                nextShowTime:0,
                beijing_bg:appConfig.getImagesAddress() + 'beijing.png',
                beijing_flag:appConfig.getImagesAddress() + 'beijing_flag.png',
                navList:['参与记录','往期揭晓','夺宝规则'],
                replaceToggle:true,
                current:0,
                publish_data:[],
                max_end_at :0,
                index:0,
                items: [],
                per_page:20,
                page:1,
                noneData:false,
                noneData2:false
            };
        },

        mounted(){
            var parameters = parseUrlParams(this.$getConfig().bundleUrl);
            if (parameters.hasOwnProperty('id')) {
                this.id = parameters['id'];
            } else if (parameters.hasOwnProperty('product_id')) {
                this.product_id = parameters['product_id'];
            } else {
                weexModules.toast('id 或 product_id 没有这参数')
                return;
            }

//            this.handleRefresh(null);
            this.getPublishData();
        },

        methods: {
            leftClick(){
                weexModules.closePage();
            },
            handleRefresh(event){
                this.page = 1;
                this.getOneProductDetails();
                this.bottom_toggle = true;
                this.getBarrageData();
            },
            onloading(event) {
                this.loading_display = true;
                setTimeout(() => {
                    this.loading_display = false;
                }, 44)
//                if (this.page < this.total_page) {
//                    this.page++;
//                    this.getWinnerList();
//                }
//                else {
//                    weexModules.toast('别扯了，已经到最后了！');
//                    this.$refs.list.$emit("loadingDone");
//                    this.$refs.list.loadingHide();
//                    setTimeout(() => {
//                        this.loading_display = false;
//                    }, 444)
//                }
            },
            getOneProductDetails(){
                console.log("当前id:" + this.id + " 当前product_id:" + this.product_id);
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress() + '/api/period_products/detail', {
                    id: this.id,
                    product_id: this.product_id
                }).then((res) => {
                    if (res.error_code == 0) {
                        self.product_data = res;
                        self.period_product = res.period_product;
                        self.lucy_user = res.period_product.user;
                        self.thumb_images = res.period_product.thumb_image_urls;
                        self.mynums = res.buy_luck_nos;
                        console.log("当前id:" + this.id + " mynums:" + self.mynums.length);
                        self.buy_num = res.period_product.unit_num;
                        self.setStatus();
                        self.unit_num = self.period_product.unit_num;
                        self.top_4_data = self.unit_num == 100 ? self.top_4_data100 : '' || self.unit_num == 10 ? self.top_4_data10 : self.top_4_data1;
                        self.top_4_data.forEach(function (item, index) {
                            item.top_4_toggle = true;
                            if (item.num > self.period_product.rest_num) {
                                item.top_4_can = false;
                            }
                        });
                        self.getWinnerList();
                        if (isNull(self.lucy_user)) {
                            self.lucy_user_flag = false;
                            self.lucy_user = {
                                "id": 0,
                                "avatar_url ": "",
                                "avatar_small_url": "",
                                "username": "",
                                "ip_text": "",
                                "sex": 0
                            };
                        } else {
                            self.lucy_user_flag = true;
                        }

                        self.product_id = '';
                        self.id = self.period_product.id;
                    } else {
                        weexModules.toast(res.error_reason);
                    }
                })
            },
            getWinnerList(){
                weexModules.httpGet(appConfig.getApiServerAddress() + '/api/period_product_users',
                    {period_product_id: this.period_product.id, max_created_at: this.max_created_at}).then((res) => {
                    if (res.error_code >= 0) {
                        if (this.page == 1 && res.period_product_users.length > 0) {
                            this.period_product_users = [];
                        }
                        if (res.period_product_users.length <= 0){
                            this.noneData = true;
                        }
                        else {
                            this.noneData = false;
                        }
                        this.total_page = res.total_page;
                        this.period_product_users.push.apply(this.period_product_users, res.period_product_users);
                    }
                });
            },
            setStatus(){
                var self = this;
                if (self.period_product.status == 1) {
                    self.show_published = false;
                    self.status_text = '进行中';
                    self.show_bottom_buy = true;
                    self.show_countdown = false;
                } else if (self.period_product.status == 2) {
                    self.show_published = false;
                    self.status_text = '倒计时';
                    self.show_get_away = true;
                    self.show_countdown = true;
                    self.show_bottom_buy = false;
                } else if (self.period_product.status == 3) {
                    self.status_text = '已揭晓';
                    self.show_published = true;
                    self.show_get_away = true;
                    self.show_countdown = false;
                    self.show_bottom_buy = false;
                }
            },
            showMore(){
                this.saber = !this.saber;
            },
            buy_reduce() {
                var self = this;
                if (self.buy_num <= self.period_product.unit_num) {
                    weexModules.toast('最少购买' + self.period_product.unit_num);
                    return;
                }
                self.buy_num -= self.period_product.unit_num;
            },
            buy_add() {
                var self = this;
                self.buy_num = Number(self.buy_num) + Number(self.period_product.unit_num);
                if (self.buy_num > self.period_product.rest_num) {
                    self.buy_num = self.period_product.rest_num;
                }
                if (self.buy_num > 10000) {
                    self.buy_num = 10000;
                }
            },
            buy_max(){      //包尾购买
                this.buy_num = this.period_product.max_buy_num;
                weexModules.httpPost(appConfig.getApiServerAddress() + '/api/orders/create', {
                    num: this.buy_num,
                    period_product_id: this.period_product.id,
                    type: 'product'
                }).then((res) => {
                    if (res.error_code == 0) {
                        weexModules.openAppFunction(appConfig.getWebViewAddress() + res.redirect_url);
                    } else if (res.error_code == -100) {
                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'login.js');
                    } else {
                        weexModules.toast(res.error_reason);
                    }
                })
            },
            buy_current() {  //立即购买
                weexModules.httpPost(appConfig.getApiServerAddress() + '/api/orders/create', {
                    num: this.buy_num,
                    period_product_id: this.period_product.id,
                    type: 'product'
                }).then((res) => {
                    if (res.error_code == 0) {
                        weexModules.openAppFunction(appConfig.getWebViewAddress() + res.redirect_url, {urlType: 'recharge'});
                    } else if (res.error_code == -100) {
                        weexModules.gotoPage(appConfig.getJsServerAddress() + 'login.js');
                    } else {
                        weexModules.toast(res.error_reason);
                    }
                })
            },

            onInput(e) {
                if (isNull(this.period_product)) {
                    return;
                }
                if (e.value.length == 0 || e.value < this.period_product.unit_num) {
                    if (!this.user_input_timeout) {
                        this.user_input_timeout = true;
                        setTimeout(() => {
                            this.user_input_timeout = false;
                            dom.updateAttrs(this.$refs.buy_input, {value: this.period_product.unit_num});

                        }, 2000);
                    }

                    return;
                }
                this.inputFilter(e.value, 'buy_input');
            },

            inputFilter(value, id){
                if (timer) {
                    clearTimeout(timer);
                }
                var num = value.replace(/[^0-9]/ig, "");
                if (num > this.period_product.rest_num) {
                    num = this.period_product.rest_num;
                    dom.updateAttrs(this.$refs.buy_input, {value: num});
                }
                if (num < this.period_product.unit_num) {
                    num = this.period_product.unit_num;
                }
                if (num > 10000) {
                    num = 10000;
                }
                this.buy_num = num;

            },

            onGetAway() {
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'product_detail.js?product_id=' + this.period_product.product_id);
            },
            click_graphic_details() { //图文详情
                weexModules.openAppFunction(appConfig.getWebViewAddress() + '/m/period_products/detail_image?product_id=' + this.period_product.product_id)
            },
            to_phase_out(id) {   //往期揭晓
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'pre_publish.js?id=' + id);
            },
            old_share(id) {  //往期晒单
                weexModules.gotoPage(appConfig.getJsServerAddress() + 'shaidan.js?id=' + id);
            },
            timerFinish() {
                this.period_product.status = 3;
                this.setStatus();
            },
            calculation_details() {  //计算详情
                var id = parseUrlParams(this.$getConfig().bundleUrl)['id'];
                weexModules.openAppFunction(appConfig.getWebViewAddress() + '/m/period_products/calc_detail?id=' + id);
            },
            getLocalTime(nS) {
                var date = new Date(parseInt(nS)),
                    y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate();
                var result = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + date.toTimeString().substr(0, 8);
                return result;
            },
            goClose(){
                this.bottom_toggle = !this.bottom_toggle;
            },
            goOpen(){
                if (this.bottom_toggle == true) {
                    this.bottom_toggle = false;
                }
                else {
                    this.buy_current();
                }
            },
            buy_new(type, value, can){
                if (can) {
                    this.top_4_data.forEach(function (item, index) {
                        item.top_4_toggle = true;
                    });
                    this.top_4_data[type].top_4_toggle = false;
                    if (type == 4) {
                        this.buy_num = this.product_data.period_product.max_buy_num;
                    }
                    else {
                        this.buy_num = Number(value);
                    }
                    if (this.buy_num > 10000) {
                        this.buy_num = 10000;
                    }
                    if (this.buy_num > this.period_product.rest_num) {
                        this.buy_num = this.period_product.rest_num;
                    }
                }
                else {
                    return;
                }
            },
            getBarrageData() {
                var self = this;
                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/period_product_users/lately',{}).then(res=>{
                    if(res.error_code == 0){
                        self.barrageList = res.period_product_users;
                        self.starBarrage();
                    }
                })
            },
            starBarrage () {
                clearTimeout(timer2);
                if(this.nextShowTime==0){
                    this.barrage_toggle = true;
                }
                this.nextShowTime = Math.ceil(Math.random()*29)+1;
                var timer1 =  setTimeout(function () {
                    this.barrage_toggle = false;
                    this.barrage_second = Math.ceil(Math.random()*29)+1;
                    if(this.barrage_index<this.barrageList.length){
                        this.barrage_index++;
                    }
                    else {
                        this.barrage_index = 0;
                    }
                }.bind(this), 2600);
                var timer2 = setTimeout(function () {
                    this.barrage_toggle = true;
                    clearTimeout(timer1);
                    this.starBarrage();
                }.bind(this),this.nextShowTime*1000);
            },

            ontab:function (index) {
                var self = this;
//                weexModules.showProcess();
//                self.replaceToggle = false;
                switch (index) {
                    case 0:     //参与记录
                        self.current=0;

                        break;
                    case 1:     //往期揭晓
                        self.current=1;

                        break;
                    case 2:     //夺宝规则
                        self.current=2;

                        break;
                }
            },
            //往期揭晓
            getPublishData () {
                var self = this;
//                this.product_id = parseUrlParams(this.$getConfig().bundleUrl)['id'];
                weexModules.httpGet(appConfig.getApiServerAddress() + '/api/period_products/history', {
                    product_id: self.product_id,
                    max_end_at: self.max_end_at,
                    per_page: 20
                }).then(function (res) {
                    if (res.error_code == 0) {
                        if(self.max_end_at == 0){
                            self.publish_data = [];
                            if (res.period_products.length <= 0){
                                self.noneData2 = true ;
                            }else {
                                self.noneData2 = false ;
                            }
                        }
                        self.publish_data.push.apply(self.publish_data, res.period_products);
                        self.index = self.publish_data.length -1;
                    }
                })
            },
        }
    }
</script>