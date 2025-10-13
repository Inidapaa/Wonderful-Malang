import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <div className="h-full font-display flex flex-col gap-10 justify-center items-center p-10">
          <h1 className="text-6xl font-bold">Daftar Wisata</h1>
          <Table className="border border-primary rounded-2xl w-300">
            <TableHeader>
              <TableRow className=" border-primary bg-primary hover:bg-primary">
                <TableHead className="w-[100px] text-white">No.</TableHead>
                <TableHead className="text-white">Wisata</TableHead>
                <TableHead className="text-white">Lokasi</TableHead>
                <TableHead className="text-white">Pengelola</TableHead>
                <TableHead className="text-white">Kategori</TableHead>
                <TableHead className="text-right text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className=" gap-2 flex justify-end text-white">
                    <button className="bg-primary h-10 w-15 rounded-lg">
                      Edit
                    </button>
                    <button className="bg-red-500 h-10 w-15 rounded-lg">
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AppSidebarLayout;
