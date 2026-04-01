export interface ChannelOrder {
  channel: string;
  count: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  openConversations: number;
  revenueThisMonth: number;
  ordersPending: number;
  ordersByChannel: ChannelOrder[];
}
