<template>
  <div>
    <van-sticky>
      <baseNavBar title="化妆师档期列表"/>
    </van-sticky>
    <div>
      <van-row style="text-align: center"><p class="cardTitle">{{  artistName + '的化妆档期' }}</p></van-row>
      <van-cell-group>
        <van-cell style="font-size: 12px" v-for="item in scheduleList" :key="item.id">
          <van-row>
            <van-col span="12">档期时间 :{{ item.makeupDate + ' ' + item.makeupTime }}</van-col>
            <van-col span="12">档期种类 :{{ ' ' + item.makeupType }}</van-col>
          </van-row>
          <van-row>
          </van-row>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "makeupScheduleList",
  data() {
    return {
      artistName: this.$route.query.artistName,
      makeupArtistId: this.$route.query.id,
      historyText: "显示历史档期",
      historyShow: false,
      loading: false,
      finished: true,
      scheduleList: [],
      historyScheduleList: [],
    }
  }, components: {
    baseNavBar
  },
  created() {
    this.queryMakeupScheduleList()
  }
  , methods: {
    queryMakeupScheduleList() {
      this.$axios({
        method: "get",
        url: '/makeup/makeupScheduleList',
        params: {
          makeupArtistId: this.makeupArtistId,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.scheduleList.push(...response.data.data)
        } else {
          this.$toast.fail(response.data.msg);
        }
      })
    },
  }
  ,
}
</script>

<style scoped>

</style>