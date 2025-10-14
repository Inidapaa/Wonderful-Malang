import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/supabase-client";

export default function CreateWisata() {
  const [formData, setFormData] = useState({
    nama_wisata: "",
    deskripsi: "",
    lokasi: "",
    kategori: "",
    harga_tiket: "",
    jam_operasional: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Upload gambar dulu ya bro!");

    setLoading(true);

    // 🟦 1️⃣ Upload gambar ke Supabase Storage ("images" bucket)
    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Upload gambar gagal.");
      setLoading(false);
      return;
    }

    // 🟩 2️⃣ Ambil public URL gambar
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    const { error: insertError } = await supabase.from("wisata").insert([
      {
        ...formData,
        harga_tiket: Number(formData.harga_tiket),
        gambar: imageUrl, // simpan URL gambar
        id_pengelola: null,
        id_kecamatan: null,
      },
    ]);

    if (insertError) {
      console.error(insertError);
      alert(
        `Gagal menyimpan data wisata: ${insertError.message || "Unknown error"}`
      );
    } else {
      alert("Wisata berhasil ditambahkan!");
      setFormData({
        nama_wisata: "",
        deskripsi: "",
        lokasi: "",
        kategori: "",
        harga_tiket: "",
        jam_operasional: "",
      });
      setFile(null);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-2rem)] p-6">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary text-center">
            Tambah Wisata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              name="nama_wisata"
              placeholder="Nama Wisata"
              onChange={handleChange}
              required
            />
            <Input
              name="deskripsi"
              placeholder="Deskripsi"
              onChange={handleChange}
              required
            />
            <Input
              name="lokasi"
              placeholder="Lokasi"
              onChange={handleChange}
              required
            />
            <Input
              name="kategori"
              placeholder="Kategori"
              onChange={handleChange}
              required
            />
            <Input
              name="harga_tiket"
              placeholder="Harga Tiket"
              type="number"
              onChange={handleChange}
              required
            />
            <Input
              name="jam_operasional"
              placeholder="Jam Operasional"
              onChange={handleChange}
              required
            />

            {/* 🖼️ Upload Gambar */}
            <div>
              <label className="text-sm font-medium text-primary mb-1">
                Upload Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-primary rounded-xl p-2 w-full"
              />
            </div>

            <Button type="submit" disabled={loading} className="bg-primary text-white w-full">
              {loading ? "Menyimpan..." : "Simpan Wisata"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
