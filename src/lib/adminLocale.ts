const paymentStatusLabels: Record<string, string> = {
  pending: "待付款",
  paid: "已付款",
  failed: "支付失败",
  cancelled: "已取消",
  refunded: "已退款",
  partially_refunded: "部分退款"
};

const fulfillmentStatusLabels: Record<string, string> = {
  unfulfilled: "待处理",
  processing: "处理中",
  shipped: "已发货",
  delivered: "已送达"
};

const colorLabels: Record<string, string> = {
  Yellow: "黄色",
  Pink: "粉色",
  Green: "绿色",
  Black: "黑色",
  Brown: "棕色",
  "Dark Green": "深绿色"
};

export function paymentStatusLabel(status: string) {
  return paymentStatusLabels[status] || status;
}

export function fulfillmentStatusLabel(status: string) {
  return fulfillmentStatusLabels[status] || status;
}

export function colorLabel(color: string) {
  return colorLabels[color] || color;
}

export function formatAdminDate(date: Date | null | undefined) {
  return date
    ? new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Shanghai"
      }).format(date)
    : "未提供";
}
