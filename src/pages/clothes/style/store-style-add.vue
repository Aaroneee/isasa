<template>
  <div>
    <van-sticky>
      <baseNavBar title="贸易款式添加"/>
    </van-sticky>
    <van-form scroll-to-error @submit="addStyleSubmit">
      <van-field
          name="styleType"
          :value="styleTypeText"
          label="款式类型"
          placeholder="点击选择款式类型"
          readonly
          @click="styleTypeShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="styleTypeShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="styleColumnsArray"
            @confirm="styleOnConfirm"
            @cancel="styleTypeShowPicker = false"
        />
      </van-popup>

      <van-field
          name="styleName"
          v-model="form.styleName"
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
          v-model="form.styleAlias"
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
      <van-field
          name="factoryName"
          v-model="form.factoryName"
          rows="1"
          label="品牌款式名称"
          placeholder="品牌款式名称"
          right-icon="question-o"
          @click-right-icon="$toast('品牌官方款式名称')"
      />
      <van-field
          name="factoryNumber"
          v-model="form.factoryNumber"
          rows="1"
          label="品牌款式编号"
          placeholder="品牌款式编号"
          right-icon="question-o"
          @click-right-icon="$toast('品牌官方款式编号')"
      />


      <van-field
          name="clothesSize"
          :value="form.clothesSize"
          label="选择尺寸"
          placeholder="点击选择第一件婚纱的尺寸"
          readonly
          :rules="[{ required: true }]"
      />

      <!-- 所在店铺 start-->
      <van-field
          name="clothesShop"
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
          :value="form.purchaseDate"
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
          v-model="form.styleInfo"
          type="textarea"
          label="款式介绍"
          placeholder="款式介绍"
          maxlength="40"
          show-word-limit
      />
      <van-field
          class="msg"
          name="styleFit"
          v-model="form.styleFit"
          type="textarea"
          label="适合身形"
          placeholder="请输入适合身形"
          maxlength="40"
          show-word-limit
      />
      <van-field
          class="msg"
          name="styleNoFit"
          v-model="form.styleNoFit"
          type="textarea"
          label="不适合身形"
          placeholder="请输入不适合身形"
          maxlength="40"
          show-word-limit
      />
      <div class="operationParent" style="">
        <div style="width: 50vw;display:inline-block" v-for="(item,index) in form.styleImageList" :key="index">
          <div style="height: 240px;display: flex;align-items: center;flex-direction: column;justify-content: center">
            <img class="style-img"
                 :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage+'?imageMogr2/rquality/60'"
                 @error="($event)=>{
                        $event.target.src='https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logoFont.jpg?imageMogr2/rquality/2';
                      }">
            <p style="color: var(--my-text-color);font-size: 14px">{{ item.imageTypeName }}</p>
          </div>

        </div>
      </div>
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

export default {
  name: "styleAdd",
  inject: ['reload'],
  data() {
    return {
      form: {
        //款式类型id
        styleType: "",
        //款式名称
        styleName: "",
        brandId: 0,
        //创建日期
        purchaseDate: this.$dateUtils.vantDateToYMD(new Date()),
        tenantCrop: localStorage.getItem("tenantCrop"),
        //款式介绍
        styleInfo: "",
        //适合身形
        styleFit: "",
        //不适合身形
        styleNoFit: "",

        //品牌款式名称
        factoryName: "",
        //品牌款式编号
        factoryNumber: "",

        styleAlias: "",
        clothesSize: "",

        clothesShop: "",
        clothesPosition: "",
        styleImage: "",
        styleImageList: [],
        styleLabels: [],
        empId: localStorage.getItem("empId"),
        msgId: this.$route.query.msgId,
        storeStyleId:  this.$route.query.storeStyleId,
      },

      //款式文字显示
      styleTypeText: "",
      clothesShopText: "",
      clothesPositionText: "",
      //款式可选数组
      styleColumnsArray: [],
      shopColumnsArray: [],
      positionColumnsArray: [],

      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],

      styleTypeShowPicker: false,
      createDateShowPicker: false,
      shopShowPicker: false,
      positionShowPicker: false,
      styleLabelShowPicker: false,
      overlayShow: false,

      styleLabelList: [],
      styleLabels: [],
      finalStyleLabels: [],

      brandShowPicker: false,
      brand: "",

      checkbox: true,

      myShopIds: localStorage.getItem("shopIds"),

    }
  },
  created() {
    this.queryStyleIds();
    this.queryShopIds();
    this.queryStyleLabelList();
    this.queryStoreStyleById();
  },
  components: {
    baseNavBar
  },
  methods: {
    queryStyleIds: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.Picker).then(response => {
        this.styleColumnsArray = JSON.parse(response.data.data)
      })
    },
    styleOnConfirm: function (value) {
      this.form.styleType = value.id
      this.styleTypeText = value.text
      this.styleTypeShowPicker = false
      if (this.checkbox) {
        this.queryStyleName(value.id);
      }

    },
    queryStyleName: function (value) {
      return this.$axios({
        method: "GET",
        url: "/style/queryStyleName",
        params: {
          styleType: value,
          tenantCrop: this.form.tenantCrop
        }
      }).then((response) => {
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
        this.form.styleName = name
      })
    },
    addStyleSubmit() {
      this.form.styleLabels=[];
      for (let temp in this.styleLabelList) {
        let index = this.styleLabelList[temp].value
        if (this.styleLabels[index] === 1) {
          this.form.styleLabels.push(index)
        }
      }

      this.$dialog.confirm({
        title: '添加款式',
        message: '确定要添加该款式吗？',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/style/saveStyleByStore",
          data: this.form
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
    pushStyleLabel: function (value) {
      this.$set(this.styleLabels, value,
          this.styleLabels[value] === 1 ? 0 : 1)
    },
    close: function (value) {
      this.$set(this.styleLabels, value, 0)
    },
    createDateOnConfirm: function (time) {
      this.form.purchaseDate = this.$dateUtils.vantDateToYMD(time);
      this.createDateShowPicker = false;

    },
    shopOnConfirm: function (value) {
      //先清空店铺下的所有位置
      this.form.clothesPosition = ""
      this.clothesPositionText = ""
      this.clothesShopText = value.text
      this.form.clothesShop = value.id
      this.shopShowPicker = false
      //查询店铺下所有位置
      this.queryPositionIdsByShop(value.id)
    },
    queryShopIds: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.Picker).then(response => {
        this.shopColumnsArray = JSON.parse(response.data.data);
        this.setDefaultShop();
      })
    },
    queryPositionIdsByShop: function (shop) {
      this.$selectUtils.queryPositionIdsByShop(shop, this.$selectUtils.Picker).then(response => {
        this.positionColumnsArray = JSON.parse(response.data.data)
        this.setDefaultPosition();
      })
    },
    positionOnConfirm: function (value) {
      this.clothesPosition = value.id
      this.clothesPositionText = value.text
      this.positionShowPicker = false
    },

    autoStyleAlias: function () {
      if (this.form.styleType !== "") {
        if (this.checkbox) {
          this.styleOnConfirm({id: this.form.styleType, text: this.styleTypeText})
        }
      }
    },
    //设置默认店铺
    setDefaultShop: function () {
      let localShopIds = this.myShopIds.split(",")
      let shopId = localShopIds.includes("59") ? 59 : Number(localShopIds[0]);
      let choose = this.shopColumnsArray.filter(k => {
        return k.id === shopId;
      })
      this.form.clothesShop = choose[0].id;
      this.clothesShopText = choose[0].text;
      this.queryPositionIdsByShop(choose[0].id);
    },
    //设置默认位置
    setDefaultPosition: function () {
      this.positionColumnsArray.forEach(s => {
        if (s.text.indexOf("新款入库区") !== -1) {
          this.form.clothesPosition = s.id
          this.clothesPositionText = s.text
        }
      })
    },
    //查询贸易ID
    queryStoreStyleById() {
      //查询款式类型ID,款式编号,款式品牌ID,款式标签ID
      this.$axios({
        method: "GET",
        url: "/storeStyle/queryById",
        params: {
          id: this.$route.query.storeStyleId,
        }
      }).then(response => {
        let storeStyle = response.data.data;
        this.form.factoryName = storeStyle.styleName;
        this.form.factoryNumber = storeStyle.styleNum;
        this.form.styleAlias = storeStyle.styleName;
        this.form.styleFit = storeStyle.styleFit;
        this.form.styleNoFit = storeStyle.styleNoFit;
        this.form.styleInfo = storeStyle.styleInfo;
        this.form.clothesSize = this.$route.query.clothesSize;
        this.form.styleImage = storeStyle.mainImage;
        this.setStoreStyleImage(storeStyle.storeStyleImages)
        this.setStoreStyleType(storeStyle.storeTypeName)
        this.setStoreStyleLabel(storeStyle.labelNames)
        this.setStoreStyleBrand(storeStyle.storeBrandName)
      })
    },
    setStoreStyleImage(storeStyleImages) {
      storeStyleImages.forEach(k => {
        this.form.styleImageList.push({styleImage: k.styleImage, imageTypeName: k.storeImageTypeName,tenantCrop:this.form.tenantCrop})
      })
    },
    setStoreStyleType(storeTypeName) {
      this.$axios({
        method: "GET",
        url: "/styleType/queryByTypeName",
        params: {
          typeName: storeTypeName,
          tenantCrop: this.form.tenantCrop,

        }
      }).then(response => {
        this.form.styleType = response.data.data.id;
        this.styleTypeText = response.data.data.typeName;
        this.queryStyleName(this.form.styleType);
      })
    },
    setStoreStyleLabel(labelNames) {
      this.$axios({
        method: "GET",
        url: "/label/queryByNames",
        params: {
          names: labelNames,
          labelType: 2,
          tenantCrop: this.form.tenantCrop,

        }
      }).then(response => {
        if (response.data.data.length > 0) {
          response.data.data.forEach(k => {
            if (this.styleLabelList.some(obj => obj.value === k.id)) {
              this.pushStyleLabel(k.id);
            }
          })
        }
      })
    },
    setStoreStyleBrand(brandName) {
      this.$axios({
        method: "GET",
        url: "/styleBrand/queryIsAuth",
        params: {
          brandName: brandName,
          tenantCrop: this.form.tenantCrop,

        }
      }).then(response => {
        if (response.data.data.length < 2) {

          this.brand = response.data.data[0].brandName;
          this.form.brandId = response.data.data[0].id;
        }
      })
    },

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

.operationParent {
  overflow-x: auto;
  white-space: nowrap;
}

.operationParent::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.style-img {
  max-height: 220px;
  max-width: 165px;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
