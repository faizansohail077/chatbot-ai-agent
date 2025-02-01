import './globals.css'
import ConvexClientProvider from '@/components/ConvexClientProvider'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ConvexClientProvider>
  )
}