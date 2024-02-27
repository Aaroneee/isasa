<template>
  <div>
    <van-sticky>
      <baseNavBar title="化妆档期添加"/>
    </van-sticky>
    <div class="card">
      <br>
      <van-calendar v-model="makeupDateShow" @confirm="makeupDateConfirm"/>
      <van-action-sheet v-model="makeupTimeShow" title="化妆档期时间">
        <van-datetime-picker
            v-model="time"
            type="time"
            :min-hour="10"
            :max-hour="20"
            @confirm="makeupTimeConfirm"
        />
      </van-action-sheet>

      <van-popup v-model="makeupTypeShow" position="bottom">
        <van-picker
            show-toolbar
            :columns="makeupTypeColumns"
            @confirm="makeupTypeConfirm"
            @cancel="makeupTypeShow = false"
        />
      </van-popup>


      <van-form @submit="onSubmit">
        <van-field
            v-model="artistName"
            name="化妆师"
            label="化妆师"
            placeholder="化妆师"
            readonly
        />
        <van-field
            v-model="makeupSchedule.makeupDate"
            name="档期日期"
            label="档期日期"
            placeholder="档期日期"
            @click="makeupDateShow = true"
            :rules="[{ required: true, message: '请选择化妆档期日期' }]"
        />
        <van-field
            v-model="makeupSchedule.makeupTime"
            name="档期时间"
            label="档期时间"
            placeholder="档期时间"
            @click="makeupTimeShow = true"
            :rules="[{ required: true, message: '请选择化妆档期时间' }]"
        />
        <van-field
            v-model="makeupSchedule.makeupType"
            name="档期种类"
            label="档期种类"
            placeholder="档期种类"
            @click="makeupTypeShow = true"
            :rules="[{ required: true, message: '请选择化妆档期种类' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>

import baseNavBar from "@/components/nav-bar/base-nav-bar.vue";

export default {
  name: "makeupScheduleAdd",
  data() {
    return {
      artistName: this.$route.query.artistName,
      makeupSchedule: {
        makeupArtistId: this.$route.query.id,
        makeupDate: '',
        makeupTime: '',
        makeupType: "",
      },
      makeupTypeColumns: ['外出跟妆', '店内试桩', '日常排班'],
      date: '',
      time: "10:00",
      makeupDateShow: false,
      makeupTimeShow: false,
      makeupTypeShow: false,
    }
  },
  created() {
  },
  components: {
    baseNavBar
  },
  methods: {
    makeupDateConfirm(date) {
      this.makeupSchedule.makeupDate = this.$dateUtils.vantDateToYMD(date)
      this.makeupDateShow = false
    },
    makeupTypeConfirm(item) {
      this.makeupSchedule.makeupType = item
      this.makeupTypeShow = false
    },
    makeupTimeConfirm: function (time) {
      console.log(time)
      this.makeupSchedule.makeupTime = time
      this.makeupTimeShow = false
    },
    onSubmit: function () {
      let self = this
      self.$dialog.confirm({
        title: '添加档期',
        message: '是否添加该档期?',
      }).then(() => {
        this.addMakeupSchedule().then((response) => {
          if (response === 'success') {
            setTimeout(this.back, 1000);
          }
        })
      })
    },
    back() {
      this.$router.back()
    },
    async addMakeupSchedule() {
      return this.$axios({
        method: "POST",
        url: "/makeup/addMakeupSchedule",
        data: this.makeupSchedule
      }).then(response => {
        if (response.data.code === 200) {
          this.$toast.success('添加成功')
          return 'success'
        } else {
          this.$toast.fail(response.data.msg)
          return 'fail'
        }
      })
    },
  },
}
</script>


<style scoped>
.card {
  margin: 2%;
  background-color: white;
  height: 90vh;
  border-radius: 10px;
}

.style-img {
  height: 270px;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
}
</style>