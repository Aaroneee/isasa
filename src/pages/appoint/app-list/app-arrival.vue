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
  data() {
    return {
      appId: this.$route.query.id,
      appoint: {},

      appointDressPicker: false,
      appointCosmeticsPicker: false,
      roomPicker: false,

      appointDress: "",
      appointDressText: "",
      appointDressArray: [],

      appointCosmeticsText: "",
      appointCosmetics: "",
      appointCosmeticsArray: [],


      room: "",
      roomText: "",
      roomArray: [],


    }
  },
  components: {
    baseNavBar
  },
  created() {
    this.queryAppoint();
  },
  methods: {
    //礼服师确认
    appointDressOnConfirm: function (value) {
      this.appointDress = value.id;
      this.appointDressText = value.text;
      this.appointDressPicker = false;
    },
    //房间确认
    roomOnConfirm: function (value) {
      this.room = value.id;
      this.roomText = value.text;
      this.roomPicker = false;
    },
    //化妆师
    appointCosmeticsOnConfirm: function (value) {
      this.appointCosmetics = value.id;
      this.appointCosmeticsText = value.text;
      this.appointCosmeticsPicker = false;
    },
    appointArrival: function () {
      this.$dialog.confirm({
        title: '预约到店',
        message: '礼服师 : ' + this.appointDressText +
            '<br>房间 : ' + this.roomText +
            '<br>是否确认分配?',
      }).then(() => {
        this.$axios({
          method: "PUT",
          url: "/appoint/arrivalAppoint",
          params: {
            id: this.appId,
            cusId: this.appoint.cusId,
            appointDress: this.appointDress,
            appointCosmetics: this.appointCosmetics,
            room: this.room,
            appState: this.appoint.appState,
          }
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

    //查询预约
    queryAppoint: function () {
      this.$axios({
        method: "GET",
        url: "/appoint/queryAppointById",
        params: {
          id: this.appId
        }
      }).then(response => {
        if (response.data.code !== 200) {
          this.$toast.fail(response.data.msg);
          return;
        }
        this.appoint = response.data.data;
        this.appointDress = this.appoint.appointDress
        this.room = this.appoint.room
        this.queryAppointDress();
        this.queryRoomIdsByShopId();
        this.queryAppointCosmetics();
      })
    },
    //查询礼服师
    queryAppointDress: function () {
      this.$selectUtils.queryDressIds(
          this.$selectUtils.Picker
      ).then(response => {
        this.appointDressArray = JSON.parse(response.data.data);
        if (this.appoint.appointDress !== "") {
          this.appointDressText = this.appointDressArray.find(k => k.id === this.appoint.appointDress).text;
        }
      })
    },
    //查询化妆师
    queryAppointCosmetics: function () {
      this.$selectUtils.queryCosmeticsIds(
          this.$selectUtils.Picker
      ).then(response => {
        this.appointCosmeticsArray = JSON.parse(response.data.data);
        if (this.appoint.appointCosmetics !== "") {
          this.appointCosmeticsText = this.appointCosmeticsArray.find(k => k.id === this.appoint.appointCosmetics).text;
        }
      })
    },
    //查询房间
    queryRoomIdsByShopId: function () {
      if (this.appoint.appointShop === undefined || this.appoint.appointShop === null) {
        this.$toast.fail("此预约无店铺,请先给预约分配店铺");
        return;
      }
      this.$selectUtils.queryRoomIdsByShopId(
          this.appoint.appointShop,
          this.$selectUtils.Picker
      ).then(response => {
        if (response.data.data.length === 0) {
          this.$toast.fail("此店铺无试纱间,请先添加试纱间");
          return;
        }
        this.roomArray = JSON.parse(response.data.data);
        // 到店分配 text 找不到
        if (this.appoint.room !== "") {
          this.roomText = this.roomArray.find(k => k.id === this.appoint.room).text;
        }
      })
    }
  },
}
</script>

<style scoped>

</style>
