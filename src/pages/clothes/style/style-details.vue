<template>
  <div>
    <van-sticky>
      <switchNavBar title="款式详情" switchText="操作" @flag="buttonShow=true"/>
    </van-sticky>
    <!--    头部-->
    <div class="card">
      <van-row><p class="cardTitle">款式信息</p></van-row>
      <van-row>
        <van-col :span="8">
          <div style="display: flex;justify-content: space-around;height: 100%">
            <img
                alt="styleImage"
                style="  height: 130px;width: 90px;border-radius: 7px"
                :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+this.style.styleImage"/>
          </div>
        </van-col>
        <van-col :span="16">
          <van-row>
            <van-col :span="12">
              <p>款式类型 : {{ style.typeName }}</p>
            </van-col>
            <van-col :span="12" style="float: right;text-align: right">
              <p>款式编号 : {{ style.styleName }}</p>
            </van-col>
          </van-row>
          <p>款式名称 : {{ style.styleAlias }}</p>
          <p>款式品牌 : {{ style.brandName }}</p>
          <p>采购日期 : {{ style.purchaseDate }}</p>
          <p>同款件数 : {{ style.clothesCount }}</p>
        </van-col>
      </van-row>
    </div>
    <!--    价格-->
    <div class="card" @touchstart.prevent="touchPrice(stylePrice)" @touchend.prevent="clearTime(stylePrice)">
      <van-row><p class="cardTitle">款式价格</p></van-row>
      <van-row v-if="stylePrice.length>0">
        <van-col :span="8" v-for="(item,index) in stylePrice" :key="index">
          <p style="text-align: center;margin: 10px 0">{{ item.priceType }}</p>
          <p style="text-align: center;margin: 10px 0">{{ item.price }}</p>
        </van-col>
      </van-row>
      <van-row v-else>
        <p style="text-align: center;">无</p>
      </van-row>
    </div>
    <!--    标签-->
    <div class="card">
      <van-row><p class="cardTitle">款式标签</p></van-row>
      <van-row v-if="labelName.length>0">
        <van-col v-for="(item,index) in labelName" :key="index" style="margin: 1% 1%">
          <van-tag size="large" v-once :color="labelColor[Math.floor(Math.random() * labelColor.length)]">{{ item }}</van-tag>
        </van-col>
      </van-row>
      <van-row v-else>
        <p style="text-align: center;">无</p>
      </van-row>
    </div>
    <!--    款式信息-->
    <div class="card">
      <van-row><p class="cardTitle">款式信息</p></van-row>
      <van-row>
        <van-col :span="24">
          <p>款式信息 : {{ style.styleInfo }}</p>
          <p>适合情况 : {{ style.styleFit }}</p>
          <p>不适合情况 : {{ style.styleNoFit }}</p>
        </van-col>
      </van-row>
    </div>

    <div style="padding-bottom: 5%;" v-show="buttonShow">
      <per-button @click="addClothes" type="info" per="style_details:add_clothes" :span="6">添加婚纱</per-button>
      <per-button @click="updateStyle" type="warning" per="style_details:edit" :span="6">编辑</per-button>
      <per-button @click="toStyleImage" type="info" per="style_details:image" :span="6">查看图片</per-button>
      <per-button @click="toStylePrice" type="primary" per="style_details:price" :span="6">查看价格</per-button>
      <per-button @click="deleteStyle" type="danger" per="style_details:delete" :span="6">删除</per-button>
    </div>
    <br><br><br><br><br><br>
    <p/>

    <!--    修改临时价格-->
    <van-dialog v-model="updatePriceShow" title="修改临时价格" show-cancel-button show-confirm-button
                @confirm="updatePrice()">
      <p style="text-align: center;color: red">此操作是修改临时价格并不会修改原价<br>临时价格只有自己可见并在此显示12个小时<br>到期自动恢复为原价</p>
        <van-field v-model="selfPrice.leasePrice" type="number" label="租赁价格"/>
        <van-field v-model="selfPrice.depositPrice" type="number" label="押金价格"/>
        <van-field v-model="selfPrice.cusPrice" type="number" label="定制价格"/>
    </van-dialog>
  </div>

</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "styleDetails",
  components: {
    switchNavBar,
  },
  created() {
    this.style = this.$route.query
    this.queryStyleDetails()
    this.queryPrice()
  },
  data() {
    return {
      style: {},
      buttonShow: false,
      tenantCrop: localStorage.getItem("tenantCrop"),
      empId: localStorage.getItem("empId"),

      labelName:[],
      stylePrice: [],
      selfPrice: {
        //租赁价格
        leasePrice: "",
        //押金价格
        depositPrice: "",
        //定制价格
        cusPrice: "",
      },
      updatePriceShow: false,
      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],
    }
  },
  watch: {
    'style.labelName':function (val){
      this.labelName=val!==""?val.split(","):[];
    },
  },
  methods: {
    updateStyle() {
      this.$router.push({name: "styleEdit", query: this.style});
    },
    addClothes() {
      this.$router.push({name: "clothesAdd", query: this.style})
    },
    toStylePrice() {
      this.$router.push({name: "stylePrice", query: this.style})
    },
    toStyleImage() {
      this.$router.push({name: "styleImage", query: this.style.id})
    },
    queryStyleDetails(){
      this.$axios({
        method: "GET",
        url: "/style/queryStyleDetails",
        params: {
          styleId: this.style.id,
        }
      }).then(response => {
        this.style=response.data.data
      })
    },
    //删除款式
    deleteStyle() {
      this.$dialog.confirm({
        title: '删除款式',
        message: '确定要删除该款式吗？',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/style/deleteStyle",
          params: {
            styleId: this.style.id
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("删除成功");
            setTimeout(() => {
              this.$router.go(-1)
            }, 500)
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })
    },
    //查询价格
    queryPrice() {
      this.$axios({
        method: "GET",
        url: "/stylePrice/queryStyleOneShopPriceByEmpId",
        params: {
          styleId: this.style.id,
          empId: this.empId
        }
      }).then(response => {
        this.stylePrice = response.data.data;
      })
    },
    touchPrice() {
      clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(function () {
        this.updatePriceShow = true;
      }.bind(this), 1000);
    },
    clearTime() {
      // 这个方法主要是用来将每次手指移出之后将计时器清零
      clearInterval(this.Loop);
    },
    updatePrice() {
      if (this.selfPrice.leasePrice===""||this.selfPrice.depositPrice===""||this.selfPrice.cusPrice===""){
        this.$toast.fail('请将价格输入完整');
        return false;
      }
      this.$dialog.confirm({
        title: '确认修改?',
      }).then(() => {
        this.$axios({
          method:"POST",
          url:"/stylePrice/setSelfPrice",
          params:{
            leasePrice:this.selfPrice.leasePrice,
            depositPrice:this.selfPrice.depositPrice,
            cusPrice:this.selfPrice.cusPrice,
            styleId: this.style.id,
            empId: this.empId
          }
        }).then(response => {
          response.data.code===200?this.$toast.success('成功'):this.$toast.fail(response.data.msg);
          this.queryPrice();
        })
      }).catch(() => {
        // on cancel
      });
    },
  }
}
</script>

<style>
.card {
  background: white;
  border-radius: 7px;
  margin:  4% 3%;
  padding: 3% 3%;
  height: 100%;
  overflow: hidden;
}
.cardTitle{
  text-align: center;font-weight: bold
}
.card .imgParent {
  padding-left: 2%;
  height: 100%;
  width: 80px;
  display: inline-block;
  /*align-items: center;*/
}

p {
  margin: 2% 0;
}

.col {
  /*offset=1*/
  margin-left: 4.16666667%;
}

.col:first-child {
  /*offset=2*/
  margin-left: 8.33333333%;
}

.col:nth-child(3n+1) {
  margin-left: 8.33333333%;
}

.col:nth-child(n+4) {
  margin-top: 17px;
}

</style>
