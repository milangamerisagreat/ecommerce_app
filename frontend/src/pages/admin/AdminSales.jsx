import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const AdminSales = () => {

  const [stats, setstats] = useState({
    totalUsers:0,
    totalProducts:0,
    totalOrders:0,
    totalSales:0,
    sales:[]
  })
  const accessToken = localStorage.getItem("accessToken")

  const fetchState = async() => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/sales`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })

      if(res.data.success){
        setstats(res.data)
      }
    } catch (error) {
      console.error("error fetching state ",error)
    }
  } 

  useEffect(()=>{
    fetchState()
  },[])

  return (
    <div className='p-15 mt-15 bg-[#15ff0041] min-h-screen'>
     <div className='p-6 grid gap-6 lg:grid-cols-4'>
      
      {/* Stats card */}
      <Card className="bg-[#51ff003a]">
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
          <CardContent className= "p-5 rounded-lg mt-5 bg-linear-to-br from-[#53ff0f62] to-[#4444442f] backdrop-blur-2xl border border-[#0000003b] shadow-2xl font-bold text-2xl">
            {stats.totalUsers}
          </CardContent>
        </CardHeader>
      </Card>
      <Card className="bg-[#51ff003a]">
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
          <CardContent className= "p-5 rounded-lg mt-5 bg-linear-to-br from-[#53ff0f62] to-[#4444442f] backdrop-blur-2xl border border-[#0000003b] shadow-2xl font-bold text-2xl">
            {stats.totalProducts}
          </CardContent>
        </CardHeader>
      </Card>
      <Card className="bg-[#51ff003a]">
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
          <CardContent className= "p-5 rounded-lg mt-5 bg-linear-to-br from-[#53ff0f62] to-[#4444442f] backdrop-blur-2xl border border-[#0000003b] shadow-2xl font-bold text-2xl">
            {stats.totalOrders}
          </CardContent>
        </CardHeader>
      </Card>
      <Card className="bg-[#51ff003a]">
        <CardHeader>
          <CardTitle>Total Saless</CardTitle>
          <CardContent className= "p-5 rounded-lg mt-5 bg-linear-to-br from-[#53ff0f62] to-[#4444442f] backdrop-blur-2xl border border-[#0000003b] shadow-2xl font-bold text-2xl">
            {stats.totalSales}
          </CardContent>
        </CardHeader>
      </Card>

      {/* Sales chart */}
      <Card className="lg:col-span-4 bg-[#51ff003a]">
        <CardHeader>
          <CardTitle>Sales (Last 30 days)</CardTitle>
        </CardHeader>
        <CardContent style={{height:300}}>
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <AreaChart data={stats.sales}>
             <XAxis dataKey="date"/>
             <YAxis/>
             <Tooltip/>
             <Area type="monotone" dataKey="amount" stroke='#F4724B6' fill='green'/>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
     </div>
    </div>
  )
}

export default AdminSales
