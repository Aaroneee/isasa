<template>
  <div>
    <van-sticky>
      <switchNavBar :title=title :switch-text="historyShow?'隐藏历史档期':'显示历史档期'" @flag="changeShowHistory"/>
    </van-sticky>
    <div>
      <van-tabs color="#fdd640" swipeable animated>
        <van-tab title="案例">
          <van-empty v-if="makeupArtistImageList === 0" description="暂无化妆师案例"/>
          <div v-else>
            <van-list
                :v-model="loading"
                :finished="finished"
                @load="onLoad"
                finished-text="没有更多了">
              <van-cell style="font-size: 12px">
                <van-row gutter="5">
                  <van-col span="24" v-for="item in makeupArtistImageList" :key="item.id"
                           @click="toMakeupArtistDetails(item)"
                           style="text-align: center">
                    <div v-if="item.imageType==='案例图'" class="card">
                      <van-row><p class="cardTitle">{{ item.intrName }}</p></van-row>
                      <van-row :gutter="20">
                        <van-col :span="10">
                          <div style="display: flex;justify-content: space-around;height: 100%">
                            <img
                                alt="图片已损坏，请重新选择主图"
                                style="max-height: 90%"
                                :src="'https://makeup-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.imageUrl"/>
                          </div>
                        </van-col>
                        <van-col style="text-align: center" :span="14">
                          <p>案例价格 : {{ item.priceAmount }}</p>
                          <p>案例介绍 : {{ item.imageIntr }}</p>
                        </van-col>
                      </van-row>
                    </div>
                  </van-col>
                </van-row>
              </van-cell>
            </van-list>
          </div>
        </van-tab>

        <van-tab title="档期">
          <van-divider :style="{ color: '#000000', borderColor: '#000000', padding: '0 16px' }">
            今天及将来档期
          </van-divider>
          <van-cell-group>
            <van-cell style="font-size: 12px" v-for="item in todayAndLaterScheduleList" :key="item.id">
              <van-row>
                <van-col span="24">客户名 :{{ item.makeupCustomer }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">档期时间 :{{ item.makeupDate + ' ' + item.makeupTime }}</van-col>
                <van-col span="12">档期种类 :{{ ' ' + item.makeupType }}</van-col>
              </van-row>
              <van-row>
              </van-row>
            </van-cell>
          </van-cell-group>
          <van-empty v-if="todayAndLaterScheduleList.length === 0" image-size="50" image="search"
                     description="该婚纱下暂无未来档期"/>
          <van-divider :style="{ color: '#000000', borderColor: '#000000', padding: '0 16px' }"
                       v-show="historyShow">
            历史档期
          </van-divider>
          <van-cell-group v-show="historyShow">
            <van-cell style="font-size: 12px" v-for="item in beforeTodayScheduleList" :key="item.id">
              <van-row>
                <van-col span="24">客户名 :{{ item.makeupCustomer }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">档期时间 :{{ item.makeupDate + ' ' + item.makeupTime }}</van-col>
                <van-col span="12">档期种类 :{{ ' ' + item.makeupType }}</van-col>
              </van-row>
              <van-row>
              </van-row>
            </van-cell>
          </van-cell-group>
          <van-empty v-if="beforeTodayScheduleList.length === 0" v-show="historyShow" image-size="50" image="search"
                     description="该婚纱下暂无历史档期"/>
        </van-tab>

      </van-tabs>
    </div>
    <div style="height: 50px"></div>
    <div id="operationDiv">
      <div id="operationCon">
        <p class="cardTitle" style="padding-top: 10px">操作菜单</p>
        <div id="operationParent">
          <div class="operationBlock" @click="addMakeupArtistImage" v-if="this.$per('style_details:add_clothes')">
            <van-icon name="add-o" size="30"/>
            <p>添加案例</p>
          </div>
          <div class="operationBlock" @click="insertMakeupArtistImage" v-if="this.$per('style_details:add_clothes')">
            <van-icon name="add-o" size="30"/>
            <p>形象修改</p>
          </div>
          <div class="operationBlock" @click="addMakeupArtistScheduleView"
               v-if="this.$per('style_details:add_clothes')">
            <van-icon name="add-o" size="30"/>
            <p>添加档期</p>
          </div>
          <!--          <div class="operationBlock" @click="listMakeupArtistScheduleView"-->
          <!--               v-if="this.$per('style_details:add_clothes')">-->
          <!--            <van-icon name="add-o" size="30"/>-->
          <!--            <p>档期列表</p>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "makeupArtistDetails",
  data() {
    return {
      id: this.$route.query.id,
      artistName: this.$route.query.artistName,
      tenantCrop: localStorage.getItem("tenantCrop"),
      loading: false,
      finished: false,
      makeupArtistImageList: [],
      historyShow:false,
      todayAndLaterScheduleList: [],
      beforeTodayScheduleList : [],
      title: this.$route.query.artistName + " 化妆师详情"
    }
  }, components: {
    switchNavBar: switchNavBar,
  },
  methods: {
    changeShowHistory: function (){
      this.historyShow = !this.historyShow
    },
    queryMakeupScheduleList() {
      this.$axios({
        method: "get",
        url: '/makeup/makeupScheduleList',
        params: {
          makeupArtistId: this.id,
        }
      }).then(response => {
        if (response.data.code === 200) {
          const data = response.data.data;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayAndLater = [];
          const beforeToday = [];
          data.forEach(item => {
            const makeupDate = new Date(item.makeupDate);
            if (makeupDate >= today) {
              todayAndLater.push(item);
            } else {
              beforeToday.push(item);
            }
          });
          this.todayAndLaterScheduleList = todayAndLater
          this.beforeTodayScheduleList = beforeToday
        } else {
          this.$toast.fail(response.data.msg);
        }
      })
    },
    queryMakeupArtistList() {
      this.loading = true
      this.$axios({
        method: "get",
        url: '/makeup/makeupArtistDetails',
        params: {
          makeupArtistId: this.id,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.finished = true
          this.loading = false
          this.makeupArtistImageList.push(...response.data.data)
        } else {
          this.finished = true
          this.$toast.fail(response.data.msg);
        }
      })
    },
    onLoad() {
      const that = this;
      setTimeout(function () {
        that.queryMakeupArtistList()
        that.queryMakeupScheduleList()
      }, 500)
    },
    create() {
      const that = this;
      setTimeout(function () {
      }, 500)
    },
    toMakeupArtistDetails(item) {
      console.log(item)
    },
    addMakeupArtistImage() {
      this.$router.push({name: "makeupArtistImageAdd", query: {id: this.id}})
    },
    insertMakeupArtistImage() {
      this.$router.push({name: "makeupArtistImageInsert", query: {id: this.id}})
    },
    addMakeupArtistScheduleView() {
      this.$router.push({name: "makeupScheduleAdd", query: {id: this.id, artistName: this.artistName}})
    },
    listMakeupArtistScheduleView() {
      this.$router.push({name: "makeupScheduleList", query: {id: this.id, artistName: this.artistName}})
    },
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

.cardTitle {
  text-align: center;
  font-weight: bold
}

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}

.styleInfo {
  margin-bottom: 5px;
}

img {
  height: 245px;
  min-height: 245px;
  width: 100%;
  border-radius: 7px;
}

.card {
  min-height: 270px;
  max-height: 270px;
  min-width: 160px;
  padding: 5px 5px 3px 5px;
  background-color: white;
  border-radius: 10px;
  margin: 0 auto 3% auto;
}

.imgFont {
  margin: 0 auto;
  width: 100%;
  min-width: 45vw;
  max-width: 45vw;
}

.pFont {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 !important;

  font-weight: bold;
  padding: 0 3px;
  font-size: 12px;
}

.van-list >>> .van-cell {
  padding: 10px 5px;
  background-color: #f7f8fa;
  line-height: 17px;
  /*background-color: #1a2a4c;*/
}

.card >>> .van-badge--fixed {
  left: 0;
  right: auto;
  -webkit-transform: none;
}

#operationDiv {
  position: fixed;
  bottom: 10px;
  width: 100%;
}

#operationCon {
  border-radius: 10px;
  margin: 0 auto;
  background: white;
  height: 110px;
  width: 95%;
}

.PTitle {
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  padding-top: 3%;
}

#operationParent {
  padding: 10px 0;
  white-space: nowrap;
  /*文本不会换行，文本会在在同一行上继续*/
  overflow-y: auto;
}

#operationParent::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.operationBlock {
  height: 50px;
  text-align: center;
  display: inline-block;
  margin: 0 4%
}

p {
  font-size: 15px;
  margin: 2% 0;
}

</style>
