import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/supabase-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WisataEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [wisata, setWisata] = useState({
    id: null,
    nama_wisata: "",
    kategori: "",
    deskripsi: "",
    id_pengelola: null,
    id_kecamatan: null,
  });

  const [pengelolaList, setPengelolaList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);

  const [pengelola, setPengelola] = useState({
    id: null,
    nama_pengelola: "",
    kontak: "",
    alamat: "",
  });
  const [kecamatan, setKecamatan] = useState({
    id: null,
    nama_kecamatan: "",
    deskripsi: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // fetch wisata row
      const { data: w, error: ew } = await supabase
        .from("wisata")
        .select(
          "id, nama_wisata, kategori, deskripsi, id_pengelola, id_kecamatan"
        )
        .eq("id", id)
        .single();

      // fetch refs lists in parallel
      const [{ data: pengs }, { data: kecs }] = await Promise.all([
        supabase.from("pengelola").select("id, nama_pengelola, kontak, alamat"),
        supabase.from("kecamatan").select("id, nama_kecamatan, deskripsi"),
      ]);

      if (!ew && w) {
        setWisata(w);
      }
      setPengelolaList(pengs || []);
      setKecamatanList(kecs || []);

      // prefill selected records if exist
      if (w?.id_pengelola) {
        const p = (pengs || []).find((x) => x.id === w.id_pengelola);
        if (p) setPengelola(p);
      }
      if (w?.id_kecamatan) {
        const k = (kecs || []).find((x) => x.id === w.id_kecamatan);
        if (k) setKecamatan(k);
      }

      setLoading(false);
    };
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const pengelolaId = pengelola?.id ?? null;
    const kecamatanId = kecamatan?.id ?? null;

    // Update wisata fields + foreign keys
    const { error: ew } = await supabase
      .from("wisata")
      .update({
        nama_wisata: wisata.nama_wisata,
        kategori: wisata.kategori,
        deskripsi: wisata.deskripsi,
        id_pengelola: pengelolaId,
        id_kecamatan: kecamatanId,
      })
      .eq("id", wisata.id);

    setSaving(false);

    if (!ew) {
      alert("Perubahan tersimpan");
      navigate("/dashboard");
    } else {
      alert("Gagal menyimpan perubahan");
    }
  };

  if (loading) return <div className="p-6">Memuat...</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold text-primary">Edit Data</h1>
      <form onSubmit={submit} className="flex flex-col gap-6">
        {/* Wisata */}
        <Card className="rounded-2xl border border-primary/20 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Form Wisata</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">Nama Wisata</label>
              <Input
                placeholder="Nama Wisata"
                value={wisata.nama_wisata || ""}
                onChange={(e) => setWisata({ ...wisata, nama_wisata: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">Kategori</label>
              <Input
                value={wisata.kategori || ""}
                onChange={(e) => setWisata({ ...wisata, kategori: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">Deskripsi</label>
              <textarea
                placeholder="Deskripsi"
                value={wisata.deskripsi || ""}
                onChange={(e) => setWisata({ ...wisata, deskripsi: e.target.value })}
                className="border border-primary rounded-xl p-3 w-full min-h-[120px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pengelola */}
        <Card className="rounded-2xl border border-primary/20 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Pengelola</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <label className="text-sm font-medium text-primary mb-1 block">Pilih Pengelola (opsional)</label>
            <Select
              value={pengelola?.id ? String(pengelola.id) : undefined}
              onValueChange={(val) => {
                const sel = pengelolaList.find(
                  (p) => String(p.id) === String(val)
                );
                setPengelola(
                  sel || {
                    id: null,
                    nama_pengelola: "",
                    kontak: "",
                    alamat: "",
                  }
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Pengelola (opsional)" />
              </SelectTrigger>
              <SelectContent>
                {pengelolaList.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nama_pengelola}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">Hanya dapat memilih dari daftar pengelola.</div>
          </CardContent>
        </Card>

        {/* Kecamatan */}
        <Card className="rounded-2xl border border-primary/20 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Kecamatan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <label className="text-sm font-medium text-primary mb-1 block">Pilih Kecamatan (opsional)</label>
            <Select
              value={kecamatan?.id ? String(kecamatan.id) : undefined}
              onValueChange={(val) => {
                const sel = kecamatanList.find(
                  (k) => String(k.id) === String(val)
                );
                setKecamatan(
                  sel || { id: null, nama_kecamatan: "", deskripsi: "" }
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kecamatan (opsional)" />
              </SelectTrigger>
              <SelectContent>
                {kecamatanList.map((k) => (
                  <SelectItem key={k.id} value={String(k.id)}>
                    {k.nama_kecamatan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">Hanya dapat memilih dari daftar kecamatan.</div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Batal
          </Button>
          <Button
            className="bg-primary text-white"
            type="submit"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
