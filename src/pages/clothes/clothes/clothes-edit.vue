<template>
  <div>
    <van-sticky>
      <baseNavBar title="婚纱修改"/>
    </van-sticky>
    <van-field
        name="clothesSize"
        :value="form.clothesSize"
        label="选择尺寸"
        placeholder="点击选择第一件婚纱的尺寸"
        readonly
        @click="clothesSizeShowPicker = true"
        :rules="[{ required: true }]"
    />
    <van-popup v-model="clothesSizeShowPicker" position="bottom">
      <van-picker
          getColumnValues
          show-toolbar
          :columns="clothesSizeColumnsArray"
          @confirm="clothesSizeOnConfirm"
          @cancel="clothesSizeShowPicker = false"
      />
    </van-popup>
    <van-field
        readonly
        clickable
        center
        name="styleLabels"
        label="款式标签"
        placeholder="点击选择标签"
        @click="styleLabelShowPicker = true"
    >
      <template #input>
        <van-col slot="label">
          <van-tag v-for="item in styleLabelList" :key="item.value" v-if="styleLabels[item.value] === 1" type="danger"
                   size="large" closeable style="margin: 5px"
                   @click="pushStyleLabel(item.value,item.name)"
                   @close="close(item.value)">
            {{ item.name }}
          </van-tag>
        </van-col>
      </template>
    </van-field>
    <van-popup v-model="styleLabelShowPicker" position="bottom">
      <van-row type="flex" style="padding: 10px">
        <van-col style="margin: 5px" v-for="item in styleLabelList" :key="item.value">
          <van-tag type="danger" :class="styleLabels[item.value] === 1?'':'van-tag--plain'"
                   size="large"
                   @click="pushStyleLabel(item.value,item.name)">{{ item.name }}
          </van-tag>
        </van-col>
      </van-row>
    </van-popup>
    <van-field
        class="msg"
        name="styleInfo"
        v-model="form.styleInfo"
        type="textarea"
        label="款式介绍"
        placeholder="款式介绍"
        maxlength="40"
        show-word-limit
    />
    <van-field
        class="msg"
        name="styleFit"
        v-model="form.styleFit"
        type="textarea"
        label="适合身形"
        placeholder="请输入适合身形"
        maxlength="40"
        show-word-limit
    />
    <van-field
        class="msg"
        name="styleNoFit"
        v-model="form.styleNoFit"
        type="textarea"
        label="不适合身形"
        placeholder="请输入不适合身形"
        maxlength="40"
        show-word-limit
    />
    <van-button
        color="linear-gradient(to right, #50E64D, #03B300)"
        class="bottom-button"
        round block type="primary"
        @click="updateEdit">提交
    </van-button>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'
export default {
  name: "clothes-edit",
  data(){
    return{
      form:{
        id:"",
        styleId:"",
        clothesSize: "",
        finalStyleLabels:[],
        styleInfo:"",
        styleFit:"",
        styleNoFit:"",
        tenantCrop: localStorage.getItem("tenantCrop"),
      },
      clothes:{},

      clothesSizeShowPicker: false,
      clothesSizeColumnsArray: [],

      styleLabelShowPicker: false,
      styleLabelsText: "",
      styleLabelsTextArray: [],
      styleLabelList: [],
      styleLabels: [],



    }
  },
  components: {
    baseNavBar
  },
  created() {
    this.clothes = this.$route.query;
    this.form.id=this.clothes.clothesId;
    this.form.styleId=this.clothes.styleId;
    this.form.clothesSize=this.clothes.clothesSize;
    this.form.styleInfo=this.clothes.styleInfo;
    this.form.styleFit=this.clothes.styleFit;
    this.form.styleNoFit=this.clothes.styleNoFit;

    this.queryStyleLabelList();
    this.queryClothesSize();
  },
  methods:{
    updateEdit:function (){
      for (let temp in this.styleLabelList) {
        let index = this.styleLabelList[temp].value
        if (this.styleLabels[index] === 1) {
          this.form.finalStyleLabels.push(index)
        }
      }
      console.log(this.clothes)
      console.log(this.form)
      this.$dialog.confirm({
        title: "确认修改?",
        message: "",
      }).then(() => {
        this.$axios({
          method: "post",
          url: '/clothes/mUpdateClothes',
          data: {
            id:this.form.id,
            styleId:this.form.styleId,
            clothesSize:this.form.clothesSize,
            styleLabels:this.form.finalStyleLabels,
            styleInfo:this.form.styleInfo,
            styleFit:this.form.styleFit,
            styleNoFit:this.form.styleNoFit,
            tenantCrop:this.form.tenantCrop,
          }
        }).then(response => {
          if (response.data.code===200) {
            this.$toast.success('修改成功');
            return;
          }
          this.$toast.fail('修改失败');

        })
      })

    },
    clothesSizeOnConfirm: function (value) {
      this.form.clothesSize = value;
      this.clothesSizeShowPicker = false;
    },

    //查询礼服标签
    queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
        for (let temp in this.styleLabelList) {
          let index = this.styleLabelList[temp].value
          this.styleLabels[index] = 0
        }
        let temp = this.clothes.styleLabels
        const orStyleLabels = temp.split(",");
        for (const flag of orStyleLabels) {
          this.$set(this.styleLabels, flag, 1)
        }
      })
    },
    pushStyleLabel: function (value) {
      this.$set(this.styleLabels, value,
          this.styleLabels[value] === 1?0:1
      )
    },
    close: function (value) {
      this.$set(this.styleLabels, value, 0)
    },
    queryClothesSize() {
      this.$selectUtils.queryClothesSize().then(response => {
        this.clothesSizeColumnsArray = JSON.parse(response.data.data).map(s => s['name'])
      })
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