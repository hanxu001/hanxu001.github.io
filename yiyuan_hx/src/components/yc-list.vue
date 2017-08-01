<style scoped>

    .root {
        width: 750px;
        flex: 1;
    }

    .refresh_view {
        width: 750px;
        height: 140px;
        justify-content: center;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .gif {
        width: 164px;
        height: 100px;
    }
    .end_text{
        font-size:40px;
        color:#000000;
    }
</style>
<template>
    <list :style="{backgroundColor: backgroundColor}" class="root" loadmoreoffset="300" @loadmore="loadMore">
        <refresh ref="refresh" class="refresh_view" :display="refreshing ? 'show' : 'hide'" @refresh="handleRefresh">
            <yc-gif :src="imgSrc" class="gif"></yc-gif>
        </refresh>
        <slot></slot>
        <loading ref="loading" class="refresh_view" @loading="handleLoading" :display="loading?'show':'hide'">
            <yc-gif :src="imgSrc" class="gif" v-if="!end"></yc-gif>
            <text class="end_text" v-if="end">已到底部</text>
        </loading>
    </list>
</template>
<script>
    let modal = weex.requireModule("modal");
    let dom = weex.requireModule("dom");
    export default{
        props: {
            imgSrc: {default: 'http://test.365yf.cc/hybrid/yiyuan/images/header_anime.gif'},
            backgroundColor: {default: '#f2f3f7'},
            end:{default:false}
        },
        data(){
            return {
                refreshing: false,
                isRefreshing: false,
                loading: false,
                isLoading: false,


            }
        },
        computed:{

        },
        components: {},
        mounted () {
//            this.$on('refreshDone', (e) => {
//                this.refreshing = false;
//            });
//
//            this.$on('loadingDone', (e) => {
//                this.loading = false;
//            });
        },
        methods: {
            handleRefresh(){
                if (this.isRefreshing) {
                    modal.toast({message: "正在刷新数据......", duration: 1});
                    return;
                }
                this.refreshing = true;
                this.isRefreshing = true;
                this.$emit("refresh");
                setTimeout(() => {
                    this.isRefreshing = false;
                }, 2000);//3s内只能执行一次
                setTimeout(() => {
//                    if (!this.refreshing){
////                        dom.updateAttrs(this.$refs.refresh, {display:'hide'});
////                        modal.toast({message: "网络超时", duration: 1});
//                    }
                    if (this.refreshing) {
                        this.refreshing = false;
                        this.isRefreshing = false;
//                        modal.toast({message: "网络超时", duration: 1});
                    }

                }, 4000);//5s内还没数据过来，网络超时
            },
            handleLoading(){
                if (this.isLoading) {
                    modal.toast({message: "正在加载数据......", duration: 1});
                    return;
                }
                this.loading = true;
                this.isLoading = true;
                this.$emit("loading");
                setTimeout(() => {
                    this.isLoading = false;
                }, 2000);//3s内只能执行一次
                setTimeout(() => {
                    if (!this.loading){
//                        dom.updateAttrs(this.$refs.loading, {display:'hide'});
//                        modal.toast({message: "网络超时", duration: 1});
                    }

                    if (this.loading) {
                        this.loading = false;
                        this.isLoading = false;
//                        modal.toast({message: "网络超时", duration: 1});
                    }

                }, 4000);//5s内还没数据过来，网络超时
            },
            loadMore(e) {
                this.$emit('loadMore',e);
            },
            loadingHide() {
                this.loading = false;
                this.isLoading = false;
//                dom.updateAttrs(this.$refs.loading, {display:'hide'});
            },
            refreshHide() {
                this.refreshing = false;
                this.isRefreshing = false;
//                dom.updateAttrs(this.$refs.refresh, {display:'hide'});
            }

        }

    }
</script>
