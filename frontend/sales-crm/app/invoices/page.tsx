"use client"

import { useEffect, useState } from "react"
import Layout from "../components/layout"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: number
  company_name: string
}

interface Invoice {
  id: number
  invoice_number: string
  customer_details: {
    company_name: string
  }
  total_amount: number
  status: string
  due_date: string
}

export default function Invoices() {
  const { isAuthenticated } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newInvoice, setNewInvoice] = useState({
    invoice_number: "",
    customer: "",
    total_amount: "",
    status: "DRAFT",
    due_date: "",
  })

  const getAuthHeaders = (): Record<string, string> => {
    if (typeof window === 'undefined') {
      return {
        'Content-Type': 'application/json'
      }
    }
    const token = localStorage.getItem('token') || ''
    return {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const headers = getAuthHeaders()
          const [invRes, custRes] = await Promise.all([
            fetch('http://localhost:8000/api/invoices/', { headers }),
            fetch('http://localhost:8000/api/customers/', { headers })
          ])

          if (!invRes.ok || !custRes.ok) {
            throw new Error('Failed to fetch data')
          }

          const [invoicesData, customersData] = await Promise.all([
            invRes.json(),
            custRes.json()
          ])

          // Debug: log invoices data to verify structure
          console.log("Fetched invoices:", invoicesData)

          setInvoices(invoicesData)
          setCustomers(customersData)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [isAuthenticated])

  const addInvoice = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/invoices/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newInvoice)
      })

      if (!response.ok) {
        throw new Error('Failed to create invoice')
      }

      const data = await response.json()
      setInvoices(prev => [...prev, data])
      setNewInvoice({
        invoice_number: "",
        customer: "",
        total_amount: "",
        status: "DRAFT",
        due_date: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice')
    }
  }

  // Don't render anything while checking authentication
  if (isAuthenticated === null) {
    return (
      <Layout>
        <div className="text-center py-8">
          Loading...
        </div>
      </Layout>
    )
  }

  // Not authenticated - handled by useAuth hook with redirect
  if (!isAuthenticated) {
    return null
  }

  if (error) {
    return (
      <Layout>
        <div className="text-red-500 text-center py-8">
          Error: {error}
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Invoices</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Invoice</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Enter the details of the new invoice here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoiceNumber" className="text-right">
                  Invoice Number
                </Label>
                <Input
                  id="invoiceNumber"
                  value={newInvoice.invoice_number}
                  onChange={(e) => setNewInvoice({ ...newInvoice, invoice_number: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client" className="text-right">
                  Client
                </Label>
                <Select
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, customer: value })}
                  defaultValue={newInvoice.customer}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newInvoice.total_amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, total_amount: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value })}
                  defaultValue={newInvoice.status}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select invoice status" />
                  </SelectTrigger>
                  <SelectContent>
                    {["DRAFT", "SENT", "PAID", "OVERDUE"].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.due_date}
                  onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={addInvoice}>
                Save Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          Loading invoices...
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number || "N/A"}</TableCell>
                  <TableCell>{invoice.customer_details?.company_name || "N/A"}</TableCell>
                  <TableCell>
                    ${invoice.total_amount ? Number(invoice.total_amount).toFixed(2) : "0.00"}
                  </TableCell>
                  <TableCell>{invoice.status || "N/A"}</TableCell>
                  <TableCell>{invoice.due_date || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Layout>
  )
}

