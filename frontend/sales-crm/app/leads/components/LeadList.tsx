"use client"
import { useState, useEffect } from "react"
import { API } from "@/services/api"
import { Lead, Employee } from "@/app/services/leadService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LeadListProps {
  leads: Lead[];
  onLeadUpdate: () => void;
}

export function LeadList({ leads, onLeadUpdate }: LeadListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await API.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAssign = async () => {
    if (!selectedEmployee || !selectedLead) return;

    try {
      await API.assignLead(selectedLead, parseInt(selectedEmployee));
      // Refresh leads list or update the specific lead
      onLeadUpdate();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error assigning lead:", error);
    }
  };

  return (
    <div>
      {/* Existing leads table/list code */}
      {leads.map((lead: Lead) => (
        <div key={lead.id} className="flex items-center justify-between p-4 border-b">
          {/* Existing lead information */}
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLead(lead.id);
                setIsDialogOpen(true);
              }}
            >
              Assign Lead
            </Button>
          </DialogTrigger>
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Lead</DialogTitle>
            <DialogDescription>
              Select an employee to assign this lead to.
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={setSelectedEmployee}>
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
    </div>
  );
}
