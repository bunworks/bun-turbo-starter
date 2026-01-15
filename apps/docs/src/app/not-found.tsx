import Link from "next/link"
import { FileQuestion, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Страница не найдена</h2>
        <p className="mb-8 text-muted-foreground">
          К сожалению, страница, которую вы ищете, не существует или была перемещена.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs">
              <Search className="mr-2 h-4 w-4" />
              Документация
            </Link>
          </Button>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Совет:</strong> Воспользуйтесь поиском (⌘K) или навигацией в документации, чтобы найти нужную
            информацию.
          </p>
        </div>
      </div>
    </div>
  )
}
