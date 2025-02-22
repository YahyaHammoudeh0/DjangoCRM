"use client"

import { useEffect, useState } from "react"
import Layout from "./components/layout"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Dynamically import the Graph component (instead of BarChart)
const GraphComponent = dynamic(() => import("./components/Graph"), { ssr: false })

interface ConversionData {
  name: string
  value: number
}

export default function Dashboard() {
  // New state for the custom logo
  const [customLogo, setCustomLogo] = useState("")

  const [paidRevenue, setPaidRevenue] = useState<number>(0)
  const [activeLeads, setActiveLeads] = useState<number>(0)
  const [employeesCount, setEmployeesCount] = useState<number>(0)
  const [clientsCount, setClientsCount] = useState<number>(0)
  const [conversionData, setConversionData] = useState<ConversionData[]>([])
  const [loadingMetrics, setLoadingMetrics] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token") || ""
    return {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    }
  }

  // Load the custom logo upon mount
  useEffect(() => {
    const storedLogo = localStorage.getItem("customLogoUrl") || ""
    setCustomLogo(storedLogo)
  }, [])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoadingMetrics(true)
        const headers = getAuthHeaders()
        // Fetch paid invoices
        const invRes = await fetch("http://localhost:8000/api/invoices/?status=PAID", { headers })
        if (!invRes.ok) throw new Error("Failed to fetch paid invoices")
        const invoices = await invRes.json()
        const revenue = invoices.reduce(
          (acc: number, item: any) => acc + Number(item.total_amount || 0),
          0
        )
        setPaidRevenue(revenue)

        // Fetch active leads
        const leadsRes = await fetch("http://localhost:8000/api/leads/?status=New", { headers })
        if (!leadsRes.ok) throw new Error("Failed to fetch leads")
        const leads = await leadsRes.json()
        setActiveLeads(Array.isArray(leads) ? leads.length : 0)

        // Fetch employees count
        const empRes = await fetch("http://localhost:8000/api/employee/employees/", { headers })
        if (!empRes.ok) throw new Error("Failed to fetch employees")
        const employees = await empRes.json()
        setEmployeesCount(Array.isArray(employees) ? employees.length : 0)

        // Fetch clients count (using customers endpoint)
        const clientsRes = await fetch("http://localhost:8000/api/customers/", { headers })
        if (!clientsRes.ok) throw new Error("Failed to fetch clients")
        const clients = await clientsRes.json()
        setClientsCount(Array.isArray(clients) ? clients.length : 0)

        setConversionData([
          { name: "Leads", value: Array.isArray(leads) ? leads.length : 0 },
          { name: "Clients", value: Array.isArray(clients) ? clients.length : 0 }
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching metrics")
      } finally {
        setLoadingMetrics(false)
      }
    }

    fetchMetrics()
  }, [])

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8 text-red-500">{error}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* New header displaying the custom logo if available */}
      <header className="mb-6 flex items-center">
        { customLogo ? (
          <img src={customLogo} alt="Logo" style={{ height: "50px" }} />
        ) : (
          <h1 className="text-2xl font-bold">Your App Name</h1>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Revenue from paid invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeads}</div>
            <p className="text-xs text-gray-500">Active leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeesCount}</div>
            <p className="text-xs text-gray-500">Total employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientsCount}</div>
            <p className="text-xs text-gray-500">Total clients</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Leads to Clients Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 350 }}>
              <GraphComponent data={conversionData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
