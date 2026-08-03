import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUpload from '@/components/ui/ImageUpload'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const AddProducts = () => {

  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const [productData, setProductData] = useState({
    productName : "" ,
    productPrice : 0 , 
    brand : "" ,
    category : "" ,
    productDesc : "" ,
    productImg : []
  })

const handleChange = (e) => {
  const {name , value} = e.target 
  setProductData((prev)=>({
    ...prev ,
    [name] : value
  }))
}

const submitHandler = async (e) => {
  e.preventDefault()
   
   const formData = new FormData();
   formData.append("productName", productData.productName);
   formData.append("productPrice", productData.productPrice);
   formData.append("brand", productData.brand);
   formData.append("category", productData.category);
   formData.append("productDesc", productData.productDesc);

   if(productData.productImg.length === 0){
    toast.error("Please select one image");
    return;
   }

   productData.productImg.forEach((img)=>{
    formData.append("files", img)
   })
   
   try {
    setLoading(true)
    const res = await axios.post(`http://localhost:5000/api/v1/product/add`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if(res.data.success){
      toast.success("Product added successfully")
      dispatch(setProducts([...Products, res.data.product]))
    }
   } catch (error) {
    console.log(error);
   } finally{
    setLoading(false)
   }
}

  return (
    <div className='bg-[#15ff0044]  min-h-screen p-20'>
      <Card className="w-full my-15 rounded-2xl bg-[#c8ffcd] backdrop-blur-2xl border border-[#00000010] shadow-2xl">
        <CardHeader>
          <CardTitle className="font-bold">Add Products</CardTitle>
          <CardDescription className='font-semibold'> Enter Products details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-2'>
            <div className='grid gap-2'>
              <Label className="font-bold">Product Name :</Label>
              <Input className='border border-[#00000048]' type='text' value={productData.productName} onChange={handleChange} name="productName" placeholder="Ex- Iphone" required />
            </div>
            <div className='grid gap-2'>
              <Label className="font-bold">Price /-</Label>
              <Input className='border border-[#00000048]' type='number' value={productData.productPrice} onChange={handleChange} name="productPrice" placeholder="" required />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2 '>
                <Label className="font-bold">Brand :</Label>
                <Input className='border border-[#00000048]' type='text' value={productData.brand} onChange={handleChange} name="brand" placeholder="Ex- Apple" required />
              </div>
              <div className='grid gap-2 '>
                <Label className="font-bold">Category :</Label>
                <Input className='border border-[#00000048]' type='text' value={productData.category} onChange={handleChange} name="category" placeholder="Ex-Mobile Phone" required />
              </div>
            </div>
            <div className='grid gap-2 '>
             <div className='flex items-center'>
              <Label className="font-bold">Description :</Label>
             </div>
             <Textarea className='border border-[#00000048]' name="productDesc" value={productData.productDesc} onChange={handleChange} placeholder="Add Product Description"/>
            </div>
            <ImageUpload productData={productData} setProductData={setProductData}/>
          </div>
          <CardFooter className="flex-col gap-2 bg-transparent border border-transparent">
            <Button disabled={loading} onClick={submitHandler} className="w-full cursor-pointer" type="submit">{loading? <span className='flex flex-1 items-center'><Loader2 className='animate-spin'/>Please wait</span> : "Add Product"}</Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddProducts
