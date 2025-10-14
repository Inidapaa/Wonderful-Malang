import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
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
  });

  useEffect(() => {
    const fetchList = async () => {
      const { data } = await supabase
        .from("pengelola")
        .select("id, nama_pengelola, kontak, alamat")
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
      setFormData({ nama_pengelola: "", kontak: "", alamat: "" });
      const { data } = await supabase
        .from("pengelola")
        .select("id, nama_pengelola, kontak, alamat")
        .order("id", { ascending: false });
      setList(data || []);
    } else alert("Gagal menyimpan data");
  };

  const refreshList = async () => {
    const { data } = await supabase
      .from("pengelola")
      .select("id, nama_pengelola, kontak, alamat")
      .order("id", { ascending: false });
    setList(data || []);
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
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-2rem)]">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-2xl border border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary text-center">
            Tambah Data Pengelola
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            <Button
              type="submit"
              className="bg-primary hover:bg-secondary text-white w-full"
            >
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>
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
                    <TableCell>{p.alamat}</TableCell>
                    <TableCell className="text-right">
                      <button
                        className="hover:scale-110 transition-transform"
                        onClick={() => removeOne(p.id)}
                        title="Hapus"
                      >
                        <Trash2 className="text-red-500" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
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
    </div>
  );
}
