import React from 'react'

// Hum {data} prop use karenge kyunki UserDashboard mein aap 'cate' pass kar rahe hain
const CategoryCard = ({ category,image }) => {
  return (
    <div className='group relative w-[140px] h-[140px] md:w-[200px] md:h-[200px] 
      shrink-0 cursor-pointer transition-all duration-500 hover:-translate-y-2'>
      
      {/* Main Container */}
      <div className='w-full h-full rounded-[2.5rem] overflow-hidden bg-white 
        border-2 border-red group-hover:border-[#ff4d2d]/20 
        shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_40px_rgba(255,77,45,0.15)] 
        relative flex items-center justify-center transition-all duration-500'>
        
        {/* Background Image */}
        <img 
          src={image} 
          alt={category} 
          className='w-full h-full object-cover transition-transform duration-700 
          group-hover:scale-110' 
        />

        {/* Dark Overlay for Text Clarity (Sirf tab dikhega jab mouse upar ho ya hamesha ke liye halka rakhein) */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent 
          opacity-80 group-hover:opacity-90 transition-opacity duration-500'></div>

        {/* Category Label - Bottom Center */}
        <div className='absolute bottom-4 left-0 w-full px-2'>
          <div className='mx-auto w-[85%] bg-white/20 backdrop-blur-md border border-white/30 
            py-2 rounded-2xl shadow-xl transition-all duration-500 
            group-hover:bg-[#ff4d2d] group-hover:border-[#ff4d2d]'>
            <p className='text-[10px] md:text-sm font-black text-white text-center 
              uppercase tracking-[0.1em] group-hover:scale-105 transition-transform'>
              {category}
            </p>
          </div>
        </div>

      </div>

      {/* Shadow Effect niche (Extra Detail) */}
      <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 
        bg-black/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
    </div>
  )
}

export default CategoryCard