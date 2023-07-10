<template>
    <van-cell-group v-if="modules.商城 !=null" title="商城" class="gird_module">
        <van-grid :border="false" clickable :column-num="4">
            <van-grid-item v-for="value in modules.商城" @click="onClickItem(value.viewLink)" :key="value.id"
                           :icon="value.viewIcon"
                           :text="value.viewName"/>
        </van-grid>
    </van-cell-group>
    </div>
</template>

<script>
export default {
    name: "store",
    data(){
        return{
            modules: {},
        }
    },
    created() {
        this.queryModules();
    },
    methods: {
        onClickItem: function (event,id) {
            this.$store.commit('setKeepAlive', [event])
            this.$router.push({name: event,query:{id: id}})
        },
        queryModules() {
            this.$axios({
                method: "GET",
                url: '/index/mobileManBar',
                params: {
                    tenantCrop: localStorage.getItem("tenantCrop"),
                    empId: localStorage.getItem("empId"),
                }
            }).then(response => {
                this.modules = response.data.data;
            })
        }
    },
    activated() {
        this.queryModules();
    }
}
</script>

<style scoped>
.gird_module{
    background-color: #ffffff;
    margin: 0px 7px 7px 8px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding-bottom: 7px;
    border-color: #ffffff!important;
}
/deep/ .van-cell-group__title{
    margin: 8px 7px 0px 7px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #ffffff;
}
/deep/ [class*=van-hairline]::after {
    border: none;
}
</style>
