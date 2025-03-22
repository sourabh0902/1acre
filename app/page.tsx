import PropertyGrid from '@/components/PropertyGrid'
import PropertyMap from '@/components/PropertyMap'
import React from 'react'

const page = () => {
  return (
    <main className="container min-h-screen bg-gray-50 px-0 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">1acre Property Listings</h1>
        <p className="text-center text-gray-600">
          Explore available properties and their locations
        </p>
      </header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 px-2">

        {/* Property Map Component */}
        <div className="w-full lg:col-span-1 h-auto lg:h-[500px] lg:sticky top-4">
          <PropertyMap />
        </div>

        {/* Property Grid Component with Infinite Scroll */}
        <div className="w-full lg:col-span-1">
          <PropertyGrid />
        </div>

      </div>
    </main>
  )
}

export default page