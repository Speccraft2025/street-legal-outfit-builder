import { createClient } from '@supabase/supabase-js';
import { products as initialProducts } from '@/data/products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// In-memory or localStorage Mock Database for local development fallback
class MockSupabaseClient {
  private getStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const data = localStorage.getItem(`street_legal_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  }

  private setStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`street_legal_${key}`, JSON.stringify(value));
  }

  // Fluent API builder mimicking Supabase
  from(table: string) {
    const client = this;
    return {
      select: (query: string = '*') => {
        let data: any[] = [];
        if (table === 'products') {
          data = client.getStorage('products', initialProducts);
        } else if (table === 'outfits') {
          data = client.getStorage('outfits', []);
        } else if (table === 'saved_outfits') {
          data = client.getStorage('saved_outfits', []);
        } else if (table === 'profiles') {
          data = client.getStorage('profiles', []);
        } else if (table === 'orders') {
          data = client.getStorage('orders', []);
        }

        return {
          eq: (field: string, value: any) => {
            const filtered = data.filter((item) => item[field] === value);
            return Promise.resolve({ data: filtered, error: null });
          },
          single: () => {
            const item = data[0] || null;
            return Promise.resolve({ data: item, error: item ? null : { message: 'Not found' } });
          },
          order: (field: string, { ascending = true } = {}) => {
            const sorted = [...data].sort((a, b) => {
              if (a[field] < b[field]) return ascending ? -1 : 1;
              if (a[field] > b[field]) return ascending ? 1 : -1;
              return 0;
            });
            return Promise.resolve({ data: sorted, error: null });
          },
          then: (onfulfilled: any) => onfulfilled({ data, error: null }),
        };
      },
      insert: (values: any | any[]) => {
        const rows = Array.isArray(values) ? values : [values];
        let data: any[] = client.getStorage(table, []);
        const newRows = rows.map(row => ({
          id: row.id || Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          ...row
        }));
        data = [...data, ...newRows];
        client.setStorage(table, data);
        return Promise.resolve({ data: newRows, error: null });
      },
      upsert: (values: any | any[]) => {
        const rows = Array.isArray(values) ? values : [values];
        let data: any[] = client.getStorage(table, []);
        const updatedRows = rows.map(row => {
          const index = data.findIndex((item: any) => item.id === row.id || (row.sku && item.sku === row.sku));
          const updatedRow = {
            id: row.id || Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
            ...row
          };
          if (index !== -1) {
            data[index] = { ...data[index], ...updatedRow };
          } else {
            data.push(updatedRow);
          }
          return updatedRow;
        });
        client.setStorage(table, data);
        return Promise.resolve({ data: updatedRows, error: null });
      },
      delete: () => {
        return {
          eq: (field: string, value: any) => {
            let data: any[] = client.getStorage(table, []);
            const beforeLength = data.length;
            data = data.filter((item: any) => item[field] !== value);
            client.setStorage(table, data);
            return Promise.resolve({ data: null, error: null, count: beforeLength - data.length });
          }
        };
      }
    };
  }

  auth = {
    getUser: () => {
      const activeUser = this.getStorage('active_user', null);
      return Promise.resolve({ data: { user: activeUser }, error: null });
    },
    getSession: () => {
      const activeUser = this.getStorage('active_user', null);
      return Promise.resolve({ data: { session: activeUser ? { user: activeUser } : null }, error: null });
    },
    signInWithOtp: (credentials: any) => {
      const mockUser = {
        id: 'u1',
        email: credentials.email,
        username: credentials.email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${credentials.email}`
      };
      this.setStorage('active_user', mockUser);
      let profiles: any[] = this.getStorage('profiles', []);
      if (!profiles.some((p: any) => p.email === credentials.email)) {
        profiles.push(mockUser);
        this.setStorage('profiles', profiles);
      }
      return Promise.resolve({ data: { user: mockUser }, error: null });
    },
    signOut: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('street_legal_active_user');
      }
      return Promise.resolve({ error: null });
    }
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (new MockSupabaseClient() as any);
