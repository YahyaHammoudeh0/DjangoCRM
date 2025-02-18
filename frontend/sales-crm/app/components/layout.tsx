"use client"

import { useState, type ReactNode, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, X, Menu } from "lucide-react"
import { LayoutDashboard, Users, FileText, UserCircle, Settings } from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Clients", href: "/clients", icon: UserCircle },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Layout({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const [logo, setLogo] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Load logo from localStorage (in a real app, this might come from an API)
    const savedLogo = localStorage.getItem("crmLogo")
    if (savedLogo) {
      setLogo(savedLogo)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = () => {
    // Clear all auth data from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("is_superuser")
    localStorage.removeItem("username")
    
    // Redirect to login page
    router.push("/login")
  }

  return (
    <div className={`h-screen flex overflow-hidden bg-background text-text ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-64 bg-background overflow-y-auto transition duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900 dark:bg-gray-50">
          {logo ? (
            <img src={logo || "/placeholder.svg"} alt="CRM Logo" className="h-8 w-auto" />
          ) : (
            <span className="text-gray-50 text-2xl font-semibold dark:text-gray-900">CRM Pro</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-50 dark:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-5 px-3">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <span
                className={`flex items-center px-4 py-2 mt-2 text-sm font-semibold rounded-lg ${
                  pathname === item.href ? "text-gray-900 bg-gray-900/10 dark:text-gray-50 dark:bg-gray-50/10" : "text-text hover:bg-gray-100/10 dark:hover:bg-gray-800/10"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow dark:bg-gray-950">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-semibold text-text">
              {navItems.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {localStorage.getItem("username")}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-950">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

