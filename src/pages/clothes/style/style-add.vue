<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式添加"/>
    </van-sticky>
    <van-form scroll-to-error @submit="addStyleSubmit">
      <van-field
          name="styleType"
          :value="styleTypeText"
          label="款式类型"
          placeholder="点击选择款式类型"
          readonly
          @click="styleShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="styleShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="styleColumnsArray"
            @confirm="styleOnConfirm"
            @cancel="styleShowPicker = false"
        />
      </van-popup>

      <van-field
          name="styleName"
          v-model="styleNameText"
          :readonly="checkbox"
          center
          label="店铺款式编号"
          placeholder="店铺款式编号"
          :rules="[{ required: true }]">
        <template #button>
          <van-checkbox v-model="checkbox" @click="autoStyleAlias">自动编号</van-checkbox>
        </template>
      </van-field>

      <van-field
        name="styleAlias"
        label="款式名称"
        placeholder="款式名称"
        v-model="styleAlias"
      />
      <van-field
          readonly
          label="款式品牌"
          placeholder="点击选择品牌"
          clickable
          name="brand"
          :value="brand"
          @click="brandShowPicker = true"
      />
      <van-popup v-model="brandShowPicker" round position="bottom">
        <van-picker
            show-toolbar
            :columns="brandArray"
            @cancel="brandShowPicker = false"
            @confirm="brandConfirm"
        />
      </van-popup>
<!--      <van-field-->
<!--          name="factoryNumber"-->
<!--          v-model="factoryNumber"-->
<!--          rows="1"-->
<!--          label="品牌款式编号"-->
<!--          placeholder="品牌款式编号"-->
<!--          right-icon="question-o"-->
<!--          @click-right-icon="$toast('品牌官方款式编号')"-->
<!--      />-->
<!--      <van-field-->
<!--          name="factoryName"-->
<!--          v-model="factoryName"-->
<!--          rows="1"-->
<!--          label="品牌款式名称"-->
<!--          placeholder="品牌款式名称"-->
<!--          right-icon="question-o"-->
<!--          @click-right-icon="$toast('品牌官方款式名称')"-->
<!--      />-->
      <van-field label="第一件婚纱">
        <template #input>
          <van-switch v-model="firstSwitch" size="20"/>
        </template>
      </van-field>

      <van-field
          name="clothesSize"
          v-if="firstSwitch"
          :value="clothesSize"
          label="选择尺寸"
          placeholder="点击选择第一件婚纱的尺寸"
          readonly
          @click="clothesSizeShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="clothesSizeShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="clothesSizeColumnsArray"
            @confirm="clothesSizeOnConfirm"
            @cancel="clothesSizeShowPicker = false"
        />
      </van-popup>

      <!-- 所在店铺 start-->
      <van-field
          name="clothesShop"
          v-if="firstSwitch"
          label="所在店铺"
          placeholder="点击选择所在店铺"
          readonly
          v-model="clothesShopText"
          v-on:click="shopShowPicker=true"
          :rules="[{ required: true}]"
      >
      </van-field>
      <van-popup v-model="shopShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="shopColumnsArray"
            @confirm="shopOnConfirm"
            @cancel="shopShowPicker = false"
        />
      </van-popup>
      <!-- 所在店铺 end-->

      <!-- 所在位置 start-->
      <van-field
          name="clothesPosition"
          v-if="firstSwitch"
          v-model="clothesPositionText"
          label="所在位置"
          placeholder="点击选择所在位置"
          readonly
          v-on:click="positionShowPicker = true"
          :rules="[{ required: true}]"
      >
      </van-field>
      <van-popup v-model="positionShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="positionColumnsArray"
            @confirm="positionOnConfirm"
            @cancel="positionShowPicker = false"
        />
      </van-popup>
      <!-- 所在位置 end-->
      <van-field
          readonly
          clickable
          name="purchaseDate"
          :value="purchaseDate"
          label="采购日期"
          placeholder="点击选择采购日期"
          @click="createDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="createDateShowPicker" :min-date="minDate" :max-date="maxDate"
                    @confirm="createDateOnConfirm" :default-date="new Date()"/>
      <van-field
          readonly
          clickable
          center
          name="styleLabels"
          label="款式标签"
          placeholder="点击选择标签"
          @click="styleLabelShowPicker = true"
      >
        <template #input>
          <van-col slot="label">
            <van-tag v-for="item in styleLabelList" :key="item.value" v-if="styleLabels[item.value] === 1" type="danger"
                     size="large" closeable style="margin: 5px"
                     @close="close(item.value)">
              {{ item.name }}
            </van-tag>
          </van-col>
        </template>
      </van-field>
      <van-popup v-model="styleLabelShowPicker" position="bottom">
        <van-row type="flex" style="padding: 10px">
          <van-col style="margin: 5px" v-for="item in styleLabelList" :key="item.value">
            <van-tag type="danger" :class="styleLabels[item.value] === 1?'':'van-tag--plain'"
                     size="large"
                     @click="pushStyleLabel(item.value,item.name)">{{ item.name }}
            </van-tag>
          </van-col>
        </van-row>
      </van-popup>
      <van-field
          class="msg"
          name="styleInfo"
          v-model="styleInfo"
          type="textarea"
          label="款式介绍"
          placeholder="款式介绍"
          maxlength="40"
          show-word-limit
      />
      <van-field
          class="msg"
          name="styleFit"
          v-model="styleFit"
          type="textarea"
          label="适合身形"
          placeholder="请输入适合身形"
          maxlength="40"
          show-word-limit
      />
      <van-field
          class="msg"
          name="styleNoFit"
          v-model="styleNoFit"
          type="textarea"
          label="不适合身形"
          placeholder="请输入不适合身形"
          maxlength="40"
          show-word-limit
      />
      <van-field
          readonly
          label="图片类型"
          placeholder="点击选择图片类型"
          clickable
          v-if="fileName.length>0"
          name="imageType"
          :value="imageTypeText"
          @click="imageTypeShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="imageTypeShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="imageTypeColumnsArray"
            @confirm="imageTypeOnConfirm"
            @cancel="imageTypeShowPicker = false"
        />
      </van-popup>

      <van-field name="uploader" label="婚纱图片">
        <template #input>
          <van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="1"/>
        </template>
      </van-field>
      <!-- 裁剪页 -->
      <transition name="slim-fade">
        <div v-show="cropShow" class="crop-wrap">
          <SlimCropper ref="cropper" :src="inputImgUrl" :aspect-ratio="0.7"></SlimCropper>
          <div class="btn-box">
            <button type="button" class="crop-btn" @click="hideCrop">取消</button>
            <button type="button" class="crop-btn" @click="submitCrop">使用</button>
          </div>
        </div>
      </transition>

      <br>
      <van-button
          color="linear-gradient(to right, #50E64D, #03B300)"
          class="bottom-button"
          round block type="primary"
          native-type="submit">提交
      </van-button>
    </van-form>


    <van-overlay :show="overlayShow"/>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

// 将 blob 对象转化为 url
const getObjectURL = (file) => {
  let url
  if (window.createObjectURL) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  return new window.File([theBlob], fileName, {type: 'image/jpeg'})
}

export default {
  name: "styleAdd",
  inject: ['reload'],
  data() {
    return {
      //款式id
      styleType: "",
      //款式文字显示
      styleTypeText: "",
      //款式可选数组
      styleColumnsArray: [],
      //款式下拉是否展示
      styleShowPicker: false,
      //款式名称id
      //款式名称文字显示
      styleName: "",
      styleNameText: "",
      tenantCrop: localStorage.getItem("tenantCrop"),
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],
      //创建日期
      purchaseDate: this.$dateUtils.vantDateToYMD(new Date()),
      //日期选择框展示
      createDateShowPicker: false,
      //款式介绍
      styleInfo: "",
      //适合身形
      styleFit: "",
      //不适合身形
      styleNoFit: "",
      //品牌款式编号
      factoryNumber: "",
      //品牌款式名称
      factoryName: "",
      fileName: "",
      fileList: [],

      firstSwitch: true,
      clothesSize: "",
      clothesSizeShowPicker: false,
      clothesSizeColumnsArray: [],

      clothesShop: "",
      clothesShopText: "",
      shopColumnsArray: [],
      shopShowPicker: false,
      positionColumnsArray: [],
      clothesPosition: "",
      clothesPositionText: "",
      positionShowPicker: false,

      cropShow: false, // 裁剪弹窗显示
      inputImgUrl: '', // input 选中的图片 url
      getObjectURL,
      loading: false,
      overlayShow: false,

      styleLabelShowPicker: false,
      styleLabelsText: "",
      styleLabelsTextArray: [],
      styleLabelList: [],
      styleLabels: [],
      finalStyleLabels:[],

      brandShowPicker: false,
      brand:"",
      brandArray:[],
      brandId:0,

      imageTypeShowPicker:false,
      imageType:"",
      imageTypeText:"",
      imageTypeColumnsArray:[],
      checkbox: true,
      styleAlias:"",

      myShopIds: localStorage.getItem("shopIds"),
    }
  },
  created() {
    this.queryStyleIds();
    this.queryShopIds();
    this.queryStyleLabelList();
    this.queryBrands();
    this.queryImageType();
    this.queryClothesSize();

  },
  components: {
    baseNavBar
  },
  watch:{
    firstSwitch(newVal,oldVal){
      if (newVal===true){
        this.setDefaultClothesSize();
        this.setDefaultShop();
        this.setDefaultPosition();
      }
    }
  },
  methods: {
    queryStyleIds: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.Picker).then(response => {
        this.styleColumnsArray = JSON.parse(response.data.data)
      })
    },
    styleOnConfirm: function (value) {
      console.log(value)
      this.styleType = value.id
      this.styleTypeText = value.text
      this.styleShowPicker = false
      if (this.checkbox) {
        this.queryStyleName(value.id).then((response) => {
          let name = response.data.data + "";
          let styleNameLen = name.length
          switch (styleNameLen) {
            case 1:
              name = "000" + name;
              break;
            case 2:
              name = "00" + name;
              break;
            case 3:
              name = "0" + name;
              break;
          }
          this.styleNameText = name
        })
      }

    },
    queryStyleName: function (value) {
      return this.$axios({
        method: "GET",
        url: "/style/queryStyleName",
        params: {
          styleType: value,
          tenantCrop: this.tenantCrop
        }
      })
    },
    addStyleSubmit(data) {
      data.styleType = this.styleType;
      data.clothesShop = this.clothesShop;
      data.clothesPosition = this.clothesPosition;
      data.styleLabels = this.styleLabels.toString();
      this.$dialog.confirm({
        title: '添加款式',
        message: '确定要添加该款式吗？',
      }).then(() => {
        if (this.fileList.length !== 0) {
          this.$toast.loading({
            message: '上传图片中...',
            forbidClick: true,
            duration: 2500
          })
        }
        this.uploadClothesImage().then(value => {
          if (!value) {
            this.$toast.fail("图片上传发生错误,请检查后进行上传")
            this.overlayShow = false
          } else {
            for (let temp in this.styleLabelList) {
              var index = this.styleLabelList[temp].value
              if (this.styleLabels[index] == 1) {
                this.finalStyleLabels.push(index)
              }
            }
            data.tenantCrop = this.tenantCrop
            data.styleImage = this.fileName
            data.uploader = []
            data.imageType=this.imageType;
            data.brandId = this.brandId
            data.empId = localStorage.getItem("empId")
            data.styleLabels = this.finalStyleLabels
            data.styleAlias = this.styleAlias
            this.$axios({
              method: "POST",
              url: "/style/saveStyle",
              data: data
            }).then((response) => {
              if (response.data.code === 200) {
                this.overlayShow = false
                this.$dialog.confirm({
                  title: '添加成功',
                  message: '是否跳转款式列表查看?',
                }).then(() => {
                  this.$router.replace({name: "styleList"})
                })
                    .catch(() => {
                      this.reload()
                    })
              } else {
                this.$toast.fail(response.data.msg);
              }
            })
          }
        })
      })
    },
    queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
        for (let temp in this.styleLabelList) {
          let index = this.styleLabelList[temp].value
          this.styleLabels[index] = 0
        }
      })
    },
    styleLabelConfirm: function () {
      this.styleLabelShowPicker = false
    },
    pushStyleLabel: function (value) {
      this.$set(this.styleLabels, value,
          this.styleLabels[value] === 1?0:1)
    },
    close: function (value) {
      this.$set(this.styleLabels, value, 0)
    },
    createDateOnConfirm: function (time) {
      this.purchaseDate = this.$dateUtils.vantDateToYMD(time);
      this.createDateShowPicker = false;

    },
    clothesSizeOnConfirm: function (value) {
      this.clothesSize = value;
      this.clothesSizeShowPicker = false;
    },
    shopOnConfirm: function (value) {
      //先清空店铺下的所有位置
      this.clothesPosition = ""
      this.clothesPositionText = ""
      this.clothesShopText = value.text
      this.clothesShop = value.id
      this.shopShowPicker = false
      //查询店铺下所有位置
      this.queryPositionIdsByShop(value.id)
    },
    queryShopIds: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.Picker).then(response => {
        this.shopColumnsArray =JSON.parse(response.data.data);
        this.setDefaultShop();
      })
    },
    queryPositionIdsByShop: function (shop) {
      this.$selectUtils.queryPositionIdsByShop(shop, this.$selectUtils.Picker).then(response => {
        this.positionColumnsArray = JSON.parse(response.data.data)
        this.setDefaultPosition();
      })
    },
    queryImageType:function(){
      this.$selectUtils.queryStyleImageTypeIds(this.$selectUtils.Picker,0).then((response) => {
        this.imageTypeColumnsArray = JSON.parse(response.data.data);
      })
    },
    queryClothesSize() {
      this.$selectUtils.queryClothesSize().then(response => {
        this.clothesSizeColumnsArray = JSON.parse(response.data.data).map(s => s['name'])
        this.setDefaultClothesSize()
      })
    },
    positionOnConfirm: function (value) {
      this.clothesPosition = value.id
      this.clothesPositionText = value.text
      this.positionShowPicker = false
    },
    beforeClose: function (action, done) {
      if (action === 'confirm') {
        setTimeout(done, 1000);
      } else {
        done();
      }
    },
    afterRead(file) {
      this.fileName = file.file.name
      this.inputImgUrl = getObjectURL(file.file)
      this.showCrop()
      // this.fileList[0].status = "uploading"
      // this.fileList[0].message = "上传中..."
      // this.$upload.clothesImageUpload(file)
      // .then(response=>{
      //   let data = response.data
      //   if (data.code === 200){
      //     this.fileList[0].status = ""
      //   }
      // })
    },
    uploadClothesImage: function () {
      return new Promise((resolve, reject) => {
        if (this.fileList.length !== 0) {
          this.fileList[0].status = "uploading"
          this.fileList[0].message = "上传中..."
          this.$upload.clothesImageUpload(this.fileList[0].file)
              .then(response => {
                let data = response.data
                if (data.code === 200) {
                  this.fileList[0].status = ""
                  this.fileName = data.data
                  resolve(true)
                } else {
                  reject(false)
                }
              })
        } else {
          resolve(true)
        }
      })
    },
    // 显示裁剪页
    showCrop() {
      this.cropShow = true
    },
    // 隐藏裁剪页
    hideCrop: function () {
      this.cropShow = false
    },
    // 裁剪页确认
    async submitCrop() {
      this.hideCrop()
      const img = await this.$refs.cropper.getCroppedBlob('image/jpeg', 0.7)
      this.fileList[0].file = blobToFile(img, this.fileName)
    },
    brandConfirm: function (value,index) {
      this.brand = value.text;
      this.brandId = value.id;
      this.brandShowPicker = false;
    },
    imageTypeOnConfirm:function (value,index){
      this.imageType=value.id;
      this.imageTypeText=value.text;
      this.imageTypeShowPicker=false;
    },
    //查询品牌列表
    queryBrands: function () {
       this.$selectUtils.queryBrandIds(this.$selectUtils.Picker).then((response) => {
         this.brandArray = JSON.parse(response.data.data);
       })
    },
    autoStyleAlias: function () {
      if (this.styleType !== "") {
        if (this.checkbox) {
          this.styleOnConfirm({id:this.styleType,text:this.styleTypeText})
        }
      }
    },
    //设置款式默认尺寸
    setDefaultClothesSize:function (){
      this.clothesSizeColumnsArray.forEach(s => {
        if (s==='F') {
          this.clothesSize = s
          return
        }
      })
    },
    //设置默认店铺
    setDefaultShop:function (){
      let localShopIds=this.myShopIds.split(",")
      let shopId=localShopIds.includes("59")?59:Number(localShopIds[0]);
      let choose=this.shopColumnsArray.filter(k=>{
        return k.id===shopId;
      })
      this.clothesShop=choose[0].id;
      this.clothesShopText=choose[0].text;
      this.queryPositionIdsByShop(choose[0].id);
    },
    //设置默认位置
    setDefaultPosition:function (){
      this.positionColumnsArray.forEach(s => {
        if (s.text.indexOf("新款入库区") !== -1) {
          this.clothesPosition = s.id
          this.clothesPositionText = s.text
        }
      })
    },
    positionClick() {

    }
  },

}
</script>

<style scoped>
.msg {
  height: 100px;
  word-break: break-all
}

* {
  /*padding: 0;*/
  margin: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
  /*background: transparent;*/
}

.bottom-button {
  width: 80%;
  margin: 3% auto;
}

.crop-wrap {
  z-index: 1;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #000;
}

.btn-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
}

.crop-btn {
  width: 60px;
  height: 100%;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  background: transparent;

}

.slim-fade-enter-active, .slim-fade-leave-active {
  transition: all 0.4s ease;
}

.slim-fade-enter, .slim-fade-leave-to {
  opacity: 0;
  transform-origin: top;
  transform: translateY(100%);
}

.tag-padding {
  margin-left: 5px;
  margin-right: 5px;
}

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}
</style>
