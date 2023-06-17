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
      tenant: {},
      form: {
        tenantId: "",
        payDate: new Date(),
        createDate: new Date(),
        tenantName: "",
        recorderEmpId: "",
        payEmpId: "",
        addDay: "0",
        money: 1000,
        remark: "用户自行充值",
        tenantCrop: "",
      },
      resultId: "",
    }
  },
  created() {
    this.queryTenant();
  },
  mounted() {
    window.payResult = this.payResult
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
        this.setForm();
      })
    },
    //充值
    purchase() {
      this.$dialog.confirm({
        message: '<p style="font-weight: bold">确定是否续费? \n\n 续费时长 : 1年 \n\n 续费金额 :1000元</p>',
        overlay: false,
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/tenantPurchase/savePurchase",
          data: this.form
        }).then(response => {
          if (response.data.code === 200) {
            this.resultId = response.data.data.id;
            if (/Linux/i.test(navigator.platform)) {
              androidMethod.getPurchaseInfo(this.resultId);
            } else {
              window.webkit.messageHandlers.pay.postMessage(this.resultId);
            }
          } else {
            this.$toast.fail(response.data.msg)
          }
        });

      }).catch(() => {
        // on cancel
      });
    },
    payResult(status) {
      if (status === 0 || status === "0") {
        this.$toast.fail('支付失败!');
        this.queryTenant();
      }
      if (status === 1 || status === "1") {
        this.$axios({
          method: "POST",
          url: "/tenantPurchase/changeDay",
          data: {
            id: this.resultId
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success('支付成功');
            this.queryTenant();

          } else {
            this.$toast.fail(response.data.msg)
          }
        });

      }
    },

    setForm() {
      this.form.tenantId = this.tenant.tenantId;
      this.form.tenantName = this.tenant.tenantName;
      this.form.recorderEmpId = this.tenant.id;
      this.form.payEmpId = this.tenant.id;
      this.form.tenantCrop = this.tenant.tenantCrop;
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
