"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Building2, Play, BookOpen, Settings, Palette, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const platformItems = [
    { name: "Playground", icon: Play },
    { name: "Models", icon: Building2 },
    { name: "Documentation", icon: BookOpen },
    { name: "Settings", icon: Settings },
  ]

  const projectItems = [
    { name: "Design Engineering", icon: Palette },
    { name: "Sales & Marketing", icon: TrendingUp },
  ]

  return (
    <div className={cn("flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border", className)}>
      {/* Company Header */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">Acme Inc</span>
          <span className="text-xs text-sidebar-foreground/60">Enterprise</span>
        </div>
        <ChevronDown className="ml-auto h-4 w-4 text-sidebar-foreground/60" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Platform Section */}
        <div className="mb-6">
          <h3 className="mb-2 px-2 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
            Platform
          </h3>
          <div className="space-y-1">
            {platformItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start gap-3 h-9 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => toggleSection(item.name)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h3 className="mb-2 px-2 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
            Projects
          </h3>
          <div className="space-y-1">
            {projectItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start gap-3 h-9 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/diverse-user-avatars.png" alt="shadcn" />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">SC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">shadcn</span>
            <span className="text-xs text-sidebar-foreground/60 truncate">m@example.com</span>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/60 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
