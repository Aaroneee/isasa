import self from "@/main";

/**
 * 判断是否有权限 根据传入的权限标识
 * @param perms 权限标识
 * @returns {boolean}
 */
export default function hasPermission(perms) {
    let hasPermission = false
    for (let i = 0, len = self.$store.state.permission.length; i < len; i++) {
        if (self.$store.state.permission[i] === perms) {
            hasPermission = true
            break
        }
    }
    return hasPermission
}