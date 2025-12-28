import React from 'react'
import Navbar from './Navbar' 
import { categories } from '../categories'
import CategoryCard from './CategoryCard'

const UserDashboard = () => {
  return (
    /* w-screen ki jagah w-full behtar hai taaki horizontal scrollbar na aaye */
    <div className="w-full min-h-screen flex flex-col items-center bg-white overflow-y-auto">
      <Navbar />
      
      {/* pt-24 taaki content Navbar ke niche se shuru ho */}
      <div className='w-full max-w-7xl flex flex-col gap-8 items-start p-6 pt-24'>
        
        <h1 className='text-gray-900 text-2xl sm:text-4xl font-black tracking-tight'>
          Inspiration for your first order
        </h1>

        {/* Categories Container - Horizontal Scrollable */}
        <div className='w-full flex gap-5 overflow-x-auto pb-6 scrollbar-hide'>
          {categories.map((cate, index) => (
            // props ka naam 'category' aur 'image' rakhein jo aapne CategoryCard mein banaya hai
            <CategoryCard 
              key={index} 
              category={cate.category} 
              image={cate.image} 
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default UserDashboard