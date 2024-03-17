<template>
  <div>
    <van-sticky>
      <baseNavBar title="化妆造型添加"/>
    </van-sticky>

    <div>
      <van-empty v-if="selectedMakeStatus=== false" description="当前暂无已选择的造型"/>
      <van-cell-group inset>
        <van-cell title="已选择的造型" :value=selectedMake.intrName />
      </van-cell-group>
    </div>

    <van-popup v-model="makeupClothesOrderPop" round position="bottom" :style="{ height: '43%' }">
      <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
        <van-cell style="font-size: 14px">
          <van-col style="color: #39a9ed" span="12">客户名:{{ orderVo.name }}</van-col>
        </van-cell>
        <van-form @submit="addSchedule">
          <van-field
              name="clothesName"
              v-model="orderVo.pushClothesName"
              label="婚纱编号"
              placeholder="婚纱编号"
              readonly
              :rules="[{ required: true }]"
          />

          <van-field
              name="clothesId"
              v-model="orderVo.pushClothesId"
              style="display: none"
          />
          <van-field
              name="orderId"
              v-model="orderVo.id"
              style="display: none"
          />
          <van-field
              name="cusId"
              v-model="orderVo.cusId"
              style="display: none"
          />
          <van-field
              name="makeupId"
              v-model="makeupId"
              style="display: none"
          />
          <van-field
              name="makeupArtistId"
              v-model="orderVo.orderCosmetics"
              style="display: none"
          />
          <van-field
              label="案例名称"
              name="makeupName"
              v-model="makeupName"
              readonly
          />
          <van-field label="档期" placeholder="档期" name="makeupDate" readonly v-model="orderVo.weddingDay"
                     @click="weddingDaySelectShowPicker = true"/>
          <br>
          <br>
          <br>
          <van-row style="margin-bottom: 20px">
            <van-col span="22" offset="1">
              <van-button round block type="primary" native-type="submit">提交</van-button>
            </van-col>
          </van-row>
          <van-overlay :show="overlayShow"/>
        </van-form>
      </van-collapse>
    </van-popup>


    <van-cell style="font-size: 12px">
      <van-cell :title="orderVo.cosmetics+' 化妆师的造型'" center :border="false"
                style="padding-top: 0; padding-bottom: 0;text-align: center;font-size: 16px"></van-cell>
      <div>
        <van-row gutter="5">
          <van-grid :column-num="2" :border="false">
            <van-grid-item v-for="item in makeupArtistImageList" :key="item.id">
              <van-image
                  :src="item.imageUrl==='' ? 'null' : 'https://makeup-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.imageUrl"
                  @click="selectMakeup(item)"
                  alt="主图显示失败,请重新设置主图" radius="10px" height="58vw" width="40vw"/>
              <span>{{ item.intrName + ' ' + item.priceAmount }}</span>
              <van-row>
                <van-col style="color: red" @click="selectMakeup(item)">选择此件</van-col>
                <!--                <van-col style="color: #3b86e8;margin-left:15px" @click="makeupScheduleQuery(item)">查看档期</van-col>-->
              </van-row>
            </van-grid-item>
          </van-grid>
        </van-row>
      </div>
    </van-cell>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar.vue";

export default {
  name: "makeupOrderClothes"
  , data() {
    return {
      makeupArtistImageList: [],
      orderVo: this.$route.query,
      overlayShow: false,
      activeNames: ['1'],
      weddingDaySelectShowPicker: false,
      makeupClothesOrderPop: false,
      makeupName: '',
      makeupId: '',

      selectedMake:{},
      selectedMakeStatus:false
    }
  },
  components: {
    baseNavBar
  },
  create() {
    this.queryMakeupArtistList()
    this.makeupScheduleQuery()
  },
  mounted() {
    this.queryMakeupArtistList()
    this.makeupScheduleQuery()
  },
  methods: {
    queryMakeupArtistList() {
      this.$axios({
        method: "get",
        url: '/makeup/makeupArtistDetails',
        params: {
          makeupArtistId: this.orderVo.orderCosmetics,
        }
      }).then(response => {
        if (response.data.code === 200) {
          const data = response.data.data
          const filter = data.filter(s => s.imageType === '案例图');
          this.makeupArtistImageList.push(...filter)
        } else {
          this.$toast.fail(response.data.msg);
        }
      })
    },
    selectMakeup(item) {
      this.makeupName = item.intrName
      this.makeupId = item.id
      this.makeupClothesOrderPop = true
    },
    back() {
      this.$router.back()
    },

    async addMakeupSchedule(item) {
      this.$dialog.confirm({
        title: '添加档期',
        message: '是否添加该档期?',
      }).then(() => {
        this.addOrderClothesMakeupSchedule(item).then((response) => {
          if (response === 'success') {
            setTimeout(this.back, 1000);
          }
        })
      })
    },
    async addOrderClothesMakeupSchedule(item) {
      item.makeupId = this.makeupId
      return this.$axios({
        method: "POST",
        url: "/makeup/addOrderClothesMakeupSchedule",
        data: item
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
    makeupScheduleQuery() {
      this.$axios({
        method: "GET",
        url: "/makeup/queryMakeupClothesOrderSchedule",
        params: {
          clothesId:this.orderVo.pushClothesId,
          orderId:this.orderVo.id
        }
      }).then(response => {
        var data = response.data.data;
        if (data.makeupId !== ''){
          this.selectedMake = this.makeupArtistImageList.filter(s => s.id === data.makeupId)[0]
          this.selectedMakeStatus = true
          console.log(this.selectedMake)
        }
      })
    },
    addSchedule(item) {
      this.addMakeupSchedule(item)
    },
    dateAmongClick() {
      if (this.weddingDay === "") {
        this.$toast.fail("请先选择婚期")
        return
      }
      this.dateSectionShow = true
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
