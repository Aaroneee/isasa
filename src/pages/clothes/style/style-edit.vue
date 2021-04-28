<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式修改"/>
    </van-sticky>
    <van-form scroll-to-error @submit="updateStyleSubmit">
      <van-field
          name="id"
          :value="style.id"
          readonly
          type="hidden"
      />
      <van-field
          name="styleType"
          :value="style.typeName"
          label="款式类型"
          placeholder="点击选择款式类型"
          readonly
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
          v-model = "style.styleName"
          readonly
          label="款式名称"
          placeholder="查询款式名称"
          :rules="[{ required: true }]">
      </van-field>


      <van-field
          readonly
          clickable
          name="purchaseDate"
          :value="style.purchaseDate"
          label="采购日期"
          placeholder="点击选择采购日期"
          @click="createDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="createDateShowPicker" :min-date="minDate" :max-date="maxDate" @confirm="createDateOnConfirm"/>
      <van-field
          class="msg"
          name="styleInfo"
          v-model="style.styleInfo"
          type="textarea"
          label="款式介绍"
          placeholder="款式介绍"
          maxlength="40"
          show-word-limit
      />
      <van-field
          class="msg"
          name="styleFit"
          v-model="style.styleFit"
          label="适合身形"
          placeholder="请输入适合身形"
          type="textarea"
          maxlength="40"
          show-word-limit
      />
      <van-field
          class="msg"
          name="styleNoFit"
          v-model="style.styleNoFit"
          label="不适合身形"
          placeholder="请输入不适合身形"
          type="textarea"
          maxlength="40"
          show-word-limit
      />
      <van-field
          name="factoryName"
          v-model="style.factoryName"
          label="工厂来源"
          onblur="window.scrollTo(0,0)"
          placeholder="请输入工厂来源"
      />

      <van-button
          class="bottom-button"
          color="linear-gradient(to right, #50E64D, #03B300)"
          round block type="primary"
          native-type="submit"

      >
        提交
      </van-button>
    </van-form>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "styleEdit",
  data() {
    return {
      //款式id
      style: {},
      tenantCrop:localStorage.getItem("tenantCrop"),
      styleColumnsArray: [],
      styleShowPicker: false,
      createDateShowPicker: false,

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

    }
  },
  created() {
    this.style = this.$route.query
    this.styleType = this.$route.query.styleType
    this.queryStyleIds()
  },
  components: {
    baseNavBar
  },
  methods: {
    queryStyleIds: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.Picker).then(response => {
        this.styleColumnsArray = JSON.parse(response.data.data);
      })
    }
    , styleOnConfirm: function (value) {
      this.styleType = value.id
      this.style.typeName = value.text
      this.styleShowPicker = false
      this.queryStyleName(value.id).then((response) => {
        var name = response.data.data + "";
        var styleNameLen = name.length
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
    , queryStyleName: function (value) {
      return this.$axios({
        method: "GET",
        url: "/style/queryStyleName",
        params: {
          styleType: value,
          tenantCrop: this.tenantCrop
        }
      })
    }
    , updateStyleSubmit(data) {
      data.styleType = this.styleType
      data.tenantCrop = this.tenantCrop
      console.log(data)
      this.$dialog.confirm({
        title: '修改款式',
        message: '确定要修改该款式吗？',
      }).then(() => {
        data.tenantCrop = this.tenantCrop
        this.$axios({
          method: "PUT",
          url: "/style/editStyle",
          params: data
        }).then((response) => {
          if (response.data.code === 200) {
            this.$toast.success("修改成功")
            const that = this
            setTimeout(function () {
              that.$router.back()
            }, 1000)
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })

    }
    , createDateOnConfirm: function (time) {
      this.style.purchaseDate = this.$dateUtils.vantDateToYMD(time);
      this.createDateShowPicker = false;

    },
    beforeClose: function (action, done) {
      if (action === 'confirm') {
        setTimeout(done, 1000);
      } else {
        done();
      }
    }

  },

}
</script>

<style scoped>
.msg {
  height: 100px;
}

.bottom-button {
  width: 80%;
  margin: 5% auto;
}
</style>
