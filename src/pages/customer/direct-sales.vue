<template>
  <div>
    <van-sticky>
      <baseNavBar title="销售直约" type="primary" />
    </van-sticky>

    <van-form scroll-to-error @submit="addDirectSales">

      <van-divider content-position="left">客资添加</van-divider>

      <van-cell-group>
        <van-field v-model="name" :rules="nameRule" label="客户名:" placeholder="没有请暂填无"></van-field>
      </van-cell-group>

      <van-cell-group>
        <van-field v-model="city" label="客户城市:" placeholder="请输入客户城市"></van-field>
      </van-cell-group>

      <van-cell-group>
        <van-field v-model="phone" label="手机号:" placeholder="请输入手机号"></van-field>
      </van-cell-group>

      <van-cell-group>
        <van-field v-model="weChat" label="微信号:" placeholder="请输入微信号"></van-field>
      </van-cell-group>

      <van-cell-group>
        <van-field
            readonly
            label="意向程度:"
            placeholder="请选择意向程度"
            :value="cusInShopWay.name"
            :rules="shopWayRule"
            @click="showPickerShopWay = true">
        </van-field>
        <van-popup v-model="showPickerShopWay" round position="bottom">
          <van-picker
            title="意向程度"
            show-toolbar
            value-key="name"
            :columns="cusInShopWayArray"
            @cancel="showPickerShopWay = false"
            @confirm="chooseShopWay"
          />
        </van-popup>
      </van-cell-group>

      <van-cell-group>
        <van-field
            readonly
            :value="cusChannel.name"
            :rules="cusChannelRule"
            label="客资来源:"
            placeholder="请选择客资来源"
            @click="showPickerChannel = true"
        />
        <van-popup v-model="showPickerChannel" round position="bottom">
          <van-picker
              show-toolbar
              title="客资来源"
              value-key="name"
              :columns="cusChannelArray"
              @cancel="showPickerChannel = false"
              @confirm="chooseChannel"
          />
        </van-popup>
      </van-cell-group>

      <van-cell-group>
        <van-field v-model="cusWedding" label="婚期:" placeholder="请填写婚期"></van-field>
        <van-popup>

        </van-popup>
      </van-cell-group>

      <van-cell-group>
        <van-field v-model="cusWeddingPlace" label="婚礼地点:" placeholder="请输入婚礼地点"></van-field>
      </van-cell-group>

      <van-cell-group>
        <van-field v-model="cusReception" label="录入人:" placeholder="请输入录入人"></van-field>
      </van-cell-group>

      <van-cell-group>
        <van-field
            v-model="cusMessage"
            rows="3"
            type="textarea"
            label="备注"
            placeholder="请输入备注"
            autosize
            maxlength="40"
            show-word-limit
        />
      </van-cell-group>

      <van-divider content-position="left">预约添加</van-divider>

      <van-cell-group>
        <van-field
            readonly
            :value="inviterText"
            :rules="inviterTextRule"
            label="接待人:"
            placeholder="请选择接待人"
            @click="showPickerInviter = true"
        />
        <van-popup v-model="showPickerInviter" round position="bottom">
          <van-picker
              show-toolbar
              title="接待人"
              :columns="inviters"
              @cancel="showPickerInviter = false"
              @confirm="chooseInviter"
          />
        </van-popup>
      </van-cell-group>

      <van-cell-group>
        <van-field
            readonly
            :value="appoint.text"
            :rules="appointRule"
            label="预约项目:"
            placeholder="请选择预约项目"
            @click="showPickerAppointName = true"
        />
        <van-popup v-model="showPickerAppointName" round position="bottom">
          <van-picker
              show-toolbar
              title="预约项目"
              :columns="appointNameArray"
              @cancel="showPickerAppointName = false"
              @confirm="chooseAppointName"
          />
        </van-popup>
      </van-cell-group>

      <van-cell-group>
        <van-field
            readonly
            :value="shop.shopName"
            :rules="shopRule"
            label="店铺:"
            placeholder="请选择店铺"
            @click="showPickerShop = true"
        />
        <van-popup v-model="showPickerShop" round position="bottom">
          <van-picker
              show-toolbar
              title="店铺"
              value-key="shopName"
              :columns="shops"
              @cancel="showPickerShop = false"
              @confirm="chooseShop"
          />
        </van-popup>
      </van-cell-group>

      <van-cell-group>
        <van-field readonly v-model="appCity" label="城市:" placeholder="请输入城市"></van-field>
      </van-cell-group>

      <van-cell-group>
        <van-field
            v-model="arriveDate"
            :rules="arriveDateRule"
            label="到店日期:"
            placeholder="请选择到店日期"
            @click="showPickerArriveDate = true"
        />
        <van-calendar v-model="showPickerArriveDate"
                      @confirm="chooseArriveDate" />
      </van-cell-group>

      <van-cell-group>
        <van-field
            readonly
            v-model="arriveTime"
            :rules="arriveTimeRule"
            label="到店时间:"
            placeholder="请选择到店时间"
            @click="showPickerArriveTime = true"
        />
        <van-popup v-model="showPickerArriveTime" round position="bottom">
          <van-picker
              show-toolbar
              title="到店时间"
              :columns="arriveTimeArray"
              @cancel="showPickerArriveTime = false"
              @confirm="chooseArriveTime"
          />
        </van-popup>
      </van-cell-group>

      <br><br><br><br>
      <van-row>
        <van-col span="14" offset="5">
          <van-button round block type="primary" native-type="submit">提交</van-button>
        </van-col>
      </van-row>
      <br><br><br><br><br>

    </van-form>
  </div>
</template>

<script>
import BaseNavBar from "@/components/nav-bar/base-nav-bar";
export default {
  name: "direct-sales",
  components: {BaseNavBar},
  data() {
    return {
      name:'',
      city:'',
      phone:'',
      weChat:'',
      cusInShopWay:'',
      cusChannel:{},
      cusWedding:'',
      cusReception:'',
      cusMessage:'',
      arriveDate:'',
      arriveTime:'',
      tenantCrop:'',
      cusWeddingPlace:'',
      inviter:'',
      inviterText:'',
      shop:'',
      appCity:'',
      appoint:{},
      emp:{},
      inviters:{},
      empId: localStorage.getItem("empId"),
      sourceList:[],
      shops:[],
      tryClothes:true,
      showPickerShopWay:false,
      showPickerChannel:false,
      showPickerArriveDate:false,
      showPickerArriveTime:false,
      showPickerShop:false,
      showPickerInviter:false,
      showPickerAppointName:false,
      cusInShopWayArray:[],
      cusChannelArray:[],
      appointNameArray:[],
      arriveTimeArray:['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00',
        '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'],
      shopWayRule:[{
        required:true,
        message:'请选择意向程度',
        trigger: 'onBlur'
      }],
      cusChannelRule:[{
        required:true,
        message:'请选择客资来源',
        trigger: 'onBlur'
      }],
      nameRule:[{
        required:true,
        message:'请输入客户名，没有请暂填无',
        trigger: 'onBlur'
      }],
      inviterTextRule:[{
        required:true,
        message:'请选择接待人',
        trigger: 'onBlur'
      }],
      appointRule:[{
        required:true,
        message:'请选择预约项目',
        trigger: 'onBlur'
      }],
      shopRule:[{
        required:true,
        message:'请选择店铺',
        trigger: 'onBlur'
      }],
      arriveDateRule:[{
        required:true,
        message:'请选择到店日期',
        trigger: 'onBlur'
      }],
      arriveTimeRule:[{
        required:true,
        message:'请选择到店时间',
        trigger: 'onBlur'
      }]
    }
  },
  created() {
    this.querySource();
    this.queryDegree();
    this.queryEmp();
    this.queryShop();
    this.queryInviter();
    this.queryAppointNameArray();
  },
  methods:{
    addDirectSales(data){
      data.name = this.name;//客资姓名
      data.city = this.city;//客户城市
      data.phone = this.phone;//客户手机号
      data.weChat = this.weChat;//客户微信
      data.grade = this.cusInShopWay.value;//意向程度
      data.source = this.cusChannel.value;//客资来源
      data.weddingDay = this.cusWedding;//婚期
      data.weddingVenue = this.cusWeddingPlace;//婚礼地点
      data.entryPer = this.cusReception;//录入人
      data.remark = this.cusMessage;//客资备注
      data.inviter = this.inviter;//预约人
      data.appointName = this.appoint.appointName;//预约项目
      data.appointShop = this.shop.value;//预约店铺
      data.appointCity = this.appCity;//预约城市
      data.appointDate = this.arriveDate;//预约日期
      data.appointTime = this.arriveTime;//预约时间
      data.tenantCrop = this.tenantCrop;//公司
      data.createDate = this.$dateUtils.vantDateToYMD(new Date());//创建时间
      console.log(data)
      this.$dialog.confirm({
        title:'新增销售直约',
        message:'是否确认添加该条销售直约？',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/customer/directSales",
          params: data
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("新增销售直约成功")
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
    chooseShopWay(value){
      this.cusInShopWay = value;
      this.showPickerShopWay = false;
    },
    chooseChannel(value){
      this.cusChannel = value;
      this.showPickerChannel = false;
    },
    chooseArriveDate(value){
      this.arriveDate = this.$dateUtils.vantDateToYMD(value);
      this.showPickerArriveDate =false;
    },
    chooseArriveTime(value){
      this.arriveTime = value;
      this.showPickerArriveTime = false;
    },
    queryShop(){
      this.$axios({
        method: "GET",
        url: "/shop/shopList",
        params: {
          tenantCrop: this.tenantCrop,
        }
      }).then( response => {
        for (let i = 0; i < response.data.data.list.length; i++) {
          this.shops[i] = {
            shopName: response.data.data.list[i].shopName,
            shopCity: response.data.data.list[i].shopCity,
            value: response.data.data.list[i].id,
          }
        }
      })
    },
    queryEmp(){
      this.$axios({
        method:"GET",
        url:'/emp/queryEmpById',
        params:{
          empId: this.empId,
        }
      }).then(response => {
        this.emp = response.data.data;
        this.cusReception = this.emp.empName;
        this.cusWeddingPlace = this.emp.tenantCity;
      })
    },
    querySource(){
      this.tenantCrop = localStorage.getItem("tenantCrop");
      this.$axios({
        method: "GET",
        url: "/source/querySourceList",
        params:{
          tenantCrop:this.tenantCrop,
        }
      }).then(response => {
        this.sourceList = response.data.data.list;
        for (let i = 0; i < response.data.data.list.length; i++) {
          this.cusChannelArray[i] = {
            name:response.data.data.list[i].sourceName,
            value:response.data.data.list[i].id,
          }
        }
      })
    },
    queryDegree(){
      this.$axios({
        method: "GET",
        url:"/grade/gradeList",
        params:{
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        for (let i = 0; i < response.data.data.list.length; i++) {
          this.cusInShopWayArray[i] = {
            name : response.data.data.list[i].gradeName,
            value: response.data.data.list[i].id,
          }
        }
      })
    },
    chooseShop(value){
      this.shop = value;
      this.showPickerShop = false;
      this.appCity = this.shop.shopCity;
    },
    queryInviter(){
      this.$selectUtils.queryEmpIds(this.$selectUtils.Picker).then(response => {
        this.inviters = JSON.parse(response.data.data);
      })
    },
    queryAppointNameArray(){
      this.$axios({
        method:"GET",
        url:"/select/appProjects",
        params:{
          type:this.$selectUtils.Picker,
          projectsType:this.$projectsType.appoint,
          preAfterSale:this.$selectUtils.Picker,
          tenantCrop:localStorage.getItem("tenantCrop"),
        }
      }).then(response =>{
        this.appointNameArray = JSON.parse(response.data.data);
        console.log(JSON.parse(response.data.data))
      })
    },
    chooseInviter(value){
      this.inviterText = value.text;
      this.inviter = value.id;
      this.showPickerInviter = false;
    },
    chooseAppointName(value){
      this.appoint.text = value.text;
      this.appoint.appointName = value.id;
      console.log(this.appoint)
      this.showPickerAppointName = false;
    }
  }
}
</script>

<style scoped>

</style>