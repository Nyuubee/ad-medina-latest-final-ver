export type OmitTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>
export type OmitIdAndTimestamps<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
