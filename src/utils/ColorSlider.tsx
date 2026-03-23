'use client';

import { useEffect, useState } from 'react';

interface ColorSliderProps {
  value?: string; // espera HEX
  onChange: (color: string) => void;
  disabled?: boolean;
}

export default function ColorSlider({
  value,
  onChange,
  disabled,
}: ColorSliderProps) {
  const [hue, setHue] = useState(0);

  // Converte HSL para HEX
  const hslToHex = (h: number, s = 100, l = 50) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0'); // garante 2 dígitos
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Atualiza hue se receber valor externo
  useEffect(() => {
    if (value) {
      // cria elemento temporário para ler cor
      const ctx = document.createElement('canvas').getContext('2d');
      if (ctx) {
        ctx.fillStyle = value;
        // isso só valida se o valor é válido, não converte
        // então mantemos o hue antigo
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number(e.target.value);
    setHue(newHue);
    onChange(hslToHex(newHue));
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="range"
        min={0}
        max={360}
        step={1}
        value={hue}
        onChange={handleChange}
        disabled={disabled}
        className="h-3 w-full appearance-none rounded-lg"
        style={{
          background:
            'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)',
        }}
      />
      <div className="flex items-center gap-2">
        <div
          className="h-6 w-6 rounded border border-gray-400"
          style={{ backgroundColor: hslToHex(hue) }}
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {hslToHex(hue)}
        </span>
      </div>
    </div>
  );
}
