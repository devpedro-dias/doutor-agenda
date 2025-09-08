import { ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BreadcrumbNav() {
  return (
    <div className="flex items-center gap-2 p-4 border-b border-border">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Copy className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer">Building Your Application</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Data Fetching</span>
      </div>
    </div>
  )
}
