'use client'
import { capitalizeFirstLetter } from '@/hooks/firstLetterUppercase';
import useGoogleMaps from '@/hooks/use-google-maps';
import { fetchMapProperties } from '@/services/api';
import { MapProperty } from '@/types/map';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';

import { Skeleton } from "@/components/ui/skeleton";
import { formatLandSize } from '@/hooks/formatLandSize';
import { formatPrice } from '@/hooks/formatPrice';

const PropertyMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const { googleMapsLoaded, loadError } = useGoogleMaps();

    // Fetch map properties
    const { data: mapData, isLoading, error } = useQuery({
        queryKey: ['mapProperties'],
        queryFn: fetchMapProperties,
        enabled: googleMapsLoaded,
    });
    // console.log(mapData)

    // Initialize map when Google Maps is loaded and data is available
    useEffect(() => {
        if (!googleMapsLoaded || !mapRef.current || !mapData?.results.length) return;


        // Initialize infoWindow once
        if (!infoWindowRef.current) {
            infoWindowRef.current = new google.maps.InfoWindow();
        }

        // Calculate bounds to fit all markers
        const bounds = new google.maps.LatLngBounds();
        const properties = mapData.results;

        // Create map if not already created
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new google.maps.Map(mapRef.current, {
                zoom: 10,
                center: { lat: Number(properties[0].lat), lng: Number(properties[0].long) },
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
            });
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Create markers for each property
        properties.forEach((property: MapProperty) => {
            if (property.lat && property.long) {
                const position = { lat: Number(property.lat), lng: Number(property.long) };
                bounds.extend(position);

                const marker = new google.maps.Marker({
                    position,
                    map: mapInstanceRef.current,
                    title: property.title,
                });

                // Create info popup content
                const contentString = `
                    <div style="max-width: 200px; padding: 10px;">
                        <h2 style="font-size: 16px; margin-bottom: 5px;">${capitalizeFirstLetter(property.division_slugs['district'] || '')}, ${capitalizeFirstLetter(property.division_slugs['state'] || '')}</h2>
                    <div style="font-size: 14px; color: green; margin-bottom: 5px; display: flex; align-items: center;">
                        <span style="color: #666; margin-right: 2px;">₹</span>
                        <span style="font-weight: 300;">${formatPrice(property.land_price?.price_per_acre_crore || { crore: 0, lakh: 0 })}</span>
                        <span style="color: #666; margin-left: 2px;">/acre</span>
                    </div>
                    <p style="font-size: 12px; margin: 0; display: flex; align-items: center; gap: 4px;">
                        <span style="color: #666;">Size:</span>
                        <span style="font-weight: 500;">
                            ${formatLandSize(property?.land_size?.total_land_size_in_acres || {})}
                        </span>
                    </p>
                        <p style="font-size: 12px; color: #666; margin-top: 8px; color:green;">${property.status && `Available`}</p>
                    </div>
            `;

                // Add click event to show popup
                marker.addListener('click', () => {
                    if (infoWindowRef.current) {
                        infoWindowRef.current.setContent(contentString);
                        infoWindowRef.current.open({
                            anchor: marker,
                            map: mapInstanceRef.current,
                        });
                    }
                });

                markersRef.current.push(marker);
            }
        });

        // Fit map to bounds of all markers
        if (markersRef.current.length > 0) {
            mapInstanceRef.current.fitBounds(bounds);
        }

    }, [googleMapsLoaded, mapData])

    if (loadError) {
        return <div className="p-8 text-center text-red-500">Failed to load Google Maps: {loadError.message}</div>;
    }

    if (isLoading || !googleMapsLoaded) {
        return (
            <Skeleton className="w-full h-[96vh] rounded-lg shadow-md" />
        );
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading map data: {error.message}</div>;
    }


    return (
        <div className="container mx-auto px-1 pb-8">
            <div
                ref={mapRef}
                className="w-full h-[50vh] lg:h-[96vh] rounded-lg shadow-md"
            ></div>
        </div>
    )
}

export default PropertyMap