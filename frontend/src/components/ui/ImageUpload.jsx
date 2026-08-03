import React from 'react'
import { Label } from './label'
import { Input } from './input'
import { Button } from './button'
import { Card, CardContent } from './card'
import { X } from 'lucide-react'


const ImageUpload = ({productData, setProductData}) => {

  const handleFiles = (e) => {
    const files= Array.from(e.target.files || []) 
    if (files.length) {
      setProductData((prev)=>({
        ...prev, 
        productImg: [...prev.productImg, ...files]
      }))
    }
  }

  const removeImage = (index) => {
       setProductData((prev)=>{
        const updatedImages = prev.productImg.filter((_, i)=> i !== index) 
        return {...prev, productImg:updatedImages}
       })
  }
  return (
    <div className='grid gap-2'>
      <Label className="font-bold">Products Images :</Label>
      <Input className="border border-[#00000048] cursor-pointer " type="file" id="file-upload" accept="image/*" multiple onChange={handleFiles}/>
      <label
       htmlFor="file-upload"
       className="bg-[#038319c5] text-white px-4 py-2 rounded cursor-pointer text-center"
       >
       Upload Images
      </label>

      {/* Images preview */}
      {
        productData.productImg.length > 0 && (
          <div className='grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3'>
            {
              productData.productImg.map((file, idx)=> {
                // check if a file already a file (from input) or a db/string
                let preview
                if(file instanceof File) {
                   preview = URL.createObjectURL(file)
                } else if (typeof file === 'string') {
                  preview = file
                } else if (file?.url) {
                  preview = file.url
                } else {
                  return null
                }

                return (
                  <Card key={idx} className="relative group overflow-hidden">
                    <CardContent className="">
                      <img src={preview} alt="" width={100} height={200} className='w-full h-32 object-cover rounded-md'/>
                      {/* Remove Button */}
                        <button onClick={()=>removeImage(idx)} className=' absolute
                           top-2
                           right-2
                         bg-[#00000079]
                         text-white
                           p-1
                           rounded-full
                           opacity-0
                           group-hover:opacity-100
                           transition-opacity
                           duration-200
                           cursor-pointer '><X size={14}/></button>
                    </CardContent>
                  </Card>
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}

export default ImageUpload
