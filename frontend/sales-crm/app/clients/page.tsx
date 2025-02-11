"use client"

import { useState, useEffect } from "react"
import Layout from "../components/layout"
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
import { fetchCompanies, createCompany, type CompanyInfo } from "@/lib/api"

export default function Clients() {
  const [clients, setClients] = useState<CompanyInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newClient, setNewClient] = useState<CompanyInfo>({
    company_name: "",
    industry: "",
    employee_count: 0,
    budget_estimate: 0,
    country: "",
    company_needs: "",
    description: "",
    contact_type: "CLIENT"
  })

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      setLoading(true)
      const data = await fetchCompanies('CLIENT')
      setClients(data)
      setError(null)
    } catch (err) {
      setError('Failed to load clients')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function addClient() {
    try {
      const newClientData = await createCompany(newClient)
      setClients([...clients, newClientData])
      setNewClient({
        company_name: "",
        industry: "",
        employee_count: 0,
        budget_estimate: 0,
        country: "",
        company_needs: "",
        description: "",
        contact_type: "CLIENT"
      })
    } catch (err) {
      setError('Failed to create client')
      console.error(err)
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Clients</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Client</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the details of the new client here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company_name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  value={newClient.company_name}
                  onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">
                  Industry
                </Label>
                <Input
                  id="industry"
                  value={newClient.industry}
                  onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee_count" className="text-right">
                  Employees
                </Label>
                <Input
                  id="employee_count"
                  value={newClient.employee_count}
                  onChange={(e) => setNewClient({ ...newClient, employee_count: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget_estimate" className="text-right">
                  Budget
                </Label>
                <Input
                  id="budget_estimate"
                  value={newClient.budget_estimate}
                  onChange={(e) => setNewClient({ ...newClient, budget_estimate: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Country
                </Label>
                <Input
                  id="country"
                  value={newClient.country}
                  onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company_needs" className="text-right">
                  Needs
                </Label>
                <Input
                  id="company_needs"
                  value={newClient.company_needs}
                  onChange={(e) => setNewClient({ ...newClient, company_needs: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newClient.description}
                  onChange={(e) => setNewClient({ ...newClient, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={addClient}>
                Save Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Needs</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.company_name}</TableCell>
                <TableCell>{client.industry}</TableCell>
                <TableCell>{client.employee_count}</TableCell>
                <TableCell>${client.budget_estimate}</TableCell>
                <TableCell>{client.country}</TableCell>
                <TableCell>{client.company_needs}</TableCell>
                <TableCell>{client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

