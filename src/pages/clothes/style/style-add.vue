<template>
  <div>
    <baseNavBar title="款式添加"/>
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
          :value="styleNameText"
          readonly
          label="款式名称"
          placeholder="查询款式名称"
          :rules="[{ required: true }]">
      </van-field>


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
      <van-calendar v-model="createDateShowPicker" @confirm="createDateOnConfirm"/>
      <van-field
          class="msg"
          name="styleFit"
          v-model="styleFit"
          rows="1"
          autosize
          label="适合身形"
          type="textarea"
          placeholder="请输入适合身形"
      />
      <van-field
          class="msg"
          name="styleNoFit"
          v-model="styleNoFit"
          rows="1"
          autosize
          label="不适合身形"
          type="textarea"
          placeholder="请输入不适合身形"
      />
      <van-field
          class="msg"
          name="factoryName"
          v-model="factoryName"
          rows="1"
          autosize
          label="工厂来源"
          type="textarea"
          placeholder="请输入工厂来源"
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
  name: "styleAdd",
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
      //创建日期
      purchaseDate: "",
      //日期选择框展示
      createDateShowPicker: false,
      //适合身形
      styleFit: "",
      //不适合身形
      styleNoFit: "",
      //工厂信息
      factoryName: "",

    }
  },
  created() {
    this.queryStyleIds()
  },
  components: {
    baseNavBar
  },
  methods: {
    queryStyleIds: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.Picker).then(response => {
        this.styleColumnsArray = JSON.parse(response.data.data)
      })
    }
    , styleOnConfirm: function (value) {
      this.styleType = value.id
      this.styleTypeText = value.text
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
    , addStyleSubmit(data) {
      data.styleType = this.styleType
      console.log(data)
      this.$dialog.confirm({
        title: '添加款式',
        message: '确定要添加该款式吗？',
      }).then(() => {
        data.tenantCrop = this.tenantCrop
        this.$axios({
          method: "POST",
          url: "/style/saveStyle",
          params: data
        }).then((response) => {
          if (response.data.code === 200) {
            this.$dialog.confirm({
              title: '添加成功',
              message: '是否跳转款式列表查看?',
            }).then(() => {
              this.$router.replace({name: "styleList"})
            })
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })

    }
    , createDateOnConfirm: function (time) {
      this.purchaseDate = this.$dateUtils.vantDateToYMD(time);
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
  width: 90%;
  position: absolute;
  bottom: 10%;
  left: 5%;
  margin: 0 auto;
}
</style>
