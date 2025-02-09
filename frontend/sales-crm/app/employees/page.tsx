"use client"

import { useState } from "react"
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

const initialEmployees = [
  { id: 1, name: "Alice Johnson", position: "Sales Manager", email: "alice@example.com", phone: "123-456-7890" },
  { id: 2, name: "Bob Smith", position: "Account Executive", email: "bob@example.com", phone: "234-567-8901" },
  { id: 3, name: "Charlie Brown", position: "Customer Success", email: "charlie@example.com", phone: "345-678-9012" },
  { id: 4, name: "Diana Miller", position: "Sales Representative", email: "diana@example.com", phone: "456-789-0123" },
  { id: 5, name: "Edward Davis", position: "Business Development", email: "edward@example.com", phone: "567-890-1234" },
]

// We'll use the leads from the leads page
const initialLeads = [
  { id: 1, name: "Acme Corp", status: "New" },
  { id: 2, name: "John Doe", status: "Contacted" },
  { id: 3, name: "Tech Innovators", status: "Qualified" },
  { id: 4, name: "Alice Johnson", status: "New" },
  { id: 5, name: "Global Solutions Inc.", status: "Lost" },
]

export default function Employees() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [newEmployee, setNewEmployee] = useState({ name: "", position: "", email: "", phone: "" })
  const [leads, setLeads] = useState(initialLeads)
  const [assignLead, setAssignLead] = useState({ employeeId: "", leadId: "" })

  const addEmployee = () => {
    setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }])
    setNewEmployee({ name: "", position: "", email: "", phone: "" })
  }

  const handleAssignLead = () => {
    // In a real application, you would update this in your backend
    console.log(`Assigned lead ${assignLead.leadId} to employee ${assignLead.employeeId}`)
    // For demo purposes, we'll remove the assigned lead from the list
    setLeads(leads.filter((lead) => lead.id !== Number.parseInt(assignLead.leadId)))
    setAssignLead({ employeeId: "", leadId: "" })
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Employees</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Employee</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the details of the new employee here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={addEmployee}>
                Save Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-gray-200 mb-8 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Assign Lead</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                  <Select onValueChange={(leadId) => setAssignLead({ employeeId: employee.id.toString(), leadId })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign Lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id.toString()}>
                          {lead.name} - {lead.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={handleAssignLead} disabled={!assignLead.employeeId || !assignLead.leadId}>
        Confirm Lead Assignment
      </Button>
    </Layout>
  )
}

