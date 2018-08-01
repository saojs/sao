<template>
  <div class="terminal-demo">
    <div
      class="toggle-demo"
      @click="toggleDemo">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      <span v-if="loading">Loading...</span>
      <span v-else-if="showDemo">Hide the demo</span>
      <span v-else>Check out the demo</span>
    </div>
    <div class="demo-image" v-if="showDemo">
      <img :src="url" alt="demo">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      showDemo: false,
      loading: false
    }
  },

  methods: {
    toggleDemo() {
      if (this.showDemo) {
        this.showDemo = false
        return
      }

      this.loading = true
      const img = new Image()
      img.onload = () => {
        this.showDemo = true
        this.loading = false
      }
      img.src = this.url
    }
  }
}
</script>

<style scoped lang="stylus">
.toggle-demo
  background: #e7ecf3
  padding: 10px 15px
  cursor: pointer
  display: inline-flex
  align-items: center
  border-radius: 3px
  font-size: 14px
  user-select: none

  &:hover
    background: darken(@background, 5)

  span
    margin-left: 5px

  svg
    width: 20px
    height: @width

.demo-image
  margin-top: 10px
</style>
