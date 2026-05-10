import { create } from 'zustand';

interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  color: string;
  description: string;
  images: string[];
  features: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CarState {
  cars: Car[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    fuelType: string;
    transmission: string;
    minPrice: string;
    maxPrice: string;
  };
  setCars: (cars: Car[]) => void;
  addCar: (car: Car) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  removeCar: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<CarState['filters']>) => void;
  clearFilters: () => void;
}

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
  },
  setCars: (cars) => set({ cars }),
  addCar: (car) => set((state) => ({ cars: [car, ...state.cars] })),
  updateCar: (id, updatedCar) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car._id === id ? { ...car, ...updatedCar } : car
      ),
    })),
  removeCar: (id) =>
    set((state) => ({
      cars: state.cars.filter((car) => car._id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () =>
    set({
      filters: {
        search: '',
        fuelType: '',
        transmission: '',
        minPrice: '',
        maxPrice: '',
      },
    }),
}));
