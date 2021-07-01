<template>
  <div>
    <baseNavBar title="出样陈列"/>
    <van-form @submit="addClothesOperation">
      <!-- 婚纱尺寸 start-->
      <van-field
          name="clothesName"
          v-model="clothesNameText"
          label="婚纱名称"
          readonly
      >
      </van-field>
      <van-field
          readonly
          clickable
          name="createDate"
          :value="createDate"
          label="操作日期"
          :rules="[{ required: true }]"
      />

      <van-field
          name="historyPosition"
          readonly
          :value="historyPosition"
          label="当前位置"
      />


      <van-field
          name="operationId"
          readonly
          :value="operationText"
          label="操作行为"
          placeholder="点击选择操作行为"
          @click="operationShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="operationShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="operationArray"
            @confirm="operationOnConfirm"
            @cancel="inviterShowPicker = false"
        />
      </van-popup>

      <!-- 所在位置 start-->
      <van-field
          name="positionId"
          v-model="clothesPositionText"
          label="目标位置"
          placeholder="点击选择将要移动的位置"
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
          class="msg"
          name="remark"
          v-model="remark"
          type="textarea"
          label="备注"
          placeholder="本次操作备注"
          maxlength="40"
          show-word-limit
      />


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
  name: "clothes-operation",
  created() {
    this.clothes = this.$route.query
    this.clothesNameText = this.clothes.styleType + "-" + this.clothes.styleName + "-" + this.clothes.clothesSize + "-" + this.clothes.clothesNo
    this.historyPosition = this.clothes.positionName === "" ?"无":this.clothes.positionName
    this.queryOperationArray()
    this.queryPositionIdsByShop(this.clothes.shopId)
  }
  , data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      clothes: {},
      clothesNameText: "",
      clothesName: "",
      operationShowPicker: false,
      historyPosition:"",
      operationId: "",
      operationText: "",
      operationArray: [],
      positionShowPicker: false,
      positionId: "",
      clothesPositionText: "",
      positionColumnsArray: [],

      remark: "",


      createDate: this.$dateUtils.vantDateToYMD(new Date())
    }
  }
  , components: {
    baseNavBar
  }
  , methods: {
    addClothesOperation: function (data) {
      data.operationId = this.operationId
      data.positionId = this.positionId
      data.shopId = this.clothes.shopId
      data.tenantCrop = this.tenantCrop
      data.clothesId = this.clothes.clothesId
      data.localShopId = this.clothes.shopId
      data.localPositionId = this.clothes.positionId
      data.empId = localStorage.getItem("empId")
      this.$dialog.confirm({
        title: '出样陈列',
        message: '是否将' + data.clothesName + "移动到" + this.clothesPositionText,
      }).then(() => {
        this.$axios({
          method: "PUT",
          url: "/clothesOperation/addClothesOperation",
          params: data
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("出样陈列成功")
            const that = this
            setTimeout(function () {
              that.$router.go(-2)
            }, 1000)
          } else {
            this.$toast.fail(response.data.code);
          }
        })
      })
    }
    , queryOperationArray: function () {
      this.$selectUtils.queryOperationIds(this.$selectUtils.Picker).then(response => {
        const data = JSON.parse(response.data.data)
        this.operationArray.push(...data)
        if (data.length > 0) {
          this.operationText = data[0].text;
          this.operationId = data[0].id;
        }
      })
    }
    , operationOnConfirm: function (value) {
      this.operationText = value.text
      this.operationId = value.id
      this.operationShowPicker = false
    }
    , queryPositionIdsByShop: function (shop) {
      if (shop === ""){
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
          this.clothes.shopId = response.data.data.shopId
          this.queryPositionIdsByShop(response.data.data.shopId)
        })
      }
      this.$selectUtils.queryPositionIdsByShop(shop, this.$selectUtils.Picker).then(response => {
        this.positionColumnsArray = JSON.parse(response.data.data)
      })
    }
    , positionOnConfirm: function (value) {
      this.clothesPositionText = value.text
      this.positionId = value.id
      this.clothes.positionName = value.text
      this.positionShowPicker = false
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
