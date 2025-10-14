import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePengelola() {
  const [wisataList, setWisataList] = useState([]);
  const [selectedWisata, setSelectedWisata] = useState("");
  const [formData, setFormData] = useState({
    nama_pengelola: "",
    kontak: "",
    alamat: "",
  });

  useEffect(() => {
    const fetchWisata = async () => {
      const { data } = await supabase.from("wisata").select("id, nama_wisata");
      setWisataList(data || []);
    };
    fetchWisata();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: pengelolaData, error } = await supabase
      .from("pengelola")
      .insert([formData])
      .select();

    if (!error && selectedWisata) {
      await supabase
        .from("wisata")
        .update({ id_pengelola: pengelolaData[0].id })
        .eq("id", selectedWisata);
      alert("Data pengelola berhasil disimpan!");
    } else alert("Gagal menyimpan data");
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-2rem)] p-6">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary text-center">
            Tambah Data Pengelola
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              name="nama_pengelola"
              placeholder="Nama Pengelola"
              onChange={handleChange}
              required
            />
            <Input
              name="kontak"
              placeholder="Kontak"
              onChange={handleChange}
              required
            />
            <Input
              name="alamat"
              placeholder="Alamat"
              onChange={handleChange}
              required
            />

            <Select onValueChange={setSelectedWisata}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Wisata" />
              </SelectTrigger>
              <SelectContent>
                {wisataList.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.nama_wisata}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="bg-primary hover:bg-secondary text-white w-full"
            >
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
