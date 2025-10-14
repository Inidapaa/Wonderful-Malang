import { Button } from "@/components/ui/button";

export default function DiscoveryCard({ item, kecamatanName, onOpenDetail }) {
	return (
		<div
			className="group relative rounded-2xl overflow-hidden border border-primary/20 bg-white/5 shadow-lg hover:shadow-glowing/30 transition-transform hover:-translate-y-0.5"
		>
			<img
				src={item.gambar}
				alt={item.nama_wisata}
				className="w-full h-56 object-cover"
			/>
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
			{item.kategori && (
				<span className="absolute top-2 right-2 z-10 bg-primary text-white text-xs px-2 py-1 rounded-full">
					{item.kategori}
				</span>
			)}
			<div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
				<h3 className="font-semibold text-lg line-clamp-1">
					{item.nama_wisata}
				</h3>
				<p className="text-xs text-white/80 line-clamp-2">
					{item.deskripsi}
				</p>
				<div className="mt-2 flex items-center justify-between gap-2">
					<div className="text-[11px] text-white/80">
						Kecamatan: <span className="font-medium text-white">{kecamatanName || "-"}</span>
					</div>
					<Button
						size="sm"
						className="bg-white/70 text-primary hover:bg-white cursor-pointer"
						onClick={onOpenDetail}
					>
						Detail
					</Button>
				</div>
			</div>
		</div>
	);
}


