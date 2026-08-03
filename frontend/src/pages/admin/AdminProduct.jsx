import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/ImageUpload";
import axios from "axios";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("")
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  let filteredProducts = products.filter(
    (product) =>
      product.productName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

if(sortOrder === 'LowToHigh') {
  filteredProducts =[...filteredProducts].sort((a,b)=> a.productPrice - b.productPrice)
}

if(sortOrder === 'HighToLow') {
  filteredProducts =[...filteredProducts].sort((a,b)=> b.productPrice - a.productPrice)
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("productName", editProduct.productName);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("brand", editProduct.brand);
    formData.append("category", editProduct.category);

    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    //Add new file
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files".file);
      });

    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProducts(updateProducts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );
      const res = await axios.delete(
        `http://localhost:5000/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product deleted successfully");
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const items = [
    { label: "Price: Low To High", value: "LowToHigh" },
    { label: "Price: High To Low", value: "HighToLow" },
  ];

  return (
    <div className="bg-[#15ff0041] min-h-screen p-20 flex flex-col gap-3">
      <div className="flex justify-between p-6 bg-linear-to-br from-[#53ff0f62] to-[#4444442f] backdrop-blur-2xl border border-[#0000003b] shadow-2xl rounded-2xl ">
        <div className="relative">
          <Input
            values={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#00000075] w-100 items-center p-1"
            type="text"
            placeholder="Search Product..."
          />
          <Search className="absolute top-2 ml-94 text-[#414141]" size={17} />
        </div>

        <Select items={items} onValueChange={(value)=>setSortOrder(value)}>
          <SelectTrigger className="w-50 bg-[#fff8f8]">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.map((product, index) => {
        return (
          <Card key={index} className="px-4 mt-2">
            <div className="flex items-center justify-between ">
              <div className="flex gap-3 items-center">
                <img
                  src={product.productImg[0].url}
                  alt=""
                  className="w-25 h-25"
                />
                <h1 className="font-bold w-96">{product.productName}</h1>
              </div>
              <h1 className="font-semibold">₹{product.productPrice}</h1>
              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger>
                    {" "}
                    <Edit
                      onClick={() => setEditProduct(product)}
                      className="text-[#05fa1a]"
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-165.25 max-h-185 overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>
                        Make changes to your Product here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="flex flex-col gap-2">
                      <Field className="grid gap-2">
                        <Label>Product Name</Label>
                        <Input
                          value={editProduct?.productName}
                          onChange={handleChange}
                          type="text"
                          name="productName"
                          placeholder="EX- Iphone"
                          required
                        />
                      </Field>
                      <Field className="grid gap-2">
                        <Label>Product Price</Label>
                        <Input
                          value={editProduct?.productPrice}
                          onChange={handleChange}
                          type="number"
                          name="productPrice"
                          required
                        />
                      </Field>
                      <FieldGroup className="flex flex-cols-2 gap-4">
                        <Field className="grid gap-2">
                          <Label>Brand</Label>
                          <Input
                            value={editProduct?.brand}
                            onChange={handleChange}
                            type="text"
                            name="brand"
                            placeholder="EX- Apple"
                            required
                          />
                        </Field>
                        <Field className="grid gap-2">
                          <Label>Category</Label>
                          <Input
                            value={editProduct?.category}
                            onChange={handleChange}
                            type="text"
                            name="category"
                            placeholder="EX- mobile"
                            required
                          />
                        </Field>
                      </FieldGroup>
                      <FieldGroup className="grid gap-2">
                        <Field className="flex items-center">
                          <Label>Description</Label>
                          <div className="">
                            <Textarea
                              value={editProduct?.productDesc}
                              onChange={handleChange}
                              name="productDesc"
                              placeholder="Enter Product description"
                            />
                          </div>
                          <ImageUpload
                            productData={editProduct}
                            setProductData={setEditProduct}
                          />
                        </Field>
                      </FieldGroup>
                    </FieldGroup>
                    <DialogFooter>
                      <Button type="submit" onClick={handleSave}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2 className="text-[#db0000]" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your Product from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProductHandler(product._id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminProduct;
