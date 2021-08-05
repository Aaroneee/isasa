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
          label="款式编号"
          placeholder="查询款式名称"
          :rules="[{ required: true }]">
      </van-field>

      <van-field
          name="styleAlias"
          v-model = "style.styleAlias"
          readonly
          label="款式名称"
          placeholder="款式名称">
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
      <van-calendar v-model="createDateShowPicker" :default-date="new Date(style.purchaseDate)" :min-date="minDate" :max-date="maxDate" @confirm="createDateOnConfirm"/>
      <van-field
          readonly
          label="款式品牌"
          placeholder="点击选择品牌"
          clickable
          name="brand"
          :value="brand"
          @click="showPicker = true"
      />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
            show-toolbar
            :columns="brandArray"
            @cancel="showPicker = false"
            @confirm="brandConfirm"
            :default-index="this.style.brandId - 1"
        />
      </van-popup>
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
                     @click="pushStyleLabel(item.value,item.name)"
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
      brand:"",
      showPicker: false,
      brandArray:[],
      brandId:0,

      styleLabelShowPicker: false,
      styleLabelsText: "",
      styleLabelsTextArray: [],
      styleLabelList: [],
      styleLabels: [],
      finalStyleLabels:[],

    }
  },
  created() {
    this.style = this.$route.query
    this.brand = this.style.brandName
    this.styleType = this.$route.query.styleType
    this.queryStyleIds()
    this.queryBrands()
    this.queryStyleLabelList();

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
      data.brandId = this.brandId
      for (let temp in this.styleLabelList) {
        var index = this.styleLabelList[temp].value
        if (this.styleLabels[index] == 1) {
          this.finalStyleLabels.push(index)
        }
      }
      data.styleLabels = this.finalStyleLabels.toString()
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
    },
    //查询品牌列表
    queryBrands: function () {
      this.$selectUtils.queryBrandIds(this.$selectUtils.Picker).then(response=>{
        this.brandArray = JSON.parse(response.data.data);
      })
    },
    brandConfirm: function (value,index) {
      this.brand = value.text;
      this.brandId = value.id;
      this.showPicker = false;
    },
    queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
        for (let temp in this.styleLabelList) {
          var index = this.styleLabelList[temp].value
          this.styleLabels[index] = 0
        }
        let temp = this.style.styleLabels
        const orStyleLabels = temp.split(",");
        for (const flag of orStyleLabels) {
          this.$set(this.styleLabels, flag, 1)
        }
      })
    },
    pushStyleLabel: function (value) {
      this.$set(this.styleLabels, value,
          this.styleLabels[value] === 1?0:1
      )
    },
    close: function (value) {
      this.$set(this.styleLabels, value, 0)
    },
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
