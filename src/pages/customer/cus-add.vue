<template>
  <div>
    <baseNavBar title="客资添加"/>
    <van-form @submit="addCustomerSubmit">
      <van-field
          v-model="name"
          name="name"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true}]"
      />
      <van-field
          v-model="phone"
          type="number"
          name="phone"
          label="手机号"
          placeholder="手机号"
      />
      <van-field
          v-model="weChat"
          type="string"
          name="weChat"
          label="微信号"
          placeholder="微信号"
      />
      <van-field
          v-model="city"
          type="string"
          name="city"
          label="客户所在城市"
          placeholder="客户所在城市"
      />
      <van-field
          readonly
          name="source"
          :value="sourceText"
          label="来源渠道"
          placeholder="点击选择来源渠道"
          @click="sourceShowPicker = true"
          :rules="[{ required: true}]"
      />
      <van-popup v-model="sourceShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="sourceColumns"
            @confirm="sourceOnConfirm"
            @cancel="sourceShowPicker = false"
        />
      </van-popup>
      <van-field
          readonly
          clickable
          name="createDate"
          :value="createDate"
          label="对接日期"
          placeholder="点击选择对接日期"
          @click="createDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="createDateShowPicker" :min-date="minDate" :max-date="maxDate"
                    @confirm="createDateOnConfirm"/>
      <van-field
          v-model="weddingDay"
          type="string"
          name="weddingDay"
          label="婚期"
          placeholder="婚期"
      />
      <van-field
          v-model="weddingVenue"
          type="string"
          name="weddingVenue"
          label="婚礼地点"
          placeholder="婚礼地点"
      />
      <van-field
          readonly
          name="service"
          :value="serviceText"
          label="客服"
          placeholder="点击选择客服"
          @click="serviceShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="serviceShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="serviceColumns"
            @confirm="serviceOnConfirm"
            @cancel="serviceShowPicker = false"
        />
      </van-popup>
      <van-field
          class="msg"
          name="remark"
          v-model="remark"
          type="textarea"
          label="备注"
          placeholder="备注"
          maxlength="40"
          show-word-limit
      />
      <br>
      <br>
      <br>
      <br>
      <van-row>
        <van-col span="14" offset="5">
          <van-button round block type="primary" native-type="submit">提交</van-button>
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>
<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "cus-add",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      name: "",
      phone: "",
      weChat: "",
      city: "",

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      //展示来源文本
      sourceText: "",
      //保存来源Id
      source: "",
      sourceColumns: [],
      sourceShowPicker: false,

      createDate: this.$dateUtils.vantDateToYMD(new Date()),
      createDateShowPicker: false,

      weddingDay: "",
      weddingVenue: "",

      serviceText: "",
      service: "",
      serviceColumns: [],
      serviceShowPicker: false,
      remark: "",
    }
  },
  components: {
    baseNavBar: baseNavBar
  },
  created() {
    this.querySourceColumns();
    this.queryServiceColumns();
  },
  methods: {
    //渠道选择器确认
    sourceOnConfirm: function (value) {
      if (value[1] === "") {
        this.sourceText = value[0];
        this.source = this.sourceColumns.find(k => k.text === value[0]).id;
      } else {
        this.sourceText = value[1];
        let children = this.sourceColumns.find(k => k.text === value[0]).children;
        this.source = children.find(k => k.text === value[1]).id;
      }
      this.sourceShowPicker = false;
    },
    //对接日期选择器确认
    createDateOnConfirm: function (time) {
      this.createDate = this.$dateUtils.vantDateToYMD(time);
      this.createDateShowPicker = false;
    },
    //客服选择器确认
    serviceOnConfirm: function (value) {
      this.serviceText = value.text;
      this.service = value.id;
      this.serviceShowPicker = false;
    },
    //添加客资
    addCustomerSubmit: function (values) {
      values.source = this.source;
      values.service = this.service;
      values.tenantCrop = this.tenantCrop;
      this.$dialog.confirm({
        title: '添加客资',
        message: '是否确认添加客资?',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/customer/saveCustomer",
          params: values
        }).then(response => {
          if (response.data.code === 200) {
            this.$dialog.confirm({
              title: '添加成功',
              message: '是否跳转客资列表查看',
            }).then(() => {
              this.$router.replace({name: "cusList"})
            })
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })

    },

    //查询渠道
    querySourceColumns: function () {
      this.$selectUtils.querySourceIds(this.$selectUtils.Picker).then(response => {
        this.sourceColumns = JSON.parse(JSON.parse(response.data.data));
        this.sourceColumns = this.sourceColumns.map(k => {
          if (k.children === null) {
            k.children = [{text: "", id: k.id}];
            return k;
          }
          return k;
        });
      })
    },
    //查询客服
    queryServiceColumns: function () {
      this.$selectUtils.queryServiceIds(this.$selectUtils.Picker).then(response => {
        this.serviceColumns = JSON.parse(response.data.data);
      })
      this.$roleUtils.ifService().then(response => {
        let flag = response.data.data
        if (flag) {
          this.serviceColumns.find(s => {
            if (s.id == localStorage.getItem("empId")){
              this.service = s.id
              this.serviceText = s.text
            }
          })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
