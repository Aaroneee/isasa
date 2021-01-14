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
          name="source"
          :value="sourceText"
          label="来源渠道"
          placeholder="点击选择来源渠道"
          @click="sourceShowPicker = true"
          :rules="[{ required: true}]"
      />
      <van-popup v-model="sourceShowPicker" round position="bottom">
        <van-picker
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
          :value="customer.createDate"
          label="对接日期"
          placeholder="点击选择对接日期"
          @click="createDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="createDateShowPicker" @confirm="createDateOnConfirm"/>
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
          name="service"
          :value="serviceText"
          label="客服"
          placeholder="点击选择客资渠道"
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
  data(){
    return{
      tenantCrop:localStorage.getItem("tenantCrop"),
      id:this.$route.query.cusId,
      customer:{},

      sourceText:"",
      sourceColumns:[],
      sourceShowPicker:false,
      createDateShowPicker:false,

      serviceText:"",
      serviceColumns:[],
      serviceShowPicker:false
    }
  },
  components:{
    baseNavBar
  },
  created() {
    //查询客资
    this.queryCustomerById();

  },
  methods:{
    //根据客资Id查询客资
    queryCustomerById:function (){
      this.axios({
        method:"GET",
        url:"/customer/queryCustomerById",
        params:{
          id:this.id
        }
      }).then(response=>{
        if (response.data.code===200){
          this.customer=response.data.data;
          //查询渠道参数
          this.querySourceColumns();
          //查询客服参数
          this.queryServiceColumns();
        }else {
          this.$toast.fail(response.data.msg);
        }
      })
    },
    //渠道Picker确认
    sourceOnConfirm:function (value){
      this.sourceText = value.text;
      this.source = value.id;
      this.sourceShowPicker = false;
    },
    //交接日期确认
    createDateOnConfirm:function (time){
      this.createDate = this.dateUtils.vantDateToYMD(time);
      this.createDateShowPicker = false;
    },
    //客服Picker确认
    serviceOnConfirm:function (value){
      this.serviceText = value.text;
      this.service = value.id;
      this.serviceShowPicker = false;
    },
    editCustomerSubmit:function (values){
      values.id=this.id;
      values.source = this.source;
      values.service = this.service;
      values.tenantCrop = this.tenantCrop;
      this.$dialog.confirm({
        title: '修改客资',
        message: '是否确认修改该条客资?',
      }).then(() => {
        this.$axios({
          method:"PUT",
          url:"/customer/updateCustomer",
          params:values
        }).then(response=>{
          response.data.code===200?this.$toast.success("添加成功"):this.$toast.fail(response.data.msg);
        })
      })

    },
    //查询渠道
    querySourceColumns: function () {
      this.$selectUtils.querySourceIds(this.$selectUtils.picker).then(response=>{
        if (response.data.code !== 200){
          this.$toast.fail(response.data.msg);
          return;
        }
        this.sourceColumns = response.data.data;
        let value=this.sourceColumns.find(k=>k.id===this.customer.source);
        this.sourceText=value.text;
        this.source=value.id;
      });
    },
    //查询客服
    queryServiceColumns: function () {
      this.$selectUtils.queryServiceIds(this.$selectUtils.picker).then(response=>{
        if (response.data.code !== 200) {
          this.$toast.fail(response.data.msg);
          return;
        }
        this.serviceColumns = response.data.data;
        let value=this.serviceColumns.find(k=>k.id===this.customer.service);
        this.serviceText=value.text;
        this.service=value.id;
      })
    },
  }
}
</script>

<style scoped>

</style>