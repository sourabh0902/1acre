'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from './ui/carousel';
import { Heart, Share2 } from "lucide-react";
import Image from 'next/image';
import { Property } from '@/types/property';
import { capitalizeFirstLetter } from '@/hooks/firstLetterUppercase';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
    // console.log(property)
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    const formatPrice = () => {
        const { crore, lakh } = property.land_price.price_per_acre_crore;
        const parts = [];

        if (crore > 0) {
            parts.push(`${crore} Cr`);
        }
        if (lakh > 0) {
            parts.push(`${lakh} L`);
        }

        return parts.join(' ');
    };

    return (
        <Card className='overflow-hidden h-full flex flex-col p-0 cursor-pointer'>
            {/* Card Top - Carousel */}
            <div className="relative">
                <Carousel className="w-full cursor-grab"
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}>
                    <CarouselContent>
                        {property.land_media.length > 0 ? (
                            property.land_media.map((image) => (
                                <CarouselItem key={image.id}>
                                    <div className="aspect-video relative">
                                        <Image
                                            src={image?.image}
                                            alt={image.category}
                                            className="object-cover w-full h-full rounded-t-lg"
                                            width={500} height={500}
                                        />
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem>
                                <div className="aspect-video bg-slate-200 flex items-center justify-center rounded-t-lg">
                                    <p className="text-slate-500">No Image Available</p>
                                </div>
                            </CarouselItem>
                        )}
                    </CarouselContent>
                    {property.land_media.length > 1 && (
                        <>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </>
                    )}
                </Carousel>
                <div className="w-full absolute bottom-0 py-1 text-center text-sm text-white">
                    {current} of {count}
                </div>

                <button
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                    onClick={() => setIsLiked(!isLiked)}
                >
                    <Heart
                        size={15}
                        className={isLiked ? "fill-red-500 text-red-500" : "text-slate-500"}
                    />
                </button>
            </div>

            {/* Card Bottom - Content  */}
            <CardContent className="p-2 flex-grow">
                <div className="flex gap-2 mb-2 w-full">
                    <span className="w-full text-sm bg-slate-100 px-3 py-2 rounded flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <span className="text-gray-600">₹</span>
                            <span className="font-medium">{formatPrice()}</span>
                            <span className="text-gray-600">/acre</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>•</span>
                            <span>{property.land_size.total_land_size_in_acres.acres} Acres</span>
                        </div>
                    </span>
                </div>
                <div className='w-full flex justify-between'>
                    {property.crop_type &&
                        <p className='text-sm px-3 py-2'>
                            Crop - {capitalizeFirstLetter(property.crop_type)}
                        </p>
                    }
                    {property.soil_type &&
                        <p className='text-sm px-3 py-2'>
                            Soil - {capitalizeFirstLetter(property.soil_type)}
                        </p>
                    }
                </div>
            </CardContent>
            <CardFooter className="p-3 !pt-3 border-t flex justify-between items-center">
                <p className="text-xs text-slate-500">
                    {new Date(property.created_at).toLocaleDateString()}
                </p>
                <button className="p-2 text-blue-600 flex items-center gap-1">
                    <Share2 size={16} />
                    <span className="text-sm">Share</span>
                </button>
            </CardFooter>
        </Card >
    )
}

export default PropertyCard;