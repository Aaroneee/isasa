<template>
  <div style="margin-bottom: 15%">
    <p style="font-size: 35px;text-align: center;margin: 20% 0">{{ tenant.empName }}</p>
    <van-cell-group>
      <van-cell title="职位" :value="tenant.roleName" icon="manager-o"/>
      <van-cell title="店铺" :value="tenant.shopName" icon="wap-home-o"/>
      <van-cell title="手机号" :value="tenant.empPhone" icon="phone-o"/>
      <van-cell title="公司名称" :value="tenant.tenantName" icon="coupon-o"/>
      <van-cell title="公司城市" :value="tenant.tenantCity" icon="location-o"/>
      <van-cell title="产品到期时间" :value="tenant.tenantEndDate" icon="flag-o"/>
    </van-cell-group>
    <van-button
      style="margin-top: 10%"
      class="logout"
      color="linear-gradient(to right, #ff6134, #ee0a24)"
      round
      type="info"
      @click="logout"
      block>退出
    </van-button>
    <div class="purchaseBox" @click="purchase">
      <p class="purchaseBoxP">产&nbsp;品&nbsp;续&nbsp;费</p>
    </div>
  </div>
</template>续费

<script>
export default {
  name: "user",
  data() {
    return {
      tenant: {}
    }
  },
  created() {
    this.queryTenant();
  },
  methods: {
    //退出登录
    logout() {
      this.$dialog.confirm({
        title: '退出',
        message: '确定要退出登录吗，将回到登陆界面',
        overlay: false,
      }).then(() => {
        if (/Linux/i.test(navigator.platform)) {
          androidMethod.logOut();
          return;
        }
        window.webkit.messageHandlers.logout.postMessage("已退出")
      }).catch(() => {
        // on cancel
      });

    },
    //查询公司信息
    queryTenant: function () {
      this.$axios({
        url: "/emp/queryEmpById",
        method: "GET",
        params: {
          empId: localStorage.getItem("empId")
        }
      }).then(response => {
        if (response.data.code !== 200) {
          this.$toast.fail("信息查询有误,请重新登陆!");
          return false;
        }
        this.tenant = response.data.data;
      })
    },
    //充值
    purchase() {
      this.$dialog.confirm({
        message: '<p style="font-weight: bold">确定是否续费? \n\n 续费时长 : 1年 \n\n 续费金额 :1000元</p>',
        overlay: false,
      }).then(() => {
        //todo 编写充值逻辑

      }).catch(() => {
        // on cancel
      });

    },
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

.purchaseBox {
  text-align: center;
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
}

.purchaseBoxP {
  color: #8a8a8a;
  border-bottom: 2px solid #8a8a8a;
  font-weight: bold
}
</style>
