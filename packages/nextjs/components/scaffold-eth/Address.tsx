import { useState, useEffect } from "react";

type AddressInputProps = {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export function Address({
  address,
  format = "short",
}: {
  address: string | `0x${string}`;
  format?: "short" | "full" | "blockie";
}) {
  const [ens, setEns] = useState<string | null>(null);

  const addrStr = typeof address === "string" ? address : address;
  const trimmed = addrStr.slice(0, 6) + "..." + addrStr.slice(-4);

  if (format === "full") {
    return <span className="font-mono text-sm">{addrStr}</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm">{format === "short" ? trimmed : addrStr}</span>
      {ens && <span className="text-xs opacity-70">({ens})</span>}
    </div>
  );
}