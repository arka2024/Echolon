import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
      <Sidebar />
      <main className="flex-1 w-full md:pl-64 overflow-x-hidden p-6 bg-secondary/10">
        <div className="max-w-6xl mx-auto w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
