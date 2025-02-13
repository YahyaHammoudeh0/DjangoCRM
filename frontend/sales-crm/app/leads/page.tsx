"use client"

import { useState, useMemo } from "react"
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

const initialLeads = [
    {
        id: 1,
        type: "Company",
        name: "Acme Corp",
        status: "New",
        source: "Website",
        country: "USA",
        phone: "123-456-7890",
        email: "info@acme.com",
        description: "Interested in our enterprise solution",
        aiScore: 85,
        humanScore: 75,
    },
    {
        id: 2,
        type: "Person",
        name: "John Doe",
        status: "Contacted",
        source: "Referral",
        country: "Canada",
        phone: "234-567-8901",
        email: "john@example.com",
        description: "Looking for small business package",
        aiScore: 62,
        humanScore: 80,
    },
    {
        id: 3,
        type: "Company",
        name: "Tech Innovators",
        status: "Qualified",
        source: "Trade Show",
        country: "UK",
        phone: "345-678-9012",
        email: "sales@techinnovators.com",
        description: "Potential large account",
        aiScore: 91,
        humanScore: 88,
    },
    {
        id: 4,
        type: "Person",
        name: "Alice Johnson",
        status: "New",
        source: "Social Media",
        country: "Australia",
        phone: "456-789-0123",
        email: "alice@example.com",
        description: "Interested in personal plan",
        aiScore: 78,
        humanScore: 70,
    },
    {
        id: 5,
        type: "Company",
        name: "Global Solutions Inc.",
        status: "Lost",
        source: "Cold Call",
        country: "Germany",
        phone: "567-890-1234",
        email: "info@globalsolutions.com",
        description: "Budget constraints, may revisit next quarter",
        aiScore: 45,
        humanScore: 60,
    },
    {
        id: 6,
        type: "Person",
        name: "Emma Wilson",
        status: "Won",
        source: "Website",
        country: "France",
        phone: "678-901-2345",
        email: "emma@example.com",
        description: "Signed up for premium plan",
        aiScore: 95,
        humanScore: 92,
    },
    {
        id: 7,
        type: "Company",
        name: "Startup Ventures",
        status: "Qualified",
        source: "Networking Event",
        country: "USA",
        phone: "789-012-3456",
        email: "hello@startupventures.com",
        description: "Exploring partnership opportunities",
        aiScore: 88,
        humanScore: 85,
    },
    {
        id: 8,
        type: "Person",
        name: "Michael Chang",
        status: "Contacted",
        source: "Referral",
        country: "Singapore",
        phone: "890-123-4567",
        email: "michael@example.com",
        description: "Requested product demo",
        aiScore: 72,
        humanScore: 78,
    },
    {
        id: 9,
        type: "Company",
        name: "EcoTech Solutions",
        status: "New",
        source: "Trade Show",
        country: "Sweden",
        phone: "901-234-5678",
        email: "info@ecotechsolutions.com",
        description: "Interested in green technology integration",
        aiScore: 82,
        humanScore: 79,
    },
    {
        id: 10,
        type: "Person",
        name: "Sophia Rodriguez",
        status: "Qualified",
        source: "Webinar",
        country: "Spain",
        phone: "012-345-6789",
        email: "sophia@example.com",
        description: "Highly engaged, multiple touchpoints",
        aiScore: 93,
        humanScore: 89,
    },
]

const leadStatuses = ["New", "Contacted", "Qualified", "Lost", "Won"]
const leadSources = [
    "Website",
    "Referral",
    "Trade Show",
    "Social Media",
    "Cold Call",
    "Networking Event",
    "Webinar",
    "Other",
]

export default function Leads() {
    const [leads, setLeads] = useState(initialLeads)
    const [newLead, setNewLead] = useState({
        type: "Company",
        name: "",
        status: "New",
        source: "",
        country: "",
        phone: "",
        email: "",
        description: "",
        aiScore: 0,
        humanScore: 0,
    })
    const [filters, setFilters] = useState({
        name: "",
        status: "all",
        aiScore: "",
        humanScore: "",
    })

    const addLead = () => {
        setLeads([
            ...leads,
            {
                ...newLead,
                id: leads.length + 1,
                aiScore: Math.floor(Math.random() * 100),
                humanScore: Math.floor(Math.random() * 100),
            },
        ])
        setNewLead({
            type: "Company",
            name: "",
            status: "New",
            source: "",
            country: "",
            phone: "",
            email: "",
            description: "",
            aiScore: 0,
            humanScore: 0,
        })
    }

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            return (
                lead.name.toLowerCase().includes(filters.name.toLowerCase()) &&
                (filters.status === "all" || lead.status === filters.status) &&
                (filters.aiScore === "" || lead.aiScore >= Number.parseInt(filters.aiScore)) &&
                (filters.humanScore === "" || lead.humanScore >= Number.parseInt(filters.humanScore))
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
                                Enter the details of the new lead here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Type
                                </Label>
                                <Select onValueChange={(value) => setNewLead({ ...newLead, type: value })} defaultValue={newLead.type}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select lead type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Company">Company</SelectItem>
                                        <SelectItem value="Person">Person</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newLead.name}
                                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <Select
                                    onValueChange={(value) => setNewLead({ ...newLead, status: value })}
                                    defaultValue={newLead.status}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select lead status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leadStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="source" className="text-right">
                                    Source
                                </Label>
                                <Select
                                    onValueChange={(value) => setNewLead({ ...newLead, source: value })}
                                    defaultValue={newLead.source}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select lead source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leadSources.map((source) => (
                                            <SelectItem key={source} value={source}>
                                                {source}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="country" className="text-right">
                                    Country
                                </Label>
                                <Input
                                    id="country"
                                    value={newLead.country}
                                    onChange={(e) => setNewLead({ ...newLead, country: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    value={newLead.phone}
                                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={newLead.email}
                                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
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
                        {leadStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
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
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>AI Score</TableHead>
                            <TableHead>Human Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell>{lead.type}</TableCell>
                                <TableCell>{lead.name}</TableCell>
                                <TableCell>{lead.status}</TableCell>
                                <TableCell>{lead.source}</TableCell>
                                <TableCell>{lead.country}</TableCell>
                                <TableCell>{lead.phone}</TableCell>
                                <TableCell>{lead.email}</TableCell>
                                <TableCell>{lead.aiScore}</TableCell>
                                <TableCell>{lead.humanScore}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    )
}

