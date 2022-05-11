<template>
  <div id="parent">
    <van-sticky>
      <baseNavBar title="婚纱详情(Pad)"/>
    </van-sticky>
    <div class="card">
      <p class="PTitle">{{clothes.styleType + '-' + clothes.styleName + '-' + clothes.clothesSize + '-' + clothes.clothesNo}}</p>
      <van-row>
        <van-swipe :loop="false" :width="400" ref="swiper" @change="imageChange">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img :src="`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image.styleImage}?imageMogr2/rquality/60`"
                 style="height: 500px;width: 350px" @click="clickItem(index)" alt=""/>
<!--            <p style="text-align: center;font-size: 20px;font-weight: bold">{{ image.imageTypeName }}</p>-->
          </van-swipe-item>
        </van-swipe>
        <br><br><br><br>
        <van-radio-group v-model="imagePosition" direction="horizontal" >
          <van-radio v-for="(typeName , index) in imageTypes" :name="typeName" :key="index"
                     icon-size="35px" checked-color="#8DE091" @click="imageTypeSelect">{{ typeName }}</van-radio>
        </van-radio-group>
        <br><br><br><br>
      </van-row>
    </div>
    <div class="card">
      <van-row><p class="PTitle">婚纱详情</p></van-row>
      <van-cell>
        <van-row>
          <van-col span="24"><p class="pValue">品牌：{{ clothes.brand === "" ? "暂无品牌" : clothes.brand }}</p></van-col>
        </van-row>
        <van-row style="padding-top: 5px">
          <van-col span="24"><p class="pValue">位置：{{ clothes.positionName === "" ? "暂无位置" : clothes.positionName }}</p></van-col>
        </van-row>
        <van-row >
          <van-col><span class="pValue">标签：{{ styleLabelList.length == 0 ? "暂无标签" : "" }}</span>
            <van-tag v-for="item in styleLabelList" :key="item.id" type="danger"
                     size="large" style="margin: 5px">
              {{ item.labelName }}
            </van-tag>
          </van-col>
        </van-row>
      </van-cell>
    </div>
    <div class="card" @touchstart.prevent="touchPrice(stylePrice)" @touchend.prevent="clearTime(stylePrice)">
      <van-row><p class="PTitle">款式价格</p></van-row>
      <van-row v-if="stylePrice.length>0">
        <van-col :span="8" v-for="(item,index) in stylePrice" :key="index">
          <p class="pValue" style="text-align: center;margin: 10px 0;">{{ item.priceType }}</p>
          <p class="pValue" style="text-align: center;margin: 10px 0;">{{ item.price }}</p>
        </van-col>
      </van-row>
      <van-row v-else>
        <p style="text-align: center; margin: 3% 0">无</p>
      </van-row>
    </div>
    <div class="card">
      <van-row><p class="PTitle">历史位置</p></van-row>
      <van-steps direction="vertical" :active="0" active-color="#000000" inactive-color="#000000" style="margin-left: 15%;">
        <van-step v-for="item in clothesOperations.slice(0, 3)" :key="item.id">
          <van-row >
            <van-col span="12">
              <p class="pValue">经办人：{{ item.empName }}</p>
            </van-col>
            <van-col span="12">
              <p class="pValue">行为：{{ item.operationName }}</p>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">
              <p class="pValue">目标店铺：{{ item.shopName }}</p>
            </van-col>
            <van-col span="12">
              <p class="pValue">原店铺：{{ item.localShopName===''?'暂无':item.localShopName }}</p>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">
              <p class="pValue">目标位置：{{ item.positionName }}</p>
            </van-col>
            <van-col span="12">
              <p class="pValue">原位置：{{ item.localPositionName===''?'暂无':item.localPositionName }}</p>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">
              <p class="pValue">操作日期：{{ item.createDate }}</p>
            </van-col>
          </van-row>
        </van-step>
      </van-steps>
    </div>
    <div style="height: 140px"></div>
    <div id="operationDiv">
      <div id="operationCon">
        <p class="PTitle">操作菜单</p>
        <div id="operationParent">
          <div class="operationBlock" @click="clothesOperation">
            <van-icon name="back-top" size="40"/>
            <p class="pValue">出样陈列</p>
          </div>
          <div class="operationBlock" @click="clothesSchedules">
            <van-icon name="chart-trending-o" size="40"/>
            <p class="pValue">档期查看</p>
          </div>
          <div class="operationBlock" @click="styleInfoView">
            <van-icon name="newspaper-o" size="40"/>
            <p class="pValue">款式介绍</p>
          </div>
          <div class="operationBlock" @click="addClothesYarn">
            <van-icon name="add-o" size="40"/>
            <p class="pValue">添加试纱</p>
          </div>
          <div class="operationBlock" @click="toStyleImage">
            <van-icon name="photo-o" size="40"/>
            <p class="pValue">查看图片</p>
          </div>
          <div class="operationBlock" @click="toStylePrice">
            <van-icon name="balance-o" size="40"/>
            <p class="pValue">查看价格</p>
          </div>
          <div class="operationBlock" @click="operationRecord">
            <van-icon name="todo-list-o" size="40"/>
            <p class="pValue">历史操作</p>
          </div>
        </div>
      </div>
    </div>

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
import baseNavBar from '@/components/nav-bar/base-nav-bar'
import {ImagePreview} from "vant";

export default {
  name: "clothesDetails",
  created() {
    this.clothes = this.$route.query
    this.queryStyleLabelList()
    this.queryStyleImageByClothesId(this.clothes.clothesId)
    this.queryPrice()
    this.queryClothesOperations()
  },
  data() {
    return {
      clothes: {},
      images: [],
      imageNames: [],
      imageTypes:[],
      //radio 的值
      imagePosition:"",
      styleLabelList: [],
      clothesOperations: [],
      stylePrice: [],
      updatePriceShow: false,
      empId: localStorage.getItem("empId"),
      tenantCrop: localStorage.getItem("tenantCrop"),
      selfPrice: {
        //租赁价格
        leasePrice: "",
        //押金价格
        depositPrice: "",
        //定制价格
        cusPrice: "",
      },
    }
  },
  components: {
    baseNavBar
  },
  watch:{
  },
  methods: {
    clickItem: function (value) {
      ImagePreview(this.imageNames,value)
    },

    queryStyleImageByClothesId() {
      this.$axios({
        method: "GET",
        url: "/styleImage/queryStyleImageList",
        params: {
          styleId: this.clothes.styleId,
        }
      }).then(response => {
        this.images=response.data.data;

        for (let image of response.data.data) {
          this.imageNames.push( "https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/" + image.styleImage)
          this.imageTypes.push(image.imageTypeName);
        }
        this.imageTypes=Array.from(new Set(this.imageTypes))
        //默认类型
        this.imagePosition=this.imageTypes[0];
      })
    },
    //查询礼服标签
    queryStyleLabelList: function () {
      this.$axios({
        method: "GET",
        url: "/styleLabel/queryStyleLabelVoByClothesId",
        params: {
          clothesId: this.clothes.clothesId
        }
      }).then(response => {
        this.styleLabelList = response.data.data
      })
    },
    //查询价格
    queryPrice() {
      this.$axios({
        method: "GET",
        url: "/stylePrice/queryStyleOneShopPriceByEmpId",
        params: {
          styleId: this.clothes.styleId,
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
            styleId: this.clothes.styleId,
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
    queryClothesOperations: function () {
      this.$axios({
        method: "GET",
        url: "/clothesOperation/clothesOperationList",
        params: {
          tenantCrop: this.tenantCrop,
          clothesId: this.clothes.clothesId,
        }
      }).then(response => {
        this.clothesOperations = response.data.data.list.reverse();
      })
    },
    //图片滑动时改变radio的值
    imageChange:function (val){
      this.imagePosition=this.images[val].imageTypeName;
    },
    //radio 点击后 图片跳转
    imageTypeSelect(val){
      for(let i = 0;i < this.images.length; i++){
        if (this.images[i].imageTypeName===this.imagePosition){
          // //因为要把选择的图片展示正中间 所以要-1在0位展示上一张 这么1位就展示的是选中类型的图
          // this.$refs.swiper.swipeTo(i-1);
          this.$refs.swiper.swipeTo(i);
          return;
        }
      }
    },
    //出样陈列
    clothesOperation: function () {
      this.$router.push({name: "clothesOperation", query: this.clothes})
    },
    clothesSchedules: function () {
      this.$router.push({name: "clothesSchedule", query: this.clothes})
    },
    toStyleImage:function (){
      this.$router.push({name: "styleImage", query: this.clothes.styleId})
    },
    toStylePrice:function (){
      this.$router.push({name: "stylePrice", query: this.clothes.styleId})
    },
    styleInfoView: function () {
      this.$router.push({name: "styleIntroduce", query: this.clothes})
    },
    addClothesYarn: function () {
      this.$router.push({name: "dailyAppList", query: this.clothes})
    },
    operationRecord: function () {
      this.$router.push({name: "clothesOperationRecord", query: this.clothes})
    },
  }
}
</script>

<style scoped>
p{
  margin-block-start: 0;
  margin-block-end: 0;
}
.PTitle {
  font-size: 23px;
  font-weight: bold;
  text-align: center;
  padding-top: 1%;
}
.pValue{
  font-size: 17px;
}
.card {
  background: white;
  border-radius: 10px;
  width: 95%;
  margin: 10px auto 10px auto;
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
  height: 130px;
  width: 95%;
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

.van-swipe>>>.van-swipe__indicators{
  display: none;
}
.van-radio-group{
  text-align: center;
  justify-content: center
}
.van-radio >>> .van-radio__label{
  font-size: 25px;
  font-weight: bold;
}
</style>
