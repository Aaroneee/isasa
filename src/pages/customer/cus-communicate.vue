<template>
  <div>
    <baseNavBar title="客资沟通"/>
    <van-form scroll-to-error @submit="addCusCommunicate">
      <van-field
          readonly
          label="沟通方式:"
          :value="commType"
          :rules="wayRules"
          placeholder="请选择"
          @click="showPickerWay = true"
      />

      <van-popup v-model="showPickerWay" round position="bottom">
        <van-picker
            title="沟通方式"
            show-toolbar
            :columns="communicateWayArray"
            @cancel="showPickerWay = false"
            @confirm="changeCommunicate"
        />
      </van-popup>

      <van-field
          readonly
          label="意愿程度:"
          :value="commResult"
          :rules="willRules"
          placeholder="请选择"
          @click="showPickerWill = true"
      />

      <van-popup v-model="showPickerWill" round position="bottom">
        <van-picker
          title="意愿程度"
          show-toolbar
          :columns="willingnessArray"
          @cancel="showPickerWill = false"
          @confirm="changeWillingness"
        />
      </van-popup>

      <van-field
          v-show="showFlag"
          readonly
          label="设置提醒:">
        <van-switch v-model="SwitchAttention" slot="button" active-color="green" size="24px" @change="flagChange" />
      </van-field>

      <van-field
          v-show="showFlag"
          readonly
          label="沟通周期:"
          :value="commCycle"
          placeholder="请选择周期"
          @click="showPickerCycle = true"
      />
      <van-popup v-model="showPickerCycle" round position="bottom">
        <van-picker
          title="沟通周期"
          show-toolbar
          :columns="communicateArray"
          @cancel="showPickerCycle = false"
          @confirm="communicateCycleF"
        />
      </van-popup>

      <van-field
          v-model="commNote"
          rows="3"
          label="沟通内容:"
          :rules="messageRules"
          type="textarea"
          placeholder="请输入内容"
          autosize
          maxlength="40"
          show-word-limit
      />

      <van-field
        label="热门沟通:"
        placeholder="点击查看"
        @click="showPickerPopular = true"
      />
      <van-popup v-model="showPickerPopular" round position="bottom">
        <van-row type="flex" style="padding: 10px">
          <van-col style="margin: 5px" v-for="item in popularArray" :key="item">
            <van-tag type="danger" size="large" @click="clickPopular(item)">
              {{ item }}
            </van-tag>
          </van-col>
        </van-row>
      </van-popup>

      <br><br><br><br><br>
      <van-row>
        <van-col span="14" offset="5">
          <van-button round block type="primary" native-type="submit">提交</van-button>
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>

<script>
import BaseNavBar from "@/components/nav-bar/base-nav-bar";
export default {
  name: "cus-communicate",
  components: {BaseNavBar},
  data() {
    return{
      commType:'',
      commResult:'',
      commCycle:'',
      communicateContent:'',
      commNote:'',
      cusId: this.$route.query.cusId,
      communicateWayArray:["微信沟通","电话沟通"],
      willingnessArray:['意向程度高', '意向程度低'],
      communicateArray:['1天','2天','3天','5天','7天','14天','30天','60天'],
      popularArray:['已约试纱','微信跟进','婚博会意向金客户','只看租金','已拉群','取消预约，继续跟进','已加上微信，打招呼未回复','发了款式未回复','微信跟进已删客服微信','打招呼未回复',],
      showPickerWay:false,
      showPickerWill: false,
      showPickerCycle:false,
      SwitchAttention:true,
      showPickerPopular:false,
      showFlag:true,
      wayRules:[{
        required:true,
        message:'沟通方式不能为空',
        trigger: 'onBlur'
      }],
      willRules:[{
        required:true,
        message:'意愿程度不能为空',
        trigger: 'onBlur'
      }],
      messageRules:[{
        required:true,
        message:'沟通内容不能为空',
        trigger: 'onBlur'
      }]
    }
  },
  created() {

  },
  methods: {
    changeCommunicate(value){
      this.commType = value;
      this.showPickerWay = false;
    },
    changeWillingness(value){
      this.commResult = value;
      this.showPickerWill = false;
    },
    communicateCycleF(value){
      this.commCycle = value;
      this.showPickerCycle = false;
    },
    clickPopular(value){
      this.commNote = value;
      this.showPickerPopular = false;
    },
    flagChange(){
      this.showFlag = false;
    },
    addCusCommunicate(data) {
      console.log(data)
      data.commType = this.commType;
      if (this.commResult == "意向程度高"){
        data.commResult = 44;
      }else if (this.commResult == "意向程度低"){
        data.commResult = 45;
      }
      this.commCycle = this.commCycle.replace("天","");
      data.commCycle = this.commCycle;
      data.commNote = this.commNote;
      data.cusId = this.cusId;
      data.tenantCrop = localStorage.getItem("tenantCrop");
      this.$dialog.confirm({
        title:'新增客资沟通',
        message:'是否确认添加该条沟通？',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/comm/saveComm",
          params: data
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("新增沟通成功")
            const that = this
            setTimeout(function () {
              that.$router.back()
            }, 1000)
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })
    },
  }
}
</script>

<style scoped>

</style>