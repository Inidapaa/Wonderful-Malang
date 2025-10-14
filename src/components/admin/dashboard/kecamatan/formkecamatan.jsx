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

export default function CreateKecamatan() {
  const [wisataList, setWisataList] = useState([]);
  const [selectedWisata, setSelectedWisata] = useState("");
  const [formData, setFormData] = useState({
    nama_kecamatan: "",
    deskripsi: "",
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

    // Insert kecamatan baru
    const { data: kecamatanData, error } = await supabase
      .from("kecamatan")
      .insert([{ ...formData }])
      .select();

    if (error) {
      alert("Gagal menyimpan data kecamatan");
      console.error(error);
      return;
    }

    const kecamatanId = kecamatanData[0].id;

    if (selectedWisata) {
      await supabase
        .from("wisata")
        .update({ id_kecamatan: kecamatanId })
        .eq("id", selectedWisata);
    }

    alert("Data kecamatan berhasil disimpan!");
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-2rem)] p-6">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary text-center">
            Tambah Data Kecamatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              name="nama_kecamatan"
              placeholder="Nama Kecamatan"
              onChange={handleChange}
              required
            />
            <Input
              name="deskripsi"
              placeholder="Deskripsi"
              onChange={handleChange}
              required
            />

            <Select onValueChange={setSelectedWisata}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Wisata (opsional)" />
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
