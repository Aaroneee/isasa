<template>
  <div style="overflow: hidden">
    <div style="height: 3vh;">
      <van-row style="margin: 8px 8px;padding:8px 8px;background-color: #89bea8;border-radius: 5px;">
        <van-col :span="8">
<!--          <div style="height: 25px;display: flex;justify-content: flex-start;align-items: center">-->
<!--            <img  @click="openImg" :src="logo" style="height: 100%;border-radius: 10%;"/>-->
<!--          </div>-->
        </van-col>
        <van-col :span="8">
          <div style="height: 25px;display: flex;justify-content: center;align-items: center">
            <span @click="copyLink" style="font-size: 25px;transform: scale(1.05, 1);color: #ffffff;">ISASA</span>
          </div>

        </van-col>
        <van-col :span="8">
          <div style="height: 25px;display: flex;justify-content: flex-end;align-items: center">
            <!--          <img :src="logo" style="height: 100%"/>-->
                        <img  @click="onClickItem('user')" :src="user" style="height: 100%;border-radius: 10%;"/>

<!--            <img :src="user" size="25" @click="onClickItem('user')" style="color: #ffffff;"/>-->
          </div>
        </van-col>
      </van-row>
    </div>



    <div style="height: 91vh;overflow:auto;margin-top: 30px;background-color: rgb(246,247,249)">
      <van-cell-group v-if="modules.客资 !=null" title="客资" class="gird_module">
        <van-grid :border="false" clickable :column-num="4">
          <van-grid-item v-for="value in modules.客资" @click="onClickItem(value.viewLink)" :key="value.id"
                         :icon="value.viewIcon"
                         :text="value.viewName"/>
        </van-grid>
      </van-cell-group>
      <van-cell-group v-if="modules.预约 !=null" title="预约" class="gird_module">
        <van-grid :border="false" clickable :column-num="4">
          <van-grid-item v-for="value in modules.预约" @click="onClickItem(value.viewLink, value.id)" :key="value.id"
                         :icon="value.viewIcon"
                         :text="value.viewName"/>
        </van-grid>
      </van-cell-group>
      <van-cell-group v-if="modules.订单 !=null" title="订单" class="gird_module">
        <van-grid :border="false" clickable :column-num="4">
          <van-grid-item v-for="value in modules.订单" @click="onClickItem(value.viewLink, value.id)" :key="value.id"
                         :icon="value.viewIcon"
                         :text="value.viewName"/>
        </van-grid>
      </van-cell-group>
      <van-cell-group v-if="modules.售后 !=null" title=售后 class="gird_module">
        <van-grid :border="false" clickable :column-num="4">
          <van-grid-item v-for="value in modules.售后" @click="onClickItem(value.viewLink, value.id)" :key="value.id"
                         :icon="value.viewIcon"
                         :text="value.viewName"/>
        </van-grid>
      </van-cell-group>
      <van-cell-group v-if="modules.婚纱 !=null" title="婚纱" class="gird_module">
        <van-grid :border="false" clickable :column-num="4">
          <van-grid-item v-for="value in modules.婚纱" @click="onClickItem(value.viewLink)" :key="value.id"
                         :icon="value.viewIcon"
                         :text="value.viewName"/>
        </van-grid>
      </van-cell-group>
      <br><br><br>
    </div>
  </div>
</template>

<script>
import {ImagePreview} from "vant";
import baseNavBar from "@/components/nav-bar/base-nav-bar.vue";

export default {
  name: "work",
  components: {baseNavBar},
  created() {
    if (localStorage.getItem("tenantCrop") === null) {
      window.location.reload()
    }
    this.queryModules()
    this.queryButton()
    this.queryShopIdsByEmpId()
  },
  data() {
    return {
      logo: require("@/assets/icon.jpg"),
      user: require("@/assets/user.svg"),
      copyLinkVal: 0,
      tenantCrop: localStorage.getItem("tenantCrop"),
      empId: localStorage.getItem("empId"),
      modules: {},
    }
  },
  methods: {
    onClickItem: function (event, id) {
      this.$store.commit('setKeepAlive', [event])
      this.$router.push({name: event, query: {id: id}})
    },
    // setLocalStorage: function (tenantCrop, empId,token) {
    //   localStorage.setItem("tenantCrop", tenantCrop);
    //   localStorage.setItem("empId", empId);
    //   localStorage.setItem("token", token);
    //   this.queryModules()
    // },
    queryModules() {
      this.$axios({
        method: "GET",
        url: '/index/mobileManBar',
        params: {
          tenantCrop: this.tenantCrop,
          empId: this.empId,
        }
      }).then(response => {
        this.modules = response.data.data
      })

    },
    queryButton() {
      this.$axios({
        method: "GET",
        url: "/index/mobileButton",
        params: {
          empId: this.empId,
        }
      }).then(response => {
        this.$store.commit("setPermission", response.data.data)
      })
    },
    queryShopIdsByEmpId() {
      this.$axios({
        method: "GET",
        url: "/emp/queryEmpShopIdsByEmpId",
        params: {
          empId: localStorage.getItem("empId")
        }
      }).then(response => {
        localStorage.setItem("shopIds", response.data.data)
      })
    },
    //点击Logo
    openImg() {
      console.log(111)
      ImagePreview([this.logo])
    },
    //复制手机号
    copyLink: function () {
      //获取复制链接
      let val = this.copyLinkVal === 0 ? "http://www.isasaerp.com" :
        this.copyLinkVal === 1
          ? "http://www.isasaerp.com/android/isasa.apk" : "https://apps.apple.com/cn/app/isasa/id1558243921"

      //获取复制成功提示
      let textVal = this.copyLinkVal === 0 ? "电脑端链接复制成功"
        : this.copyLinkVal === 1
          ? "安卓下载端链接已复制" : "苹果下载端链接已复制"

      //更改索引
      this.copyLinkVal = this.copyLinkVal === 0 || this.copyLinkVal === 1
        ? this.copyLinkVal + 1 : 0;

      let _this = this;
      _this.$copyText(val).then(function (e) {
        _this.$toast.success({message: textVal, duration: 700});
      }, err => {
        _this.$toast.fail({message: textVal, duration: 700});
      })
    },
  },
  // mounted() {
  //   window.setLocalStorage = this.setLocalStorage
  // }
  activated() {
    if (localStorage.getItem("tenantCrop") === null) {
      window.location.reload()
    }
    this.queryModules()
    this.queryButton()
    this.queryShopIdsByEmpId()
  }
}
</script>

<style scoped>
.box {
    padding-top: 7px;
}

.gird_module {
    background-color: #ffffff;
    margin: 0px 8px 8px 8px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding-bottom: 8px;
    border-color: #ffffff !important;
}

/deep/ .van-cell-group__title {
    margin: 8px 8px 0px 8px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #ffffff;
}

/deep/ [class*=van-hairline]::after {
    border: none;
}
</style>
