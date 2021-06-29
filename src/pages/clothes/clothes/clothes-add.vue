<template>
  <div>
    <baseNavBar title="婚纱添加"/>
    <van-form @submit="addClothesSubmit">
      <!-- 婚纱尺寸 start-->
      <van-field
          name="clothesSize"
          label="婚纱尺寸"
          placeholder="点击选择婚纱尺寸"
          v-model="clothesSize"
          readonly
          @click="sizeShowPicker = true"
          :rules="[{ required: true}]"
      >
      </van-field>
      <van-popup v-model="sizeShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="sizeColumnsArray"
            @confirm="sizeOnConfirm"
            @cancel="sizeShowPicker = false"
        />
      </van-popup>
      <!-- 婚纱尺寸 end-->

      <!-- 婚纱编号 start-->
      <van-field
          name="clothesNo"
          label="婚纱编号"
          readonly
          v-model="clothesNo"
          :rules="[{ required: true}]"

      >
      </van-field>
      <!-- 婚纱编号 end-->

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

      <!-- 水洗标状态 start-->
      <van-field
          name="washingTip"
          v-model="washingTip"
          label="水洗标状态"
          placeholder="水洗标状态"
          readonly
      >
        <template #input>
          <van-switch v-model="washingTipChecked" size="20"
                      v-on:change="washingTipCheck(washingTipChecked)"
          />
        </template>
      </van-field>
      <!-- 水洗标状态 end-->


      <!-- 公司编号 start-->
      <van-field
          name="tenantCrop"
          v-model="tenantCrop"
          style="display: none"
      >
      </van-field>
      <!-- 公司编号 end-->


      <van-button
          color="linear-gradient(to right, #50E64D, #03B300)"
          class="bottom-button"
          round block type="primary"
          native-type="submit">提交
      </van-button>
    </van-form>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "clothesAdd",
  created() {
    this.queryClothesNoByStyleId(this.$route.query.id)
    this.queryShopIds()
    this.style = this.$route.query
  },
  components: {
    baseNavBar
  },
  data() {
    return {
      style: {},
      tenantCrop: localStorage.getItem("tenantCrop"),
      clothesSize: "",
      sizeShowPicker: false,
      sizeColumnsArray: ['M', 'S', 'L', 'XL', 'XXL', 'F'],
      clothesNo: "",
      clothesShop: "",
      clothesShopText: "",
      shopColumnsArray: [],
      shopShowPicker: false,
      positionColumnsArray: [],
      clothesPosition: "",
      clothesPositionText: "",
      positionShowPicker: false,
      washingTip: 0,
      washingTipChecked: false
    }
  },
  methods: {
    queryClothesNoByStyleId: function (value) {
      console.log(value)
      this.$axios({
        method: "get",
        url: "/clothes/queryClothesNoByStyleId",
        params: {
          styleId: value,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.clothesNo = response.data.data
        }
      })
    },
    sizeOnConfirm: function (value) {
      this.clothesSize = value
      this.sizeShowPicker = false
    },
    shopOnConfirm: function (value) {
      //查询店铺下所有位置
      this.queryPositionIdsByShop(value.id)
      //先清空店铺下的所有位置
      this.clothesPosition = ""
      this.clothesPositionText = ""
      this.clothesShopText = value.text
      this.clothesShop = value.id
      this.shopShowPicker = false
    },
    queryShopIds: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.Picker).then(response => {
        this.shopColumnsArray = JSON.parse(response.data.data)
      })
    },
    queryPositionIdsByShop: function (shop) {
      this.$selectUtils.queryPositionIdsByShop(shop, this.$selectUtils.Picker).then(response => {
        this.positionColumnsArray = JSON.parse(response.data.data)
      })
    },
    positionOnConfirm: function (value) {
      this.clothesPosition = value.id
      this.clothesPositionText = value.text
      this.positionShowPicker = false
    },
    washingTipCheck: function (value) {
      console.log(value)
      this.washingTip = value ? 1 : 0
    },
    addClothesSubmit: function (data) {
      data.washingTip = this.washingTip
      data.clothesPosition = this.clothesPosition
      data.clothesShop = this.clothesShop
      data.styleId = this.style.id
      data.empId = localStorage.getItem("empId")
      this.$dialog.confirm({
        title: "婚纱添加",
        message: "您要添加的婚纱编号为" + "<br><br>" + this.style.typeName + "-" + this.style.styleName + "-" + data.clothesSize + "-" + data.clothesNo,
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/clothes/saveClothes",
          params: data
        }).then((response) => {
          if (response.data.code === 200) {
            this.$dialog.confirm({
              title: '添加成功',
              message: '是否跳转婚纱列表查看?',
            }).then(() => {
              this.$router.replace({name: "clothesList"})
            })
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })
    }

  }
}
</script>

<style scoped>

.bottom-button {
  width: 90%;
  position: absolute;
  bottom: 10%;
  left: 5%;
  margin: 0 auto;
}
</style>
