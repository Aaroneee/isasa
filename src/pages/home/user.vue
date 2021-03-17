<template>
  <div style="margin-bottom: 15%">
    <div style="text-align: center" v-cloak>
      <p style="font-size: 35px">{{tenant.tenantName}}</p>
      <p style="font-size: 32px">{{tenant.empName}}</p>
    </div>
    <van-cell-group title="功能">
      <van-cell title="个人资料" value="" icon="friends-o" is-link/>
      <van-cell title="修改密码" icon="setting-o" is-link/>
      <van-cell title="我的公司" icon="location-o" is-link/>
      <van-cell title="我的业绩" icon="diamond-o" is-link/>
      <van-cell title="参数查询" icon="search" is-link/>
      <van-cell  :border="false" title="系统消息" icon="comment-o" is-link/>
    </van-cell-group>

    <van-button
        style="margin-top: 5%"
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
  name: "user",
  data(){
    return{
      tenant:{}
    }
  },
  created() {
    this.queryTenant();
  },
  methods: {
    //退出登录
    logout() {
      const u = navigator.userAgent;
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      this.$dialog.confirm({
        title: '退出',
        message: '确定要退出登录吗，将回到登陆界面',
        overlay: false,
      }).then(() => {
        if (isiOS) {
          //IOS
          window.webkit.messageHandlers.logout.postMessage("已退出")
        } else {
          //Android
          androidMethod.logOut();
        }

        this.show = true
      }).catch(() => {
        // on cancel
      });

    },
    //查询公司信息
    queryTenant:function (){
      this.$axios({
        url:"/emp/queryEmpById",
        method:"GET",
        params:{
          empId:localStorage.getItem("empId")
        }
      }).then(response=>{
        if (response.data.code!==200){
          this.$toast.fail("信息查询有误,请重新登陆!");
          return false;
        }
        this.tenant=response.data.data;
      })
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
