<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式列表"/>
      <form action="javascript:return true">
      <van-search
          @search="queryStyleList"
          v-model="styleName"
          placeholder="请输入款式名称"/>
      </form>
      <van-dropdown-menu>
        <van-dropdown-item :title="styleText" v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <!--        <van-dropdown-item :title="gradeText" v-model="grade" @change="gradeChange" :options="gradeArray"/>-->
        <!--        <van-dropdown-item :title="stateText" v-model="state" @change="stateChange" :options="stateArray"/>-->
        <van-dropdown-item title="款式标签" ref="labelRef">
          <van-row type="flex" style="padding: 10px">
            <van-col style="margin: 5px" v-for="item in styleLabelList" :key="item.value">
              <van-tag color="#B6B1BD" :class="{'bgcolor':styleLabels.indexOf(item.value)>-1}"
                       round plain size="large"
                       @click="pushStyleLabel(item.value)">{{ item.name }}
              </van-tag>
            </van-col>
          </van-row>
          <div style="padding: 100px 30px 30px 30px;">
            <van-button type="danger" block round @click="styleLabelConfirm">
              确认
            </van-button>
          </div>
        </van-dropdown-item>
        <van-dropdown-item :title="brandText" @change="brandChange" v-model="brand" :options="styleBrandArray"/>
        <!--        <van-dropdown-item :title="serviceText" v-model="service" @change="serviceChange" :options="serviceArray" />-->
      </van-dropdown-menu>

    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了">
        <van-cell style="font-size: 12px" v-for="item in styleList" :key="item.id" @click="clickItem(item)">
          <van-row>
            <van-col span="13">
              <van-col style="color: #39a9ed;font-size: 15px">款式名称:{{ item.typeName + item.styleName }}</van-col>
              <van-row>
                <van-col span="24">款式品牌:{{ item.brandName }}</van-col>
              </van-row>
              <van-row>
                <van-col span="24">采购日期:{{ item.purchaseDate }}</van-col>
              </van-row>
              <van-row>
                <van-col span="24">适合身形:{{ item.styleFit }}</van-col>
              </van-row>
              <van-row>
                <van-col span="24">不适合身形:{{ item.styleNoFit }}</van-col>
              </van-row>
              <van-row>
                <van-col span="24">标签:{{ item.labelName }}</van-col>
              </van-row>
            </van-col>
            <van-col offset="1" span="10">
              <van-image radius="7" @click="clickItem(item)"
                         :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage">
              </van-image>
            </van-col>
          </van-row>
          <br>
          <!--          <van-row>-->
          <!--            <van-tag round class="tag-padding" closeable size="large"  @close="close" type="primary">标签</van-tag>-->
          <!--            <van-tag round class="tag-padding" closeable size="large"  @close="close" type="success">标签</van-tag>-->
          <!--            <van-tag round class="tag-padding" closeable size="large"  @close="close" type="danger">标签</van-tag>-->
          <!--            <van-tag round class="tag-padding" closeable size="large"  @close="close" type="warning">标签</van-tag>-->
          <!--          </van-row>-->
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
      styleText: "",
      styleType: "",
      styleTypeArray: [{text: "款式类型", value: ""}],
      loading: false,
      finished: false,
      styleList: [],
      styleLabelList: [],
      styleLabels: [],
      isactive: false,
      brandText:"",
      brand:"",
      styleBrandArray: [{text: "款式品牌", value: ""}],
    }
  }
  , created() {
    this.queryStyleList()
    this.queryStyleType()
    this.queryStyleLabelList()
    this.queryClothesBrand()
  }
  , components: {
    baseNavBar
  }
  , methods: {
    queryStyleList: function (value) {
      this.$axios({
        method: "get",
        url: '/style/mStyleList',
        params: {
          styleName: value,
          styleType: this.styleType,
          tenantCrop: this.tenantCrop,
          styleLabels: this.styleLabels.toString(),
          brandName: this.brand,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.styleList = response.data.data.list
          this.finished = true;
        }
      })
    }
    , clickItem(value) {
      this.$router.push({name: "styleDetails", query: value})
    }
    , queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
        console.log(response)
      })
    }, queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
        console.log(response)
      })
    }
    , styleTypeChange: function (value) {
      this.styleType = value
      this.queryStyleList();
    }, styleLabelConfirm: function () {
      this.$refs.labelRef.toggle()
      this.queryStyleList();
    }, pushStyleLabel: function (value) {
      if (this.styleLabels.indexOf(value) > -1) {
        this.styleLabels.splice(this.styleLabels.indexOf(value, 0), 1)
      } else {
        this.styleLabels.push(value)
      }
    },
    brandChange: function () {
      this.queryStyleList();
    },
    queryClothesBrand: function () {
      this.$axios({
        method:"GET",
        url: "/select/mBrandIds",
        params: {
          tenantCrop: this.tenantCrop,
        }
      }).then((response) => {
        this.styleBrandArray.push(...JSON.parse(response.data.data))
      })
    },
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'styleDetails') {
      this.$store.commit('setKeepAlive', ['styleList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }
}
</script>

<style>
.tag-padding {
  margin-left: 5px;
  margin-right: 5px;
}

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}

</style>
