<template>
   <div>
     <baseNavBar title="售后预约添加"/>
     <van-field label="客户名" readonly v-model="order.name"/>
     <van-form @submit="submit">
       <van-field v-model="appoint.createDate"
                  label="预约日期"
                  required
                  readonly
                  :rules="[{ required: true }]"
                  placeholder="请选择预约日期"
                  @click="createDateShowPicker = true"/>
       <van-calendar v-model="createDateShowPicker" @confirm="createDateOnConfirm"/>
       <van-field v-model="appoint.appointDate"
                  label="到店日期"
                  required
                  readonly
                  :rules="[{ required: true }]"
                  placeholder="请选择到店日期"
                  @click="appointDateShowPicker = true"/>
       <van-calendar v-model="appointDateShowPicker" @confirm="appointDateOnConfirm"/>
       <van-field v-model="appoint.appointTime"
                  label="到店时间"
                  required
                  readonly
                  placeholder="请选择到店时间"
                  @click="appointTimeShowPicker = true"
                  :rules="[{ required: true }]"/>
       <van-popup v-model="appointTimeShowPicker" position="bottom">
         <van-picker
             getColumnValues
             show-toolbar
             :columns="appointTimeColumns"
             @confirm="appointTimeOnConfirm"
             @cancel="appointTimeShowPicker = false"
         />
       </van-popup>
       <van-field label="预约项目"
                  v-model="appointNameText"
                  required
                  readonly
                  placeholder="请选择预约项目"
                  @click="appointNameShowPicker = true"
                  :rules="[{ required: true }]"/>
       <van-popup v-model="appointNameShowPicker" position="bottom">
         <van-picker
             getColumnValues
             show-toolbar
             :columns="appointNameArray"
             @confirm="appointNameOnConfirm"
             @cancel="appointNameShowPicker = false"
         />
       </van-popup>
       <van-field label="预约人"
                  v-model="inviterText"
                  required
                  readonly
                  @click="inviterShowPicker = true"
                  placeholder="请选择预约人"
                  :rules="[{ required: true }]"/>
       <van-popup v-model="inviterShowPicker" position="bottom">
         <van-picker
             getColumnValues
             show-toolbar
             :columns="inviterArray"
             @confirm="inviterOnConfirm"
             @cancel="inviterShowPicker = false"
         />
       </van-popup>
       <van-field label="预约店铺"
                  v-model="appointShopText"
                  required
                  readonly
                  placeholder="请选择预约店铺"
                  @click="appointShopShowPicker = true"
                  :rules="[{ required: true }]"/>
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
           class="msg"
           name="appointRemark"
           v-model="appoint.appointRemark"
           type="textarea"
           label="备注"
           placeholder="备注"
           maxlength="40"
           show-word-limit
       />
       <van-row style="margin-top: 20px">
         <van-col span="22" offset="1">
           <van-button
               color="linear-gradient(to right, #50E64D, #03B300)"
               class="bottom-button"
               round block
               type="primary"
               native-type="submit">提交
           </van-button>
         </van-col>
       </van-row>
     </van-form>
   </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "after-sale-app-add",
  components: {
    baseNavBar
  },
  created() {
    console.log(this.order)
    this.queryInviterIds()
    this.queryProjectsIds()
    this.queryShopIds()
  },
  data() {
    return {
      order: this.$route.query,
      appoint: {
        createDate: this.$dateUtils.vantDateToYMD(new Date()),
        appointDate: "",
        appointTime: "",
        appointName: "",
        inviter: "",
        appointShop: "",
        appointRemark: "",
        tenantCrop: localStorage.getItem("tenantCrop")
      },
      inviterArray: [],
      inviterShowPicker: false,
      inviterText: "",
      createDateShowPicker: false,
      appointDateShowPicker: false,
      appointTimeColumns: appointTime,
      appointTimeShowPicker: false,
      appointNameArray: [],
      appointNameShowPicker: false,
      appointNameText: "",
      appointShopArray: [],
      appointShopText: "",
      appointShopShowPicker: false,
    }
  },
  methods: {
    submit() {
      this.appoint.type = "售后预约"
      this.appoint.cusId = this.order.cusId
      this.$axios({
        method: "POST",
        url: "/appoint/saveAppoint",
        params: {
          ...this.appoint
        }
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
    },
    // 查询预约人
    queryInviterIds: function () {
      this.$selectUtils.queryEmpIds(this.$selectUtils.Picker).then(response => {
        this.inviterArray = JSON.parse(response.data.data);
        this.appoint.inviter = localStorage.getItem("empId")
        this.inviterText = this.inviterArray.find(s => s.id === Number(this.appoint.inviter)).text
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
          preAfterSale: 2,
        }
      }).then(response => {
        this.appointNameArray = JSON.parse(response.data.data);
      })
    },
    //查询店铺
    queryShopIds() {
      this.$selectUtils.queryShopIds(this.$selectUtils.Picker).then(response => {
        this.appointShopArray = JSON.parse(response.data.data);
        this.appoint.appointShop = this.appointShopArray[0].id
        this.appointShopText = this.appointShopArray[0].text
      })
    },
    createDateOnConfirm(val) {
      this.appoint.createDate = this.$dateUtils.vantDateToYMD(val)
      this.createDateShowPicker = false
    },
    appointDateOnConfirm(val) {
      this.appoint.appointDate = this.$dateUtils.vantDateToYMD(val)
      this.appointDateShowPicker = false
    },
    appointTimeOnConfirm(val) {
      this.appoint.appointTime = val.text
      this.appointTimeShowPicker = false
    },
    appointNameOnConfirm(value) {
      this.appointNameText = value.text
      this.appoint.appointName = value.id
      this.appointNameShowPicker = false
    },
    inviterOnConfirm(value) {
      this.inviterText = value.text
      this.appoint.inviter = value.id
      this.inviterShowPicker = false
    },
    appointShopOnConfirm(value) {
      this.appointShopText = value.text;
      this.appoint.appointShop = value.id;
      this.appointShopShowPicker = false;
    },
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