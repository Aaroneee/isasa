<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式列表"/>
      <van-search
          @search="queryStyleList"
          v-model="styleName"
          placeholder="请输入款式名称"/>
      <van-dropdown-menu>
        <van-dropdown-item :title="styleText" v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <!--        <van-dropdown-item :title="gradeText" v-model="grade" @change="gradeChange" :options="gradeArray"/>-->
        <!--        <van-dropdown-item :title="stateText" v-model="state" @change="stateChange" :options="stateArray"/>-->
        <!--        <van-dropdown-item :title="serviceText" v-model="service" @change="serviceChange" :options="serviceArray" />-->
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了">
        <van-cell v-for="item in styleList" :key="item.id" @click="clickItem(item.id)">
          <p>款式名称:{{ item.styleType + item.styleName }}</p>
          <van-row>
            <van-col span="12">采购日期:{{ item.purchaseDate }}</van-col>
            <van-col span="12">采购来源:{{ item.factoryName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">适合身形:{{ item.styleInfo }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">不适合身形:{{ item.styleFit }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "styleList",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      styleName: "",
      styleText: "款式名称",
      styleType: "",
      styleTypeArray: [],
      loading: false,
      finished: false,
      styleList: [],
    }
  }
  , created() {
    this.queryStyleList()
    this.queryStyleType()
  }
  , components: {
    baseNavBar
  }
  , methods: {
    queryStyleList: function (value) {
      console.log(value)
      this.$axios({
        method: "get",
        url: '/style/styleList',
        params: {
          styleName: value,
          styleType: this.styleType,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.styleList = response.data.data.list
          this.finished = true;
        }
      })
    }
    , clickItem(value) {
      console.log(value)
    }
    , queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
        console.log(response)
      })
    }
    , styleTypeChange: function (value) {
      console.log(value)
    }
  }
}
</script>

<style scoped>

</style>
