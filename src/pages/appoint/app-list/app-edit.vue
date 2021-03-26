<template>
  <div>
    <baseNavBar title="预约编辑"/>
    <van-form @submit="editAppointSubmit">
      <van-field
          readonly
          clickable
          name="appointDate"
          :value="appoint.appointDate"
          label="到店日期"
          placeholder="点击选择到店日期"
          @click="appointDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="appointDateShowPicker" @confirm="appointDateOnConfirm"/>

      <van-field
          name="appointTime"
          readonly
          :value="appoint.appointTime"
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
          readonly
          name="inviter"
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
          name="appointName"
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
          readonly
          name="appointShop"
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
          :value="appoint.appointCity"
          label="预约城市"
          placeholder="点击选择预约店铺"
          :rules="[{ required: true }]"
      />
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
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "app-edit",
  components:{
    baseNavBar
  },

  data(){
    return{
      appId:this.$route.query.id,
      appoint:{},

      appointDateShowPicker:false,
      appointTimeShowPicker:false,
      appointTimeColumns:appointTime,
      inviterShowPicker:false,
      appointNameShowPicker:false,
      appointShopShowPicker:false,

      inviterText:"",
      inviterArray:[],

      appointNameText:"",
      appointNameArray:[],

      appointShopText:"",
      appointShopArray:[],

    }
  },
  created() {
    this.queryAppoint();
  },
  methods:{
    //到店日期
    appointDateOnConfirm:function (time){
      this.appoint.appointDate=this.dateUtils.vantDateToYMD(time);
      this.appointDateShowPicker=false;
    },
    //到店时间
    appointTimeOnConfirm:function (value){
      this.appoint.appointTime=value.text;
      this.appointTimeShowPicker=false;
    },
    //预约人
    inviterOnConfirm:function (value){
      this.appoint.inviter=value.id;
      this.inviterText=value.text;
      this.inviterShowPicker=false;

    },
    //预约项目
    appointNameOnConfirm:function (value){
      this.appoint.appointName=value.id;
      this.appointNameText=value.text;
      this.appointNameShowPicker=false;
    },
    //店铺
    appointShopOnConfirm:function (value){
      this.appointShopText=value.text;
      this.appoint.appointShop=value.id;
      this.appointShopShowPicker=false;
      //查询店铺所在的城市
      this.queryCityByShopIds(value.id);
    },
    editAppointSubmit:function (){
      console.log(this.appoint);
      this.$dialog.confirm({
        title: '修改客资',
        message: '是否确认修改该条客资?',
      }).then(() => {
        this.axios({
          method:"POST",
          url:"/appoint/editAppoint",
          params:this.appoint
        }).then(response=>{
          if (response.data.code!==200){
            this.$toast.fail(response.data.msg);
            return
          }
          this.$toast.success("修改成功")
        })
      })
    },


    queryAppoint:function (){
      this.$axios({
        method:"GET",
        url:"/appoint/queryAppointById",
        params:{
          id:this.appId
        }
      }).then(response=>{
        if (response.data.code!==200){
          this.$toast.fail(response.data.msg); return;
        }
        this.appoint=response.data.data;
        this.queryInviterIds();
        this.queryProjectsIds();
        this.queryShopIds();
      })
    },
    //查询预约人
    queryInviterIds:function (){
      this.$selectUtils.queryEmpIds(this.$selectUtils.Picker).then(response=>{
        this.inviterArray=JSON.parse(response.data.data);
        this.inviterText=this.inviterArray.find(k=>k.id===this.appoint.inviter).text;
      })
    },
    //查询预约项目
    queryProjectsIds:function (){
      this.$selectUtils.queryProjectsIds(this.$projectsType.appoint,this.$selectUtils.Picker).then(response=>{
        this.appointNameArray=JSON.parse(response.data.data);
        this.appointNameText=this.appointNameArray.find(k=>k.id===this.appoint.appointName).text;
      })
    },
    //查询店铺
    queryShopIds:function (){
      this.$selectUtils.queryShopIds(this.$selectUtils.Picker).then(response=>{
        this.appointShopArray=JSON.parse(response.data.data);
        this.appointShopText=this.appointShopArray.find(k=>k.id===this.appoint.appointShop).text;
      })
    },
    //根据店铺查询城市
    queryCityByShopIds:function (id){
      this.$selectUtils.queryCityByShopIds(id).then(response=>{
        this.appoint.appointCity=JSON.parse(response.data.msg);
      })
    },
  },

}

const appointTime=[
  {text:"06:00",id:"06:00"},
  {text:"07:00",id:"07:00"},
  {text:"08:00",id:"08:00"},
  {text:"08:30",id:"08:30"},
  {text:"09:00",id:"09:00"},
  {text:"09:30",id:"09:30"},
  {text:"10:00",id:"10:00"},
  {text:"10:30",id:"10:30"},
  {text:"11:00",id:"11:00"},
  {text:"11:30",id:"11:30"},
  {text:"12:00",id:"12:00"},
  {text:"12:30",id:"12:30"},
  {text:"13:00",id:"13:00"},
  {text:"13:30",id:"13:30"},
  {text:"14:00",id:"14:00"},
  {text:"14:30",id:"14:30"},
  {text:"15:00",id:"15:00"},
  {text:"15:30",id:"15:30"},
  {text:"16:00",id:"16:00"},
  {text:"16:30",id:"16:30"},
  {text:"17:00",id:"17:00"},
  {text:"17:30",id:"17:30"},
  {text:"18:00",id:"18:00"},
  {text:"18:30",id:"18:30"},
  {text:"19:00",id:"19:00"},
  {text:"19:30",id:"19:30"},
  {text:"20:00",id:"20:00"},
  {text:"20:30",id:"20:30"},
  {text:"21:00",id:"21:00"},
]
</script>

<style scoped>

</style>
