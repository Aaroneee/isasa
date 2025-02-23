export class STATE  {
    StateConst = {
        COMMITTED_UN_REVIEWED: "已提交未审核",
        REVIEWED_UN_SEND: "已审核未寄出",
        SEND: "已寄出",
        REFUSE: "已拒绝",
        CANCEL: "已取消",
    }
    //取消
    cancel(state) {
        return [this.StateConst.COMMITTED_UN_REVIEWED, this.StateConst.REVIEWED_UN_SEND].includes(state)
    }
    //寄出
    send(state) {
        // 已提交未审核(暂时) 已审核未寄出都可以寄出
        return [this.StateConst.COMMITTED_UN_REVIEWED, this.StateConst.REVIEWED_UN_SEND].includes(state)
    }
}