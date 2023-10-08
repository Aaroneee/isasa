
<template>
<!--  <van-tabs type="card" background="#F5F7FA" color="white" title-active-color="black" title-inactive-color="black">-->
<!--    <van-tab title="未读" >-->
<!--      -->
<!--    </van-tab>-->
<!--    <van-tab title="已读">已读</van-tab>-->
<!--  </van-tabs>-->
  <van-list
      style="background-color: white;margin: 8px 8px 13% 8px;border-radius: 10px"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
  >
    <!--    <van-cell v-for="item in list" :key="item" :title="item" />-->
    <div v-for="item in list" :key="item.id" >
      <div class="card" style="padding: 12px 12px">
        <van-row style="display: flex;align-items: center">
          <van-col :span="4">
            <IconPark :type="item.msgIcon" theme="filled" strokeLinecap="square" size="33" :fill="getMsgTypeColor(item.msgType)"/>
          </van-col>
          <van-col :span="20">
            <van-row style="color: var(--my-text-color);">
              <van-col :span="24" style="font-size: 16px;font-weight: bolder">
                {{item.msgTitle}}
              </van-col>
            </van-row>
            <van-row style="margin-top: 8px;color: var(--my-describe-color);font-size: 14px">
              {{item.createDate}}
            </van-row>
            <van-row style="margin-top: 8px;color: var(--my-describe-color);font-size: 14px">
              {{item.msgText}}
            </van-row>
          </van-col>
        </van-row>
      </div>
      <van-divider />
    </div>

  </van-list>
</template>

<script>
import {IconPark} from '@icon-park/vue/es/all';
export default {
  name: "message",
  data() {
    return {
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
      loading: false,
      finished: false,
    }
  },
  components: {
    IconPark
  },
  methods: {
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