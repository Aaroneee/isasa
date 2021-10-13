<template>
  <div>
    <van-sticky>
      <switchNavBar :title="titleText" switchText="对接日期" @flag="createDateShow=true"/>
      <van-calendar v-model="createDateShow" :min-date="minDate" :max-date="maxDate"
                    @confirm="createDateOnConfirm"/>
      <form action="javascript:return true">
      <van-search
          @search="queryCusList"
          v-model="searchValue"
          placeholder="请输入搜索关键词"/>
      </form>
      <van-dropdown-menu>
        <van-dropdown-item :title="sourceText" ref="sourceShowPicker">
          <van-picker
              show-toolbar
              toolbar-position="bottom"
              cancel-button-text="清空"
              :columns="sourceArray"
              @confirm="sourceOnConfirm"
              @cancel="sourceCancel"
          />
        </van-dropdown-item>
        <van-dropdown-item :title="gradeText" v-model="grade" @change="gradeChange" :options="gradeArray"/>
        <van-dropdown-item :title="stateText" v-model="state" @change="stateChange" :options="stateArray"/>
        <van-dropdown-item :title="serviceText" v-model="service" @change="serviceChange" :options="serviceArray" />
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px" v-for="item in customerList" :key="item.id"  @click="clickItem(item.id)" >
          <van-row>
            <van-col span="12" :style="{color:item.gradeColor}">姓名:{{ item.name }}</van-col>
            <van-col style="color: #de0d0d" span="12">客资状态:{{ item.state }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">婚期:{{ item.weddingDay }}</van-col>
            <van-col span="12">对接日期:{{ item.createDate }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">微信:{{ item.weChat }}</van-col>
            <van-col span="12" @touchstart="copyPhone(item.phone)">手机:{{ item.phone }}
              <span v-if="item.phone !== ''" class="copy-btn"
                          @click.stop="copyPhone(item.phone)"
                          style="top: -5px;left: 10px;color: #ffa71e">复制
              </span>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">来源:{{ item.source }}</van-col>
            <van-col span="12">客服:{{ item.service }}</van-col>
          </van-row>
          <van-row>
            <van-col span="24">备注:{{ item.remark }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>

  </div>
</template>

<script>
import switchNavBar from '@/components/nav-bar/switch-nav-bar'
import {Notify} from "vant";

export default {
  name: "cusList",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      //List
      customerList: [],
      loading: false,
      finished: false,
      titleText: "客资列表",
      createDateShow: false,
      createDate: "",

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      //顶部搜索
      searchValue: "",
      //客资来源下拉
      sourceText: "客资渠道",
      source: "",
      sourceArray: [],
      //意愿程度
      gradeText: "",
      grade: "",
      gradeArray: [{text: "客资意愿", value: ""}],
      //客资状态
      stateText: "",
      state: "",
      stateArray: [{text: "客资状态", value: ""}],
      //客服
      serviceText: "",
      service: "",
      serviceArray: [{text: "选择客服", value: ""}],
    }
  },
  components: {
    switchNavBar
  },
  created() {
    this.querySourceIds();
    this.queryGradeIds();
    this.queryStateIds();
    this.queryServiceIds();
    this.queryCusList();
  },

  methods: {
    //点击渠道
    sourceOnConfirm: function (val) {
      if (val[1] === "") {
        this.sourceText = val[0];
        this.source = this.sourceArray.find(k => k.text === val[0]).value;
      } else {
        this.sourceText = val[1];
        this.source = this.sourceArray.find(k => k.text === val[0]).children.find(k => k.text === val[1]).value;
      }
      this.$refs.sourceShowPicker.toggle();
      this.queryCusList();
    },
    //清除渠道
    sourceCancel: function () {
      this.sourceText = "客资渠道";
      this.source = "";
      this.queryCusList();
      this.$refs.sourceShowPicker.toggle();
    },
    //点击意愿
    gradeChange: function (val) {
      this.grade = val;
      this.queryCusList();
    },
    //点击状态
    stateChange: function (val) {
      this.state = val;
      this.queryCusList();
    },
    //点击客服
    serviceChange: function (val) {
      this.service = val;
      this.queryCusList();
    },
    //点击每个Listitem
    clickItem: function (id) {
      this.$router.push({name: "cusDetails", query: {cusId: id}})
    },
    //复制手机号
    copyPhone: function(value){
      this.$copyText(value).then(function (){
        Notify({ type:'success', message:'复制到剪贴板成功'})
      },() => {
        Notify({ type:'warning', message:'复制失败'})
      })
    },


    //查询客资列表
    queryCusList: function (val) {
      this.$axios({
        method: "get",
        url: "/customer/mCustomerList",
        params: {
          value: val,
          createDate: this.createDate,
          source: this.source,
          grade: this.grade,
          state: this.state,
          service: this.service,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.customerList = response.data.data.list
          this.finished = true;
        }
      })
    },
    //查询渠道
    querySourceIds: function () {
      this.$selectUtils.querySourceIds(this.$selectUtils.DropDownMenu).then(response => {
        if (response.data.code !== 200) {
          self.$toast.fail(response.data.msg);
          return
        }
        this.sourceArray = JSON.parse(JSON.parse(response.data.data));
        this.sourceArray = this.sourceArray.map(k => {
          if (k.children === null) {
            k.children = [{text: "", id: k.id}];
            return k;
          }
          return k;
        });
      })
    },
    //查询意愿
    queryGradeIds: function () {
      this.$selectUtils.queryGradeIds(this.$selectUtils.DropDownMenu).then(response => {
        if (response.data.code === 200) {
          this.gradeArray.push(...JSON.parse(response.data.data));
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //查询状态
    queryStateIds: function () {
      this.$selectUtils.queryStateIds(this.$selectUtils.DropDownMenu).then(response => {
        if (response.data.code === 200) {
          this.stateArray.push(...JSON.parse(response.data.data));
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //查询客服
    queryServiceIds: function () {
      this.$selectUtils.queryServiceIds(this.$selectUtils.DropDownMenu).then(response => {
        if (response.data.code === 200) {
          this.serviceArray.push(...JSON.parse(response.data.data));
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    }, createDateOnConfirm: function (time) {
      this.createDate = this.$dateUtils.vantDateToYMD(time);
      this.titleText = this.$dateUtils.vantDateToYMD(time);
      this.queryCusList();
      this.createDateShow = false;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'cusDetails') {
      this.$store.commit('setKeepAlive', ['cusList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }, activated() {
    console.log("哎呀看见我了")
    console.log("----------activated--------")
  },
  deactivated() {
    console.log("讨厌！！你又走了")
    console.log("----------deactivated--------")
  }
}
</script>

<style scoped>
.copy-btn{
  margin-left: 5%;
}
</style>
