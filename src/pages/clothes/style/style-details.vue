<template>
  <div>
    <switchNavBar title="款式详情" switchText="款式图片" @flag="styleImages=true"/>
    <van-popup v-model="styleImages" round position="bottom" :style="{ height: '80%' }">
      <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
        <van-collapse-item v-for="item in styleImageArray" :key="item.id"
                           :title="item.imageType"
                           :name="item.id">
          <van-cell-group style="text-align: center">
            <van-image radius="7"
                       :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage"/>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </van-popup>

    <van-cell-group>
      <van-cell title="款式类型:" :value="style.typeName"/>
      <van-cell title="款式编号:" :value="style.styleName"/>
      <van-cell title="款式名称:" :value="style.styleAlias"/>
      <van-cell title="款式介绍:" :value="style.styleInfo"/>
      <van-cell title="适合身形:" :value="style.styleFit"/>
      <van-cell title="不适合身形:" v-cloak :value="style.styleNoFit"/>
      <van-cell title="款式品牌:" v-cloak :value="style.brandName"/>
      <van-cell title="采购日期:" :value="style.purchaseDate"/>
      <van-cell title="同款件数:" :value="style.appointCity"/>
    </van-cell-group>
    <br>
    <br>
    <br>
    <br>
    <van-col span="6" offset="2">
      <van-button @click="addClothes" size="small" style="width: 100%" type="info">添加婚纱</van-button>
    </van-col>
    <van-col span="6" offset="1">
      <van-button @click="updateStyle" size="small" type="warning" style="width: 100%">编辑</van-button>
    </van-col>
    <van-col span="6" offset="1">
      <van-button @click="deleteStyle" size="small" type="danger" style="width: 100%">删除</van-button>
    </van-col>
  </div>

</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "styleDetails",
  components: {
    switchNavBar
  }
  , created() {
    this.style = this.$route.query
    this.queryStyleImage(this.style.id)
  }
  , data() {
    return {
      style: {},
      styleImages: false,
      tenantCrop: localStorage.getItem("tenantCrop"),


      activeNames: ['1'],
      styleImageArray: []
    }
  },
  methods: {
    updateStyle() {
      console.log()
      this.$router.push({name: "styleEdit", query: this.style});
    },
    addClothes() {
      this.$router.push({name: "clothesAdd", query: this.style})
    },
    queryStyleImage(styleId) {
      this.$axios({
        method: "GET",
        url: "/image/queryStyleImages",
        params: {
          styleId: styleId,
        }
      }).then(response => {
        this.styleImageArray = response.data.data
      })
    },
    //删除款式
    deleteStyle(){
      this.$dialog.confirm({
        title: '删除款式',
        message: '确定要删除该款式吗？',
      }).then(() => {
        this.$axios({
          method:"POST",
          url:"/style/deleteStyle",
          params:{
            styleId:this.style.id
          }
        }).then(response=>{
          if (response.data.code === 200) {
            this.$toast.success("删除成功");
            setTimeout(()=>{
              this.$router.go(-1)
            },1000)
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })
    }
  }
}
</script>

<style >
.van-image__img {
  min-height: 200px;
}

</style>
