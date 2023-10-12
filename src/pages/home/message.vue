
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
        <div style="padding: 12px 12px;">
          <van-row style="display: flex;align-items: center" offset="20">
            <van-col :span="3" style="text-align: center">
              <van-badge dot>
                <IconPark :type="'envelopeOne'" theme="filled" strokeLinecap="square" size="25" fill="#89bea8"/>
              </van-badge>
            </van-col>
            <van-col :span="21">
              {{item.msgText}}
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
            createDate:'2023-10-08 20:20:22',
            msgIcon:'fullDressLonguette',
            msgTitle:"贸易订单收货提示",
            msgText:"款式已收货,请添加至款式列表",
          },
          {
            id:2,
            msgType:2,
            createDate:'2023-10-06 19:19:38',
            msgIcon:'newEfferent',
            msgTitle:"新订单添加婚纱提示",
            msgText:"已为AAA客户添加了一条订单,请为该订单添加婚纱.",
          },
          {
            id:3,
            msgType:0,
            createDate:'2023-10-05 18:18:57',
            msgIcon:'reverseOperationIn',
            msgTitle:"订单婚纱撞档",
            msgText:"客户AAA订单的婚纱[H-0001-F-1]在12月10日有撞档,请尽快处理",
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
        if (this.list.length >= 3) {
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