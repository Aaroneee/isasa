<template>
  <div>
    <baseNavBar title="预约添加"/>
    <van-field
        readonly
        v-model="customer.name"
        label="客户名"
        placeholder="客户名"
    />
    <van-field
        readonly
        v-model="customer.phone"
        label="手机号"
        placeholder="手机号"
    />
    <van-field
        readonly
        v-model="customer.weChat"
        label="微信号"
        placeholder="微信号"
    />
    <van-form @submit="addAppointSubmit">
      <van-field
          readonly
          clickable
          name="createDate"
          :value="createDate"
          label="预约日期"
          placeholder="点击选择预约日期"
          @click="createDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="createDateShowPicker" :min-date="minDate" :max-date="maxDate"
                    @confirm="createDateOnConfirm"/>

      <van-field
          readonly
          clickable
          name="appointDate"
          :value="appointDate"
          label="到店日期"
          placeholder="点击选择到店日期"
          @click="appointDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="appointDateShowPicker" :min-date="minDate" :max-date="maxDate" @confirm="appointDateOnConfirm"/>

      <van-field
          name="appointTime"
          readonly
          :value="appointTime"
          label="到店时间"
          placeholder="点击选择到店时间"
          @click="appointTimeShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="appointTimeShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="appointTimeColumns"
            @confirm="appointTimeOnConfirm"
            @cancel="appointTimeShowPicker = false"
        />
      </van-popup>

      <van-field
          name="inviter"
          readonly
          :value="inviterText"
          label="预约人"
          placeholder="点击选择预约人"
          @click="inviterShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="inviterShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="inviterArray"
            @confirm="inviterOnConfirm"
            @cancel="inviterShowPicker = false"
        />
      </van-popup>

      <van-field
          readonly
          clickable
          name="appointDress"
          :value="appointDressText"
          label="礼服师"
          placeholder="点击选择礼服师"
          @click="appointDressPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="appointDressPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="appointDressArray"
            @confirm="appointDressOnConfirm"
            @cancel="appointDressPicker = false"
        />
      </van-popup>

      <van-field
          readonly
          clickable
          name="appointCosmetics"
          :value="appointCosmeticsText"
          label="化妆师"
          placeholder="点击选择化妆师"
          @click="appointCosmeticsPicker = true"
      />
      <van-popup v-model="appointCosmeticsPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="appointCosmeticsArray"
            @confirm="appointCosmeticsOnConfirm"
            @cancel="appointCosmeticsPicker = false"
        />
      </van-popup>

      <van-field
          name="appointName"
          readonly
          :value="appointNameText"
          label="预约项目"
          placeholder="点击选择预约项目"
          @click="appointNameShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="appointNameShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="appointNameArray"
            @confirm="appointNameOnConfirm"
            @cancel="appointNameShowPicker = false"
        />
      </van-popup>

      <van-field
          name="appointShop"
          readonly
          :value="appointShopText"
          label="预约店铺"
          placeholder="点击选择预约店铺"
          @click="appointShopShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="appointShopShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="appointShopArray"
            @confirm="appointShopOnConfirm"
            @cancel="appointShopShowPicker = false"
        />
      </van-popup>

      <van-field
          readonly
          name="appointCity"
          :value="appointCity"
          label="预约城市"
          placeholder="点击选择预约店铺"
          :rules="[{ required: true }]"
      />
      <van-field
          class="msg"
          name="appointRemark"
          v-model="appointRemark"
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
  name: "app_add",
  data() {
    return {
      customer: {},
      createDate: this.$dateUtils.vantDateToYMD(new Date()),

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      appointDate: "",
      appointTime: "",

      inviter: "",
      inviterText: "",
      inviterArray: [],

      appointDress: "",
      appointDressText: "",
      appointDressArray: [],

      appointCosmeticsText: "",
      appointCosmetics: "",
      appointCosmeticsArray: [],

      appointName: "",
      appointNameText: "",
      appointNameArray: [],

      appointShop: "",
      appointShopText: "",
      appointShopArray: [],

      appointCity: "",

      appointRemark: "",


      createDateShowPicker: false,
      appointDateShowPicker: false,
      appointTimeShowPicker: false,
      appointTimeColumns: appointTime,
      inviterShowPicker: false,
      appointDressPicker: false,
      appointCosmeticsPicker: false,
      appointNameShowPicker: false,
      appointShopShowPicker: false,
      tenantCrop: localStorage.getItem("tenantCrop"),



      //售后状态
      state:"",
      stateText:"",
      stateShowPicker:false,
      stateFlag: 1, //1 售前 2 售后
      stateArray:false,

      dress:"",
      cosmetics:"",

    }
  },
  components: {
    baseNavBar: baseNavBar
  },
  created() {
    this.customer = this.$route.query;
    this.queryInviterIds();
    this.queryAppointDress();
    this.queryAppointCosmetics();
    this.ifStateType()
    this.queryShopIds();

  },
  methods: {
    //预约日期
    createDateOnConfirm: function (time) {
      this.createDate = this.$dateUtils.vantDateToYMD(time);
      this.createDateShowPicker = false;

    },
    //到店日期
    appointDateOnConfirm: function (time) {
      this.appointDate = this.$dateUtils.vantDateToYMD(time);
      this.appointDateShowPicker = false;
    },
    //到店时间
    appointTimeOnConfirm: function (value) {
      this.appointTime = value.text;
      this.appointTimeShowPicker = false;
    },
    //预约人
    inviterOnConfirm: function (value) {
      this.inviterText = value.text;
      this.inviter = value.id;
      this.inviterShowPicker = false;
    },
    //礼服师确认
    appointDressOnConfirm: function (value) {
      this.appointDress = value.id;
      this.appointDressText = value.text;
      this.appointDressPicker = false;
    },
    //化妆师
    appointCosmeticsOnConfirm: function (value) {
      this.appointCosmetics = value.id;
      this.appointCosmeticsText = value.text;
      this.appointCosmeticsPicker = false;
    },
    //客资状态
    stateArrayOnConfirm:function (value){
      this.state = value.id
      this.stateText = value.text
      this.stateShowPicker = false
    },
    //预约项目
    appointNameOnConfirm: function (value) {
      this.appointNameText = value.text;
      this.appointName = value.id;
      this.appointNameShowPicker = false;
    },
    //查询店铺
    appointShopOnConfirm: function (value) {
      this.appointShopText = value.text;
      this.appointShop = value.id;
      this.appointShopShowPicker = false;
      //查询店铺所在的城市
      this.queryCityByShopIds(value.id);
    },


    addAppointSubmit: function (values) {
      values.cusId = this.customer.id;
      values.inviter = this.inviter;
      values.appointName = this.appointName;
      values.appointShop = this.appointShop;
      values.type = "售前预约";
      values.tenantCrop = this.tenantCrop;
      values.appointDress=this.appointDress;
      values.appointCosmetics=this.appointCosmetics;
      if (this.stateFlag===2){
        values.type = "售后预约";
        if (this.dress!==""){
          values.appointDress = this.dress
        }
        if (this.cosmetics!==""){
          values.appointCosmetics = this.cosmetics
        }
      }
      this.$dialog.confirm({
        title: '添加预约',
        message: '是否确认给该条客资添加预约?',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/appoint/saveAppoint",
          params: values
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("添加预约成功")
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


    //查询预约人
    queryInviterIds: function () {
      this.$selectUtils.queryEmpIds(this.$selectUtils.Picker).then(response => {
        this.inviterArray = JSON.parse(response.data.data);
      })
    },
    queryStateIds:function (){
      let noState=["已订单","已交接","二次预约转订单"]
      this.$selectUtils.queryStateIds(this.$selectUtils.Picker,"售后状态").then(response=>{
        let data = JSON.parse(response.data.data)
        this.stateArray = data.filter(k=>!noState.includes(k.text))
      })
    },
    //查询礼服师
    queryAppointDress: function () {
      this.$selectUtils.queryDressIds(
          this.$selectUtils.Picker
      ).then(response => {
        this.appointDressArray = JSON.parse(response.data.data);
      })
    },
    //查询化妆师
    queryAppointCosmetics: function () {
      this.$selectUtils.queryCosmeticsIds(
          this.$selectUtils.Picker
      ).then(response => {
        this.appointCosmeticsArray = JSON.parse(response.data.data);
      })
    },
    //查询预约项目
    queryProjectsIds: function () {
      this.$axios({
          method: "GET",
          url: "/select/appProjects",
          params: {
            tenantCrop: localStorage.getItem("tenantCrop"),
            type: this.$selectUtils.Picker,
            projectsType: this.$projectsType.appoint,
            preAfterSale: this.stateFlag,
          }
      }).then(response => {
        this.appointNameArray = JSON.parse(response.data.data);
      })
    },
    //查询店铺
    queryShopIds: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.Picker).then(response => {
        this.appointShopArray = JSON.parse(response.data.data);
      })
    },
    //根据店铺查询城市
    queryCityByShopIds: function (id) {
      this.$selectUtils.queryCityByShopIds(id).then(response => {
        this.appointCity = response.data.msg;
      })
    },
    saleAppDefaultDressAndCosmetics:function (){
      this.$axios({
        method:"GET",
        url:"order/saleAppDefaultDressAndCosmetics",
        params:{
          cusId:this.customer.id
        }
      }).then(response=>{
        let data = response.data.data
        let dressArray=this.appointDressArray.find(k=>k.id===data.dress);
        if (dressArray!==undefined){
          this.appointDress = dressArray.id;
          this.appointDressText=dressArray.text;
        }
        let cosmeticsArray=this.appointCosmeticsArray.find(k=>k.id===data.cosmetics);
        if (cosmeticsArray!==undefined){
          this.appointCosmetics = cosmeticsArray.id;
          this.appointCosmeticsText=cosmeticsArray.text;
        }
      })
    },
    ifStateType:function (){
      this.$axios({
        method:"get",
        url:"state/getById",
        params:{
          id:this.customer.stateId,
        }
      }).then(response=>{
        var data = response.data.data;
        if (data.stateType === "售后状态"){
          this.stateFlag = 2
          this.queryStateIds()
          this.saleAppDefaultDressAndCosmetics()
        }
        this.queryProjectsIds();
      })
    }
  }

}
const appointTime = [
  {text: "06:00", id: "06:00"},
  {text: "07:00", id: "07:00"},
  {text: "08:00", id: "08:00"},
  {text: "08:30", id: "08:30"},
  {text: "09:00", id: "09:00"},
  {text: "09:30", id: "09:30"},
  {text: "10:00", id: "10:00"},
  {text: "10:30", id: "10:30"},
  {text: "11:00", id: "11:00"},
  {text: "11:30", id: "11:30"},
  {text: "12:00", id: "12:00"},
  {text: "12:30", id: "12:30"},
  {text: "13:00", id: "13:00"},
  {text: "13:30", id: "13:30"},
  {text: "14:00", id: "14:00"},
  {text: "14:30", id: "14:30"},
  {text: "15:00", id: "15:00"},
  {text: "15:30", id: "15:30"},
  {text: "16:00", id: "16:00"},
  {text: "16:30", id: "16:30"},
  {text: "17:00", id: "17:00"},
  {text: "17:30", id: "17:30"},
  {text: "18:00", id: "18:00"},
  {text: "18:30", id: "18:30"},
  {text: "19:00", id: "19:00"},
  {text: "19:30", id: "19:30"},
  {text: "20:00", id: "20:00"},
  {text: "20:30", id: "20:30"},
  {text: "21:00", id: "21:00"},
]
</script>

<style scoped>

</style>
