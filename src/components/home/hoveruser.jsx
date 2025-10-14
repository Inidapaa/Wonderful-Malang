import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";

const HoverUser = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("pengelola")
        .select("id, nama_pengelola, deskripsi")
        .order("id", { ascending: false })
        .limit(5);
      setItems(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="flex flex-wrap gap-10 md:gap-25 justify-center items-center">
          {loading && <div className="col-span-full text-white">Memuat...</div>}
          {!loading && items.length === 0 && (
            <div className="col-span-full text-white">Belum ada data</div>
          )}
          {!loading &&
            items.map((p) => (
              <HoverCard key={p.id}>
                <HoverCardTrigger
                  asChild
                  className="bg-white flex justify-center items-center h-20 w-45 hover:shadow-glowing transition-all duration-1000"
                >
                  <Button
                    className="text-black font-bold p-3 flex-wrap uppercase"
                    variant="link"
                  >
                    {p.nama_pengelola}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-1 text-center">
                    <h4 className="text-sm font-semibold text-primary">
                      {p.nama_pengelola}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {p.deskripsi || "Tidak ada deskripsi"}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
        </div>
      </div>
    </>
  );
};

export default HoverUser;
