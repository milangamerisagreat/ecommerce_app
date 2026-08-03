import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useEffect } from "react";
import FilterSidebar from "@/components/ui/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";

const items = [
  {
    value: "Sort by price",
    label: "Price: Low to High",
  },
  {
    value: "Sort by pricee",
    label: "Price: High to Low",
  },
  {
    value: "Sort by rating",
    label: "Rating",
  },
];

const Products = () => {
  const {products} = useSelector((store) => store.product);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearcgh] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000000000]);
  const [sortOrder, setSortOrder] = useState("");
  const dispatch = useDispatch();
  
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/product/get-all",
      );
      if (response.data.success) {
        
        setAllProducts(response.data.products);
        dispatch(setProducts(response.data.products))
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);

      ;

    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if(allProducts.length === 0) return;
    let filtered = [...allProducts];
    if (search.trim() !== "") {
  const searchTerm = search.toLowerCase();

  filtered = filtered.filter((p) => {
    return (
      p.productName?.toLowerCase().includes(searchTerm) ||
      p.brand?.toLowerCase().includes(searchTerm) ||
      p.category?.toLowerCase().includes(searchTerm) ||
      p.productDesc?.toLowerCase().includes(searchTerm) ||
      p.productPrice?.toString().includes(searchTerm)
    );
  });
}

    if(category !== "All"){
      filtered = filtered.filter(p => p.category === category);
    }

    if(brand !== "All"){
      filtered = filtered.filter(p => p.brand === brand);
    }

    filtered = filtered.filter(
  p =>
    p.productPrice >= priceRange[0] &&
    p.productPrice <= priceRange[1]
);
      if(sortOrder === "lowToHigh"){
        filtered.sort((a, b) => a.productPrice - b.productPrice);
      } else if(sortOrder === "highToLow"){
         filtered.sort((a, b) => b.productPrice - a.productPrice);
      }
      
      dispatch(setProducts(filtered));
  }, [search, category, brand, priceRange, sortOrder, allProducts, dispatch]);

  useEffect(() => {
     
    getAllProducts();
  }, []);

  
  console.log(allProducts);

  return (
    <div className="pt-16 pb-10 min-h-screen bg-[#2bff004f] ">
      <div className="min-w-screen max-h-screen px-4 flex gap-5 ">
        {/* filter sidebar  */}
        <FilterSidebar  
        allProducts={allProducts} 
        priceRange={priceRange} 
        setPriceRange={setPriceRange}
        search={search}
        setSearch={setSearcgh}
        category={category}
        setCategory={setCategory}
        brand={brand}
        setBrand={setBrand}
        />
        {/* products  */}
        <div className="flex flex-col flex-1 pt-2">
          <div className="flex justify-end mb-4 w-full ">
            <Select items={items} onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">
                    Price: Low to High
                  </SelectItem>

                  <SelectItem value="highToLow">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="Sort by rating">Rating</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            {/* Render products */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 justify-items-center">
              
              {products.map((product) => (

                <ProductCard 
                key={product._id} 
                product={product} 
                loading={loading}
                
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
