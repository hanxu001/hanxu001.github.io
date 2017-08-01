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
                address:{},
                province_city_district_name: '区域选择',
                area_click: false,
                area_texts: ['请选择'],
                provinces: {},//省
                province_index: -1,
                cities: {},//市
                city_index: -1,
                districts: {},//区
                district_index: -1,
                provinces_cities_districts: [],
                type: 1,
                province_id: 0, //省ID
                cities_id: 0,// 市ID
                district_id: 0,// 区ID
                receiver_flag: false,
                dialog_div_click: ['dialog_div_click', '', ''],
                shadow: false,
                SelectedClass:'dialog_div_click',
                mylines:2,
                input_ref:'input1',
            };
        },

        computed: {
            HEIGHT: function() {
                return this.$getConfig().env.deviceHeight;
            }
        },

        mounted(){

            this.getCacheAddressData() ;
        },

        methods: {
            getCacheAddressData:function () {
                var self = this ;
                weexModules.getTempData('address_Detail').then(function(json){

                    if(!json){
                        return;
                    }
                    self.address = json.dataindex ;
                    if (self.address.hasOwnProperty('province_name')) {
                        self.province_city_district_name = self.address.province_name + ' ';
                    }
                    if (self.address.hasOwnProperty('city_name')) {
                        self.province_city_district_name += self.address.city_name + ' ';
                    }
                    if (self.address.hasOwnProperty('district_name')) {
                        self.province_city_district_name += self.address.district_name;
                    }
                })
            },
            naviBarLeftItemClick () {
                weexModules.closePage();
            },

            onInput: function (id, e) {
                this.input_ref = 'input'+id;
                switch (id) {
                    case 1:
                        this.address['receiver_name'] = e.value;
                        break;
                    case 2:
                        this.address['mobile'] = e.value;
                        break;
                    case 3:
                        var mytext = e.value.substr(0,50);
                        this.mylines=Math.ceil(mytext.length/16);
                        this.address['street_address'] = mytext;
                        break;
                }
            },

            onFocus:function (id,e) {
                this.input_ref = 'input'+id ;
            },

            saveClick: function () {

                if (!this.addressAvailabe(this.address)){
                    return ;
                };

                var self = this ;

                weexModules.httpGet(appConfig.getApiServerAddress()+'/api/users/add_address',{
                    user_address_id:self.address.id,
                    receiver_name:self.address.receiver_name,
                    mobile:self.address.mobile,
                    province_id:self.address.province_id,
                    city_id:self.address.city_id,
                    district_id:self.address.district_id,
                    street_address:self.address.street_address,
                    default_status:self.address.default_status,
                }).then( res => {

                    if (res.error_code == 0){
                        weexModules.closePage() ;
                    }else {
                        weexModules.toast(res.error_reason) ;
                    }
                });
            },

            dissmeClick: function () {
                this.area_click = false;
            },
            areaClick: function () {//区域选择
                //隐藏键盘
                this.$refs[this.input_ref].blur() ;
                this.area_click = true;
                this.getProvinces();
            },
            getProvinces: function () {
                weexModules.httpGet(appConfig.getApiServerAddress() + '/provinces').then(response => {
                    this.provinces = response;
                    this.provinces_cities_districts = [];
                    this.provinces_cities_districts = response.provinces;
                })
            },
            getCities: function () {
                weexModules.httpGet(appConfig.getApiServerAddress() + '/cities', {province_id: this.provinces.provinces[this.province_index].id}).then((response) => {
                    this.cities = response;
                    this.provinces_cities_districts = [];
                    this.provinces_cities_districts = response.cities;
                    if (this.cities.cities.length == 0) {
                        this.province_city_district_name = this.provinces.provinces[this.province_index].name;
                        this.resetData();
                    }

                });
            },
            getDistricts: function () {
                weexModules.httpGet(appConfig.getApiServerAddress() + '/districts', {city_id: this.cities.cities[this.city_index].id}).then(response => {
                    this.districts = response;
                    this.provinces_cities_districts = [];
                    this.provinces_cities_districts = response.districts;
                    if (response.districts.length == 0) {
                        this.province_city_district_name = this.provinces.provinces[this.province_index].name + ' ' +
                            this.cities.cities[this.city_index].name;
                        this.resetData();
                    }
                });
            },
            areaHeaderClick: function (index, e) {//弹出框头部点击
                this.type = index + 1;
                console.log('cody :' + index);
                if (index === 0) {//加载省
                    this.dialog_div_click = ['dialog_div_click', '', ''];
                    this.getProvinces();
                } else if (index === 1) {//加载市
                    this.dialog_div_click = ['', 'dialog_div_click', ''];
                    this.getCities();
                } else if (index === 2) {//加载区
                    this.dialog_div_click = ['', '', 'dialog_div_click'];
                    this.getDistricts();
                }
                this.SelectedClass = this.dialog_div_click[index] ;
            },
            selectResult: function (index,type, e) { //选择结果
                this.area_texts = [];
                if (type === 1) { // type 1 2 3 分别是省 市 区
                    this.province_index = index;
                    this.area_texts.push(this.provinces.provinces[index].name);
                    this.address.province_id = this.provinces.provinces[index].id ;
                    if (this.provinces.is_next) {
                        this.area_texts.push('请选择');
                        this.dialog_div_click = ['dialog_div_click', '', ''];
                        this.type = 2;
                        this.provinces_cities_districts = [];
                        this.getCities();
                    }
                } else if (type === 2) {
                    this.city_index = index;
                    this.area_texts.push(this.provinces.provinces[this.province_index].name);
                    this.area_texts.push(this.cities.cities[this.city_index].name);
                    this.address.city_id = this.cities.cities[index].id ;

                    if (this.cities.is_next) {
                        this.area_texts.push('请选择');
                        this.dialog_div_click = ['', 'dialog_div_click', ''];
                        this.type = 3;
                        this.provinces_cities_districts = [];
                        this.getDistricts();
                    }
                } else if (type === 3) {
                    this.district_index = index;
                    this.area_texts.push(this.provinces.provinces[this.province_index].name);
                    this.area_texts.push(this.cities.cities[this.city_index].name);

                    if (this.districts.is_next) {
                        this.area_texts.push('请选择');
                        this.dialog_div_click = ['', '', 'dialog_div_click'];
                    } else {
                        if (!isNull(this.districts)) {
                            this.area_texts.push(this.districts.districts[index].name);
                            this.address.district_id = this.districts.districts[index].id ;
                        }
                        this.province_city_district_name = this.provinces.provinces[this.province_index].name + ' ' +
                            this.cities.cities[this.city_index].name + " " + this.districts.districts[index].name;
                        this.resetData();
                    }
                }
            },
            resetData: function () {
//                if (!isNull(this.provinces) && !isNull(this.provinces.provinces)) {
//                    this.province_id = this.provinces.provinces[this.province_index].id; //省ID
//
//                }
//                if (!isNull(this.cities) && !isNull(this.cities.cities)) {
//                    this.cities_id = this.cities.cities[this.city_index].id; // 市ID
//
//                }
//                if (!isNull(this.districts) && !isNull(this.districts.districts)) {
//                    this.district_id = this.districts.districts[this.district_index].id;// 区ID
//                }
                this.provinces_cities_districts = [];
                this.area_texts = ['请选择'];
                this.type = 1;
                this.provinces = {};
                this.cities = {};
                this.districts = {};
                this.area_click = false;
            },

            addressAvailabe: function (address) {

                //判断收货人
                if (!address.hasOwnProperty('receiver_name') || isNull(address['receiver_name'])) {
                    weexModules.toast('收货人姓名不能为空');
                    return false;
                }
                if (!address.hasOwnProperty('mobile') || isNull(address['mobile']) || address['mobile'].length < 11) {
                    weexModules.toast('手机号不能为空并且长度为11');
                    return false;
                }
                if (!address.hasOwnProperty('province_id') || address['province_id'] <= 0 ) {
                    weexModules.toast('请选择地区');
                    return false;
                }

                if (!address.hasOwnProperty('street_address') || isNull(address['street_address'])) {
                    weexModules.toast('详细地址不能为空');
                    return false;
                }
                return true;
            },

            onchange:function () {
                if (this.address.default_status){
                    this.address.default_status = 0 ;
                }else {
                    this.address.default_status = 1 ;
                }
            },
        }
    }
</script>