<template>
  <div>
    <img alt="IVORY logo" src="../../assets/logo_black.png">
    <van-form @submit="onSubmit">
      <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data:function() {
    return {
      username:"1",
      password:"1"
    };
},
  methods: {

    onSubmit(values) {
      this.axios({
        methods: "GET",
        url:"/appoint/appointList",
        withCredentials: true,
        params:{
            tenantCrop:1
        }
      }).then(response=>{
        this.$router.push({
          name: 'home',
        });
        console.log(response)
      })
      console.log('submit', values);
    },
  },
}
</script>

<style scoped>

</style>