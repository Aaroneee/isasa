<template>
  <div>
    <van-sticky>
      <BaseNavBar title="账户信息"/>
    </van-sticky>
    <div class="card">
      <div style="text-align: center;height:45%;padding-top: 5%">
        <p style="font-size: 35px;font-weight: bolder">{{mathUtils.add(advanceCharge,cashPledge)}}</p>
        <p style="font-size: 20px;">总余额(元)</p>
      </div>
      <van-row style="text-align: center;height:45%;margin-top: 5%;padding-bottom: 5%">
        <van-col :span="11">
          <div >
            <p style="font-size: 20px;font-weight: bolder">{{advanceCharge}}</p>
            <p style="font-size: 15px;">预付款余额(元)</p>
          </div>
        </van-col>
        <van-col :span="2">
          <div class="line"></div>
        </van-col>
        <van-col :span="11">
          <div>
            <p style="font-size: 20px;font-weight: bolder">{{cashPledge}}</p>
            <p style="font-size: 15px;">押金余额(元)</p>
          </div>
        </van-col>
      </van-row>
      <van-row  style="display: flex;justify-content: center">
        <div @click="dialogState=!dialogState" class="buttonShow"
             style="">
          充值
        </div>
      </van-row>

    </div>

    <van-divider content-position="left">交易明细</van-divider>
    <div class="listCard">
      <van-list
              v-model="listData.loading"
              :finished="listData.finished"
              finished-text="没有更多了"
              @load="onLoad"
      >
        <van-cell v-for="item in listData.billList" :key="item.id" style="margin: 2% 0">
          <van-row style="margin: 2% 0">
            <van-col :span="12">
              {{item.operationDate}}
            </van-col>
            <van-col :span="4" :style="{textAlign:'center',fontWeight:'bolder',color:getTextAndColor(item.operationType)[1]}">
              {{getTextAndColor(item.operationType)[0]}}
            </van-col>
            <van-col :span="8" :style="{textAlign:'right',fontWeight:'bolder',color:getTextAndColor(item.operationType)[1]}">
              {{item.operationType===2?'-':'+'}} {{item.money}}
            </van-col>
          </van-row>

          <van-row style="margin: 2% 0">
            <van-col :span="15">
              账户 : {{item.moneyType===1?'押金':'预付款'}}
            </van-col>
            <van-col :span="9" :style="{textAlign:'right'}">
              操作人 : {{item.operationEmpName}}
            </van-col>
          </van-row>
          <van-row style="margin: 2% 0">
            <p> {{item.moneyType===1?'押金':'预付款'}}剩余 : {{ item.balance}}</p>
            <!--            <p>{{ item.remark}}</p>-->
          </van-row>
          <van-row style="margin: 2% 0">
            <p>备注: </p>
            <p>{{ item.remark}}</p>
          </van-row>
        </van-cell>

      </van-list>
    </div>
    <van-dialog v-model="dialogState" title="充值" show-cancel-button confirm-button-text="充值"
                :before-close="openRecharge">
      <br>
      <van-form>
        <van-field name="moneyType" label="充值项目">
          <template #input>
            <van-radio-group v-model="moneyType" direction="horizontal">
              <van-radio :name="2">预付款</van-radio>
              <van-radio :name="1">押金</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-model="money"
            label="充值金额"
            name="money"
            type="number"
            placeholder="充值金额"
            :rules="[{ validator, message: '请输入正数' }]"
        />
      </van-form>

    </van-dialog>

  </div>
</template>

<script>

import BaseNavBar from "@/components/nav-bar/base-nav-bar.vue";
import mathUtils from "@/common/js/utils/math-utils";

export default {
  name: "account_info",
  computed: {
    mathUtils() {
      return mathUtils
    }
  },
  data() {
    return {
      tenantVO: {},
      tenantCrop: localStorage.getItem("tenantCrop"),
      advanceCharge:0,
      cashPledge:0,

      listData:{
        billList:[],
        finished:false,
        loading:false,
        page: 1
      },
      dialogState:false,
      moneyType:2,
      money:0,
      empId:localStorage.getItem("empId"),
    }
  },
  components: {
    BaseNavBar
  },
  created() {
    this.queryAdvanceCharge();
    this.queryTenantBill();
  },
  mounted() {
    window.payResult = this.payResult
  },
  watch: {},
  methods: {
    //查询公司信息
    queryAdvanceCharge() {
      this.$axios({
        method: "GET",
        url: "/tenant/queryTenantInfo",
        params: {
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        this.tenantVO=response.data.data;
        this.advanceCharge = response.data.data.advanceCharge;
        this.cashPledge = response.data.data.cashPledge;

      })
    },

    //查询公司流水
    queryTenantBill() {
      this.listData.loading=true;
      this.$axios({
        method: "GET",
        url: "/tenantBill/queryList",
        params: {
          tenantCrop: this.tenantCrop,
          page: this.listData.page,
          limit:5,
        }
      }).then(response => {
        if (response.data.data.nextPage === 0) {
          this.listData.finished = true
        } else {
          this.listData.page = response.data.data.nextPage
        }
        this.listData.loading=false;
        this.listData.billList.push(...response.data.data.list);

      })
    },

    //获取操作类型文本和颜色
    getTextAndColor(type){
      switch (type){
        case 1: return ["存入",'red'];
        case 2: return ["支出",'green'];
        case 3: return [`退款`,'#bea81b'];
      }
    },
    openRecharge(action, done){
      if (action==="cancel"){
        done();
      }
      if (Number(this.money)>0){
        done();
        this.openRecharge1();
      }
      this.$toast.fail("请输入正数!");
      done(false);
    },
    openRecharge1(){
      if (/Linux/i.test(navigator.platform)) {
        androidMethod.getPayInfo(this.money,this.moneyType);
      } else {
        const iosdata = {
          money: this.money,
          moneyType: this.moneyType
        };
        const jsonString = JSON.stringify(iosdata);
        window.webkit.messageHandlers.bill.postMessage(jsonString);
      }
    },
    payResult(status){
      if (status === 0 || status === "0") {
        this.$toast.fail('充值失败!');
      } else if (status === 1 || status === "1") {
        this.$axios({
          method: "POST",
          url: "/tenantBill/saveRecharge",
          data: {
            tenantId: this.tenantVO.id,
            operationEmpId: this.empId,
            recordEmpId: this.empId,
            operationType:1,
            moneyType:this.moneyType,
            money: this.money,
            remark: "用户手机端自行充值!",
            tenantCrop:this.tenantCrop,
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success('充值成功');
          } else {
            this.$toast.fail(response.data.msg)
          }

        })
      }
      this.listData.page=1;
      this.listData.billList=[];
      this.queryAdvanceCharge();
      this.queryTenantBill();
    },
    validator(val) {
      return /^([0-9]*[.]?[0-9]+|[.]?[0-9]+)$/.test(val)&&val instanceof Number;
    },
    onLoad() {
      this.queryTenantBill()
    },

  }
}
</script>

<style scoped>
.card {
  margin: 3% auto 3% auto;
  background-color: #6391d2;
  width: 90%;
  color: #ffffff;
  border-radius: 10px;
}

.listCard{
  overflow-y:auto;
  margin: 0 auto;
  width: 90%;
  height: 67vh;
  color: #ffffff;

}

.listCard >>> .van-cell{
  border-radius: 10px;
}

.line{
  margin: 0 auto;
  background: #f1f1f1;/*背景色为浅灰色*/
  width:2px;/*设置宽高*/
  height:30px;
  padding-top: 30%;
}
/* 账单上线分割线 */
.van-divider{
  margin: 5px 0;
}
.buttonShow{
  width: 60%;
  height: 38px;
  margin-bottom: 5%;
  font-size: 14px;
  font-weight: bolder;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items:center;
  background: var(--my-success-two-color);
}
p{
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>
