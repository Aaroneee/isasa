<template>
  <div>
    <baseNavBar title="预约到店"/>
    <van-form @submit="appointArrival">
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
          name="room"
          :value="roomText"
          label="房间名称"
          placeholder="点击选择房间名称"
          @click="roomPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="roomPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="roomArray"
            @confirm="roomOnConfirm"
            @cancel="roomPicker = false"
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
import baseNavBar from "@/components/nav-bar/base-nav-bar"
export default {
  name: "app-arrival",
  data(){
    return{
      appId:this.$route.query.id,
      appoint:{},

      appointDressPicker:false,
      roomPicker:false,

      appointDress:"",
      appointDressText:"",
      appointDressArray:[],

      room:"",
      roomText:"",
      roomArray:[],


    }
  },
  components:{
    baseNavBar
  },
  created() {
    this.queryAppoint();
  },
  methods:{
    //礼服师确认
    appointDressOnConfirm:function (value){
      this.appointDress=value.id;
      this.appointDressText=value.text;
      this.appointDressPicker=false;
    },
    //房间确认
    roomOnConfirm:function (value){
      this.room=value.id;
      this.roomText=value.text;
      this.roomPicker=false;
    },
    appointArrival:function (){
      this.$dialog.confirm({
        title: '预约到店',
        message: '礼服师 : '+this.appointDressText+
            '<br>房间 : '+this.roomText+
            '<br>是否确认分配?',
      }).then(() => {
        this.$axios({
          method:"PUT",
          url:"/appoint/arrivalAppoint",
          params:{
            id:this.appId,
            cusId:this.appoint.cusId,
            appointDress:this.appointDress,
            room:this.room,
          }
        }).then(response=>{
          if (response.data.code!==200){
            this.$toast.fail(response.data.msg)
            return;
          }
          this.$toast.success("到店信息确认成功!")
        })
      })


    },

    //查询预约
    queryAppoint:function (){
      this.$axios({
        method:"GET",
        url:"/appoint/queryAppointById",
        params:{
          id:this.appId
        }
      }).then(response=>{
        if (response.data.code!==200){
          this.$toast.fail(response.data.msg);
          return;
        }
        this.appoint=response.data.data;

        this.queryAppointDress();
        this.queryRoomIdsByShopId();
      })
    },
    //查询礼服师
    queryAppointDress: function () {
      this.$selectUtils.queryDressIds(
          this.$selectUtils.Picker
      ).then(response => {
        this.appointDressArray=JSON.parse(response.data.data);
        this.appointDressText=this.appointDressArray.find(k=>k.id===this.appoint.appointDress).text;
      })
    },
    //查询房间
    queryRoomIdsByShopId:function (){
      if (this.appoint.appointShop===undefined||this.appoint.appointShop===null){
        this.$toast.fail("此预约无店铺,请先给预约分配店铺");
        return;
      }
      this.$selectUtils.queryRoomIdsByShopId(
          this.appoint.appointShop,
          this.$selectUtils.Picker
      ).then(response=>{
        if (response.data.data.length===0){
          this.$toast.fail("此店铺无试纱间,请先添加试纱间");
          return;
        }
        this.roomArray=JSON.parse(response.data.data);
        this.roomText=this.roomArray.find(k=>k.id===this.appoint.room).text;
      })
    }
  },
}
</script>

<style scoped>

</style>
