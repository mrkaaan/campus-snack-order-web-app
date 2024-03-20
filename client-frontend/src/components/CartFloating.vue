<template>
  <div
    class="container-floating-cart"
    @mousedown="startDrag"
    @touchstart="startDrag"
    :style="styleObject"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isDragging: false,
      startX: 0,
      startY: 0,
      x: window.innerWidth - 70,
      y: window.innerHeight - 70,
      retractTimeout: null // 用于自动缩进的定时器
    }
  },
  computed: {
    styleObject () {
      return {
        left: `${this.x}px`,
        top: `${this.y}px`
        // transition: this.isDragging ? 'none' : 'transform 0.5s ease'
      }
    },
    // 计算悬浮球的transform样式
    transformStyle () {
      return `translate(${this.x}px, ${this.y}px)`
    }
  },
  methods: {
    startDrag (e) {
      e.preventDefault()
      this.isDragging = true
      this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
      this.startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY

      // this.$el.style.transition = 'none' // 开始拖动时取消过渡效果

      document.addEventListener('mousemove', this.dragging)
      document.addEventListener('mouseup', this.endDrag)
      document.addEventListener('touchmove', this.dragging)
      document.addEventListener('touchend', this.endDrag)

      // 如果有正在进行的缩进操作，清除它
      clearTimeout(this.retractTimeout)
    },
    dragging (e) {
      if (!this.isDragging) return
      const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
      const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY

      const deltaX = clientX - this.startX
      const deltaY = clientY - this.startY

      let newX = this.x + deltaX
      let newY = this.y + deltaY

      // 确保悬浮球不会移出屏幕
      newX = Math.max(0, Math.min(newX, window.innerWidth - this.$el.offsetWidth))
      newY = Math.max(0, Math.min(newY, window.innerHeight - this.$el.offsetHeight))

      this.x = newX
      this.y = newY
      this.startX = clientX
      this.startY = clientY

      // 应用计算后的transform样式
      // this.$el.style.transform = this.transformStyle
    },
    endDrag () {
      this.isDragging = false
      document.removeEventListener('mousemove', this.dragging)
      document.removeEventListener('mouseup', this.endDrag)
      document.removeEventListener('touchmove', this.dragging)
      document.removeEventListener('touchend', this.endDrag)

      // 恢复动画效果
      // this.$el.style.transition = 'transform 0.5s ease'

      // 吸边逻辑，加入平滑过渡
      const halfWindowWidth = window.innerWidth / 2
      this.x < halfWindowWidth ? (this.x = 0) : (this.x = window.innerWidth - this.$el.offsetWidth)

      // this.$el.style.transform = this.transformStyle

      // 启动自动缩进定时器
      this.retractTimeout = setTimeout(() => {
        this.x === 0 ? (this.x = -this.$el.offsetWidth / 2) : (this.x = window.innerWidth - this.$el.offsetWidth / 2)
      }, 3000) // 3秒后缩进
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/multi';

.container-floating-cart {
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: $primary-color;
  //background-color: red;
  @extend .box-shadow-2;
  cursor: pointer;
  touch-action: none;
  //transition: transform 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
