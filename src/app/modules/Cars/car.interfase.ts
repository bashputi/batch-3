
export type TCar = {
    name: string;
    type: string;
    description: string;
    color: string;
    isElectric: string;
    features: string[];
    image: string;
    status?: 'available' | 'unavailable';
    pricePerHour: number;
    isDeleted?: boolean;
    additionalFeatures?: string[];
    createdAt?: string;
    updatedAt?: string;
};
