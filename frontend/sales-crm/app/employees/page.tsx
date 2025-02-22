"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API } from "@/services/api"
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

interface Employee {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  department: string
  position: string
  phone: string
  salary: string | number // Update type to handle both string and number
  is_active: boolean
}

export default function Employees() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    department: "",
    position: "",
    phone: "",
    salary: 0,
    is_active: true,
    password: "" // Required for creation
  })
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add debug logging
    console.log('Superuser status:', localStorage.getItem('is_superuser'));
    console.log('Raw superuser value:', localStorage.getItem('is_superuser'));
    
    // Fix the admin status check
    const adminStatus = localStorage.getItem('is_superuser') === 'true';
    console.log('Computed admin status:', adminStatus);
    setIsAdmin(adminStatus);
    
    const fetchData = async () => {
      try {
        const data = await API.getEmployees()
        setEmployees(data)
      } catch (error: any) {
        console.error("Error fetching employees:", error)
        // Redirect to login if unauthorized
        if (error?.message === 'No authentication token') {
          router.push('/login')
        }
      }
    }

    fetchData()
  }, [router])

  const addEmployee = async () => {
    try {
      setError(null);
      
      // Validate required fields
      const requiredFields = ['username', 'email', 'password', 'first_name', 'last_name'];
      const missingFields = requiredFields.filter(field => !newEmployee[field as keyof typeof newEmployee]);
      
      if (missingFields.length > 0) {
        setError(`Required fields missing: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Submitting employee data:', {
        ...newEmployee,
        password: '[REDACTED]'
      });

      const created = await API.createEmployee(newEmployee);
      console.log('Employee created:', created);
      
      // Refresh the employee list
      const updatedEmployees = await API.getEmployees();
      setEmployees(updatedEmployees);
      
      // Reset form and close dialog
      setNewEmployee({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        department: "",
        position: "",
        phone: "",
        salary: 0,
        is_active: true
      });
      
    } catch (error: any) {
      console.error("Error adding employee:", error);
      setError(error.message || 'Failed to create employee');
    }
  }

  // Add a helper function to format salary
  const formatSalary = (salary: string | number | null): string => {
    if (salary === null || salary === undefined) return '$0.00';
    const numericSalary = typeof salary === 'string' ? parseFloat(salary) : salary;
    return !isNaN(numericSalary) ? `$${numericSalary.toFixed(2)}` : '$0.00';
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Employees</h2>
        {isAdmin && (
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
              {error && (
                <div className="text-red-500 text-sm p-2 mb-4 bg-red-50 border border-red-200 rounded">
                  {error}
                </div>
              )}
              <div className="grid gap-4 py-4">
                {/* Username */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={newEmployee.username}
                    onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                {/* Password */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                {/* Email */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                {/* First Name */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="first_name" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    value={newEmployee.first_name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                {/* Last Name */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="last_name" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    value={newEmployee.last_name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                {/* Department */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                {/* Position */}
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

                {/* Phone */}
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

                {/* Salary */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="salary" className="text-right">
                    Salary
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: parseFloat(e.target.value) })}
                    className="col-span-3"
                  />
                </div>

                {/* Is Active */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_active" className="text-right">
                    Active
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, is_active: value === 'true' })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={addEmployee}>
                  Save Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="rounded-md border border-gray-200 mb-8 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{`${employee.first_name} ${employee.last_name}`}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{formatSalary(employee.salary)}</TableCell>
                <TableCell>{employee.is_active ? "Active" : "Inactive"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

