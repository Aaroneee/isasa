
<template>
  <div>
    <van-search v-model="searchValue" placeholder="请输入搜索关键词" @search="onSearch"/>
    <van-list
        style="background-color: white;margin: 8px 8px 13% 8px;border-radius: 10px"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <!--    <van-cell v-for="item in list" :key="item" :title="item" />-->
      <div v-for="item in listResponse" :key="item.id" style="">
        <div style="padding: 12px 12px;" @click="clickItem(item.id)">
          <van-row style="display: flex;align-items: center">
            <van-col :span="3">
              <IconPark v-if="item.msgRead===2" :type="'envelopeOne'" theme="filled" strokeLinecap="square" size="25" fill="#89bea8"/>
              <van-badge dot v-else>
                <IconPark :type="'envelopeOne'" theme="filled" strokeLinecap="square" size="25" fill="#89bea8"/>
              </van-badge>
            </van-col>
            <van-col :span="21">
              <van-row style="margin-bottom: 10px" offset="20">
                <van-col :span="24" style="font-size: 16px;font-weight: bolder;color: var(--my-text-color)">
                  {{item.msgTitle}}
                </van-col>
              </van-row>
              <van-row style="margin-bottom: 10px" offset="20">
                <van-col :span="24" style="font-size: 15px;color: var(--my-text-color)">
                  {{item.msgText}}
                </van-col>
              </van-row>
              <van-row style="" offset="20">
                <van-col :span="24" style="font-size: 14px;text-align: right;color: var(--my-describe-color)">
                  {{item.createDate}}
                </van-col>
              </van-row>
            </van-col>
          </van-row>
        </div>
        <van-divider />
      </div>

    </van-list>
  </div>
<!--  <van-tabs type="card" background="#F5F7FA" color="white" title-active-color="black" title-inactive-color="black">-->
<!--    <van-tab title="未读" >-->
<!--      -->
<!--    </van-tab>-->
<!--    <van-tab title="已读">已读</van-tab>-->
<!--  </van-tabs>-->

</template>

<script>
import {IconPark} from '@icon-park/vue/es/all';
export default {
  name: "message",
  data() {
    return {
      searchValue:"",
      list: [],
      listResponse:[],
      loading: false,
      finished: false,
      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  components: {
    IconPark
  },
  created() {
    this.listResponse=this.list;
  },
  methods: {
    clickItem(id){
      this.$router.push({name:"msgDetails",query: {id:id}})
    },
    onSearch(val){
      this.listResponse=this.list.filter(k=>{ return k.msgText.includes(val)})
    },
    getMsgTypeColor(msgType){
      switch (msgType){
        case 0:
          return '#F56C6C';
        case 1:
          return '#FAAB0C';
        case 2:
          return '#07c160';
      }
    },
    onLoad() {
      this.loading=true;
      this.$axios({
        method: "GET",
        url: "/sysMsg/queryList",
        params: {
          tenantCrop:this.tenantCrop
        }
      }).then(response => {
        this.list=response.data.data;
        this.listResponse=this.list;
        this.loading=false;
        this.finished=true;
      })
    },

  },
}
</script>

<style scoped>
.van-divider{
  margin: 5px 0;
}
</style>
