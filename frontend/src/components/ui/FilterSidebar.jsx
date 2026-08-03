import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'



const FilterSidebar = ({ allProducts, priceRange, setPriceRange, search, setSearch, category, setCategory, brand, setBrand }) => {
   const Categories = allProducts.map(p => p.category);
   const UniqueCategory = ["All",...new Set(Categories)] 
   const Brands = allProducts.map(p => p.brand);
   const UniqueBrands = ["All",...new Set(Brands)]
    
   const handleCategoryClick = (val) =>{
        
         setCategory(val);
   } 

   const handleBrandChange = (e) => {
     setBrand(e.target.value);
   }

   const handleMinChange = (e) => {
      const value = Number(e.target.value);
      if (value <= priceRange[1]) {
        setPriceRange([value, priceRange[1]]);
      }
   }

   const handleMaxChange = (e) => {
      const value = Number(e.target.value);
      if (value >= priceRange[0]) {
        setPriceRange([priceRange[0], value]);
      }
   }
   
   const resetFilters = () => {
      setSearch("");
      setCategory("All");
      setBrand("All");
      setPriceRange([0, 10000000000]);
   }
  return (
    <div className = "bg-[#c8ffbf] mt-5 p-4 rounded-md h-max  mb-block w-50" >
     {/* Search */}

    <Input 
    type = "text"
    value={search}
    onChange={(e) => setSearch(e.target.value)} 
    placeholder = "Search products..." 
    className="bg-[#ffffff38] p-2 rounded-md border-2 border-[#585858] w-full" 
    />

      {/* Categories */}
      <h1 className="mt-5 font-semibold text-xl"> Categories.... </h1>
      <div className=" flex flex-col gap-2 mt-3">
        {
          UniqueCategory.map((item, index) => (

             <div key={index} className="flex items-center gap-2">  
              
              <input 
                type="radio" 
                id={item} 
                checked={category === item}
                onChange={() => handleCategoryClick(item)}
              />
              <label htmlFor={item}>{item}</label>

             </div>
          ))
        }

      </div>   
       {/* Brands */}
      <h1 className="mt-5 font-semibold text-xl"> Brands.... </h1>
       <select className="bg-[#ffffff38] p-2 rounded-md border-2 border-[#727272] w-full" value={brand} onChange={handleBrandChange}>
        {
          UniqueBrands.map((item, index) => (
              <option key={index} value={item}>{item.toUpperCase()}</option>
          ))
        }
       </select>

       {/* price range */}
        <h1 className="mt-5 font-semibold text-xl mb-3"> Price Range </h1>
        <div className="flex flex-col gap-2 w-full">
          
          <div className="flex gap-2 items-center">
            <input type="number" min="0" max="5000" value={priceRange[0]} onChange={handleMinChange} className="w-20 p-1 border border-[#727272] rounded-md bg-[#ffffff38]"/>
            <span>-</span>
            <input type="number" min="0" max="10000" value={priceRange[1]} onChange={handleMaxChange} className="w-20 p-1 border border-[#727272] rounded-md bg-[#ffffff38]"/>
          </div>
          <input type="range" min="0" max="5000" step="100" className="w-full" value={priceRange[0]} onChange={(e) => handleMinChange({ target: { value: e.target.value } })}/>
          <input type="range" min="0" max="10000" step="100" className="w-full" value={priceRange[1]} onChange={(e) => handleMaxChange({ target: { value: e.target.value } })}/>
        </div>
        {/* Reset button */}
        <Button onClick={resetFilters} className="text-white cursor-pointer mt-5 w-full">  Reset Filters  </Button>

    </div>
  )
}

export default FilterSidebar
