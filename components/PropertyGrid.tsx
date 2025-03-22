'use client'
import React, { useEffect } from 'react'
import PropertyCard from './PropertyCard'
import { featchProperties } from '@/services/api'
import { Property } from '@/types/property'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { CardSkeleton } from './skeleton/CardSkeleton'

interface PropertyListResponse {
    results: Property[];
    next: number | null;
    previous: number | null;
}

const PropertyGrid = () => {

    // Intersection observer for infinite scrolling
    const { ref, inView } = useInView();

    // React Query with infinite scroll
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery<PropertyListResponse>({
        queryKey: ['properties'],
        queryFn: ({ pageParam = 1 }) => featchProperties(pageParam as number),
        getNextPageParam: (lastPage: PropertyListResponse) => {
            if (lastPage.next !== null) {
                return lastPage.next;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    // Very crucial step ! 
    const allProperties: Property[] = data?.pages.flatMap(page => page.results) || [];

    // Fetch next page when the last element is in view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (status === 'error') {
        return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;
    }

    if (status === 'pending') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(10)].map((_, index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>
        )
    }

    return (
        <>
            <style>
                {`
                    .loader {
                        width: 48px;
                        height: 48px;
                        border: 5px solid #000;
                        border-bottom-color: transparent;
                        border-radius: 50%;
                        display: inline-block;
                        box-sizing: border-box;
                        animation: rotation 1s linear infinite;
                    }

                    @keyframes rotation {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    } 
                `}
            </style>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {allProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>

            {/* Loading indicator */}
            {isFetchingNextPage && (
                <div className='w-full py-4'>
                    <div className='w-fit mx-auto'>
                        <span className="loader"></span>
                    </div>
                </div>
            )}

            {/* Intersection observer target */}
            {hasNextPage && (
                <div ref={ref} className="h-10" />
            )}

            {/* No more properties */}
            {!hasNextPage && allProperties.length > 0 && (
                <div className="text-center py-4 text-gray-500">No more properties to load</div>
            )}
        </>
    )

}

export default PropertyGrid