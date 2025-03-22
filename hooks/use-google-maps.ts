'use client'
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";

const useGoogleMaps = () => {
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<Error | null>(null);

    // Custom Hook to load Google Maps API
    useEffect(() => {
        const loader = new Loader({
            apiKey: `${process.env.NEXT_PUBLIC_API_KEY}`,
            version: 'weekly',
            libraries: ['places', 'geometry']
        });

        loader.load()
            .then(() => {
                setGoogleMapsLoaded(true);
            })
            .catch((err) => {
                setLoadError(err);
            });
    }, [])

    return { googleMapsLoaded, loadError };
}

export default useGoogleMaps