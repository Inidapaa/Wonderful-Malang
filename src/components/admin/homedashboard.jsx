import { SidebarProvider } from "@/components/ui/sidebar";
import { Trash2, SquarePen } from "lucide-react";
import { AppSidebar } from "./dashboard/sidebar";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AppSidebarLayout = () => {
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-third p-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-primary">Daftar Wisata</h1>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-white shadow-lg">
            <Table containerClassName="w-full overflow-hidden rounded-2xl">
              <TableHeader>
                <TableRow className="bg-primary/90">
                  <TableHead className="w-[100px] text-white sticky top-0 z-10 bg-primary/90">No.</TableHead>
                  <TableHead className="text-white sticky top-0 z-10 bg-primary/90">Wisata</TableHead>
                  <TableHead className="text-white sticky top-0 z-10 bg-primary/90">Lokasi</TableHead>
                  <TableHead className="text-white sticky top-0 z-10 bg-primary/90">Pengelola</TableHead>
                  <TableHead className="text-white sticky top-0 z-10 bg-primary/90">Kategori</TableHead>
                  <TableHead className="text-right text-white sticky top-0 z-10 bg-primary/90">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <button>
                        <SquarePen className="text-primary hover:text-secondary transition-colors" />
                      </button>
                      <button>
                        <Trash2 className="text-red-500 hover:text-red-600 transition-colors" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AppSidebarLayout;
