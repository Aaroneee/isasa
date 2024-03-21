<template>
  <div>
    <van-sticky>
      <switchNavBar title="款式价格" :switchText="editFlag?'编辑':'关闭'" @flag="changeEditFlag"/>
    </van-sticky>
    <van-collapse v-model="activeNames">
      <van-collapse-item :title="item.shopName" :name="index" icon="shop-o" v-for="(item,index) in stylePriceArr" :key="index" >
        <van-cell-group>
          <van-field v-for="(child,index) in item.data" :key="index"
                     v-model="priceModel[child.index]"
                     :label="child.priceType"
                     :disabled="editFlag"
                     @change="inputChange(child,$event,index) "
                     right-icon="gold-coin-o"/>
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
    <br>
    <van-button
        round block type="primary"
        style="width: 200px;margin: 0 auto"
        native-type="submit"
        @click="addPriceFlag=true">添加价格
    </van-button>
    <van-popup position="bottom"  v-model="addPriceFlag" >
      <van-form scroll-to-error @submit="addStylePrice">
        <van-field
            name="shopId"
            :value="shopText"
            label="店铺"
            placeholder="点击选择店铺"
            readonly
            @click="shopIdShowPicker = true"
            :rules="[{ required: true }]"
        />
        <van-popup v-model="shopIdShowPicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="shopIdArr"
              @confirm="shopIdOnConfirm"
              @cancel="shopIdShowPicker = false"
          />
        </van-popup>
        <van-field
            name="priceType"
            :value="priceType"
            label="价格类型"
            placeholder="点击选择价格类型"
            readonly
            @click="priceTypeShowPicker = true"
            :rules="[{ required: true }]"
        />
        <van-popup v-model="priceTypeShowPicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="priceTypeArr"
              @confirm="priceTypeOnConfirm"
              @cancel="priceTypeShowPicker = false"
          />
        </van-popup>
        <van-field
            name="price"
            v-model="price"
            center
            label="价格"
            type="number"
            placeholder="请输入价格"
            :rules="[{ required: true }]">
        </van-field>
        <br><br>
        <van-button
            round block type="primary"
            style="width: 200px;margin: 0 auto"
            native-type="submit">提交
        </van-button>
        <br><br><br><br><br><br><br><br>
      </van-form>
    </van-popup>
  </div>

</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar";

export default {
  name: "style-price",
  components: {
    switchNavBar
  },
  data(){
    return{
      activeNames:[],
      styleId: "",

      price:"",
      shopId:"",
      shopText:"",
      shopIdArr:[],
      shopIdShowPicker:false,

      priceType:"",
      priceTypeArr:[],
      priceTypeShowPicker:false,

      priceModel:[],
      stylePriceArr:[],
      editFlag:true,
      addPriceFlag:false,

      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  created() {
    this.styleId = this.$route.query
    this.queryPriceByStyleId();
    this.queryShopIds();
    this.queryStylePriceType();
  },
  methods:{
    //根据ID 查询价格
    queryPriceByStyleId() {
      this.priceModel=[];
      this.stylePriceArr=[];
      this.editFlag=true;
      this.$axios({
        method: "GET",
        url: "/stylePrice/queryByStyleId",
        params: {
          styleId: this.styleId,
        }
      }).then(response => {
        response = response.data.data;
        let shopIdSet = new Set();
        let stylePriceArr = [];
        response.map((k,index) => {
          this.priceModel.push(k.price)
          this.activeNames.push(index)
          k.index=index
          shopIdSet.add(k.shopId);
        });
        shopIdSet.forEach(item=> {
          stylePriceArr.push({shopId: item,shopName:"",data:[]});
        })
        stylePriceArr = Array.from(stylePriceArr).map((k,index)=>{
          k.readFlag=index;
          return k;
        });
        response.map(k => {
          for(let item of stylePriceArr){
            if (item.shopId === k.shopId) {
              item.shopName = k.shopName;
              item.data.push(k);
            }
          }
        });
        this.stylePriceArr.push(...stylePriceArr);
      })
    },
    changeEditFlag(){
      this.editFlag=!this.editFlag;
    },
    inputChange(child,event,key){
      this.$dialog.confirm({
        title: '修改价格',
        message: '是否确认修改此价格?',
      }).then(() => {
        this.$axios({
          method:"POST",
          url:"/stylePrice/updateStylePrice",
          params:{
            id:child.id,
            price:event.target.value
          }
        }).then(response=>{
          if (response.data.code === 200) {
            this.queryPriceByStyleId();
            this.$toast.success("更改成功");
          } else {
            this.$toast.fail(response.data.msg)
            this.$set(this.priceModel,child.index,child.price);
          }
        })
      }).catch(() => {
        this.queryPriceByStyleId();
        this.$set(this.priceModel,child.index,child.price);
      });
    },
    //提交价格
    addStylePrice(){
      this.$dialog.confirm({
        title: '添加价格',
        message: '是否确认添加此价格?',
      }).then(() => {
        this.$axios({
          method: "PUT",
          url: "/stylePrice/addStylePrice",
          params: {
            shopId: this.shopId,
            styleId: this.styleId,
            priceType:this.priceType,
            price:this.price,
            tenantCrop:this.tenantCrop
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("添加成功!")
            this.addPriceFlag=false;
            this.queryPriceByStyleId();
          } else {
            this.$toast.fail(response.data.msg)
          }
        });
      }).catch(() => {
        this.queryPriceByStyleId();
      });
    },
    shopIdOnConfirm(value){
      this.shopId=value.id;
      this.shopText=value.text;
      this.shopIdShowPicker=false;
    },
    priceTypeOnConfirm(value){
      this.priceType=value.id;
      this.priceTypeShowPicker=false;
    },
    //查询价格类型
    queryStylePriceType: function () {
      this.$selectUtils.queryStylePriceType(this.$selectUtils.Picker).then((response) => {
        this.priceTypeArr = JSON.parse(response.data.data);
      })
    },
    //查询店铺
    queryShopIds: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.Picker).then((response) => {
        this.shopIdArr = JSON.parse(response.data.data);
      })
    },
  }
}
</script>

<style scoped>
/deep/ .van-cell--clickable span{
  /*color: #3b86e8;*/
  /*color: black;*/
  font-weight: bold;
}
/deep/ .van-field__control{
  text-align: right;
  padding-right: 3%;
}
</style>