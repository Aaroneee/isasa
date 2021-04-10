<template>
  <div>
    <baseNavBar title="订单添加款式"/>
    <form action="javascript:return true">
    <van-search
        @search="searchStyleName"
        v-model="styleName"
        placeholder="请输入婚纱礼服名称来搜索款式"/>
    </form>
    <van-cell style="font-size: 12px" v-for="item in clothesList" :key="item.id">
      <van-grid :border="false" :column-num="2" :gutter="1">
        <van-grid-item v-if="item[0] != null">
          <div v-if="item[0].styleImage !== ''">
            <van-image class="style-img" radius="7"
                       :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[0].styleImage">
            </van-image>
          </div>
          <div v-else>
            <van-image class="style-img">
              <template v-slot:error>未上传图片</template>
            </van-image>
          </div>
          <span
              v-text="item[0].styleType+'-'+item[0].styleName+'-'+item[0].clothesSize+'-'+item[0].clothesNo"></span>
          <span style="color: red" @click="clickItem(item[0])">选择此件</span>
        </van-grid-item>

        <van-grid-item v-if="item[1] != null">
          <div v-if="item[1].styleImage !== ''">
            <van-image class="style-img" radius="7"
                       :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[1].styleImage">
            </van-image>
          </div>
          <div v-else>
            <van-image class="style-img">
              <template v-slot:error>未上传图片</template>
            </van-image>
          </div>
          <span
              v-text="item[1].styleType+'-'+item[1].styleName+'-'+item[1].clothesSize+'-'+item[1].clothesNo"></span>
          <span style="color: red" @click="clickItem(item[1])">选择此件</span>
        </van-grid-item>
      </van-grid>
    </van-cell>

    <van-popup v-model="orderClothesPopup" round position="bottom" :style="{ height: '40%' }">
      <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
        <van-cell style="font-size: 14px">
          <van-col style="color: #39a9ed" span="12">客户名:{{ order.name }}</van-col>
          <van-col style="color: #39a9ed" span="12">婚期:{{ order.weddingDay }}</van-col>
        </van-cell>
        <van-form @submit="addSchedule">
          <van-field
              name="clothesNo"
              v-model="clothesNo"
              label="婚纱编号"
              placeholder="婚纱编号"
              readonly
              :rules="[{ required: true }]"
          />

          <van-field
              name="clothesId"
              v-model="clothesId"
              style="display: none"
          />
          <van-field
              name="cusId"
              v-model="cusId"
              style="display: none"
          />

          <van-field
              name="tenantCrop"
              v-model="tenantCrop"
              style="display: none"
          />


          <van-field
              name="dateAmong"
              v-model="dateAmong"
              label="选择档期"
              placeholder="选择档期"
              readonly
              @click="dateSectionShow=true"
              :rules="[{ required: true }]"
          />
          <van-calendar ref="dateRef" safe-area-inset-bottom v-model="dateSectionShow"
                        :min-date="new Date('2020/01/01')"
                        :max-date="new Date('2022/01/01')" :default-date="defaultDate" type="range"
                        @confirm="dateSectionConfirm"/>
          <br>
          <br>
          <br>
          <van-row>
            <van-col span="14" offset="5">
              <van-button round block type="primary" native-type="submit">提交</van-button>
            </van-col>
          </van-row>
          <van-overlay :show="overlayShow"/>
        </van-form>
      </van-collapse>
    </van-popup>


  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "orderClothes"
  , created() {
    this.order = this.$route.query
    console.log(this.order)
  }
  , data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      order: {},
      orderClothesPopup: false,
      activeNames: ['1'],
      styleName: "",
      clothesList: [],


      overlayShow: false,
      defaultDate: [],
      dateSectionShow: false,
      imageUrl: "",
      clothesNo: "",
      dateAmong: "",
      clothesId: "",
      cusId: "",


    }
  }
  , components: {
    baseNavBar
  }
  , methods: {
    clickItem: function (value) {
      console.log(value)
      this.clothesNo = value.styleType + '-' + value.styleName + '-' + value.clothesSize + '-' + value.clothesNo
      this.dateAmong = get_before_date(this.order.weddingDay, 1, 0)
      this.defaultDate = this.$dateUtils.dateSectionStrToDateArray(this.dateAmong)
      this.clothesId = value.clothesId
      this.cusId = this.order.cusId
      console.log(this.defaultDate)
      this.orderClothesPopup = true
    }
    , dateSectionConfirm: function (value) {
      this.dateAmong = this.$dateUtils.rangeVantDateToYMD(value)
      this.dateSectionShow = false
    }
    , searchStyleName: function (value) {
      this.styleName = value
      this.clothesList = []
      this.queryClothesList()
    }
    , addSchedule: function (data) {
      this.$dialog.confirm({
        title: '添加订单档期款式',
        message: '确定要添加该档期吗？',
      }).then(() => {
        this.$axios({
          method: "post",
          url: '/schedule/addSchedule',
          params: data,
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("添加档期成功")
            const that = this
            setTimeout(function () {
              that.$router.back()
            }, 1000)
          } else {
            this.$toast.fail(response.data.msg);
            this.overlayShow = false
          }
        })
      })

    }
    , queryClothesList: function () {
      this.loading = true
      this.$axios({
        method: "get",
        url: '/clothes/clothesList',
        params: {
          page: 1,
          limit: 100,
          styleName: this.styleName,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.code === 200) {
          const data = response.data.data.list
          if (data.length === 0) {
            this.$toast.fail("当前未搜索到更多婚纱礼服");
          } else {
            this.clothesList.push(...arrTrans(2, response.data.data.list))
          }
        } else {
          this.$toast.fail(response.data.msg);
        }
      })
    }
  }
}

function get_before_date(date, day, after) {
  var date1 = new Date(date),
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
  var date2 = new Date(date);
  date2.setDate(date1.getDate() - day);
  var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
  var date3 = new Date(date);
  date3.setDate(date3.getDate() + (day + after));
  var time3 = date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-" + date3.getDate();
  return time2 + ' - ' + time3;
}


function arrTrans(num, arr) {
  const iconsArr = [];
  arr.forEach((item, index) => {
    const page = Math.floor(index / num);
    if (!iconsArr[page]) {
      iconsArr[page] = [];
    }
    iconsArr[page].push(item);
  });
  return iconsArr;
}
</script>

<style scoped>

</style>
