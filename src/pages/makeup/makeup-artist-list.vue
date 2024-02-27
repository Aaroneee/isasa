<template>
  <div>
    <van-sticky>
      <baseNavBar title="化妆师列表"/>
      <!--      <form action="javascript:return true">-->
      <!--        <van-search-->
      <!--            @search="search"-->
      <!--            v-model="makeupArtistName"-->
      <!--            placeholder="请输入化妆师名称"/>-->
      <!--      </form>-->
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          finished-text="没有更多了">
        <van-cell style="font-size: 12px">
          <van-row gutter="5">
            <van-col span="12" v-for="item in makeupArtistList" :key="item.id" @click="toMakeupArtistDetails(item)"
                     style="text-align: center">
              <div class="card">
                <div class="imgFont">
                  <img v-if="item.image !== ''"
                       :src="'https://makeup-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.image+'?imageMogr2/rquality/60'"
                       alt="主图显示失败,请重新设置主图"/>
                  <img v-else
                       :src="'https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logoFont.jpg?imageMogr2/rquality/2'"
                       alt="主图显示失败,请重新设置主图"/>
                </div>
                <div class="styleInfo">
                  <van-row>
                    <van-col span="24">
                      <p class="pFont" style="text-align: left">{{ item.name + ' 化妆师' }}</p>
                    </van-col>
                  </van-row>
                </div>
              </div>
            </van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "makeupArtistList",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      loading: false,
      finished: false,
      makeupArtistList: [],
    }
  }, components: {
    baseNavBar
  },
  created() {
    this.queryMakeupArtistList()
  },
  methods: {
    queryMakeupArtistList() {
      this.loading = true
      this.$axios({
        method: "get",
        url: '/makeup/makeupArtistList',
        params: {
          page: this.page,
          limit: 20,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.finished = true
          this.loading = false
          this.makeupArtistList.push(...response.data.data)
        } else {
          this.finished = true
          this.$toast.fail(response.data.msg);
        }
      })
    },
    onLoad() {
      this.queryMakeupArtistList()
    },
    toMakeupArtistDetails(item) {
      console.log(item)
      this.$router.push({name: "makeupArtistDetails", query: {id: item.id,artistName:item.name}})
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'makeupArtistDetails') {
      this.$store.commit('setKeepAlive', ['styleList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }
}
</script>

<style scoped>
.van-dropdown-menu >>> .van-dropdown-menu__title {
  font-size: 12px;
}
.tag-padding {
  margin-left: 5px;
  margin-right: 5px;
}

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}

.styleInfo{
  margin-bottom: 5px;
}
img{
  height: 245px;
  min-height: 245px;
  width: 100%;
  border-radius: 7px;
}
.card{
  min-height: 270px;
  max-height: 270px;
  min-width: 160px;
  padding: 5px 5px 3px 5px ;
  background-color: white;
  border-radius: 10px;
  margin: 0 auto 3% auto;
}
.imgFont{
  margin: 0 auto;
  width: 100%;
  min-width: 45vw;
  max-width: 45vw;
}
.pFont{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 !important;

  font-weight: bold;
  padding: 0 3px;
  font-size: 12px;
}
.van-list >>> .van-cell{
  padding: 10px 5px;
  background-color:#f7f8fa;
  line-height:17px;
  /*background-color: #1a2a4c;*/
}
.card >>> .van-badge--fixed{
  left: 0;
  right: auto;
  -webkit-transform: none;
}
</style>
