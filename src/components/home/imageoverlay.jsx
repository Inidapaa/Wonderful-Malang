import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/supabase-client";

const ImageOverlay = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("wisata")
        .select("id, nama_wisata, deskripsi, gambar")
        .order("id", { ascending: false })
        .limit(6);
      setItems(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section className="w-full rounded-3xl bg-primary text-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-white">
              Best Locations
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">
              To Explore in <span className="text-blue-400">Malang</span>
            </h2>
          </div>
          <p className="max-w-2xl text-sm md:text-base text-white">
            Temukan destinasi terbaik di Malang. Dari pesona alam, budaya hingga
            kuliner, pilihan ini diracik untuk semua tipe pelancong.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-white/60">Memuat...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className={`overflow-hidden rounded-xl relative group shadow-lg border border-primary/10 bg-white/5 ${
                  idx === 0
                    ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 h-[460px]"
                    : "h-[220px]"
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    alt={it.nama_wisata || "Wisata"}
                    src={it.gambar}
                    className="object-cover object-center w-full h-full group-hover:scale-105 transition duration-300 ease-in-out"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent p-4 md:p-5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition duration-300 ease-in-out">
                  <div className="space-y-1">
                    <div className="font-semibold text-base md:text-lg line-clamp-1">
                      {it.nama_wisata}
                    </div>
                    <div className="opacity-90 text-xs md:text-sm line-clamp-2">
                      {it.deskripsi}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Link
            to="/discovery"
            className="inline-flex items-center gap-2 rounded-full border border-primary bg-white/10 px-5 py-2 text-sm hover:bg-blue-400/20 transition"
          >
            Lihat Selengkapnya
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ImageOverlay;
