<template>
  <div>
    <switchNavBar title="款式详情" switchText="款式图片" @flag="styleImages=true"/>
    <van-popup v-model="styleImages" round position="bottom" :style="{ height: '80%' }">
      <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
        <van-collapse-item v-for="item in styleImageArray" :key="item.id"
                           :title="item.imageTypeName"
                           :name="item.id">
          <van-cell-group style="text-align: center">
            <van-image radius="7"
                       :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage"
                       @click="imageShowClick('https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage)"/>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </van-popup>
    <div @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
      <van-image-preview v-model="imageShow" :images="images" @close="onClose" maxZoom="1" minZoom="1"></van-image-preview>
    </div>
    <van-share-sheet
        v-model="showShare"
        :options="options"
        @select="onSelect"
    />
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
    <per-button @click="addClothes" type="info" per="style_details:add_clothes" :span="6">添加婚纱</per-button>
    <per-button @click="updateStyle" type="warning" per="style_details:edit" :span="6">编辑</per-button>
    <per-button @click="deleteStyle" type="danger" per="style_details:delete" :span="6">删除</per-button>
    <per-button @click="stylePrice" type="primary" per="style_details:price" :span="6">查看价格</per-button>
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
    this.queryStyleImage(this.style.id)
  },
  data() {
    return {
      style: {},
      styleImages: false,
      tenantCrop: localStorage.getItem("tenantCrop"),
      showShare: false,
      activeNames: ['1'],
      styleImageArray: [],
      imageShow: false,
      images: [],
      options: [
        {name: '保存图片', icon: 'poster'}
      ],
      isLongClick: false,
      loop: {},
      imageUrl: "",
      touchStartX: '',
      touchStartY: '',
      moveX: '',
      moveY: '',
      flag: false,
    }
  },
  watch: {
    isLongClick: function (val) {
      if (val) {
        if (this.moveX === '' && this.moveY === '') {
          this.showShare = true
        }
        this.isLongClick = false
      }
    }
  },
  methods: {
    updateStyle() {
      this.$router.push({name: "styleEdit", query: this.style});
    },
    addClothes() {
      this.$router.push({name: "clothesAdd", query: this.style})
    },
    stylePrice() {
      this.$router.push({name: "stylePrice", query: this.style})
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
            },500)
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })
    },
    imageShowClick(val) {
      this.imageShow = true
      this.images = [val]
      this.imageUrl = val
    },
    touchStart(event) {
      this.moveX = ''
      this.moveY = ''
      this.touchStartX = event.changedTouches[0].clientX // this.touchStartX按下时的横轴坐标
      this.touchStartY = event.changedTouches[0].clientY // this.touchStartY按下时的纵轴坐标
      clearTimeout(this.loop)
      this.loop = setTimeout(() => {
        this.isLongClick = true
      }, 600)
    },
    touchEnd() {
      clearTimeout(this.loop)
    },
    onSelect() {
      /Linux/i.test(navigator.platform)
          ?androidMethod.downImage(this.imageUrl)
          :window.webkit.messageHandlers.save.postMessage(this.imageUrl);

      this.showShare = false
    },
    onClose() {
      this.imageShow = false
      this.isLongClick = false
    },
    touchMove(event) {
      this.moveX = event.changedTouches[0].clientX
      this.moveY = event.changedTouches[0].clientY
    },
  }
}
</script>

<style >
.van-image__img {
  min-height: 200px;
}
.col{
  /*offset=1*/
  margin-left: 4.16666667%;
}
.col:first-child{
  /*offset=2*/
  margin-left: 8.33333333%;
}
.col:nth-child(3n+1){
  margin-left: 8.33333333%;
}
.col:nth-child(n+4){
  margin-top: 17px;
}
</style>
