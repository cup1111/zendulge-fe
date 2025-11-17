import api from '~/config/axios';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  isActive: boolean;
}

interface RawCategoryApiResponse {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  isActive: boolean;
}

export interface CategoryApiResponse {
  success: boolean;
  message: string;
  data: RawCategoryApiResponse | RawCategoryApiResponse[];
}

const mapCategory = (raw: RawCategoryApiResponse): Category => {
  // eslint-disable-next-line no-underscore-dangle
  const rawId = raw?._id;
  if (!raw || typeof raw !== 'object' || !rawId) {
    throw new Error('Invalid category data received from API');
  }
  // eslint-disable-next-line no-underscore-dangle
  const { _id: id } = raw;
  return {
    id: String(id),
    name: String(raw.name || ''),
    slug: String(raw.slug || ''),
    icon: String(raw.icon || ''),
    isActive: Boolean(raw.isActive),
  };
};

export default class CategoryService {
  static async list(includeInactive = false): Promise<Category[]> {
    try {
      const response = await api.get<CategoryApiResponse>(
        '/public/categories',
        {
          params: { includeInactive },
        }
      );

      if (!response?.data?.data) {
        return [];
      }

      // Ensure we have an array
      const rawCategories = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      return rawCategories
        .filter(
          (cat): cat is RawCategoryApiResponse =>
            cat != null &&
            typeof cat === 'object' &&
            '_id' in cat &&
            'name' in cat &&
            'slug' in cat &&
            'icon' in cat
        )
        .map(raw => {
          try {
            return mapCategory(raw);
          } catch {
            return null;
          }
        })
        .filter((cat): cat is Category => cat != null);
    } catch {
      return [];
    }
  }

  static async getById(id: string): Promise<Category> {
    const response = await api.get<CategoryApiResponse>(`/categories/${id}`);
    return mapCategory(response.data.data as RawCategoryApiResponse);
  }

  static async getBySlug(slug: string): Promise<Category> {
    const response = await api.get<CategoryApiResponse>(
      `/categories/slug/${slug}`
    );
    return mapCategory(response.data.data as RawCategoryApiResponse);
  }

  static async create(data: {
    name: string;
    slug?: string;
    icon: string;
    isActive?: boolean;
  }): Promise<Category> {
    const response = await api.post<CategoryApiResponse>('/categories', data);
    return mapCategory(response.data.data as RawCategoryApiResponse);
  }

  static async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      icon?: string;
      isActive?: boolean;
    }
  ): Promise<Category> {
    const response = await api.patch<CategoryApiResponse>(
      `/categories/${id}`,
      data
    );
    return mapCategory(response.data.data as RawCategoryApiResponse);
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }

  static async deactivate(id: string): Promise<Category> {
    const response = await api.patch<CategoryApiResponse>(
      `/categories/${id}/deactivate`
    );
    return mapCategory(response.data.data as RawCategoryApiResponse);
  }

  static async activate(id: string): Promise<Category> {
    const response = await api.patch<CategoryApiResponse>(
      `/categories/${id}/activate`
    );
    return mapCategory(response.data.data as RawCategoryApiResponse);
  }
}
