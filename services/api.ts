import { MapResponse } from "@/types/map";
import { PropertyListResponse } from "@/types/property";

const SELLER_ID = 211;
const PAGE_SIZE = 10;

// Fetch properties list with pagination
export async function featchProperties(pageParam = 1): Promise<PropertyListResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/?seller=${SELLER_ID}&page=${pageParam}&page_size=${PAGE_SIZE}`)

    if (!response.ok) {
        throw new Error('Failed to fetch properties');
    }
    return response.json();
}

// Fetch map properties
export async function fetchMapProperties(): Promise<MapResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/landmaps/?seller_id=${SELLER_ID}`)

    if (!response.ok) {
        throw new Error('Failed to fetch map properties');
    }

    return response.json();
}

