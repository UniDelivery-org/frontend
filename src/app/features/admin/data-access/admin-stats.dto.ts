export interface AdminStatsDTO {
  totalSenders: number;
  totalCouriers: number;
  totalDeliveries: number;
  activeDeliveries: number;
  pendingDeliveries: number;
  completedDeliveries: number;
  canceledDeliveries: number;
  totalTransactionVolume: number;
  platformRevenue: number;
  currentMonthRevenue: number;
}
