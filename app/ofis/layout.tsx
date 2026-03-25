// Bu server component, /ofis rotasını force-dynamic yapar.
// "use client" olan page.tsx'te dynamic export çalışmadığı için layout'ta yapılır.
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
