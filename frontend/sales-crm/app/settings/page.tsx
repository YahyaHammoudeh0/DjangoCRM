"use client"

import { useState, useEffect } from "react"
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Settings() {
  const [logo, setLogo] = useState<string | null>(null)
  const [colors, setColors] = useState({
    primary: "#4f46e5",
    secondary: "#f59e0b",
    accent: "#10b981",
    background: "#ffffff",
    text: "#111827",
  })

  useEffect(() => {
    // Apply colors to the root element
    const root = document.documentElement
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
  }, [colors])

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleColorChange = (colorKey: string, value: string) => {
    // If value is shorthand e.g. "#3f0", expand it to "#33ff00"
    if (value.startsWith("#") && value.length === 4) {
      value = "#" + value[1].repeat(2) + value[2].repeat(2) + value[3].repeat(2);
    }
    // Proceed only if the full format matches "#rrggbb"
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setColors((prevColors) => ({
        ...prevColors,
        [colorKey]: value,
      }));
    } else {
      console.warn("Invalid hex format for", colorKey, ":", value);
    }
  }

  const saveSettings = async () => {
    const res = await fetch("http://localhost:8000/api/settings/", {
      method: "PUT", // or POST depending on your backend
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logo, colors })
    });
    if (res.ok) {
      // Reapply new colors immediately after successful save
      const root = document.documentElement;
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
      console.log("Settings saved on backend");
      // Dispatch an event so that Layout can update global styles
      window.dispatchEvent(new Event("settingsUpdated"));
      alert("Settings saved successfully!");
    } else {
      console.error("Error saving settings");
      alert("Failed to save settings");
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <Tabs defaultValue="branding">
          <TabsList className="mb-4">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
          </TabsList>
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>Customize your CRM's logo and branding elements.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="logo-upload">Upload Logo</Label>
                  <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="mt-1" />
                </div>
                {logo && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="Uploaded logo"
                      className="max-w-xs max-h-32 object-contain"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
                <CardDescription>Customize your CRM's color scheme.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(colors).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <Label htmlFor={`color-${key}`} className="mb-1 capitalize">
                        {key} Color
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id={`color-${key}`}
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-12 h-12 p-1 mr-2"
                        />
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button onClick={saveSettings} className="mt-6">
          Save Settings
        </Button>
      </div>
    </Layout>
  )
}

