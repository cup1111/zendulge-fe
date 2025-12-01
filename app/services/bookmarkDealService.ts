/**
 * @file bookmarkDealService.ts
 * @description Service for managing bookmark deals for authenticated and guest users
 * @author RX
 * @date 2025-12-01
 */

import api from '~/config/axios';
import { UserType } from '~/enum/UserType';

/**
 * Raw bookmark deal data structure from backend API
 * Uses _id field following MongoDB convention
 */
export interface RawBookmarkDeal {
  /** Unique identifier from backend (MongoDB _id) */
  _id: string;
  /** User ID who bookmarked the deal */
  user: string;
  /** Deal ID that was bookmarked */
  deal: string;
  /** ISO timestamp when bookmark was created */
  createdAt?: string;
  /** ISO timestamp when bookmark was last updated */
  updatedAt?: string;
}

/**
 * Normalized bookmark deal data structure for frontend use
 * Converts backend _id to id for consistency
 */
export interface BookmarkDeal {
  /** Unique identifier (normalized from backend _id) */
  id: string;
  /** User ID who bookmarked the deal */
  user: string;
  /** Deal ID that was bookmarked */
  deal: string;
  /** ISO timestamp when bookmark was created */
  createdAt?: string;
  /** ISO timestamp when bookmark was last updated */
  updatedAt?: string;
}

/**
 * API response structure for bookmark deal operations
 * Can contain single or multiple bookmark deals
 */
export interface BookmarkDealResponse {
  /** Indicates if the API request was successful */
  success: boolean;
  /** Bookmark deal data (single object or array) */
  data: RawBookmarkDeal | RawBookmarkDeal[];
  /** Optional message from the API (e.g., error details, success info) */
  message?: string;
}

/**
 * Service for managing bookmark deals (saved deals) for both authenticated and guest users
 *
 * This service handles:
 * - Saving deals to backend for authenticated users
 * - Saving deals to localStorage for guest users
 * - Syncing guest bookmarks to backend after login
 * - Checking if deals are bookmarked
 * - Listing and removing bookmarked deals
 *
 * All methods support both authenticated and guest user flows seamlessly.
 */
export default class BookmarkDealService {
  /** localStorage key for storing guest bookmark deal IDs */
  private static guestBookmarkKey = 'guestBookmarkDeals';

  /**
   * Maps raw bookmark deal data from backend to normalized frontend structure
   * Converts MongoDB _id field to id for consistency across the application
   * @param raw - Raw bookmark deal data from backend API
   * @returns Normalized bookmark deal object
   */
  private static mapBookmarkDeal = (raw: RawBookmarkDeal): BookmarkDeal => {
    // Extract _id and rename to id for frontend consistency
    const { _id: id } = raw;
    return {
      id,
      user: raw.user,
      deal: raw.deal,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  };

  /**
   * Save a deal as a bookmark for authenticated user or guest
   *
   * This method handles two different user flows:
   * 1. Authenticated users: Saves to backend via API (idempotent operation)
   * 2. Guest users: Saves to localStorage for later sync after login
   *
   * Flow:
   * - Checks authentication status from options parameter
   * - For guest users: calls saveToLocal() and returns mock response
   * - For authenticated users: calls backend POST /bookmark-deal endpoint
   *
   * @param dealId - The deal ID to bookmark
   * @param options - Optional configuration object
   * @param options.isAuthenticated - User authentication status (optional)
   * @returns Promise resolving to BookmarkDealResponse with success status and data
   * @throws API errors from backend for authenticated users
   */
  static async save(
    dealId: string,
    isAuthenticated?: boolean
  ): Promise<BookmarkDealResponse> {
    // Determine authentication status: use provided value or check localStorage
    // Guest user: save to localStorage
    if (!isAuthenticated) {
      this.saveToLocalStorage(dealId);
      return {
        success: true,
        data: {
          _id: dealId,
          user: UserType.GUEST,
          deal: dealId,
        },
        message: 'Saved bookmark deal locally for guest user',
      };
    }

    // Authenticated user: save to backend
    const response = await api.post<BookmarkDealResponse>('/bookmark-deal', {
      dealId,
    });
    return response.data;
  }

  /**
   * List all bookmark deals for the authenticated user
   *
   * Fetches the user's bookmarked deals from the backend API.
   * The response data is normalized from MongoDB format (_id) to frontend format (id).
   *
   * Flow:
   * 1. Sends GET request to /bookmark-deal endpoint
   * 2. Extracts data from response (handles both single object and array)
   * 3. Maps each raw deal to normalized BookmarkDeal format
   *
   * Note: This method only works for authenticated users.
   * Guest users should use listLocal() instead (private method).
   *
   * @returns Promise resolving to array of normalized BookmarkDeal objects
   * @returns Empty array if no bookmarks found or response is invalid
   * @throws API errors from backend (authentication, network, etc.)
   */
  static async list(): Promise<BookmarkDeal[]> {
    const response = await api.get<BookmarkDealResponse>('/bookmark-deal');
    const bookmarkDealRecords = response?.data?.data;
    if (!bookmarkDealRecords) return [];
    const array = Array.isArray(bookmarkDealRecords)
      ? bookmarkDealRecords
      : [bookmarkDealRecords];
    return array.map(this.mapBookmarkDeal);
  }

  /**
   * Remove a bookmark deal for the authenticated user
   *
   * Permanently deletes a bookmark from the backend database (hard delete).
   * The deal itself is not affected, only the user's bookmark association.
   *
   * Note: This method only works for authenticated users.
   * For guest users, bookmark removal is not supported (localStorage is managed internally).
   *
   * @param dealId - The deal ID to remove from bookmarks
   * @returns Promise that resolves when deletion is complete
   * @throws API errors from backend (404 if bookmark not found, 401 if unauthorized, etc.)
   */
  static async remove(dealId: string): Promise<void> {
    await api.delete(`/bookmark-deal/${dealId}`);
  }

  /**
   * Check if a deal is already bookmarked for authenticated user or guest
   *
   * This method handles checking bookmark status for both user types:
   * 1. Guest users: checks localStorage
   * 2. Authenticated users: checks backend via API
   *
   * Flow:
   * - Determines authentication status from options parameter
   * - For guest users: calls listLocal() and checks if dealId exists in array
   * - For authenticated users: calls list() and checks if dealId exists in results
   *
   * @param dealId - The deal ID to check
   * @param options - Optional configuration object
   * @param options.isAuthenticated - User authentication status (optional)
   * @returns Promise resolving to true if deal is bookmarked, false otherwise
   * @throws API errors from backend for authenticated users
   */
  static async isSaved(
    dealId: string,
    isAuthenticated?: boolean
  ): Promise<boolean> {
    // Determine authentication status: use provided value or check localStorage

    // Guest user: check localStorage
    if (!isAuthenticated) {
      return this.listLocalStorage().includes(dealId);
    }

    // Authenticated user: check backend
    const bookmarkDealRecords = await this.list();
    return bookmarkDealRecords.some(item => item.deal === dealId);
  }

  /**
   * List bookmark deal IDs from localStorage for guest users
   *
   * Retrieves and parses the array of deal IDs stored in localStorage.
   * Validates that the data is a proper array of strings.
   *
   * Error handling:
   * - Returns empty array if localStorage key doesn't exist
   * - Returns empty array if JSON parsing fails
   * - Filters out non-string values for data integrity
   */
  private static listLocalStorage(): string[] {
    try {
      const localBookmarkDealIdsData = localStorage.getItem(
        this.guestBookmarkKey
      );
      if (!localBookmarkDealIdsData) return [];
      const localBookmarkDealIds = JSON.parse(localBookmarkDealIdsData);
      return Array.isArray(localBookmarkDealIds)
        ? localBookmarkDealIds.filter(id => typeof id === 'string')
        : [];
    } catch {
      return [];
    }
  }

  /**
   * Save a deal ID to localStorage for guest users
   *
   * Adds a deal ID to the guest bookmark list in localStorage.
   * Prevents duplicate entries by checking if the deal is already saved.
   *
   * Flow:
   * 1. Retrieves existing bookmarked deal IDs from localStorage
   * 2. Checks if dealId already exists (prevents duplicates)
   * 3. Appends new dealId to array if not already present
   * 4. Saves updated array back to localStorage as JSON string
   *
   * @private
   * @param dealId - The deal ID to save locally
   * @returns void
   */
  private static saveToLocalStorage(dealId: string) {
    const localBookmarkDealIds = this.listLocalStorage();
    if (localBookmarkDealIds.includes(dealId)) return;
    const next = [...localBookmarkDealIds, dealId];
    localStorage.setItem(this.guestBookmarkKey, JSON.stringify(next));
  }

  /**
   * Clear all guest bookmark deals from localStorage
   *
   * Removes the entire guest bookmark list from localStorage.
   * This is typically called after successfully syncing guest bookmarks to backend.
   *
   * @private
   * @returns void
   */
  private static clearBookmarkLocalStorage() {
    localStorage.removeItem(this.guestBookmarkKey);
  }

  /**
   * Sync guest bookmark deals to backend after user login
   *
   * This method is called automatically after a user logs in (via AuthProvider).
   * It transfers all guest bookmarks from localStorage to the backend database.
   *
   * Flow:
   * 1. Retrieves all guest bookmarked deal IDs from localStorage
   * 2. Deduplicates the list using Set
   * 3. Fetches existing bookmarks from backend
   * 4. Filters out deals that already exist in backend (prevents duplicates)
   * 5. Saves only new deals to backend via save() method
   * 6. Tracks failed saves and keeps them in localStorage for retry
   * 7. Clears localStorage if all saves succeed
   *
   * Error handling:
   * - If fetching existing deals fails, continues with all local deals
   * - If individual saves fail, keeps failed deal IDs in localStorage for retry
   * - Uses Promise.all for parallel saves to improve performance
   *
   * Note: This prevents the duplicate save bug where deals already in backend
   * would be saved again when user logs out and back in.
   *
   * @returns Promise that resolves when sync is complete
   * @throws Does not throw - errors are handled internally
   */
  static async syncGuestData() {
    const localBookmarkDealsData = this.listLocalStorage();
    if (localBookmarkDealsData.length === 0) return;
    const localBookmarkDealIds = Array.from(new Set(localBookmarkDealsData));

    // Filter out deals that already exist in backend
    const existingDealIds = await this.getExistingDeals();
    const bookmarkDealsToSync = localBookmarkDealIds.filter(
      id => !existingDealIds.includes(id)
    );

    if (bookmarkDealsToSync.length === 0) {
      // All deals already exist in backend, clear local cache
      this.clearBookmarkLocalStorage();
      return;
    }

    try {
      // Bulk save bookmarked deals in one request after login
      await api.post('/bookmark-deal/bulk', { dealIds: bookmarkDealsToSync });
      this.clearBookmarkLocalStorage();
    } catch {
      // Preserve unsynced deals locally for retry
      localStorage.setItem(
        this.guestBookmarkKey,
        JSON.stringify(bookmarkDealsToSync)
      );
    }
  }

  private static async getExistingDeals() {
    // Fetch existing bookmark deals from backend
    try {
      const existingDeals = await this.list();
      return existingDeals.map(deal => deal.deal);
    } catch (error) {
      return [];
    }
  }
}
