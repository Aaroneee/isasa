import accountInfo from "@/pages/user/account_info"
import user from "@/pages/user/user.vue";
//账户信息

export default[
  //我的
  {
    path: '/user',
    name: 'user',
    component: user
  },
  {
    path: '/accountInfo',
    name: 'accountInfo',
    component: accountInfo,
  },
]