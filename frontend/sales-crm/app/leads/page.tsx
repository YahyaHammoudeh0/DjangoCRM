"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { fetchCompanies, createCompany, type CompanyInfo } from "@/lib/api"

export default function Leads() {
  const [leads, setLeads] = useState<CompanyInfo[]>([])
  const [loading, setLoading] = useState(true) // Remove this line if not needed
  const [error, setError] = useState<string | null>(null) // Remove this line if not needed
  const [newLead, setNewLead] = useState<CompanyInfo>({
    company_name: "",
    industry: "",
    employee_count: 0,
    budget_estimate: 0,
    country: "",
    company_needs: "",
    description: "",
    contact_type: "LEAD"
  })
  const [filters, setFilters] = useState({
    name: "",
    status: "all",
    aiScore: "",
    humanScore: "",
  })

  useEffect(() => {
    loadLeads()
  }, [])

  async function loadLeads() {
    try {
      setLoading(true)
      const data = await fetchCompanies('LEAD')
      setLeads(data)
      setError(null)
    } catch (err) {
      setError('Failed to load leads')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function addLead() {
    try {
      const newLeadData = await createCompany(newLead)
      setLeads([...leads, newLeadData])
      setNewLead({
        company_name: "",
        industry: "",
        employee_count: 0,
        budget_estimate: 0,
        country: "",
        company_needs: "",
        description: "",
        contact_type: "LEAD"
      })
    } catch (err) {
      setError('Failed to create lead')
      console.error(err)
    }
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      return (
        lead.company_name.toLowerCase().includes(filters.name.toLowerCase()) &&
        (filters.status === "all" || lead.contact_type === filters.status) &&
        (filters.aiScore === "" || (lead.expected_score ?? 0) >= Number.parseInt(filters.aiScore)) &&
        (filters.humanScore === "" || (lead.expected_score ?? 0) >= Number.parseInt(filters.humanScore))
      )
    })
  }, [leads, filters])

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Leads</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Lead</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Enter the company information for the new lead.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company_name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  value={newLead.company_name}
                  onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">
                  Industry
                </Label>
                <Input
                  id="industry"
                  value={newLead.industry}
                  onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee_count" className="text-right">
                  Employees
                </Label>
                <Input
                  id="employee_count"
                  type="number"
                  value={newLead.employee_count}
                  onChange={(e) => setNewLead({ ...newLead, employee_count: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget_estimate" className="text-right">
                  Budget
                </Label>
                <Input
                  id="budget_estimate"
                  type="number"
                  value={newLead.budget_estimate}
                  onChange={(e) => setNewLead({ ...newLead, budget_estimate: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company_needs" className="text-right">
                  Needs
                </Label>
                <Textarea
                  id="company_needs"
                  value={newLead.company_needs}
                  onChange={(e) => setNewLead({ ...newLead, company_needs: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newLead.description}
                  onChange={(e) => setNewLead({ ...newLead, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={addLead}>
                Save Lead
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Select onValueChange={(value) => setFilters({ ...filters, status: value })} value={filters.status}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="LEAD">Lead</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Min AI Score"
          value={filters.aiScore}
          onChange={(e) => setFilters({ ...filters, aiScore: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Min Human Score"
          value={filters.humanScore}
          onChange={(e) => setFilters({ ...filters, humanScore: e.target.value })}
        />
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
              <TableHead>Score</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.company_name}</TableCell>
                <TableCell>{lead.industry}</TableCell>
                <TableCell>{lead.employee_count}</TableCell>
                <TableCell>${lead.budget_estimate}</TableCell>
                <TableCell>{lead.country}</TableCell>
                <TableCell>{lead.company_needs}</TableCell>
                <TableCell>{lead.expected_score}</TableCell>
                <TableCell>{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

