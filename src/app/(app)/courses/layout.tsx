// Make sure your layout file doesn't add extra width or padding
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-hidden">{children}</div>
}
