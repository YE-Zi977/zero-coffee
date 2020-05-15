<template>
  <div class="l-slider-box" :style="{height: (height + '').indexOf('%') <= -1 ? height + 'px' : height}">
    <div @touchstart.stop="start" @touchmove.stop="move" class="l-slider" :style="{left: left + 'px', width: width + 'px'}">
      <slot></slot>

      <van-loading v-if="!isEnd" class="v-load" color="#561610" />
      <div v-if="isEnd" style="margin-left: 28px; margin-top: 12px;">没有更多了</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      width: {
        type: [Number, String],
        default() {
          return '100%';
        }
      },
      height: {
        type: [Number, String],
        default() {
          return 150;
        }
      },
      isEnd: {
        type: [Boolean],
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        left: 0,
        m_left: 0,

        // 定时器
        timers: []
      }
    },
    methods: {
      start(e) {
        this.m_left = e.changedTouches[0].pageX - this.left;
      },
      move(e) {
        let left = e.changedTouches[0].pageX;
        this.left = left - this.m_left;

        if (this.left <= -this.width + window.innerWidth) {
          let timer = setTimeout(() => {
            for (let i = 1; i < this.timers.length; i++) {
              clearTimeout(this.timers[i]);
            }

            this.$emit('my-load');
          }, 500)

          this.timers.push(timer);
        }

        let wx = window.innerWidth / 375 * 80;

        this.left = this.left >= 0 ? 0 : this.left <= -this.width + window.innerWidth - wx ? -this.width + window.innerWidth - wx : this.left;
      }
    }
  }
</script>

<style lang="less" scoped>
  .l-slider-box {
    position: relative;
    width: 100%;
    overflow: hidden;
    .l-slider {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      height: 100%;
    }
    .v-load {
      position: absolute;
      top: 50px;
      right: -35px;
    }
  }

</style>