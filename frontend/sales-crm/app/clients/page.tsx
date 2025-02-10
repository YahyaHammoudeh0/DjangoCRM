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

const initialClients = [
  {
    id: 1,
    name: "Acme Corp",
    industry: "Technology",
    country: "USA",
    contactPerson: "John Doe",
    email: "john@acme.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Global Industries",
    industry: "Manufacturing",
    country: "Germany",
    contactPerson: "Anna Schmidt",
    email: "anna@global.com",
    phone: "987-654-3210",
  },
  {
    id: 3,
    name: "Tech Innovators",
    industry: "Software",
    country: "UK",
    contactPerson: "James Wilson",
    email: "james@techinnovators.com",
    phone: "456-789-0123",
  },
  {
    id: 4,
    name: "Green Energy Co",
    industry: "Energy",
    country: "Canada",
    contactPerson: "Emily Brown",
    email: "emily@greenenergy.com",
    phone: "789-012-3456",
  },
  {
    id: 5,
    name: "Fashion Forward",
    industry: "Retail",
    country: "France",
    contactPerson: "Sophie Martin",
    email: "sophie@fashionforward.com",
    phone: "234-567-8901",
  },
]

export default function Clients() {
  const [clients, setClients] = useState(initialClients)
  const [newClient, setNewClient] = useState({
    name: "",
    industry: "",
    country: "",
    contactPerson: "",
    email: "",
    phone: "",
  })

  const addClient = () => {
    setClients([...clients, { ...newClient, id: clients.length + 1 }])
    setNewClient({ name: "", industry: "", country: "", contactPerson: "", email: "", phone: "" })
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
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
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
                <Label htmlFor="contactPerson" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  value={newClient.contactPerson}
                  onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
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
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.industry}</TableCell>
                <TableCell>{client.country}</TableCell>
                <TableCell>{client.contactPerson}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

