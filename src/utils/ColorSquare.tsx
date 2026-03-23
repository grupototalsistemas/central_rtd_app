'use client';

interface ColorSquareProps {
  color: string;
  size?: number; // opcional, default 16px
}

export function ColorSquare({ color, size = 16 }: ColorSquareProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: 4,
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
}
