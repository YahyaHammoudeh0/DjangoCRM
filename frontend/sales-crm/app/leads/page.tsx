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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getLeads, createLead, rescoreLead, type Lead } from "../services/leadService"

const leadStatuses = ["New", "Contacted", "Qualified", "Unqualified"]
const leadSources = ["Website", "Referral", "Trade Show", "Social Media", "Cold Call", "Other"]

export default function Leads() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [newLead, setNewLead] = useState<Omit<Lead, 'id' | 'score' | 'created_at'>>({
        company_name: "",
        email: "",
        phone: "",
        source: "",
        status: "New",
        industry: "",
        employee_count: 0,
        budget_estimate: 0,
        country: "",
        description: "",
    })

    useEffect(() => {
        loadLeads()
    }, [])

    const loadLeads = async () => {
        try {
            const data = await getLeads()
            setLeads(data)
        } catch (error) {
            alert("Failed to load leads")
        }
    }

    const handleSubmit = async () => {
        try {
            const lead = await createLead(newLead)
            setLeads([...leads, lead])
            alert("Lead added successfully")
        } catch (error) {
            alert("Failed to add lead")
        }
    }

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
                            <DialogDescription>Enter lead details</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {Object.entries(newLead).map(([key, value]) => {
                                const fieldId = `lead-${key}`;
                                return (
                                    <div key={key} className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={fieldId} className="text-right capitalize">
                                            {key.replace('_', ' ')}
                                        </Label>
                                        {key === 'status' ? (
                                            <Select
                                                onValueChange={(value) => setNewLead({ ...newLead, [key]: value })}
                                                value={value as string}
                                            >
                                                <SelectTrigger id={fieldId} className="col-span-3">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {leadStatuses.map((status) => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : key === 'source' ? (
                                            <Select
                                                onValueChange={(value) => setNewLead({ ...newLead, [key]: value })}
                                                value={value as string}
                                            >
                                                <SelectTrigger id={fieldId} className="col-span-3">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {leadSources.map((source) => (
                                                        <SelectItem key={source} value={source}>{source}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : key === 'description' ? (
                                            <Textarea
                                                id={fieldId}
                                                value={value as string}
                                                onChange={(e) => setNewLead({ ...newLead, [key]: e.target.value })}
                                                className="col-span-3"
                                            />
                                        ) : (
                                            <Input
                                                id={fieldId}
                                                type={typeof value === 'number' ? 'number' : 'text'}
                                                value={value}
                                                onChange={(e) => setNewLead({
                                                    ...newLead,
                                                    [key]: typeof value === 'number' ? Number(e.target.value) : e.target.value
                                                })}
                                                className="col-span-3"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit}>Save Lead</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Employees</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell>{lead.company_name}</TableCell>
                                <TableCell>{lead.email}</TableCell>
                                <TableCell>{lead.phone}</TableCell>
                                <TableCell>{lead.source}</TableCell>
                                <TableCell>{lead.status}</TableCell>
                                <TableCell>{lead.industry}</TableCell>
                                <TableCell>{lead.employee_count}</TableCell>
                                <TableCell>${lead.budget_estimate?.toLocaleString()}</TableCell>
                                <TableCell>{lead.country}</TableCell>
                                <TableCell>{lead.score}</TableCell>
                                <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{lead.description}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            try {
                                                const result = await rescoreLead(lead.id!);
                                                setLeads(leads.map(l =>
                                                    l.id === lead.id ? { ...l, score: result.score } : l
                                                ));
                                                alert(`New score: ${result.score}`);
                                            } catch (error) {
                                                alert("Failed to score lead");
                                            }
                                        }}
                                    >
                                        Rescore
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    )
}