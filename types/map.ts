// Map API Response Types
export interface MapProperty {
    id: number;
    unique_code: string;
    lat: string | undefined;
    long: string | undefined;
    title: string;
    price: number;
    size: number;
    division_slugs: {
        district: string;
        state: string;
    };
    land_price: {
        price_per_acre_crore: {
            crore: number;
            lakh: number;
        };
    };
    land_size: {
        total_land_size_in_acres: {
            acres: number | null;
            cents: number | null;
            guntas: number | null;
        }
    };
    status: string;
}

export interface MapResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: MapProperty[];
}