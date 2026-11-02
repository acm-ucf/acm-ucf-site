import Image from "next/image";

const affiliates = [
  { name: "BNY Mellon", src: "/affiliates/bny-mellon.svg" },
  { name: "Google", src: "/affiliates/google.svg" },
  { name: "Corsair", src: "/affiliates/corsair.svg" },
  { name: "Iron Galaxy", src: "/affiliates/irongalaxy.svg" },
];

const sponsors = [
  { name: "Northrop Grumman", src: "/sponsors/northrop.svg" },
  { name: "Blue Origin", src: "/sponsors/blue-origin.svg" },
  { name: "AMD", src: "/sponsors/amd.svg" },
];

function LogoRow({
  items,
}: {
  items: { name: string; src: string; className?: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
      {items.map(({ name, src, className }) => (
        <div
          key={name}
          className="flex items-center justify-center h-12 md:h-16 opacity-70 hover:opacity-100 transition-opacity duration-300 "
        >
          <Image
            src={src}
            alt={name}
            width={160}
            height={64}
            className={`${className ?? "max-h-12 md:max-h-16"} w-auto object-contain`}
          />
        </div>
      ))}
    </div>
  );
}

export default function SponsorsSection() {
  return (
    <div className="max-w-full p-8 mx-auto bg-[#0000008e] grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-12">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-catamaran font-black text-foreground mb-4">
            <span className="text-yellow-400">Affiliates</span>
          </h2>
        </div>
        <LogoRow items={affiliates} />
      </div>

      <div className="hidden md:block bg-gray-700" />

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-catamaran font-black text-foreground mb-4">
            <span className="text-yellow-400">Sponsors</span>
          </h2>
        </div>
        <LogoRow items={sponsors} />
      </div>
    </div>
  );
}
