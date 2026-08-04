import Image from "next/image";

export default function MagnifyImage({
  src,
  alt,
  sizes = "100vw",
  style,
}: {
  src: string;
  alt: string;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
    </div>
  );
}
