import makeupArtistList from "@/pages/makeup/makeup-artist-list.vue"//化妆师列表
import makeupArtistDetails from "@/pages/makeup/makeup-artist-details.vue"//化妆师详情
import makeupArtistImageAdd from "@/pages/makeup/makeup-artist-image-add.vue"//案例添加
import makeupArtistImageInsert from "@/pages/makeup/makeup-artist-image-insert.vue"//形象修改
import makeupScheduleAdd from "@/pages/makeup/makeup-schedule-add.vue"//形象修改
import makeupScheduleList from "@/pages/makeup/makeup-schedule-list.vue"//形象修改
import makeupOrderClothes from "@/pages/makeup/makeup-order-clothes.vue"

export default [
    {
        path: '/makeupArtistList',
        name: 'makeupArtistList',
        component: makeupArtistList,
    },
    {
        path: '/makeupArtistDetails',
        name: 'makeupArtistDetails',
        component: makeupArtistDetails,
    }, {
        path: '/makeupArtistImageAdd',
        name: 'makeupArtistImageAdd',
        component: makeupArtistImageAdd,
    }, {
        path: '/makeupArtistImageInsert',
        name: 'makeupArtistImageInsert',
        component: makeupArtistImageInsert,
    }, {
        path: '/makeupScheduleAdd',
        name: 'makeupScheduleAdd',
        component: makeupScheduleAdd,
    },
    {
        path: '/makeupScheduleList',
        name: 'makeupScheduleList',
        component: makeupScheduleList,
    },
    {
        path: '/makeupOrderClothes',
        name: 'makeupOrderClothes',
        component: makeupOrderClothes,
    },
]
