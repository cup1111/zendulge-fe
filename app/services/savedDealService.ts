import api from '~/config/axios';

export type SavedDealStatus = 'active' | 'removed';

export interface RawSavedDeal {
  _id: string;
  user: string;
  deal: string;
  status?: SavedDealStatus;
  removedReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedDeal {
  id: string;
  user: string;
  deal: string;
  status: SavedDealStatus;
  removedReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedDealResponse {
  success: boolean;
  data: RawSavedDeal | RawSavedDeal[];
  message?: string;
}

const mapSavedDeal = (raw: RawSavedDeal): SavedDeal => {
  const { _id: id } = raw; // backend uses _id; normalize to id
  return {
    id,
    user: raw.user,
    deal: raw.deal,
    status: raw.status ?? 'active',
    removedReason: raw.removedReason,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

export default class SavedDealService {
  private static guestKey = 'guestSavedDeals';

  /**
   * Save a deal for the authenticated user.
   * Returns backend response data; operation is idempotent server-side.
   */
  static async save(dealId: string): Promise<SavedDealResponse> {
    const response = await api.post<SavedDealResponse>('/saved-deals', {
      dealId,
    });
    return response.data;
  }

  /**
   * List saved deals for the authenticated user.
   */
  static async list(): Promise<SavedDeal[]> {
    const response = await api.get<SavedDealResponse>('/saved-deals');
    const savedDealRecords = response?.data?.data;
    if (!savedDealRecords) return [];
    const array = Array.isArray(savedDealRecords)
      ? savedDealRecords
      : [savedDealRecords];
    return array.map(mapSavedDeal);
  }

  /**
   * Soft-delete a saved deal for the authenticated user.
   */
  static async remove(dealId: string): Promise<void> {
    await api.delete(`/saved-deals/${dealId}`);
  }

  /**
   * Check if a deal is already saved (client-side helper using list()).
   */
  static async isSaved(dealId: string): Promise<boolean> {
    const savedDealRecords = await this.list();
    return savedDealRecords.some(item => item.deal === dealId);
  }

  /**
   * Guest-mode helpers: store deal ids locally when user is not authenticated.
   */
  static getGuestSavedDeals(): string[] {
    try {
      const localSavedDealIdsData = localStorage.getItem(this.guestKey);
      if (!localSavedDealIdsData) return [];
      const localSavedDealIds = JSON.parse(localSavedDealIdsData);
      return Array.isArray(localSavedDealIds)
        ? localSavedDealIds.filter(id => typeof id === 'string')
        : [];
    } catch {
      return [];
    }
  }

  static saveGuestSavedDeal(dealId: string) {
    const localSavedDealIds = this.getGuestSavedDeals();
    if (localSavedDealIds.includes(dealId)) return;
    const next = [...localSavedDealIds, dealId];
    localStorage.setItem(this.guestKey, JSON.stringify(next));
  }

  static clearGuestSavedDeals() {
    localStorage.removeItem(this.guestKey);
  }

  /**
   * Push guest-saved deals to backend after login, then clear local cache.
   */
  static async syncGuestSavedDealsToServer() {
    const guestSavedDeals = this.getGuestSavedDeals();
    if (guestSavedDeals.length === 0) return;
    const savedDealIds = Array.from(new Set(guestSavedDeals));
    const results = await Promise.all(
      savedDealIds.map(async id => {
        try {
          await this.save(id);
          return null;
        } catch {
          return id; // mark failed so we keep it locally
        }
      })
    );

    const failedDealIds = Array.isArray(results)
      ? results.filter((id): id is string => Boolean(id))
      : [];

    if (failedDealIds.length === 0) {
      this.clearGuestSavedDeals();
      return;
    }

    localStorage.setItem(this.guestKey, JSON.stringify(failedDealIds));
  }
}
