<template>
  <div>
    <van-sticky>
      <baseNavBar :title="titleText"/>
      <van-search
          v-model="searchValue"
          placeholder="请输入婚纱礼服名称"
          @search="searchStyleName">
      </van-search>
      <van-dropdown-menu style="font-size: 10px">
        <van-dropdown-item v-model="isOrder" @change="isOrderChange" :options="isOrderArray"/>
        <van-dropdown-item v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <van-dropdown-item @change="brandChange" v-model="brand" :options="styleBrandArray"/>
        <van-dropdown-item v-model="clothesSize" @change="clothesSizeChange" :options="clothesSizeArray"/>
      </van-dropdown-menu>
      <van-form>
        <van-field
            readonly
            v-model="appointVo.name"
            label="客户名"
            placeholder="客户名"
        />
        <van-field
            readonly
            v-model="useDateValue"
            label="婚期"
            placeholder="婚期"
            @click="useDateShowPicker = true"
        />
        <van-calendar
            v-model="useDateShowPicker"
            type="range" allow-same-day
            @confirm="useDateConfirm"
            :min-date="minDate"
            :max-date="maxDate"
            :default-date="userDate"
        />
        <van-field
            readonly
            v-model="clothesAllName"
            label="礼服编号"
            placeholder="请选择礼服编号"
        />
        <div style="background-color: white">
          <br>
          <van-row>
            <van-col span="20" offset="2">
              <van-button
                  color="linear-gradient(to right, #50E64D, #03B300)"
                  class="bottom-button"
                  round block
                  type="primary"
                  @click="confirmYarn()"
                  native-type="submit">提交
              </van-button>
            </van-col>
          </van-row>
          <br>
        </div>
      </van-form>
    </van-sticky>
    <van-tabs color="#fdd640" animated swipeable>
      <van-tab title="婚纱列表">
        <div>
          <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoad"
              finished-text="没有更多了"
          >
          <van-cell v-for="item in clothesList" :key="item.id">
            <van-grid :border="false" :column-num="2" :gutter="1">
              <van-grid-item v-if="item[0] != null">
                <div v-if="item[0].styleImage !== ''">
                  <van-image class="style-img" radius="7" @click="clickItem(item[0])"
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
                <van-row>
                  <van-col style="color: #3b86e8" @click="choose(item[0])">选择此件</van-col>
                  <van-col style="color: #3b86e8;margin-left:15px" @click="clothesSchedules(item[0])">查看档期</van-col>
                </van-row>
              </van-grid-item>
              <van-grid-item v-if="item[1] != null">
                <div v-if="item[1].styleImage !== ''">
                  <van-image class="style-img" radius="7" @click="clickItem(item[1])"
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
                <van-row>
                    <van-col style="color: #3b86e8" @click="choose(item[1])">选择此件</van-col>
                    <van-col style="color: #3b86e8;margin-left:15px" @click="clothesSchedules(item[1])">查看档期</van-col>
                </van-row>
              </van-grid-item>
            </van-grid>
          </van-cell>
          </van-list>
        </div>
      </van-tab>
      <van-tab title="已选试纱">
        <van-empty v-if="yarnClothesList.length == 0" style="background-color: white" description="暂未添加试纱"/>
        <van-grid v-else :border="false" :column-num="2" :gutter="1" style="font-size: 14px;">
          <van-grid-item v-for="item in yarnClothesList" :key="item.id" >
            <div v-if="item.styleImage !== ''">
              <van-image class="style-img" radius="7" @click="clickItem2(item)"
                         style="height: 218px;width: 151px;margin-top: 10px"
                         :src="item.styleImage">
              </van-image>
            </div>
            <div v-else>
              <van-image class="style-img">
                <template v-slot:error>未上传图片</template>
              </van-image>
            </div>
            <span
                v-text="item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo"></span>
            <van-row>
              <van-col style="color: #f01426;" @click="deleteClothesYarnConfirm(item)">删除此件</van-col>
            </van-row>
          </van-grid-item>
        </van-grid>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
import {ImagePreview} from "vant";

export default {
  name: "addYarnClothes",
  components: {
    baseNavBar,
  },
  created() {
    this.weddingDayProcess();
    this.queryClothesList();
    this.queryYarnClothesList();
    this.queryStyleType()
    this.queryClothesBrand()
    this.queryClothesSize()
  },
  data() {
    return {
      titleText: "添加试纱",
      appointVo: this.$route.query.appointVo,
      pageSource: this.$route.query.pageSource,

      tenantCrop: localStorage.getItem("tenantCrop"),
      clothesAllName: "",
      clothesId:"",
      clothesList: [],
      loading: false,
      finished: false,
      yarnClothesList:[],
      isOrder:"notOrder",
      isOrderArray:[{text: "全部", value: ""},{text: "有档期", value: "isOrder"},{text: "无档期可用", value: "notOrder"}],
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      searchValue: "",
      page: 1,
      styleName:"",

      useDateValue:"",
      userDate:[],
      useDateShowPicker: false,
      // 搜索框
      styleType: "",
      styleTypeArray: [{text: "款式类型", value: ""}],
      brandText:"",
      brand:"",
      styleBrandArray: [{text: "款式品牌", value: ""}],
      clothesSize: "",
      clothesSizeArray: [{text: "婚纱尺寸", value: ''}],
    }
  },
  methods: {
    clickItem: function (value) {
      ImagePreview(['\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+value.styleImage])
    },
    clickItem2(value) {
      ImagePreview([value.styleImage])
    },
    searchStyleName: function (){
      this.page = 1
      this.clothesList = []
      this.queryClothesList()
    },
    isOrderChange: function () {
      this.page = 1
      this.clothesList = [];
      this.queryClothesList();
    },
    //选择婚纱
    queryClothesList: function () {
      this.loading = true
      this.$axios({
        method: "get",
        url: '/clothes/clothesList',
        params: {
          page: this.page,
          styleName: this.searchValue,
          scheduleDate:this.useDateValue,
          tenantCrop: this.tenantCrop,
          isOrder:this.isOrder,
          styleType: this.styleType,
          brandId: this.brand,
          clothesSize: this.clothesSize,
        }
      }).then(response => {
        if (response.data.code === 200) {
          if (response.data.data.nextPage === 0) {
            this.finished = true
          } else {
            this.loading = false
            this.finished = false
            this.page = response.data.data.nextPage
          }
          this.clothesList.push(...arrTrans(2, response.data.data.list))
        } else {
          this.finished = true
          this.$toast.fail(response.data.msg);
        }
      })
    },
    //查询已选择婚纱
    queryYarnClothesList: function () {
      this.$axios({
        method: "get",
        url: '/clothesYarn/queryYarnClothesList',
        params: {
          appId: this.appointVo.id,
        }
      }).then(response => {
        this.yarnClothesList.push(...response.data.data)
      })
    },
    choose: function (item) {
      this.clothesId = item.clothesId;
      this.clothesAllName = item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo;
    },
    deleteClothesYarnConfirm: function (item) {
      this.$dialog.confirm({
        message: "是否删除？",
        theme: 'round-button',
      }).then(() => {
        this.deleteClothesYarn(item);
      },() =>{})
    },
    deleteClothesYarn: function (item) {
      this.$axios({
        method: "get",
        url: "/clothesYarn/deleteClothesYarn",
        params: {
          id: item.yarnId,
        },
      }).then(response => {
        const data = response.data;
        if (data.code === 200) {
          this.$toast.success(data.msg)
        } else {
          this.$toast.fail(data.msg);
        }
        this.yarnClothesList = [];
        this.queryYarnClothesList();
      })
    },
    onLoad() {
      const that = this
      setTimeout(function () {
        that.queryClothesList()
      }, 200)
    },
    confirmYarn: function () {
      if (this.clothesAllName === ""){
        this.$toast.fail("请选择礼服");
        return;
      }
      this.$dialog.confirm({
        message: "是否给"+"<a style='color: #39a9ed'>"
            +this.appointVo.name+"<a>"+"添加"+"" +
            "<a style='color: #39a9ed'>"+this.clothesAllName+"</a>"+"的试纱？",
        theme: 'round-button',
      }).then(() => {
        this.addClothesYarn();
      },() =>{})
    },
    clothesSchedules: function (item) {
      this.$router.push({name: "clothesSchedule", query: item})
    },
    addClothesYarn: function () {
      this.$axios({
        method: "get",
        url: '/clothesYarn/saveClothesYarn',
        params: {
          appId: this.appointVo.id,
          clothesId: this.clothesId,
          tenantCrop: this.tenantCrop,
          dress: localStorage.getItem("empId")
        }
      }).then(response => {
        const data = response.data;
        if (data.code === 200) {
          this.$toast.success(data.msg)
        } else {
          this.$toast.fail(data.msg);
        }
        this.yarnClothesList = [];
        this.queryYarnClothesList();
      })
    },
    useDateConfirm: function (value) {
      this.page = 1
      this.clothesList = [];
      this.useDateValue = this.$dateUtils.rangeVantDateToYMD(value);
      this.queryClothesList();
      this.useDateShowPicker = false;
    },
    weddingDayProcess: function () {
      const temp = this.appointVo.weddingDay;
      const pattern1 = /^\d{4}-\d{1,2}-\d{1,2}$/;
      const pattern2 = /^\d{2}\.\d{1,2}\.\d{1,2}$/;
      const pattern3 = /^\d{4}\.\d{1,2}\.\d{1,2}$/;
      if (pattern1.test(temp)) {
        this.useDateValue =
            this.$dateUtils.vantDateToYMD(new Date(temp.replaceAll("-","/")))
            +' - '+
            this.$dateUtils.vantDateToYMD(new Date(temp.replaceAll("-","/")));
        this.userDate = [new Date(temp.replaceAll("-","/")),
          new Date(temp.replaceAll("-","/"))];
      }
      if (pattern2.test(temp)) {
        this.useDateValue =
            this.$dateUtils.vantDateToYMD(new Date("20"+temp.replaceAll(".","/")))
            +' - '+
            this.$dateUtils.vantDateToYMD(new Date("20"+temp.replaceAll(".","/")));

        this.userDate = [new Date("20"+temp.replaceAll(".","/"))
          ,new Date("20"+temp.replaceAll(".","/"))];
      }
      if (pattern3.test(temp)) {
        this.useDateValue =
            this.$dateUtils.vantDateToYMD(new Date(temp.replaceAll(".","/")))
            +' - '+
            this.$dateUtils.vantDateToYMD(new Date(temp.replaceAll(".","/")));

        this.userDate = [new Date(temp.replaceAll(".","/"))
          ,new Date(temp.replaceAll(".","/"))];
      }
    },
    queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
      })
    },
    styleTypeChange: function () {
      this.clothesList = []
      this.page = 1
      this.queryClothesList()
    },
    brandChange() {
      this.clothesList = []
      this.page = 1
      this.queryClothesList()
    },
    queryClothesBrand: function () {
      this.$selectUtils.queryBrandIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleBrandArray.push(...JSON.parse(response.data.data))
        console.log(this.styleBrandArray)
      })
    },
    queryClothesSize() {
      this.$selectUtils.queryClothesSize().then(response => {
        let data = JSON.parse(response.data.data).map(s => s['name'])
        for (let temp of data) {
          this.clothesSizeArray.push({text: temp, value: temp})
        }
      })
      console.log(this.clothesSizeArray)
    },
    clothesSizeChange() {
      this.clothesList = []
      this.page = 1
      this.queryClothesList()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'clothesSchedule') {
      this.$store.commit('setKeepAlive', [this.pageSource,'addYarnClothes'])
    } else {
      this.$store.commit('setKeepAlive', [this.pageSource])
    }
    next()
  }

}

function arrTrans(num, arr) {
  const iconsArr = [];
  if (arr!==""){
    arr.forEach((item, index) => {
      const page = Math.floor(index / num);
      if (!iconsArr[page]) {
        iconsArr[page] = [];
      }
      iconsArr[page].push(item);
    });
  }
  return iconsArr;
}
</script>

<style scoped>

</style>