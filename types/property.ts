// Property API Response Types

export interface PropertyImage {
    id: number;
    image: string;
    category: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface Property {
    id: number;
    unique_code: string;
    title: string;
    description: string;
    price: number;
    size: number;
    district: string;
    division_info: {
        division_type: string;
        id: number;
        name: string;
    };
    taluka: string;
    village: string;
    state: string;
    created_at: string;
    updated_at: string;
    status: string;
    land_media: PropertyImage[];
    land_price: {
        price_per_acre_crore: {
            crore: number;
            lakh: number;
        };
    };
    land_size: {
        total_land_size_in_acres: {
            acres: number;
        }
    };
    latitude: number;
    longitude: number;
    seller: {
        id: number;
        name: string;
    };
    crop_type: string | null;
    soil_type: string | null;
}

export interface PropertyListResponse {
    count: number;
    results: [];
    next: number;
    previous: null;
}