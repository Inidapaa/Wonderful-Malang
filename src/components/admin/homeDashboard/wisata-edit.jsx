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

    let pengelolaId = pengelola?.id ?? null;
    let kecamatanId = kecamatan?.id ?? null;

    // If existing pengelola selected, update it; otherwise if fields filled, create new
    if (pengelolaId) {
      await supabase
        .from("pengelola")
        .update({
          nama_pengelola: pengelola.nama_pengelola,
          kontak: pengelola.kontak,
          alamat: pengelola.alamat,
        })
        .eq("id", pengelolaId);
    } else if (
      pengelola.nama_pengelola ||
      pengelola.kontak ||
      pengelola.alamat
    ) {
      const { data: newPeng, error } = await supabase
        .from("pengelola")
        .insert([
          {
            nama_pengelola: pengelola.nama_pengelola || null,
            kontak: pengelola.kontak || null,
            alamat: pengelola.alamat || null,
          },
        ])
        .select()
        .single();
      if (!error && newPeng) pengelolaId = newPeng.id;
    }

    // If existing kecamatan selected, update it; otherwise if fields filled, create new
    if (kecamatanId) {
      await supabase
        .from("kecamatan")
        .update({
          nama_kecamatan: kecamatan.nama_kecamatan,
          deskripsi: kecamatan.deskripsi,
        })
        .eq("id", kecamatanId);
    } else if (kecamatan.nama_kecamatan || kecamatan.deskripsi) {
      const { data: newKec, error } = await supabase
        .from("kecamatan")
        .insert([
          {
            nama_kecamatan: kecamatan.nama_kecamatan || null,
            deskripsi: kecamatan.deskripsi || null,
          },
        ])
        .select()
        .single();
      if (!error && newKec) kecamatanId = newKec.id;
    }

    // Finally, update wisata with chosen or newly created FK ids
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
            <Input
              placeholder="Nama Wisata"
              value={wisata.nama_wisata || ""}
              onChange={(e) =>
                setWisata({ ...wisata, nama_wisata: e.target.value })
              }
            />
            <Input
              placeholder="Kategori"
              value={wisata.kategori || ""}
              onChange={(e) =>
                setWisata({ ...wisata, kategori: e.target.value })
              }
            />
            <Input
              placeholder="Deskripsi"
              value={wisata.deskripsi || ""}
              onChange={(e) =>
                setWisata({ ...wisata, deskripsi: e.target.value })
              }
            />
          </CardContent>
        </Card>

        {/* Pengelola */}
        <Card className="rounded-2xl border border-primary/20 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Pengelola</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Nama Pengelola"
                value={pengelola.nama_pengelola || ""}
                onChange={(e) =>
                  setPengelola({
                    ...pengelola,
                    nama_pengelola: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Kontak"
                value={pengelola.kontak || ""}
                onChange={(e) =>
                  setPengelola({ ...pengelola, kontak: e.target.value })
                }
              />
              <Input
                placeholder="Alamat"
                value={pengelola.alamat || ""}
                onChange={(e) =>
                  setPengelola({ ...pengelola, alamat: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  setPengelola({
                    id: null,
                    nama_pengelola: "",
                    kontak: "",
                    alamat: "",
                  })
                }
              >
                Kosongkan Pengelola
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kecamatan */}
        <Card className="rounded-2xl border border-primary/20 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Kecamatan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nama Kecamatan"
                value={kecamatan.nama_kecamatan || ""}
                onChange={(e) =>
                  setKecamatan({
                    ...kecamatan,
                    nama_kecamatan: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Deskripsi"
                value={kecamatan.deskripsi || ""}
                onChange={(e) =>
                  setKecamatan({ ...kecamatan, deskripsi: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  setKecamatan({ id: null, nama_kecamatan: "", deskripsi: "" })
                }
              >
                Kosongkan Kecamatan
              </Button>
            </div>
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
