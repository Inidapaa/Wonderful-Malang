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

export default function CreateKecamatan() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState({
    nama_kecamatan: "",
    alamat: "",
    deskripsi: "",
    kode_pos: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    nama_kecamatan: "",
    alamat: "",
    deskripsi: "",
    kode_pos: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      const { data } = await supabase
        .from("kecamatan")
        .select("id, nama_kecamatan, alamat, deskripsi, kode_pos")
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
      .from("kecamatan")
      .insert([{ ...formData }])
      .select();

    if (error) {
      alert("Gagal menyimpan data kecamatan");
      console.error(error);
      return;
    }

    alert("Data kecamatan berhasil disimpan!");
    setFormData({
      nama_kecamatan: "",
      alamat: "",
      deskripsi: "",
      kode_pos: "",
    });
    const { data } = await supabase
      .from("kecamatan")
      .select("id, nama_kecamatan, alamat, deskripsi, kode_pos")
      .order("id", { ascending: false });
    setList(data || []);
  };

  const refreshList = async () => {
    const { data } = await supabase
      .from("kecamatan")
      .select("id, nama_kecamatan, alamat, deskripsi, kode_pos")
      .order("id", { ascending: false });
    setList(data || []);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditData({
      nama_kecamatan: row.nama_kecamatan || "",
      alamat: row.alamat || "",
      deskripsi: row.deskripsi || "",
      kode_pos: row.kode_pos || "",
    });
    setEditOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      nama_kecamatan: "",
      alamat: "",
      deskripsi: "",
      kode_pos: "",
    });
    setEditOpen(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("kecamatan")
      .update({
        nama_kecamatan: editData.nama_kecamatan,
        alamat: editData.alamat,
        deskripsi: editData.deskripsi,
        kode_pos: editData.kode_pos || null,
      })
      .eq("id", editingId);
    if (!error) {
      await refreshList();
      cancelEdit();
      alert("Perubahan tersimpan");
    } else alert("Gagal menyimpan perubahan");
  };

  const removeOne = async (id) => {
    if (!confirm("Hapus kecamatan ini beserta wisata terkait?")) return;

    const { data: wisataRows } = await supabase
      .from("wisata")
      .select("id, gambar")
      .eq("id_kecamatan", id);

    const filePaths = (wisataRows || [])
      .map((r) =>
        typeof r.gambar === "string" ? r.gambar.split("/images/")[1] : null
      )
      .filter(Boolean);
    if (filePaths.length)
      await supabase.storage.from("images").remove(filePaths);

    if ((wisataRows || []).length)
      await supabase
        .from("wisata")
        .delete()
        .in(
          "id",
          (wisataRows || []).map((w) => w.id)
        );

    const { error } = await supabase.from("kecamatan").delete().eq("id", id);
    if (!error) {
      await refreshList();
      alert("Kecamatan dan wisata terkait terhapus");
    } else alert("Gagal menghapus data");
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-2rem)] font-display">
      <div className="w-full max-w-5xl mx-auto flex justify-end">
        <Button
          className="bg-primary text-white"
          onClick={() => setCreateOpen(true)}
        >
          Create Kecamatan
        </Button>
      </div>
      <Card className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-2xl border border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary">
            Data Kecamatan
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
                  <TableHead className="text-white">Nama Kecamatan</TableHead>
                  <TableHead className="text-white">Alamat</TableHead>
                  <TableHead className="text-white">Kode Pos</TableHead>
                  <TableHead className="text-white">Deskripsi</TableHead>
                  <TableHead className="text-white text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((k, idx) => (
                  <TableRow key={k.id} className="hover:bg-gray-50">
                    <TableCell className="text-center text-primary font-medium">
                      {idx + 1}
                    </TableCell>
                    <TableCell>{k.nama_kecamatan}</TableCell>
                    <TableCell
                      className="max-w-[280px] truncate"
                      title={k.alamat || ""}
                    >
                      {k.alamat}
                    </TableCell>
                    <TableCell>{k.kode_pos || "-"}</TableCell>
                    <TableCell
                      className="max-w-[320px] truncate"
                      title={k.deskripsi || ""}
                    >
                      {k.deskripsi}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="hover:scale-110 transition-transform"
                          onClick={() => startEdit(k)}
                          title="Edit"
                        >
                          <SquarePen className="text-primary" />
                        </button>
                        <button
                          className="hover:scale-110 transition-transform"
                          onClick={() => removeOne(k.id)}
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
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent side="center" className="bg-white">
          <SheetHeader>
            <SheetTitle>Tambah Data Kecamatan</SheetTitle>
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
                Nama Kecamatan
              </label>
              <Input
                name="nama_kecamatan"
                placeholder=""
                onChange={handleChange}
                required
              />
              <label className="text-sm font-medium text-primary mb-1 block">
                Alamat
              </label>
              <textarea
                name="alamat"
                placeholder="Malang, Jawa Timur"
                onChange={handleChange}
                required
                className="border  rounded-xl p-3 w-full min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <label className="text-sm font-medium text-primary mb-1 block">
                Kode Pos
              </label>
              <Input
                name="kode_pos"
                placeholder=""
                onChange={handleChange}
                inputMode="numeric"
              />
              <label className="text-sm font-medium text-primary mb-1 block">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                placeholder=""
                onChange={handleChange}
                required
                className="border rounded-xl p-3 w-full min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <SheetFooter>
                <div className="flex justify-end gap-2 w-full">
                  <SheetClose asChild>
                    <Button variant="outline" type="button">
                      Batal
                    </Button>
                  </SheetClose>
                  <Button className="bg-primary text-white" type="submit">
                    Simpan
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="center" className="bg-white">
          <SheetHeader>
            <SheetTitle>Edit Kecamatan</SheetTitle>
          </SheetHeader>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Nama Kecamatan
              </label>
              <Input
                value={editData.nama_kecamatan}
                onChange={(e) =>
                  setEditData({ ...editData, nama_kecamatan: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-primary mb-1 block">
                Alamat
              </label>
              <textarea
                value={editData.alamat}
                onChange={(e) =>
                  setEditData({ ...editData, alamat: e.target.value })
                }
                className="border  rounded-xl p-3 w-full min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Kode Pos
              </label>
              <Input
                value={editData.kode_pos}
                onChange={(e) =>
                  setEditData({ ...editData, kode_pos: e.target.value })
                }
                inputMode="numeric"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-primary mb-1 block">
                Deskripsi
              </label>
              <textarea
                value={editData.deskripsi}
                onChange={(e) =>
                  setEditData({ ...editData, deskripsi: e.target.value })
                }
                className="border rounded-xl p-3 w-full min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <SheetFooter>
            <div className="flex justify-end gap-2 w-full">
              <SheetClose asChild>
                <Button variant="outline" type="button" onClick={cancelEdit}>
                  Batal
                </Button>
              </SheetClose>
              <Button
                className="bg-primary text-white"
                type="button"
                onClick={saveEdit}
              >
                Simpan
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
