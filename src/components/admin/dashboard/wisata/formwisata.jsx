import { useState, useEffect } from "react";
import { supabase } from "../../../../supabase-client.js";

const FormWisata = () => {
  const [formData, setFormData] = useState({
    nama_wisata: "",
    deskripsi: "",
    lokasi: "",
    kategori: "",
    harga_tiket: "",
    jam_operasional: "",
    id_kecamatan: "",
    id_pengelola: "",
  });
  const [gambar, setGambar] = useState(null);
  const [kecamatan, setKecamatan] = useState([]);
  const [pengelola, setPengelola] = useState([]);
  const [loading, setLoading] = useState(false);

  // // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      const { data: kec } = await supabase.from("kecamatan").select("*");
      const { data: peng } = await supabase.from("pengelola").select("*");
      setKecamatan(kec || []);
      setPengelola(peng || []);
    };
    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!gambar) return null;

    const fileExt = gambar.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: error } = await supabase.storage
      .from("images") // folder di Supabase Storage
      .upload(`wisata/${fileName}`, gambar);

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("images")
      .getPublicUrl(`wisata/${fileName}`);

    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await handleImageUpload();

    const { error } = await supabase.from("wisata").insert([
      {
        ...formData,
        gambar: imageUrl,
        created_at: new Date(),
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Gagal menyimpan data: " + error.message);
    } else {
      alert("Data berhasil ditambahkan!");
      setFormData({
        nama_wisata: "",
        deskripsi: "",
        lokasi: "",
        kategori: "",
        harga_tiket: "",
        jam_operasional: "",
        id_kecamatan: "",
        id_pengelola: "",
      });
      setGambar(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Tambah Data Wisata
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nama_wisata"
          placeholder="Nama Wisata"
          value={formData.nama_wisata}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="lokasi"
          placeholder="Lokasi"
          value={formData.lokasi}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="kategori"
          placeholder="Kategori"
          value={formData.kategori}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        <input
          type="number"
          name="harga_tiket"
          placeholder="Harga Tiket"
          value={formData.harga_tiket}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        <input
          type="text"
          name="jam_operasional"
          placeholder="Jam Operasional"
          value={formData.jam_operasional}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        {/* Dropdown Kecamatan */}
        <select
          name="id_kecamatan"
          value={formData.id_kecamatan}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        >
          <option value="">Pilih Kecamatan</option>
          {kecamatan.map((k) => (
            <option key={k.id_kecamatan} value={k.id_kecamatan}>
              {k.nama_kecamatan}
            </option>
          ))}
        </select>

        {/* Dropdown Pengelola */}
        <select
          name="id_pengelola"
          value={formData.id_pengelola}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        >
          <option value="">Pilih Pengelola</option>
          {pengelola.map((p) => (
            <option key={p.id_pengelola} value={p.id_pengelola}>
              {p.nama_pengelola}
            </option>
          ))}
        </select>

        {/* Upload Gambar */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setGambar(e.target.files[0])}
          className="w-full border rounded-lg p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Menyimpan..." : "Simpan Data"}
        </button>
      </form>
    </div>
  );
};

export default FormWisata;
