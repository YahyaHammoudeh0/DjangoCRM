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
import { getLeads, createLead, rescoreLead, assignLead, type Lead } from "../services/leadService"

const leadStatuses = ["New", "Contacted", "Qualified", "Unqualified"]
const leadSources = ["Website", "Referral", "Trade Show", "Social Media", "Cold Call", "Other"]

export default function Leads() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<number | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [employees, setEmployees] = useState<{ id: number; first_name: string; last_name: string }[]>([]);

    useEffect(() => {
        loadLeads()
    }, [])

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/employee/employees/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch employees');
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        // Call fetchEmployees when the component mounts
        fetchEmployees();
    }, []); // Empty dependency array means this runs once when component mounts

    const loadLeads = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getLeads()
            setLeads(Array.isArray(data) ? data : [])
        } catch (error: unknown) {  // explicitly type as unknown
            setError("Failed to load leads")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setError(null)
            const lead = await createLead(newLead)
            setLeads(prevLeads => [...prevLeads, lead])
            alert("Lead added successfully")
        } catch (error) {
            setError("Failed to add lead")
            console.error(error)
        }
    }

    const handleAssign = async () => {
        if (!selectedEmployee || !selectedLead) return;
        try {
            await assignLead(selectedLead, parseInt(selectedEmployee));
            // Refresh the leads list immediately after assignment
            await loadLeads();
            setIsDialogOpen(false);
            setSelectedEmployee("");
            setSelectedLead(null);
        } catch (error) {
            console.error("Error assigning lead:", error);
            alert("Failed to assign lead. Please try again.");
        }
    };

    if (loading) {
        return (
            <Layout>
                <div>Loading leads...</div>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <div className="text-red-500">{error}</div>
            </Layout>
        )
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
                                                value={String(value)}
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
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads && leads.length > 0 ? (
                            leads.map((lead) => (
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
                                        {lead.assigned_to ? 
                                            `${lead.assigned_to.first_name} ${lead.assigned_to.last_name}` : 
                                            'Unassigned'
                                        }
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedLead(lead.id);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            Assign
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={async () => {
                                                try {
                                                    const result = await rescoreLead(lead.id!);
                                                    setLeads(leads.map(l =>
                                                        l.id === lead.id ? { ...l, score: result.score } : l
                                                    ));
                                                } catch (error) {
                                                    console.error("Failed to score lead:", error);
                                                }
                                            }}
                                        >
                                            Rescore
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    No leads found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Lead</DialogTitle>
                        <DialogDescription>
                            Select an employee to assign this lead to.
                        </DialogDescription>
                    </DialogHeader>
                    <Select onValueChange={setSelectedEmployee} value={selectedEmployee}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                        <SelectContent>
                            {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                    {employee.first_name} {employee.last_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button onClick={handleAssign} disabled={!selectedEmployee}>
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}