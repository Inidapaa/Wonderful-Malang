import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [fileKey, setFileKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pengelolaList, setPengelolaList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [selectedPengelola, setSelectedPengelola] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

  useEffect(() => {
    const loadRefs = async () => {
      const [{ data: pengs }, { data: kecs }] = await Promise.all([
        supabase
          .from("pengelola")
          .select("id, nama_pengelola")
          .order("id", { ascending: false }),
        supabase
          .from("kecamatan")
          .select("id, nama_kecamatan")
          .order("id", { ascending: false }),
      ]);
      setPengelolaList(pengs || []);
      setKecamatanList(kecs || []);
    };
    loadRefs();
  }, []);

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
        id_pengelola: selectedPengelola ? Number(selectedPengelola) : null,
        id_kecamatan: selectedKecamatan ? Number(selectedKecamatan) : null,
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
      setFileKey((k) => k + 1);
      setSelectedPengelola("");
      setSelectedKecamatan("");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-2rem)] p-6 font-display">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary text-center">
            Tambah Wisata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Nama Wisata
              </label>
              <Input name="nama_wisata" onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                onChange={handleChange}
                required
                className="border rounded-xl p-3 w-full min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Lokasi
              </label>
              <Input
                name="lokasi"
                placeholder="Kab. Malang/Malang"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Kategori
              </label>
              <Select
                value={formData.kategori || undefined}
                onValueChange={(v) => setFormData({ ...formData, kategori: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alam">Alam</SelectItem>
                  <SelectItem value="Water Park">Water Park</SelectItem>
                  <SelectItem value="Playground">Playground</SelectItem>
                  <SelectItem value="Budaya">Budaya</SelectItem>
                  <SelectItem value="Edukasi">Edukasi</SelectItem>
                  <SelectItem value="Kuliner">Kuliner</SelectItem>
                  <SelectItem value="Religi">Religi</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Harga Tiket
              </label>
              <Input
                name="harga_tiket"
                placeholder="12.000"
                type="number"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Jam Operasional
              </label>
              <Input
                name="jam_operasional"
                placeholder="08:00-16:00"
                onChange={handleChange}
                required
              />
            </div>

            {/* Relasi Pengelola & Kecamatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-primary mb-1">
                  Pengelola
                </label>
                <Select
                  value={selectedPengelola || undefined}
                  onValueChange={setSelectedPengelola}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Pengelola" />
                  </SelectTrigger>
                  <SelectContent>
                    {pengelolaList.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.nama_pengelola}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1">
                  Kecamatan
                </label>
                <Select
                  value={selectedKecamatan || undefined}
                  onValueChange={setSelectedKecamatan}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {kecamatanList.map((k) => (
                      <SelectItem key={k.id} value={String(k.id)}>
                        {k.nama_kecamatan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 🖼️ Upload Gambar */}
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">
                Upload Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            key={fileKey}
                className="border border-primary bg-primary/20 rounded-xl p-2 w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-white w-full"
            >
              {loading ? "Menyimpan..." : "Simpan Wisata"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
