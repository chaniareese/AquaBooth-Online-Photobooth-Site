import { create } from "zustand"

interface BoothStore {
  photos: [string | null, string | null]
  setPhoto: (slot: 0 | 1, photo: string) => void
  deletePhoto: (slot: 0 | 1) => void
  resetPhotos: () => void
}

export const useBoothStore = create<BoothStore>((set) => ({
  photos: [null, null],
  setPhoto: (slot, photo) =>
    set((state) => {
      const photos = [...state.photos] as [string | null, string | null]
      photos[slot] = photo
      return { photos }
    }),
  deletePhoto: (slot) =>
    set((state) => {
      const photos = [...state.photos] as [string | null, string | null]
      photos[slot] = null
      return { photos }
    }),
  resetPhotos: () => set({ photos: [null, null] }),
}))