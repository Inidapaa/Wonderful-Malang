import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, SquarePen, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function Wisata() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [kecamatanMap, setKecamatanMap] = useState({});
  const [pengelolaMap, setPengelolaMap] = useState({});
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const offset = (page - 1) * limit;

  const fetchRows = async () => {
    setLoading(true);
    let query = supabase
      .from("wisata")
      .select(
        "id, nama_wisata, kategori, deskripsi, id_kecamatan, id_pengelola, gambar",
        { count: "exact" }
      )
      .order("id", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (!error) {
      setRows(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    const fetchRefs = async () => {
      const [{ data: kecs }, { data: pengs }] = await Promise.all([
        supabase.from("kecamatan").select("id, nama_kecamatan"),
        supabase.from("pengelola").select("id, nama_pengelola"),
      ]);
      const km = {};
      (kecs || []).forEach((k) => (km[k.id] = k.nama_kecamatan));
      const pm = {};
      (pengs || []).forEach((p) => (pm[p.id] = p.nama_pengelola));
      setKecamatanMap(km);
      setPengelolaMap(pm);
    };
    fetchRefs();
  }, []);

  const toggleAll = (checked) => {
    if (checked) setSelected(new Set(rows.map((r) => r.id)));
    else setSelected(new Set());
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const removeSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Hapus ${selected.size} data?`)) return;
    const ids = Array.from(selected);
    // collect referenced parents before delete
    const pengIds = new Set(
      rows
        .filter((r) => ids.includes(r.id))
        .map((r) => r.id_pengelola)
        .filter(Boolean)
    );
    const kecIds = new Set(
      rows
        .filter((r) => ids.includes(r.id))
        .map((r) => r.id_kecamatan)
        .filter(Boolean)
    );
    // remove images from storage (if any)
    const filePaths = rows
      .filter((r) => ids.includes(r.id))
      .map((r) => r.gambar)
      .map((url) => (typeof url === "string" ? url.split("/images/")[1] : null))
      .filter(Boolean);
    if (filePaths.length > 0) {
      await supabase.storage.from("images").remove(filePaths);
    }
    const { error } = await supabase.from("wisata").delete().in("id", ids);
    if (!error) {
      await cleanupOrphans(pengIds, kecIds);
      setSelected(new Set());
      fetchRows();
    } else alert("Gagal menghapus data");
  };

  const removeOne = async (id) => {
    if (!confirm("Hapus data ini?")) return;
    // remove image first
    const row = rows.find((r) => r.id === id);
    const filePath =
      row?.gambar && typeof row.gambar === "string"
        ? row.gambar.split("/images/")[1]
        : null;
    if (filePath) {
      await supabase.storage.from("images").remove([filePath]);
    }
    const pengIds = new Set(row?.id_pengelola ? [row.id_pengelola] : []);
    const kecIds = new Set(row?.id_kecamatan ? [row.id_kecamatan] : []);
    const { error } = await supabase.from("wisata").delete().eq("id", id);
    if (!error) {
      await cleanupOrphans(pengIds, kecIds);
      fetchRows();
    } else alert("Gagal menghapus data");
  };

  const cleanupOrphans = async (pengIds, kecIds) => {
    // delete pengelola with no more wisata
    for (const pid of Array.from(pengIds)) {
      const { count, error } = await supabase
        .from("wisata")
        .select("id", { count: "exact", head: true })
        .eq("id_pengelola", pid);
      if (!error && (count ?? 0) === 0) {
        await supabase.from("pengelola").delete().eq("id", pid);
      }
    }
    // delete kecamatan with no more wisata
    for (const kid of Array.from(kecIds)) {
      const { count, error } = await supabase
        .from("wisata")
        .select("id", { count: "exact", head: true })
        .eq("id_kecamatan", kid);
      if (!error && (count ?? 0) === 0) {
        await supabase.from("kecamatan").delete().eq("id", kid);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 font-display">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold text-primary">Manajemen Wisata</h1>
      </div>

      <Card className="rounded-2xl border border-primary/20 bg-white shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="w-10 text-white">
                    <input
                      type="checkbox"
                      className="accent-secondary cursor-pointer"
                      checked={rows.length > 0 && selected.size === rows.length}
                      onChange={(e) => toggleAll(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead className="text-white w-12 text-center">
                    No
                  </TableHead>
                  <TableHead className="text-white">Nama Wisata</TableHead>
                  <TableHead className="text-white">Kategori</TableHead>
                  <TableHead className="text-white">Kecamatan</TableHead>
                  <TableHead className="text-white">Pengelola</TableHead>
                  <TableHead className="text-white">Deskripsi</TableHead>
                  <TableHead className="text-right text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, idx) => (
                  <TableRow key={r.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        className="accent-secondary cursor-pointer"
                        checked={selected.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center font-medium text-primary">
                      {offset + idx + 1}
                    </TableCell>
                    <TableCell>{r.nama_wisata}</TableCell>
                    <TableCell>{r.kategori}</TableCell>
                    <TableCell>
                      {kecamatanMap[r.id_kecamatan] || "tidak ada data"}
                    </TableCell>
                    <TableCell>
                      {pengelolaMap[r.id_pengelola] || "tidak ada data"}
                    </TableCell>
                    <TableCell
                      className="max-w-[320px] truncate"
                      title={r.deskripsi || ""}
                    >
                      {r.deskripsi}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="hover:scale-110 transition-transform"
                          onClick={() => navigate(`/dashboard/edit/${r.id}`)}
                        >
                          <SquarePen className="text-primary" />
                        </button>
                        <button
                          className="hover:scale-110 transition-transform"
                          onClick={() => removeOne(r.id)}
                        >
                          <Trash2 className="text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      {loading ? "Memuat..." : "Belum ada data"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={removeSelected}
                disabled={selected.size === 0}
              >
                Hapus Terpilih ({selected.size})
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Limit</span>
                <select
                  className="border rounded-md p-1"
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Halaman {page} dari {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
