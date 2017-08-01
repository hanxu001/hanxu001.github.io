<template>
    <div class="wrap"
         @appear="appeared"
         @disappear="disappeared">
        <div ref="anim"
             class="anim">
            <div class="marquee_con" v-for="(item,index) in marqueeList">
                <text class="marquee_text1">恭喜</text><text class="marquee_text2">{{item.user.username}}</text> <text class="marquee_text1">获得</text><text class="marquee_text3">{{item.product_name}}</text>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .wrap {
        overflow: hidden;
        position: relative;
    }
    .anim {
        flex-direction: column;
        position: absolute;
        transform: translateY(0) translateZ(0);
    }
    .marquee_con{
        padding-left: 10px;
        padding-right: 0px;
        align-items: center;
        flex-direction: row;
        height: 60px;
    }
    .marquee_text1{
        font-size: 28px;
        color: #323232;
    }
    .marquee_text2{
        color:#47c0fa;
        font-size:26px;
    }
    .marquee_text3{
        font-size: 28px;
        color: #323232;
    }
</style>

<script>
    var animation = weex.requireModule('animation')
    module.exports = {
        props: {
            marqueeList:{ default: [] },
            step:{ default: 0 },
        },
        data(){
            return {
                step:60,
                count:60,
                index:1,
                duration:1500,
                interval:2000,
                outofview:false,
            }
        },
        created: function () {
            if (this.interval > 0 && this.step > 0 && this.duration > 0) {
                this.run()
            }
        },
        methods: {
            run: function () {
                if (this.outofview) {
                    setTimeout(this.run.bind(this), this.interval)
                } else {
                    setTimeout(function () {
                        this.animation(this.run.bind(this))
                    }.bind(this), this.interval)
                }
            },
            animation: function (cb) {
                var offset = -this.step * this.index;
                animation.transition(this.$refs.anim, {
                    styles: {
                        transform: 'translateY(' + offset + 'px) translateZ(0)'
                    },
                    timingFunction: 'ease',
                    duration: this.duration
                }, function () {
                    this.index = (this.index + 1) % (this.count);
                    this.$emit('change', {
                        index: this.index,
                        count: this.count
                    });
                    cb && cb();
                }.bind(this));
            },
            appeared: function() {
                this.outofview = false
            },
            disappeared: function() {
                this.outofview = true
            }
        }
    }
</script>