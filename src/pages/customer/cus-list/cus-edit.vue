<template>
  <div>
    <baseNavBar title="客资编辑"/>
    <van-form @submit="editCustomerSubmit">
      <van-field
          v-model="customer.name"
          name="name"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true}]"
      />
      <van-field
          v-model="customer.phone"
          type="number"
          name="phone"
          label="手机号"
          placeholder="手机号"
      />
      <van-field
          v-model="customer.weChat"
          type="string"
          name="weChat"
          label="微信号"
          placeholder="微信号"
      />
      <van-field
          v-model="customer.city"
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
      <van-popup v-model="sourceShowPicker" round position="bottom" :lazy-render="false" @open="sourceClick">
        <van-picker
            show-toolbar
            :columns="sourceColumns"
            @confirm="sourceOnConfirm"
            @cancel="sourceShowPicker = false"
            ref="sourceDefault"
        />
      </van-popup>
      <van-field
          readonly
          clickable
          name="createDate"
          :value="customer.createDate"
          label="对接日期"
          placeholder="点击选择对接日期"
          @click="createDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="createDateShowPicker" :min-date="minDate" :max-date="maxDate" :default-date="new Date(customer.createDate)"
                    @confirm="createDateOnConfirm"/>
      <van-field
          v-model="customer.weddingDay"
          type="string"
          name="weddingDay"
          label="婚期"
          placeholder="婚期"
      />
      <van-field
          v-model="customer.weddingVenue"
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
      <van-popup v-model="serviceShowPicker" round position="bottom">
        <van-picker
            show-toolbar
            :columns="serviceColumns"
            @confirm="serviceOnConfirm"
            @cancel="serviceShowPicker = false"
        />
      </van-popup>
      <van-field
          class="msg"
          name="remark"
          v-model="customer.remark"
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
  name: "cus-edit",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      id: this.$route.query.cusId,
      customer: {},

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      sourceText: "",
      sourceColumns: [],
      sourceShowPicker: false,
      createDateShowPicker: false,

      serviceText: "",
      serviceColumns: [],
      serviceShowPicker: false,

      remark: "",
    }
  },
  components: {
    baseNavBar
  },
  created() {
    //查询客资
    this.queryCustomerById();

  },
  methods: {
    //根据客资Id查询客资
    queryCustomerById: function () {
      this.$axios({
        method: "GET",
        url: "/customer/queryCustomerById",
        params: {
          id: this.id
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.customer = response.data.data;
          //查询渠道参数
          this.querySourceColumns();
          //查询客服参数
          this.queryServiceColumns();
        } else {
          this.$toast.fail(response.data.msg);
        }
      })
    },
    //渠道Picker确认
    sourceOnConfirm: function (value) {
      if (value[1] === "") {
        this.sourceText = value[0];
        this.source = this.sourceColumns.find(k => k.text === value[0]).id;
      } else {
        this.sourceText = value[1];
        this.source = this.sourceColumns.find(k => k.text === value[0]).children.find(k => k.text === value[1]).id;
      }
      this.sourceShowPicker = false;
    },
    //source默认选中
    sourceClick: function () {
      this.sourceColumns.forEach(va => {
        if (va.id === this.customer.source) {
          this.$refs.sourceDefault.setColumnValue(0, va.text);
          return;
        }
        for (let chili of va.children) {
          if (chili.id === this.customer.source) {
            this.$refs.sourceDefault.setColumnValue(0, va.text);
            this.$refs.sourceDefault.setColumnValue(1, chili.text);
            return;
          }
        }
      })
    },
    //交接日期确认
    createDateOnConfirm: function (time) {
      this.customer.createDate = this.$dateUtils.vantDateToYMD(time);
      this.createDateShowPicker = false;
    },
    //客服Picker确认
    serviceOnConfirm: function (value) {
      this.serviceText = value.text;
      this.service = value.id;
      this.serviceShowPicker = false;
    },
    editCustomerSubmit: function (values) {
      console.log(values)
      values.id = this.id;
      values.source = this.source;
      values.service = this.service;
      values.tenantCrop = this.tenantCrop;
      this.$dialog.confirm({
        title: '修改客资',
        message: '是否确认修改该条客资?',
      }).then(() => {
        this.$axios({
          method: "PUT",
          url: "/customer/updateCustomer",
          params: values
        }).then(response => {
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

    },
    //查询渠道
    querySourceColumns: function () {
      this.$selectUtils.querySourceIds(this.$selectUtils.Picker).then(response => {
        if (response.data.code !== 200) {
          this.$toast.fail(response.data.msg);
          return;
        }
        this.sourceColumns = JSON.parse(JSON.parse(response.data.data));
        this.sourceColumns = this.sourceColumns.map(k => {
          if (k.children === null) {
            k.children = [{text: "", id: k.id}];
            return k;
          }
          return k;
        });
        //赋值
        this.sourceColumns.forEach(va => {
          if (va.id === this.customer.source) {
            this.sourceText = va.text;
            this.source = va.id;
            return;
          }
          for (let chili of va.children) {
            if (chili.id === this.customer.source) {
              this.sourceText = chili.text;
              this.source = chili.id;
              return;
            }
          }
        })
      });
    },
    //查询客服
    queryServiceColumns: function () {
      this.$selectUtils.queryServiceIds(this.$selectUtils.Picker).then(response => {
        if (response.data.code !== 200) {
          this.$toast.fail(response.data.msg);
          return;
        }
        this.serviceColumns = JSON.parse(response.data.data);
        let value = this.serviceColumns.find(k => k.id === this.customer.service);
        this.serviceText = value.text;
        this.service = value.id;
      })
    },
  }
}
</script>

<style scoped>

</style>
