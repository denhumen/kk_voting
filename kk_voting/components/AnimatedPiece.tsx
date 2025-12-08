import Image from "next/image";

interface AnimatedPieceProps {
  src: string;
  alt: string;
  className?: string;
  rotate?: number;   // degrees
  scale?: number;    // scale multiplier
}

export default function AnimatedPiece({
  src,
  alt,
  className = "",
  rotate = 0,
  scale = 1,
}: AnimatedPieceProps) {
  return (
    <div
      className={className}
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={300}     // change if needed
        height={300}    // change if needed
        draggable={false}
        priority
      />
    </div>
  );
}
