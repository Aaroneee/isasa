<template>
  <div>
    <div style="text-align: center">
      <van-image
          round
          width="7rem"
          height="7rem"
          :src="require('../../assets/logo.png')"
      />
    </div>
    <br>
    <van-cell-group title="功能">
      <van-cell title="个人资料" value="" icon="friends-o" is-link/>
      <van-cell title="修改密码" icon="setting-o" is-link/>
      <van-cell title="我的公司" icon="location-o" is-link/>
      <van-cell title="我的业绩" icon="diamond-o" is-link/>
      <van-cell title="参数查询" icon="search" is-link/>
      <van-cell  border="false" title="系统消息" icon="comment-o" is-link/>
    </van-cell-group>

    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
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
        window.webkit.messageHandlers.logout.postMessage("已退出")
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
}

.logout {
  width: 90%;
  margin: 0 auto;
}
</style>
