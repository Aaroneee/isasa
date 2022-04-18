<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式详情"/>
    </van-sticky>
    <!--    头部-->
    <div class="card">
      <van-row><p class="cardTitle">款式信息</p></van-row>
      <van-row :gutter="20">
        <van-col :span="10">
          <div style="display: flex;justify-content: space-around;height: 100%">
            <img
                alt="图片已损坏，请重新选择主图"
                style="height: 170px;width: 120px;border-radius: 7px"
                :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+this.style.styleImage"/>
          </div>
        </van-col>
        <van-col :span="14">
          <p>款式类型 : {{ style.typeName }}</p>
          <p>款式编号 : {{ style.styleName }}</p>
          <p>款式名称 : {{ style.styleAlias }}</p>
          <p>款式品牌 : {{ style.brandName }}</p>
          <p>官方名称 : {{ style.factoryName }}</p>
          <p>官方编号 : {{ style.factoryNumber }}</p>
          <p>采购日期 : {{ style.purchaseDate }}</p>
          <p>衣服件数 : {{ style.clothesCount }}</p>
          <p>试纱次数 : {{ count.yarnCount }}</p>
          <p>出件次数 : {{ count.outCount }}</p>
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
    <div style="height: 50px"></div>
    <div id="operationDiv">
      <div id="operationCon">
        <p class="cardTitle" style="padding-top: 10px">操作菜单</p>
        <div id="operationParent">
          <div class="operationBlock" @click="addClothes" v-if="this.$per('style_details:add_clothes')">
            <van-icon name="add-o" size="30"/>
            <p>添加婚纱</p>
          </div>
          <div class="operationBlock" @click="updateStyle" v-if="this.$per('style_details:edit')">
            <van-icon name="edit" size="30"/>
            <p>编辑</p>
          </div>
          <div class="operationBlock" @click="toStyleImage" v-if="this.$per('style_details:image')">
            <van-icon name="photo-o" size="30"/>
            <p>查看图片</p>
          </div>
          <div class="operationBlock" @click="toStylePrice" v-if="this.$per('style_details:price')">
            <van-icon name="balance-o" size="30"/>
            <p>查看价格</p>
          </div>
          <div class="operationBlock" @click="deleteStyle" v-if="this.$per('style_details:delete')">
            <van-icon name="delete-o" size="30"/>
            <p>删除款式</p>
          </div>
        </div>
      </div>
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
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "styleDetails",
  components: {
    baseNavBar,
  },
  created() {
    this.style = this.$route.query
    this.queryStyleDetails()
    this.queryPrice()
    this.queryCount()
  },
  data() {
    return {
      style: {},
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
      count: {
        yarnCount: 0,
        outCount: 0,
      }
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
      this.$router.push({name: "stylePrice", query: this.style.id})
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
        console.log( this.style)
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
      }.bind(this), 2000);
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
    queryCount() {
      this.$axios({
        method: "get",
        url: "/style/queryYarnCountAndOutCountByStyleId",
        params: {
          styleId: this.style.id,
          tenantCrop: localStorage.getItem("tenantCrop"),
        }
      }).then(response => {
        this.count = response.data.data
      })
    }
  }
}
</script>

<style scoped>
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
#operationDiv {
  position: fixed;
  bottom: 10px;
  width: 100%;
}

#operationCon {
  border-radius: 10px;
  margin: 0 auto;
  background: white;
  height: 110px;
  width: 95%;
}
.PTitle {
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  padding-top: 3%;
}

#operationParent {
  padding: 10px 0;
  white-space: nowrap;
  /*文本不会换行，文本会在在同一行上继续*/
  overflow-y: auto;
}

#operationParent::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.operationBlock {
  height: 50px;
  text-align: center;
  display: inline-block;
  margin: 0 4%
}
p {
  font-size: 15px;
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
