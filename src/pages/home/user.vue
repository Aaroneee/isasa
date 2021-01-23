<template>
  <div class="profilePhoto">
    <van-image

        round
        width="7rem"
        height="7rem"
        :src="require('../../assets/logo.png')"
    />
    <van-button
        class="logout"
        color="linear-gradient(to right, #ff6134, #ee0a24)"
        round
        type="info"
        @click="logout"
        block>退出
    </van-button>
  </div>

</template>

<script>
export default {
  name: "user"

  , methods: {
    logout() {
      this.$dialog.confirm({
        title: '退出',
        message: '确定要退出登录吗，将回到登陆界面',
        overlay: false,
      }).then(() => {
        // window.webkit.messageHandlers.logout.postMessage("已退出")
        this.show = true
      }).catch(() => {
        // on cancel
      });

    }
  }
}
</script>

<style scoped>
.profilePhoto {
  text-align: center;
}

.logout {
  width: 90%;
  position: absolute;
  bottom: 10%;
  left: 5%;
  margin:0 auto;
}
</style>
