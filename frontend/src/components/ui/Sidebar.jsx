import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="
    fixed
    top-5
    left-0
    w-75
    h-screen
    border-r
    bg-[#1db10079]
    px-10
    py-10
  ">
      <div className='text-center pt-10 px-3 space-y-2 '>
    <NavLink to='/dashboard/sales' className={({isActive})=>`text-xl ${isActive ? "bg-[#19d467] text-[#f0f0f0]" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}><LayoutDashboard/><span>Dashboard</span></NavLink>
    <NavLink to='/dashboard/add-product' className={({isActive})=>`text-xl ${isActive ? "bg-[#19d467] text-[#f0f0f0]" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}><PackagePlus/><span>Add Products</span></NavLink>
    <NavLink to='/dashboard/products' className={({isActive})=>`text-xl ${isActive ? "bg-[#19d467] text-[#f0f0f0]" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}><PackageSearch/><span>products</span></NavLink>
    <NavLink to='/dashboard/users' className={({isActive})=>`text-xl ${isActive ? "bg-[#19d467] text-[#f0f0f0]" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}><Users/><span>Users</span></NavLink>
    <NavLink to='/dashboard/orders' className={({isActive})=>`text-xl ${isActive ? "bg-[#19d467] text-[#f0f0f0]" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}><FaRegEdit/><span>Orders</span></NavLink>
      </div>
    </div>
  )
}

export default Sidebar
