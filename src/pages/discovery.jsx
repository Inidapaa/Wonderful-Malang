import { useEffect, useRef, useState } from "react";
import { supabase } from "@/supabase-client";
import Navbar from "../global/navbar.jsx";
import Footer from "../global/footer.jsx";
import { Button } from "@/components/ui/button";
import DiscoveryCard from "@/components/discovery/DiscoveryCard";
import {
  Search,
  MapPin,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function DiscoveryPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [kecMap, setKecMap] = useState({});
  const [kecList, setKecList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [kecamatanId, setKecamatanId] = useState("");
  const [selected, setSelected] = useState(null);
  const searchRef = useRef();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  // Hide global scrollbar while on this page
  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");
    return () => {
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  const fetchLists = async () => {
    const [{ data: kecs }, { data: kategoris }] = await Promise.all([
      supabase.from("kecamatan").select("id, nama_kecamatan"),
      supabase.from("wisata").select("kategori"),
    ]);
    const km = {};
    (kecs || []).forEach((k) => (km[k.id] = k));
    setKecMap(km);
    setKecList(kecs || []);
    const uniq = Array.from(
      new Set((kategoris || []).map((r) => r.kategori).filter(Boolean))
    );
    setKategoriList(uniq);
  };

  const fetchItems = async (opts = {}) => {
    const {
      text = search,
      kat = kategori,
      kid = kecamatanId,
      pg = page,
    } = opts;
    setLoading(true);
    let q = supabase
      .from("wisata")
      .select(
        "id, nama_wisata, kategori, deskripsi, gambar, id_pengelola, id_kecamatan, lokasi, harga_tiket, jam_operasional",
        { count: "exact" }
      )
      .order("id", { ascending: false });
    if (kat && kat !== "__ALL__") q = q.eq("kategori", kat);
    if (kid && kid !== "__ALL__") q = q.eq("id_kecamatan", Number(kid));
    if (text) {
      // search in name or description
      q = q.or(`nama_wisata.ilike.%${text}%,deskripsi.ilike.%${text}%`);
    }
    const offset = (pg - 1) * limit;
    const { data, count } = await q.range(offset, offset + limit - 1);
    setItems(data || []);
    setTotal(count || 0);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetchLists();
      await fetchItems({});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when filters/search change (debounced) and reset to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchItems({ pg: 1 });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, kategori, kecamatanId]);

  // Refetch when page changes (no debounce)
  useEffect(() => {
    fetchItems({ pg: page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openDetail = async (w) => {
    // setOpening(true);
    // fetch related details
    const [peng, kec] = await Promise.all([
      w?.id_pengelola
        ? supabase
            .from("pengelola")
            .select("id, nama_pengelola, kontak, alamat, deskripsi")
            .eq("id", w.id_pengelola)
            .single()
            .then((r) => r.data)
        : null,
      w?.id_kecamatan
        ? supabase
            .from("kecamatan")
            .select(
              "id, nama_kecamatan, alamat, deskripsi, jumlah_wisata, kode_pos"
            )
            .eq("id", w.id_kecamatan)
            .single()
            .then((r) => r.data)
        : null,
    ]);
    setSelected({ wisata: w, pengelola: peng, kecamatan: kec });
  };

  const closeDetail = () => setSelected(null);

  return (
    <>
      <Navbar />{" "}
      <div className="min-h-screen w-full bg-primary overflow-y-scroll no-scrollbar pt-20 transition duration-200">
        <section className="w-full bg-primary text-white">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
            <h1 className="text-3xl md:text-5xl font-extrabold font-display">
              Temukan Destinasi Terbaik di{" "}
              <span className="text-blue-400">Malang</span>
            </h1>
            <p className="mt-3 md:mt-4 text-white/90 max-w-2xl">
              Jelajahi ragam wisata alam, budaya, dan kuliner. Pilih destinasi
              dan lihat detailnya secara instan.
            </p>
          </div>
        </section>

        <section className="w-full">
          <div className="max-w-6xl mx-auto px-6 pb-16">
            <div className="mb-6 space-y-3">
              <div className="bg-white rounded-full border border-primary/20 shadow-sm focus-within:ring-2 focus-within:ring-blue-200 px-4 py-2 flex items-center gap-3">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Cari wisata"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 outline-none bg-transparent text-sm"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={kecamatanId || "__ALL__"}
                      onValueChange={(val) => setKecamatanId(val)}
                    >
                      <SelectTrigger className="bg-white rounded-full h-10 px-3 min-w-[200px] md:min-w-[240px] justify-start">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 text-primary" />
                          <SelectValue placeholder="Semua Kecamatan" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="__ALL__" value="__ALL__">
                          Semua Kecamatan
                        </SelectItem>
                        {kecList.map((k) => (
                          <SelectItem key={k.id} value={String(k.id)}>
                            {k.nama_kecamatan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {kecamatanId && kecamatanId !== "__ALL__" && (
                      <button
                        type="button"
                        onClick={() => setKecamatanId("__ALL__")}
                        className="bg-white rounded-full h-8 w-8 inline-flex items-center justify-center border border-primary/10 text-gray-600 hover:bg-white/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={kategori || "__ALL__"}
                      onValueChange={(val) => setKategori(val)}
                    >
                      <SelectTrigger className="bg-white rounded-full h-10 px-3 min-w-[200px] justify-start">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Tag className="h-4 w-4 text-primary" />
                          <SelectValue placeholder="Semua Kategori" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="__ALL__" value="__ALL__">
                          Semua Kategori
                        </SelectItem>
                        {kategoriList.map((k) => (
                          <SelectItem key={k} value={String(k)}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {kategori && kategori !== "__ALL__" && (
                      <button
                        type="button"
                        onClick={() => setKategori("__ALL__")}
                        className="bg-white rounded-full h-8 w-8 inline-flex items-center justify-center border border-primary/10 text-gray-600 hover:bg-white/90"
                        aria-label="Hapus filter kategori"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="text-white/80 py-20">Memuat...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((it) => (
                  <DiscoveryCard
                    key={it.id}
                    item={it}
                    kecamatanName={kecMap[it.id_kecamatan]?.nama_kecamatan}
                    onOpenDetail={() => openDetail(it)}
                  />
                ))}
              </div>
            )}
            {!loading && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(total / limit));
                  const start = Math.max(1, Math.min(page - 1, totalPages - 2));
                  const end = Math.min(totalPages, start + 2);
                  const pages = [];
                  for (let i = start; i <= end; i++) pages.push(i);
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="bg-white rounded-full h-10 w-10 border border-primary/10 text-gray-700 disabled:opacity-50 flex items-center justify-center"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {start > 1 && (
                        <button
                          type="button"
                          onClick={() => setPage(1)}
                          className={
                            "rounded-full h-10 px-4 border " +
                            (page === 1
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-primary/10")
                          }
                        >
                          1
                        </button>
                      )}
                      {start > 2 && (
                        <span className="px-2 text-white/80">…</span>
                      )}
                      {pages.map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPage(num)}
                          className={
                            "rounded-full h-10 px-4 border " +
                            (num === page
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-primary/10")
                          }
                        >
                          {num}
                        </button>
                      ))}
                      {end < totalPages && (
                        <>
                          {end < totalPages - 1 && (
                            <span className="px-2 text-white/80">…</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setPage(totalPages)}
                            className={
                              "rounded-full h-10 px-4 border " +
                              (page === totalPages
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-gray-700 border-primary/10")
                            }
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page >= totalPages}
                        className="bg-white rounded-full h-10 w-10 border border-primary/10 text-gray-700 disabled:opacity-50 flex items-center justify-center"
                        aria-label="Next"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </section>
        {selected && (
          <div className="fixed inset-0 z-300 flex items-center justify-center backdrop-blur-2xl transition-all">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={closeDetail}
            />
            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-2 h-56 md:h-full">
                  <img
                    src={selected.wisata.gambar}
                    alt={selected.wisata.nama_wisata}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-3 p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-2xl font-bold text-primary line-clamp-2">
                      {selected.wisata.nama_wisata}
                    </h3>
                    {selected.wisata.kategori && (
                      <span className="shrink-0 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {selected.wisata.kategori}
                      </span>
                    )}
                  </div>
                  {selected.wisata.lokasi && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Lokasi:</span>{" "}
                      {selected.wisata.lokasi}
                    </div>
                  )}
                  <div className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-3 border whitespace-pre-line">
                    {selected.wisata.deskripsi || "Tidak ada deskripsi"}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border">
                      <h4 className="font-semibold text-primary mb-2">
                        Pengelola
                      </h4>
                      {selected.pengelola ? (
                        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-gray-700">
                          <dt className="font-medium">Nama</dt>
                          <dd>{selected.pengelola.nama_pengelola || "-"}</dd>
                          <dt className="font-medium">Kontak</dt>
                          <dd>{selected.pengelola.kontak || "-"}</dd>
                          <dt className="font-medium">Alamat</dt>
                          <dd>{selected.pengelola.alamat || "-"}</dd>
                          <dt className="font-medium">Deskripsi</dt>
                          <dd>{selected.pengelola.deskripsi || "-"}</dd>
                        </dl>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Tidak ada data pengelola
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border">
                      <h4 className="font-semibold text-primary mb-2">
                        Kecamatan
                      </h4>
                      {selected.kecamatan ? (
                        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-gray-700">
                          <dt className="font-medium">Nama</dt>
                          <dd>{selected.kecamatan.nama_kecamatan || "-"}</dd>
                          <dt className="font-medium">Alamat</dt>
                          <dd>{selected.kecamatan.alamat || "-"}</dd>
                          <dt className="font-medium">Kode Pos</dt>
                          <dd>{selected.kecamatan.kode_pos || "-"}</dd>
                          <dt className="font-medium">Deskripsi</dt>
                          <dd>{selected.kecamatan.deskripsi || "-"}</dd>
                          <dt className="font-medium">Jumlah Wisata</dt>
                          <dd>{selected.kecamatan.jumlah_wisata ?? "-"}</dd>
                        </dl>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Tidak ada data kecamatan
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {selected.wisata.harga_tiket && (
                      <span className="text-xs bg-white border rounded-full px-3 py-1 text-gray-700">
                        Harga tiket: {selected.wisata.harga_tiket}
                      </span>
                    )}
                    {selected.wisata.jam_operasional && (
                      <span className="text-xs bg-white border rounded-full px-3 py-1 text-gray-700">
                        Jam buka: {selected.wisata.jam_operasional}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={closeDetail}>
                      Tutup
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
