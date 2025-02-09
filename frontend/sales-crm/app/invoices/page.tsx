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

const initialInvoices = [
  { id: 1, invoiceNumber: "INV-001", client: "Acme Corp", amount: 5000, status: "Paid", dueDate: "2023-07-15" },
  { id: 2, invoiceNumber: "INV-002", client: "TechCo", amount: 7500, status: "Pending", dueDate: "2023-07-30" },
  {
    id: 3,
    invoiceNumber: "INV-003",
    client: "Global Industries",
    amount: 10000,
    status: "Overdue",
    dueDate: "2023-06-30",
  },
]

const invoiceStatuses = ["Draft", "Sent", "Paid", "Overdue"]

export default function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: "",
    client: "",
    amount: "",
    status: "Draft",
    dueDate: "",
  })

  const addInvoice = () => {
    setInvoices([...invoices, { ...newInvoice, id: invoices.length + 1, amount: Number.parseFloat(newInvoice.amount) }])
    setNewInvoice({ invoiceNumber: "", client: "", amount: "", status: "Draft", dueDate: "" })
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
                  value={newInvoice.invoiceNumber}
                  onChange={(e) => setNewInvoice({ ...newInvoice, invoiceNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client" className="text-right">
                  Client
                </Label>
                <Input
                  id="client"
                  value={newInvoice.client}
                  onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
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
                    {invoiceStatuses.map((status) => (
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
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
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
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

