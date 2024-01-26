<template>

  <div v-cloak>
    <van-sticky>
      <switchNavBar
          :switchText="orderShop"
          @flag="showPickerShop=true"
          title="申请退押"/>
    </van-sticky>
    <!--主管可以筛选全国的。数据主管(14)、开发人员(11)、上海行政(16)、总经理(1)、培训师(9)、售后主管(27)-->
<!--    <div v-if="roleList.includes(14) || roleList.includes(11) || roleList.includes(16)-->
<!--                    || roleList.includes(1) || roleList.includes(9) || roleList.includes(27)">-->
<!--      <van-nav-bar-->
<!--          title="申请退押"-->
<!--          :left-text="orderShop"-->
<!--          :right-text="weddingDate"-->
<!--          @click-left="showPickerShopMethod"-->
<!--          @click-right="showBeginDate">-->
<!--      </van-nav-bar>-->
<!--    </div>-->
    <!--礼服师没筛选 只能靠该店的-->
<!--    <div v-else>-->
<!--      <van-nav-bar-->
<!--          title="申请退押"-->
<!--          :right-text="weddingDate"-->
<!--          @click-right="showBeginDate">-->
<!--      </van-nav-bar>-->
<!--    </div>-->

    <!--店铺选择弹框-->
    <van-popup v-model="showPickerShop" position="bottom">
      <van-picker
          show-toolbar
          :columns="orderShopArray"
          @cancel="onCancelShop"
          @confirm="onConfirmShop"
      />
    </van-popup>

    <!--日期选择弹框-->
    <van-popup v-model="showPickerDate" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date"
                           @cancel="onCancelDate"
                           @confirm="onConfirmDate" :min-date="minDate" :max-date="maxDate"
                           :formatter="formatter"/>
    </van-popup>


    <van-sticky>
      <form action="javascript:return true">
        <van-search
            @search="searchList"
            v-model="mobileSearchValue"
            placeholder="请输入客户名"/>
      </form>
    </van-sticky>


    <div>
      <van-tabs v-model="tagActiveName" sticky swipeable>
        <!-- tab未还纱, 未还纱 选项卡 -->
        <van-tab title="未还纱" name="1">
          <!-- 还纱 弹出层 开始 -->
          <van-popup
              v-model="showUpdatePicturePage"
              closeable
              round
              position="bottom"
              :style="{ height: '80%' }"
          >
            <br>
            <br>
            <!-- 展示收件单 开始 -->
            <div v-if="showPictureList.length > 0">
              <van-cell :key="item" v-for="item in showPictureList">
                <van-collapse v-model="activeNames">
                  <van-collapse-item title="收件单" :name="item.orderImage">
                    <van-image
                        width="99%"
                        height="99%"
                        :src="'https://www.ivorybai.com/order/' + item.orderImage "
                        @click="onclickPicture('https://www.ivorybai.com/order/' + item.orderImage)"
                    ></van-image>
                  </van-collapse-item>
                </van-collapse>
              </van-cell>
            </div>
            <div v-else>
              <p style="width:99%;height: 99%;text-align: center;margin-top: 50px">当前客户的收件单尚未上传</p>
              <br><br>
            </div>

            <!-- 上传收件单 -->
            <van-form @submit="addImage">
              <van-cell-group :title="imageAddTitle"></van-cell-group>
              <van-field name="uploader" label="选择图片">
                <template #input>
                  <van-uploader v-model="fileList" multiple :max-count="1"/>
                </template>
              </van-field>

              <br>
              <br>
              <van-row>
                <van-col span="22" offset="1">
                  <van-button
                      color="#ca947c"
                      class="bottom-button"
                      round block
                      type="primary"
                      native-type="submit">上传图片
                  </van-button>
                </van-col>
              </van-row>
            </van-form>
            <br>

            <!-- 表格 -->
            <div>
              <!-- 标题再套层div，不套的话 下个field显示不出来 -->
              <div>
                <van-field
                    readonly
                    label="已定礼服"
                    v-model="tableHeader"
                    input-align="center"
                    style="background-color: #f5f7fa"
                />
              </div>
              <van-field
                  v-for="item in clothesList" :key="item.id"
                  readonly
                  :label="item.clothesId"
                  input-align="center"
                  v-model="item.scheduleDate"
              />
            </div>
            <!-- 展示收件单 结束 -->

          </van-popup>
          <!-- 还纱 弹出层 结束 -->
          <van-list
              :v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
          >
            <van-cell style="font-size: 12px" v-for="(item, index) in usingClothesCustomerList" :key="index">
              <van-row>
                <van-col style="font-size: 15px" span="12">姓名:{{ item.cusName }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">手机号:{{ item.phone }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">订单店铺:{{ item.orderCity }}</van-col>
                <van-col span="12">婚期:{{ item.cudWed }}</van-col>
              </van-row>
              <van-row>
                <van-col span="8">收押金额:{{ item.spareMoney }}</van-col>
                <van-col span="8">到账金额:{{ item.receivedAmount }}</van-col>
                <van-col span="8">手续费:{{ item.charge }}</van-col>
              </van-row>
              <!--                            <van-row>-->
              <!--                                <van-col span="8">订单总和:{{item.orderCount}}</van-col>-->
              <!--                                <van-col span="8">收款总和:{{item.proceedsCount}}</van-col>-->
              <!--                            </van-row>-->

              <van-button round plain color="#ca947c" type="primary" size="small"
                          @click="showUpdatePicturePopup(item)">还纱
              </van-button>

            </van-cell>
          </van-list>
        </van-tab>

        <!-- tab未退押, 未退押 选项卡 -->
        <van-tab title="未退押" name="2">
          <!-- 申请退押 弹出层 开始 -->
          <van-popup
              v-model="applyRefundPage"
              closeable
              round
              position="bottom"
              :style="{ height: '80%' }"
          >
            <br>
            <br>
            <van-popup v-model="refundMethodShowPicker" position="bottom">
              <van-picker
                  value-key="name"
                  show-toolbar
                  :columns="refundMethodColumns"
                  @confirm="refundMethodOnConfirm"
                  @cancel="refundMethodShowPicker = false"
                  @change="refundMethodOnChange"
              />
            </van-popup>
            <!-- 申请退押form -->
            <van-form @submit="submitApply">
              <van-cell-group title="填写退押申请"></van-cell-group>
              <van-field
                  v-model="refundMethodValue"
                  is-link
                  readonly
                  name="refundMethodValue"
                  label="退款方式"
                  placeholder="点击选择退款方式"
                  @click="refundMethodShowPicker = true"
                  required
                  :rules="[{ required: true }]">
              </van-field>

              <van-field
                  v-model="refundAmount"
                  type="number"
                  name="refundAmount"
                  label="退押金额"
                  :placeholder="selectSpareMoneyInfo"
                  required
                  :rules="[{ required: true }]">
              </van-field>

              <van-field
                  v-model="refundTarget"
                  name="refundTarget"
                  label="姓名"
                  placeholder="请填写姓名"
                  required
                  :rules="[{ required: true }]">
              </van-field>

              <div v-if="refundMethodValue === '支付宝' ">
                <van-field
                    v-model="targetAccount"
                    name="targetAccount"
                    label="支付宝账号"
                    placeholder="请填支付宝账号"
                    required
                    :rules="[{ required: true }]">
                </van-field>
              </div>
              <div v-if="refundMethodValue === '银行卡转账' ">
                <van-field
                    v-model="targetAccount"
                    name="targetAccount"
                    label="银行卡号"
                    placeholder="请填银行卡号"
                    required
                    :rules="[{ required: true }]">
                </van-field>
              </div>
              <div v-if="refundMethodValue === '微信' ">
                <van-field
                    v-model="targetAccount"
                    name="targetAccount"
                    label="微信号"
                    placeholder="请填微信号"
                    required
                    :rules="[{ required: true }]">
                </van-field>
              </div>

              <van-field
                  name="refundInfo"
                  label="备注"
                  placeholder="如有特殊情况请备注"
                  v-model="refundInfo"
                  rows="2"
                  autosize
                  type="textarea"
                  show-word-limit
              ></van-field>
              <br>
              <br>
              <van-row>
                <van-col span="22" offset="1">
                  <van-button
                      color="#ca947c"
                      class="bottom-button"
                      round block
                      type="primary"
                      native-type="submit">申请退押
                  </van-button>
                </van-col>
              </van-row>

              <br>
            </van-form>


          </van-popup>
          <!-- 申请退押 弹出层 结束 -->

          <van-list
              :v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
          >
            <van-cell style="font-size: 12px" v-for="item in noRefundList" :key="item.id">
              <van-row>
                <van-col style="font-size: 15px" span="12">姓名:{{ item.cusName }}</van-col>
                <van-col style="color: #ca947c; font-size: 15px;" span="12">{{ item.refundName }}
                </van-col>
              </van-row>
              <van-row>
                <van-col span="12">手机号:{{ item.phone }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">订单店铺:{{ item.orderCity }}</van-col>
                <van-col span="12">婚期:{{ item.accuratelyWedding }}</van-col>
              </van-row>
              <van-row>
                <van-col span="8">收押金额:{{ item.spareMoney }}</van-col>
                <van-col span="8">到账金额:{{ item.receivedAmount }}</van-col>
                <van-col span="8">手续费:{{ item.charge }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">收款人:{{ item.refundPeople }}</van-col>
                <van-col span="12">收款日期:{{ item.createDate }}</van-col>
              </van-row>

              <!-- 已申请退押的才有 退押申请信息，然后 备注不为空的要显示备注 -->
              <div v-if="item.applyRefundMortgage === '已申请退押' ">
                <van-row>
                  <van-col span="24">退押申请信息:{{ getCopyInfo(item) }}</van-col>
                </van-row>
              </div>

<!--              <div v-if="item.applyRefundMortgage !== '已申请退押' ">-->
<!--                <van-button round plain color="#ca947c" type="primary" size="small"-->
<!--                            @click="showApplyPopup(item)">申请退押-->
<!--                </van-button>-->
<!--              </div>-->
              <div v-if="item.applyRefundMortgage === '已申请退押' ">
                <van-button round plain color="#ca947c" type="primary" size="small"
                            @click="copyInfo(item)">复制退押申请信息
                </van-button>
              </div>


            </van-cell>
          </van-list>
        </van-tab>

        <!-- tab已退押, 已退押 选项卡 -->
        <van-tab title="已退押" name="3">
          <van-list
              :v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
          >
            <van-cell style="font-size: 12px" v-for="item in alreadyRefundList" :key="item.id">
              <van-row>
                <van-col style="font-size: 15px" span="12">姓名:{{ item.cusName }}</van-col>
                <van-col style="color: #ca947c; font-size: 15px;" span="12">{{ item.applyRefundMortgage }}
                </van-col>
              </van-row>
              <van-row>
                <van-col span="12">手机号:{{ item.phone }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">订单店铺:{{ item.orderCity }}</van-col>
                <van-col span="12">婚期:{{ item.accuratelyWedding }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">退款方式:{{ item.settlement_account }}</van-col>
                <van-col span="12">退款金额:{{ item.refund_amount }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">订单完成人:{{ item.order_over_people }}</van-col>
                <van-col span="12">退款日期:{{ item.create_date }}</van-col>
              </van-row>
            </van-cell>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"
import axios from "axios";

export default {

  name: "applyRefund",
  components: {
    switchNavBar,
  },
  data() {
    return {

      refundMethodValue: '',
      refundMethodColumns: this.queryRefundMethod(),
      refundMethodShowPicker: false,
      refundAmount: '',
      refundTarget: '',
      targetAccount: '',
      refundInfo: '',

      applyRefundPage: false,

      tableHeader: "档期",
      clothesList: [],
      imageName: null,
      empId: localStorage.getItem("empId"),
      selectCudId: null,
      selectProceedsId: null,
      selectSpareMoney: null,  //选中的收押金额
      selectSpareMoneyInfo: '',  //申请退押时 退押金额的placeholder
      selectCusName: '',
      imageAddTitle: '',
      activeNames: [],
      showPictureList: [],
      fileList: [],

      showUpdatePicturePage: false,

      tagActiveName: "1",

      tenantCrop: localStorage.getItem("tenantCrop"),
      noRefundList: [],
      alreadyRefundList: [],
      usingClothesCustomerList: [],
      mobileSearchValue: "",
      loading: false,
      finished: false,

      date: '',
      createDateShow: false,
      appointName: "",
      inviter: "",
      appointDress: "",
      appointShop: "",
      state: "",

      minDate: new Date(2019, 0, 1),
      maxDate: new Date(2025, 0, 1),
      currentDate: new Date(),
      showPickerDate: false,
      weddingDate: "选择订单婚期",

      roleList: [],
      orderShop: "选择店铺", //未退押、已退押 看的是t_order.order_city，未还纱 可能看的是客资婚期表里的店铺。
      showPickerShop: false,
      orderShopArray: this.queryAllShop(),

    }
  },
  created() {
    // this.queryRoleByEmpId();
    this.searchList();
  },
  methods: {

    //查角色根据empId
    queryRoleByEmpId: function () {
      this.$axios({
        method: "GET",
        url: '/ios/queryRoleById/' + this.empId,
      }).then(response => {
        console.log("response.data.result233")
        console.log(response.data.result)
        this.roleList = response.data.result;
      })
    },

    //把要复制的信息复制了，然后可以直接粘贴。
    copyInfo: function (item) {
      // 模拟 输入框
      var cInput = document.createElement("input");
      cInput.value = this.getCopyInfo(item); //获取要复制的信息 根据item
      document.body.appendChild(cInput);
      cInput.select(); // 选取文本框内容

      // 执行浏览器复制命令
      // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
      // Input要在正常的编辑状态下原生复制方法才会生效
      document.execCommand("copy");

      this.$toast.success("复制成功!")
      // 复制成功后再将构造的标签 移除
      document.body.removeChild(cInput);
    },

    //获取要复制的信息 根据item
    getCopyInfo: function (item) {
      if (item.refundInfo != null && item.refundInfo !== '') {
        return "客户 " + item.cusName + " 还件退押金" + item.refundAmount + "元，" + item.refundMethod
            + item.targetAccount + item.refundTarget + "(申请人 " + item.createMan + ")"
            + " 备注：" + item.refundInfo;
      } else {
        return "客户 " + item.cusName + " 还件退押金" + item.refundAmount + "元，" + item.refundMethod
            + item.targetAccount + item.refundTarget + "(申请人 " + item.createMan + ")";
      }
    },

    //退款方式里的改变选项时触发的函数
    refundMethodOnChange(picker, value, index) {
      // console.log("当前picker：" + picker);
      // console.log("当前value：" + value);
      // console.log("当前index：" + index);
      this.targetAccount = '';
      // if (value == "现金") this.targetAccount = 0; //如果是现金，targetAccount退款目标账号 填0 //不起作用传到后端还是从data里拿数据，不从this里拿。
    },

    //选退款方式里的确认
    refundMethodOnConfirm(value) {
      this.refundMethodValue = value.value;
      this.refundMethodShowPicker = false;
    },

    //申请退押 请求
    submitApply: function (data) {
      console.log("data")
      console.log(data)
      if (data.refundAmount < 0) {
        this.$toast.success("退押金额不能为负数!")
        return false
      }
      if (data.refundAmount > this.selectSpareMoney) {
        this.$toast.success("退押金额不能超过押金金额(" + this.selectSpareMoney + "元)!")
        return false
      }

      this.$dialog.confirm({
        title: '申请退押',
        message: '申请退押？'
      }).then(() => {
        axios({
          method: "PUT",
          url: 'https://www.ivorybai.com:8080/ios/applyForRefundMo',
          params: {
            empId: this.empId,
            createMan: document.getElementById("empName").value,

            cudId: this.selectCudId,
            proceedsId: this.selectProceedsId,
            refundMethod: data.refundMethodValue,
            refundAmount: data.refundAmount,
            refundTarget: data.refundTarget,
            targetAccount: data.targetAccount,
            refundInfo: data.refundInfo,
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.refundMethodValue = '';
            this.refundAmount = '';
            this.refundTarget = '';
            this.targetAccount = '';
            this.refundInfo = '';
            this.searchList();

            this.$toast.success("申请成功")
            this.applyRefundPage = false;
          } else {
            this.$toast.fail(response.data.msg);
          }
        })

      }).catch(() => {
        // on cancel
        console.log("点了取消")
      });
    },

    //点申请退押按钮 展示弹出层
    showApplyPopup: function (item) {
      console.log("item")
      console.log(item)

      if (item.applyRefundMortgage !== "已上传收件单") {
        this.$dialog.alert({
          message: '请先去 未还纱列表-还纱',
        }).then(() => {
        });
        return false
      }

      this.applyRefundPage = true;
      this.selectCudId = item.cudId;
      this.selectProceedsId = item.proceedsId;
      this.selectSpareMoney = item.spareMoney;
      this.selectSpareMoneyInfo = "请填写退押金额 " + "(收押金额" + item.spareMoney + ")";

      this.refundMethodValue = '';
      this.refundAmount = '';
      this.refundTarget = '';
      this.targetAccount = '';
      this.refundInfo = '';
    },

    //同步的。 执行orderImageUpload. 同步代码2
    uploadOrderImage: function () {
      return new Promise((resolve, reject) => {
        if (this.fileList.length !== 0) {
          this.orderImageUpload(this.fileList[0].file)
              .then(response => {
                let data = response.data
                if (data.code === 200) {
                  this.imageName = response.data.result;
                  resolve(true)
                } else {
                  reject(false)
                }
              })
        } else {
          resolve(true)
        }
      })
    },

    //上传图片到服务器。 同步代码3
    orderImageUpload: function (file) {
      const data = new FormData();
      data.append('file', file)
      return this.$axios({
        method: "post",
        url: '/upload/uploadImage/order', //上传接口
        headers: {'Content-Type': 'multipart/form-data'},
        data: data,
      })
    },

    //上传收件单
    addImage: function (data) {

      if (this.fileList.length === 0) {
        this.$toast.fail("当前未选择图片,选择后进行提交")
        return
      }

      this.$dialog.confirm({
        title: '收件礼服确认',
        message: '是否对照最下面的已定礼服表格 确认过收件礼服？ ',
      }).then(() => {
        this.$dialog.confirm({
          title: '上传收件单',
          message: '是否上传收件单?',
        }).then(() => {
          if (this.fileList.length !== 0) {
            this.$toast.loading({
              message: '上传图片中...',
              forbidClick: true,
              duration: 3000
            })
          } else {
            this.$toast.fail("当前未选择图片,选择后进行提交")
            return
          }

          //先执行 uploadOrderImage 在执行下面的axios。 同步需要3步代码，这是同步代码1
          this.uploadOrderImage().then(value => {
            if (!value) {
              this.$toast.fail("图片上传发生错误,请检查后进行上传")
            } else {
              this.$axios({
                method: 'post',
                url: '/ios/insertReceiveOrderImage',
                params: {
                  cudId: this.selectCudId,
                  empId: this.empId,
                  orderImage: this.imageName,
                  orderRate: '7',
                }
              }).then(response => {
                console.log("response")
                console.log(response)
                console.log(response.data)
                console.log(response.data.result)
                if (response.data.code !== 200) {
                  this.$toast.fail(response.data.msg)
                  return
                }

                this.fileList = []
                this.searchList();
                if (response.data.result.length >= 1) { //如果这个客户的押金 还没退，提示退押金
                  this.mobileSearchValue = this.selectCusName;
                  console.log("proceedsId")
                  console.log(response.data.result[0].proceedsId)
                  this.$dialog.confirm({
                    title: '上传成功!',
                    message: '该客户还有押金未退，是否提交退押申请？ ',
                  }).then(() => {
                    this.showUpdatePicturePage = false;
                    this.tagActiveName = "2";
                    this.noRefundList = response.data.result;
                    this.selectProceedsId = response.data.result[0].proceedsId;
                    this.applyRefundPage = true;
                  })
                } else { //没押金 或 押金退了 提示 收件单上传成功
                  this.$toast.success("上传成功!")
                }

                setTimeout(this.queryReceiveOrderPicture, 1000)

              });
            }
          })

        })
      })
    },

    //点还纱按钮 展示弹出层。还纱（即上传收件单）
    showUpdatePicturePopup: function (item) {
      this.showUpdatePicturePage = true;
      this.selectCudId = item.cudId;
      this.selectCusName = item.cusName;
      this.imageAddTitle = "上传收件单 客户：" + item.cusName;
      this.selectSpareMoney = item.spareMoney;
      this.selectSpareMoneyInfo = "请填写退押金额 " + "(收押金额" + item.spareMoney + ")";

      this.queryReceiveOrderPicture();
      this.queryClothesListByCudId();
    },

    //收件单图片查询
    queryReceiveOrderPicture: function () {
      this.$axios({
        method: 'get',
        params: {
          "cudId": this.selectCudId
        },
        url: '/ios/queryReceiveOrderPicture',
      }).then(response => {
        let res = response.data;
        let result = res.result;
        this.showPictureList = result;

        //activeNames里放要默认展开的 折叠面板。每次点按钮前要清空一下，防止重复加。
        this.activeNames = [];
        for (let i = 0; i < result.length; i++) {
          this.activeNames.push(result[i].orderImage);
        }
      });
    },

    //已定礼服查询
    queryClothesListByCudId: function () {
      this.$axios({
        method: 'get',
        url: '/ios/queryClothesListByCudId/' + this.selectCudId,
      }).then(response => {
        let res = response.data;
        let result = res.result;
        this.clothesList = result
      });
    },

    //查 已退押列表。默认 主管看全国当月， 非主管 看该店当月
    queryAlreadyRefundList: function () {
      this.alreadyRefundList = []
      axios({
        method: "GET",
        url: 'https://www.ivorybai.com:8080/ios/queryAlreadyRefundList',
        params: {
          city: this.orderShop,
          weddingDate: this.weddingDate === "选择订单婚期" ? this.$dateUtils.tran_second_of_the_month(this.$dateUtils.getTimeStr('M'))
              : this.$dateUtils.tran_second_of_the_month(this.weddingDate),//不是月份 就传 当月时间区间，是月份 就转为区间格式，例如这样2021-03-01 00:00:00 - 2021-03-31 23:59:59
          mobileSearchValue: this.mobileSearchValue,
          empId: 1,
          tenantCrop: localStorage.getItem("tenantCrop"),
          page: 1,
        }
      }).then(response => {
        this.alreadyRefundList.push(...response.data.result.list) ;
        this.finished = true;
      })
    },
    queryRefundMethod() {
      return [
        {name: '支付宝', value: '支付宝'},
        {name: '银行卡转账', value: '银行卡转账'},
        {name: '微信', value: '微信'},
        {name: '现金', value: '现金'},
      ];
    },
    queryCityByShop(shop) {
      if (shop === "华鑫店") return "上海";
      if (shop === "萧山店") return "杭州";
      if (shop === "朝阳店") return "北京";
      if (shop === "常州店") return "常州";
      if (shop === "大宁店") return "上海";
    },
    queryAllShop() {
      return ["上海", "北京", "杭州", "常州", "大宁店"];
    },
    queryEarningShopByShop(shop) {
      if (shop === "华鑫店") return "上海";
      if (shop === "萧山店") return "杭州";
      if (shop === "朝阳店") return "北京";
      if (shop === "常州店") return "常州";
      if (shop === "大宁店") return "大宁店";
      if (shop === "维拉店") return "维拉店";
    },

    //查 申请退押列表 即 未退押列表。默认 主管看全国所有未退押的， 非主管 看该店所有的。
    applyRefundMortgageList: function () {
      this.noRefundList =[]

     axios({
        method: "GET",
        url: 'https://www.ivorybai.com:8080/ios/applyRefundMortgageList',
        params: {
          city: this.orderShop,
          weddingDate: this.weddingDate === "选择订单婚期" ? "选择订单婚期"
              : this.$dateUtils.tran_second_of_the_month(this.weddingDate),//转为区间格式，例如这样2021-03-01 00:00:00 - 2021-03-31 23:59:59
          mobileSearchValue: this.mobileSearchValue,
          empId: 1,
          tenantCrop: localStorage.getItem("tenantCrop"),
          page: 1,
        }
      }).then(response => {
        this.noRefundList.push(...response.data.result.list) ;
        this.finished = true;
      })
    },

    //查正在用衣服的客户 即未还纱列表。默认 主管看全国所有的未还纱，非主管 看该店所有的(该店的礼服师都能处理还纱)。
    queryUsingClothesCustomer: function () {
      this.usingClothesCustomerList =[]
      axios({
        method: "GET",
        url: 'https://www.ivorybai.com:8080/ios/queryUsingClothesCustomer',
        params: {
          city: this.orderShop,
          weddingDate: this.weddingDate === "选择订单婚期" ? "选择订单婚期"
              : this.$dateUtils.tran_second_of_the_month(this.weddingDate),//转为区间格式，例如这样2021-03-01 00:00:00 - 2021-03-31 23:59:59
          mobileSearchValue: this.mobileSearchValue,
          empId: 1,
          page: 1,
        }
      }).then(response => {
        console.log("response111")
        console.log(response.data.result)
        this.usingClothesCustomerList = response.data.result.list;
        this.finished = true;
      })
    },

    searchList() {
      this.applyRefundMortgageList();
      this.queryAlreadyRefundList();
      this.queryUsingClothesCustomer();
    },

    // 日期组件自定义格式
    formatter(type, value) {
      if (type === 'year') {
        this.value1 = value   // 可以拿到当前点击的数值
        return `${value}年`
      } else if (type === 'month') {
        this.value2 = value
        return `${value}月`
      }
    },
    //关闭 选择日期的弹层
    onCancelDate() {
      this.showPickerDate = false
    },
    //确认选中的婚期
    onConfirmDate() {
      this.weddingDate = `${this.value1}-${this.value2}`  // 字符串拼接 结果如2020-07
      this.searchList();
      this.onCancelDate()
    },
    //显示选择订单婚期的弹层
    showBeginDate: function () {
      this.showPickerDate = true
    },

    //关闭 选择店铺的弹层
    onCancelShop() {
      this.showPickerShop = false
    },

    //显示选择店铺的弹层
    showPickerShopMethod: function () {
      this.showPickerShop = true
    },

    //确认选中的店铺
    onConfirmShop(value, index) {
      this.orderShop = value;
      this.searchList();
      this.onCancelShop()
    },

    //点击查看图片 可 拉伸放大
    onclickPicture: function (pictureUrl) {
      console.log("pictureUrl")
      console.log(pictureUrl)

      this.ImagePreview([pictureUrl]);
    },


  },
}
</script>

<style scoped>

</style>