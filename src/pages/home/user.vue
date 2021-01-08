<template>
  <div class="profilePhoto">
    <van-image

        round
        width="7rem"
        height="7rem"
        :src="require('../../assets/logo.png')"
    />
  </div>
</template>

<script>
export default {
  name: "user"
}
</script>

<style scoped>
.profilePhoto{
  text-align: center;
}
</style>