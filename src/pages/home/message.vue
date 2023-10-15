
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
        <div style="padding: 12px 12px;" @click="clickItem(item)">
          <van-row style="display: flex;align-items: center">
            <van-col :span="3">
              <van-badge dot>
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
      list: [
          {
            id:1,
            msgType:1,
            createDate:'2023-10-13 20:20:22',
            msgIcon:'fullDressLonguette',
            msgTitle:"贸易订单收货提示",
            msgText:"您收到了来自【GLACIAR】品牌的【柏林少女】【FR22201】",
          },
          {
            id:2,
            msgType:2,
            createDate:'2023-10-12 19:19:38',
            msgIcon:'newEfferent',
            msgTitle:"贸易订单收货提示",
            msgText:"您收到了来自【Julia Kontogruni】品牌的【皓月流光】【FR22102】",
          },
      ],
      listResponse:[],
      loading: false,
      finished: false,
    }
  },
  components: {
    IconPark
  },
  created() {
    this.listResponse=this.list;
  },
  methods: {
    clickItem(item){
      this.$router.push({name:"msgDetails",query:item.id})
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
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        // for (let i = 0; i < 10; i++) {
        //   this.list.push(this.list.length + 1);
        // }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 2) {
          this.finished = true;
        }
      }, 1000);
    },

  },
}
</script>

<style scoped>
.van-divider{
  margin: 5px 0;
}
</style>