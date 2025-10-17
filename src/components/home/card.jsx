import { Mountain, Users, CloudSun } from "lucide-react";

const Card = () => {
  const items = [
    {
      title: "Pariwisata",
      description:
        "Malang Raya memikat dengan keindahan alam, wisata pegunungan, pantai, dan budaya yang khas. Setiap tempat menghadirkan pengalaman yang tak terlupakan.",
      icon: Mountain,
    },
    {
      title: "Masyarakat",
      description:
        "Warga Malang dikenal ramah dan menjunjung tinggi nilai budaya. Keramahan mereka membuat setiap pengunjung merasa seperti di rumah sendiri.",
      icon: Users,
    },
    {
      title: "Suasana",
      description:
        "Udara sejuk dan pemandangan asri menciptakan suasana tenang dan nyaman. Malang Raya selalu menghadirkan keteduhan di setiap sudutnya.",
      icon: CloudSun,
    },
  ];

  return (
    <>
      <div className="font-display w-full flex flex-col justify-center items-center gap-30">
        <h1 className="font-bold text-7xl text-white text-center">
          Kenapa <span className="text-blue-400">Malang?</span>
        </h1>
        <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
          {items.map((item) => (
            <div className="bg-white h-90 w-80 flex flex-col p-5 gap-5 rounded-3xl items-center hover:-translate-y-1 transition duration-300 hover:shadow-glowing">
              <div className="h-20 flex items-center">
                <item.icon size={50}></item.icon>
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <h2 className="font-bold text-2xl">{item.title}</h2>
                <p className="text-center">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Card;
