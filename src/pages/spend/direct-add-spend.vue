<template>
  <div>
    <van-sticky>
      <baseNavBar title="直接加支出"/>
    </van-sticky>

    <van-form scroll-to-error @submit="directAddSpendSubmit">
      <van-field
          v-model="content"
          name="content"
          label="内容"
          placeholder="请填写内容"
          required
          :rules="[{ required: true, message: '请填写内容'}]"
      />

      <!--支出发生日期。日期框 滚轮选择的-->
      <!--vant表单里的日历好像用不了。-->
      <van-field
          readonly
          clickable
          name="createDate"
          :value="createDate"
          label="支出发生日期"
          placeholder="点击选择支出发生日期"
          required
          @click="createDatePicker = true"
          :rules="[{ required: true, message: '请选择支出发生日期' }]"
      />
      <!--日期选择弹框-->
      <van-popup v-model="createDatePicker" position="bottom">
        <van-datetime-picker
            v-model="createDateCurrentDate"
            type="date"
            @cancel="createDatePicker = false"
            @confirm="onConfirmCreateDate"
            :min-date="minCreateDate"
            :max-date="maxCreateDate"
            :formatter="formatter"
        />
      </van-popup>

      <!--支出项目-->
      <van-field
          readonly
          clickable
          name="projectId"
          :value="projectText"
          label="支出项目"
          placeholder="点击选择支出项目"
          required
          @click="projectPicker = true"
          :rules="[{ required: true, message: '请选择支出项目' }]"
      />
      <van-popup v-model="projectPicker" position="bottom">
        <!--                        <van-search-->
        <!--                                v-model="projectSearchVal"-->
        <!--                                show-action-->
        <!--                                placeholder="请输入搜索关键词"-->
        <!--                                @search="projectOnSearch"-->
        <!--                                @cancel="projectSearchOnCancel"-->
        <!--                        />-->
        <van-picker
            show-toolbar
            :columns="projectArray"
            @cancel="projectPicker = false"
            @confirm="projectOnConfirm"
        />
      </van-popup>

      <!--店铺-->
      <van-field
          readonly
          clickable
          name="shopId"
          :value="shopText"
          label="店铺"
          placeholder="点击选择店铺"
          required
          @click="shopPicker = true"
          :rules="[{ required: true, message: '请选择店铺' }]"
      />
      <van-popup v-model="shopPicker" position="bottom">
        <van-picker
            show-toolbar
            :columns="shopArray"
            @cancel="shopPicker = false"
            @confirm="shopOnConfirm"
        />
      </van-popup>

      <!--支出金额-->
      <van-field
          v-model="spendAmount"
          name="spendAmount"
          type="number"
          label="支出金额"
          placeholder="请填写支出金额"
          required
          :rules="[{ required: true, message: '请填写支出金额' }]"
      />

      <!--报销人-->
      <van-field
          readonly
          clickable
          name="spendPeopleId"
          :value="spendPeopleText"
          label="报销人"
          placeholder="点击选择报销人"
          required
          @click="spendPeoplePicker = true"
          :rules="[{ required: true, message: '请选择报销人' }]"
      />
      <van-popup v-model="spendPeoplePicker" position="bottom">
        <van-picker
            show-toolbar
            :columns="spendPeopleArray"
            @cancel="spendPeoplePicker = false"
            @confirm="spendPeopleOnConfirm"
        />
      </van-popup>

      <van-field
          name="uploader"
          label="支出图片">
        <template #input>
          <van-uploader v-model="fileList" multiple :max-count="9"/>
        </template>
      </van-field>

      <!--公司结算方式-->
      <van-field
          readonly
          clickable
          name="spendMethodId"
          :value="spendMethodText"
          label="公司结算方式"
          placeholder="点击选择公司结算方式"
          required
          @click="spendMethodPicker = true"
          :rules="[{ required: true, message: '请选择公司结算方式' }]"
      />
      <van-popup v-model="spendMethodPicker" position="bottom">
        <van-picker
            show-toolbar
            :columns="spendMethodArray"
            value-key="name"
            @cancel="spendMethodPicker = false"
            @confirm="spendMethodOnConfirm"
        />
      </van-popup>

      <!--结算时间。选择完整时间，包括年月日和小时、分钟。 滚轮选择的-->
      <van-field
          readonly
          clickable
          name="spendMethodTime"
          :value="spendMethodTime"
          label="结算时间"
          placeholder="点击选择结算时间"
          required
          @click="spendMethodTimePicker = true"
          :rules="[{ required: true, message: '请选择结算时间' }]"
      />
      <!--完整时间选择弹框-->
      <van-popup v-model="spendMethodTimePicker" position="bottom">
        <van-datetime-picker
            v-model="spendMethodTimeCurrentDate"
            type="datetime"
            title="选择完整时间"
            @cancel="spendMethodTimePicker = false"
            @confirm="onConfirmSpendMethodTime"
            :min-date="minSpendMethodTime"
            :max-date="maxSpendMethodTime"
            :formatter="formatter"
        />
      </van-popup>
      <van-button
          color="linear-gradient(to right, #50E64D, #03B300)"
          class="bottom-button"
          round block type="primary"
          native-type="submit">提交
      </van-button>
    </van-form>

  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "directAddSpend",
  // inject: ['reload'],
  data() {
    return {
      content: '',
      spendAmount: '',

      //发生日期
      createDate: this.$dateUtils.getTimeStr('d'), //老板要求支出发生日期默认今天。
      createDatePicker: false,
      minCreateDate: new Date(2018, 0, 1),
      maxCreateDate: new Date(),
      createDateCurrentDate: new Date(),

      //支出项目
      projectId: "",
      projectText: "",
      projectArray: [],
      projectPicker: false,

      //店铺
      shopId: "",
      shopText: "",
      shopArray: [],
      shopPicker: false,

      //报销人
      spendPeopleId: "",
      spendPeopleText: "",
      spendPeopleArray: [],
      spendPeoplePicker: false,

      //公司结算方式
      spendMethodId: "",
      spendMethodText: "",
      spendMethodArray: [],
      spendMethodPicker: false,

      //公司结算时间
      spendMethodTime: this.$dateUtils.getTimeStr('minute'),
      spendMethodTimePicker: false,
      minSpendMethodTime: new Date(2018, 0, 1),
      maxSpendMethodTime: new Date(),
      spendMethodTimeCurrentDate: new Date(),

      spendId: "", //添加支出后返回的id
      fileList: [],
      spendPictureList: [],

      createPeopleId: "",
      createPeopleName: "",

      tenantCrop: localStorage.getItem("tenantCrop"),
      loading: false,
      finished: false,
    }
  },
  components: {
    baseNavBar
  },
  created() {
    this.queryProject();
    this.queryShop();
    this.querySpendMethod();
    this.querySpendPeople();

  },
  methods: {
    directAddSpendSubmit: function () {
      if (this.spendAmount < 0) {
        this.$dialog.alert({
          message: "支出金额不能是负数!",
        }).then(() => {
          // on close
        });
        return false
      }

      this.$dialog.confirm({
        title: '直接加支出',
        messageAlign: "left",
        message: "支出金额： " + this.spendAmount
            + '<br><br>确认信息无误？',
      }).then(() => {

        //没图片，只加支出的。
        if (this.fileList.length == 0) {
          this.addSpend().then(response => {
            if (response.data.code === 200) {
              this.$toast.success("添加支出成功");
              setTimeout(this.reset(), 5000);
              return;
            }
          })

        }

        //有加支出图片，则先加支出数据，再加支出图片。
        if (this.fileList.length >= 1) {
          this.addSpend().then(response => {
            if (response.data.code !== 200) {
              this.$toast.fail(response.data.msg);
              return;
            }

            //this.addSpend() 支出数据添加成功后，再执行下面这个。
            if (response.data.code === 200) {
              if ([null, '', undefined].includes(response.data.data)) {
                this.$dialog.alert({
                  message: "添加支出失败，请联系管理员查看。",
                }).then(() => {
                  return;
                  // on close
                });
              }

              //获取添加支出后返回的id
              this.spendId = response.data.data;
              this.$toast.loading({
                message: '上传图片中...',
                forbidClick: true,
                duration: 3000
              })
              this.uploadSpendImage().then(value => {
                if (!value) {
                  this.$toast.fail("图片上传发生错误,请检查后进行上传")
                } else {
                  this.$axios({
                    method: "PUT",
                    url: "/spend/saveBatchSpendImageAll",
                    data: {
                      tenantCrop: localStorage.getItem("tenantCrop"),
                      spendPictureList: this.spendPictureList,
                    }
                  }).then(res => {
                    console.log("res")
                    console.log(res)
                    if (res.data.code != 200) {
                      this.$dialog.alert({
                        message: "添加支出图片失败",
                      }).then(() => {
                        return
                      });
                    }

                    if (res.data.code == 200) {
                      this.$toast.success("添加支出成功");
                      setTimeout(this.reset(), 5000);
                      return;
                    }
                  })
                }
              })


            }


          })
        }

      })

    },

    //单纯加条支出数据，返回 response。response.data.data里有返回的 spendId。
    addSpend() {
      return this.$axios({
        method: "POST",
        url: "/spend/addSpend",
        data: {
          'tenantCrop': this.tenantCrop,
          'content': this.content,
          'createDate': this.createDate,
          'spendProjectsId': this.projectId,
          'shopId': this.shopId,
          'spendAmount': this.spendAmount,
          'spendPeopleId': this.spendPeopleId,
          'spendMethodId': this.spendMethodId,
          'spendMethodTime': this.spendMethodTime + ":00", //后端接要精确到秒的。
          //'settlement': 1, //直接加支出。 已结算 (1）
          'stateId': 4, // 直接加支出，设置审核状态为 已结算(4)
        },
      })
    },

    // for循环一张一张图片文件上传到服务器。
    uploadSpendImage: async function () {
      console.log("this.fileList")
      console.log(this.fileList)

      if (this.fileList.length !== 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          try {
            const response = await this.$upload.expendImageUpload(this.fileList[i].file)
            if (response.data.code === 200) {
              this.spendPictureList.push({
                'spendId': this.spendId,
                'spendImage': response.data.data,
                // 'imageType': "",
                'createPeopleName': this.createPeopleName,
                'createPeopleId': this.createPeopleId,
                //创建时间和更新时间 好像不用传过来，null的话数据库好像会默认当前。
                // 'createDate': this.$dateUtils.getTimeStr('s'),
                // 'updateDate': this.$dateUtils.getTimeStr('s'),
              })
            } else {
              throw new Error('上传失败')
            }
          } catch (error) {
            console.error(error)
            throw error
          }
        }
      }
      return true
    },


    //支出发生日期确认
    onConfirmCreateDate: function () {
      this.createDate = `${this.value1}-${this.value2}-${this.value3}`  // 字符串拼接 结果如2020-07-01
      this.createDatePicker = false
    },

    //查支出项目参数。
    queryProject: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.expend, this.$selectUtils.Picker).then(response => {
        this.projectArray = JSON.parse(response.data.data)
      })
    },

    //支出项目确认。
    projectOnConfirm: function (value) {
      this.projectId = value.id;
      this.projectText = value.text;
      this.projectPicker = false;
    },

    //查店铺参数。
    queryShop: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.Picker).then(response => {
        this.shopArray = JSON.parse(response.data.data)
      })
    },

    //店铺确认。
    shopOnConfirm: function (value) {
      this.shopId = value.id;
      this.shopText = value.text;
      this.shopPicker = false;
    },

    //查报销人参数。
    querySpendPeople: function () {
      this.$selectUtils.queryEmpIds(this.$selectUtils.Picker).then(response => {
        this.spendPeopleArray = JSON.parse(response.data.data);

        //老板要求报销人是 登录人。
        this.spendPeopleArray.find(s => {
          if (s.id == localStorage.getItem("empId")) {
            this.spendPeopleId = s.id
            this.spendPeopleText = s.text

            this.createPeopleId = s.id
            this.createPeopleName = s.text
          }
        })
      })
    },

    //报销人确认。
    spendPeopleOnConfirm: function (value) {
      this.spendPeopleId = value.id;
      this.spendPeopleText = value.text;
      this.spendPeoplePicker = false;
    },

    //查公司结算方式参数。
    querySpendMethod: function () {
      this.$selectUtils.queryAccount(this.$selectUtils.Picker).then(response => {
        this.spendMethodArray = JSON.parse(response.data.data)
      })
    },

    //公司结算方式确认。
    spendMethodOnConfirm: function (value) {
      this.spendMethodId = value.value;
      this.spendMethodText = value.name;
      this.spendMethodPicker = false;
    },

    //公司结算时间确认
    onConfirmSpendMethodTime: function () {
      this.spendMethodTime = `${this.value1}-${this.value2}-${this.value3} ${this.value4}:${this.value5}`
      this.spendMethodTimePicker = false
    },

    //页面变量值重置。
    reset: function () {
      //刷新当前页面。好像有点问题，手动置空好了。
      // setTimeout(location.reload(), 1000);
      // setTimeout(this.reload(), 1000);
      this.querySpendPeople(); //里面有会设置默认报销人。
      this.content = "";
      this.createDate = this.$dateUtils.getTimeStr('d');
      this.projectId = "";
      this.projectText = "";
      this.shopId = "";
      this.shopText = "";
      this.spendAmount = "";
      this.spendMethodId = "";
      this.spendMethodText = "";
      this.spendMethodTime = this.$dateUtils.getTimeStr('minute');

      this.spendId = "";
      this.spendPictureList = [];
      this.fileList = [];
    },

    //选项格式化函数。里面好像建了些变量，时间确认的函数有用到这些变量。
    formatter(type, value) {
      if (type === 'year') {
        this.value1 = value   // 可以拿到当前点击的数值
        return `${value}年`
      } else if (type === 'month') {
        this.value2 = value
        return `${value}月`
      } else if (type === 'day') {
        this.value3 = value
        return `${value}日`
      } else if (type === 'hour') {
        this.value4 = value
        return `${value}时`
      } else if (type === 'minute') {
        this.value5 = value
        return `${value}分`
      } else if (type === 'second') {
        this.value6 = value
        return `${value}秒`
      }
    },
  }
}
</script>


<style scoped>

.bottom-button {
  width: 80%;
  margin: 3% auto;
}

</style>