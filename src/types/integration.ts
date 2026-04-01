export interface Integration {
  id: string;
  provider: string;
  externalAccountId: string;
  displayName: string;
  isConnected: boolean;
  lastSyncAtUtc?: string | null;
}
