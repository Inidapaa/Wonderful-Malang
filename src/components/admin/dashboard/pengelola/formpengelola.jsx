import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Trash2, SquarePen } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function CreatePengelola() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState({
    nama_pengelola: "",
    kontak: "",
    alamat: "",
    deskripsi: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    nama_pengelola: "",
    kontak: "",
    alamat: "",
    deskripsi: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      const { data } = await supabase
        .from("pengelola")
        .select("id, nama_pengelola, kontak, alamat, deskripsi")
        .order("id", { ascending: false });
      setList(data || []);
    };
    fetchList();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("pengelola")
      .insert([formData])
      .select();

    if (!error) {
      alert("Data pengelola berhasil disimpan!");
      setFormData({ nama_pengelola: "", kontak: "", alamat: "", deskripsi: "" });
      const { data } = await supabase
        .from("pengelola")
        .select("id, nama_pengelola, kontak, alamat, deskripsi")
        .order("id", { ascending: false });
      setList(data || []);
    } else alert("Gagal menyimpan data");
  };

  const refreshList = async () => {
    const { data } = await supabase
      .from("pengelola")
      .select("id, nama_pengelola, kontak, alamat, deskripsi")
      .order("id", { ascending: false });
    setList(data || []);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditData({
      nama_pengelola: row.nama_pengelola || "",
      kontak: row.kontak || "",
      alamat: row.alamat || "",
      deskripsi: row.deskripsi || "",
    });
    setEditOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ nama_pengelola: "", kontak: "", alamat: "", deskripsi: "" });
    setEditOpen(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("pengelola")
      .update({
        nama_pengelola: editData.nama_pengelola,
        kontak: editData.kontak,
        alamat: editData.alamat,
        deskripsi: editData.deskripsi,
      })
      .eq("id", editingId);
    if (!error) {
      await refreshList();
      cancelEdit();
      alert("Perubahan tersimpan");
    } else alert("Gagal menyimpan perubahan");
  };

  const removeOne = async (id) => {
    if (!confirm("Hapus pengelola ini beserta wisata terkait?")) return;
    // find wisata referencing this pengelola
    const { data: wisataRows } = await supabase
      .from("wisata")
      .select("id, gambar")
      .eq("id_pengelola", id);
    // delete images
    const filePaths = (wisataRows || [])
      .map((r) =>
        typeof r.gambar === "string" ? r.gambar.split("/images/")[1] : null
      )
      .filter(Boolean);
    if (filePaths.length)
      await supabase.storage.from("images").remove(filePaths);
    // delete wisata rows
    if ((wisataRows || []).length)
      await supabase
        .from("wisata")
        .delete()
        .in(
          "id",
          (wisataRows || []).map((w) => w.id)
        );
    // delete pengelola
    const { error } = await supabase.from("pengelola").delete().eq("id", id);
    if (!error) {
      await refreshList();
      alert("Pengelola dan wisata terkait terhapus");
    } else alert("Gagal menghapus data");
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-2rem)] font-display">
      <div className="w-full max-w-5xl mx-auto flex justify-end">
        <Button className="bg-primary text-white" onClick={() => setCreateOpen(true)}>
          Create Pengelola
        </Button>
      </div>
      <Card className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-2xl border border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary">
            Data Pengelola
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-white w-12 text-center">
                    No
                  </TableHead>
                  <TableHead className="text-white">Nama Pengelola</TableHead>
                  <TableHead className="text-white">Kontak</TableHead>
                  <TableHead className="text-white">Alamat</TableHead>
                  <TableHead className="text-white">Deskripsi</TableHead>
                  <TableHead className="text-white text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((p, idx) => (
                  <TableRow key={p.id} className="hover:bg-gray-50">
                    <TableCell className="text-center text-primary font-medium">
                      {idx + 1}
                    </TableCell>
                    <TableCell>{p.nama_pengelola}</TableCell>
                    <TableCell>{p.kontak}</TableCell>
                    <TableCell className="max-w-[280px] truncate" title={p.alamat || ""}>{p.alamat}</TableCell>
                    <TableCell className="max-w-[320px] truncate" title={p.deskripsi || ""}>{p.deskripsi}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="hover:scale-110 transition-transform"
                          onClick={() => startEdit(p)}
                          title="Edit"
                        >
                          <SquarePen className="text-primary" />
                        </button>
                        <button
                          className="hover:scale-110 transition-transform"
                          onClick={() => removeOne(p.id)}
                          title="Hapus"
                        >
                          <Trash2 className="text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      Belum ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Create Pengelola Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent side="center" className="bg-white">
          <SheetHeader>
            <SheetTitle>Tambah Data Pengelola</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <form
              onSubmit={async (e) => {
                await handleSubmit(e);
                setCreateOpen(false);
              }}
              className="flex flex-col gap-5"
            >
              <label className="text-sm font-medium text-primary mb-1 block">
                Nama Pengelola
              </label>
              <Input
                name="nama_pengelola"
                placeholder="Nama Pengelola"
                onChange={handleChange}
                required
              />
              <label className="text-sm font-medium text-primary mb-1 block">
                Kontak
              </label>
              <Input
                name="kontak"
                placeholder="Kontak"
                onChange={handleChange}
                required
              />
              <label className="text-sm font-medium text-primary mb-1 block">
                Alamat
              </label>
              <textarea
                name="alamat"
                placeholder="Alamat"
                onChange={handleChange}
                className="border border-primary rounded-xl p-3 w-full min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <label className="text-sm font-medium text-primary mb-1 block">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                placeholder="Deskripsi"
                onChange={handleChange}
                className="border border-primary rounded-xl p-3 w-full min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <SheetFooter>
                <div className="flex justify-end gap-2 w-full">
                  <SheetClose asChild>
                    <Button variant="outline" type="button">Batal</Button>
                  </SheetClose>
                  <Button className="bg-primary text-white" type="submit">Simpan</Button>
                </div>
              </SheetFooter>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="center" className="bg-white">
          <SheetHeader>
            <SheetTitle>Edit Pengelola</SheetTitle>
          </SheetHeader>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">Nama Pengelola</label>
              <Input
                value={editData.nama_pengelola}
                onChange={(e) => setEditData({ ...editData, nama_pengelola: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">Kontak</label>
              <Input
                value={editData.kontak}
                onChange={(e) => setEditData({ ...editData, kontak: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-primary mb-1 block">Alamat</label>
              <textarea
                value={editData.alamat}
                onChange={(e) => setEditData({ ...editData, alamat: e.target.value })}
                className="border border-primary rounded-xl p-3 w-full min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-primary mb-1 block">Deskripsi</label>
              <textarea
                value={editData.deskripsi}
                onChange={(e) => setEditData({ ...editData, deskripsi: e.target.value })}
                className="border border-primary rounded-xl p-3 w-full min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <SheetFooter>
            <div className="flex justify-end gap-2 w-full">
              <SheetClose asChild>
                <Button variant="outline" type="button" onClick={cancelEdit}>Batal</Button>
              </SheetClose>
              <Button className="bg-primary text-white" type="button" onClick={saveEdit}>Simpan</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
