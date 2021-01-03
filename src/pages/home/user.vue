<template>
  <div class="profilePhoto">
    <van-image

        round
        width="10rem"
        height="10rem"
        :src="require('../../assets/logo_black.png')"
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