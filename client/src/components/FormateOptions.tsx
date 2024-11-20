import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const imageFormate = [
  { id: 1, formate: ".jpeg", label: "JPEG" },
  { id: 2, formate: ".png", label: "PNG" },
  { id: 3, formate: ".gif", label: "GIF" },
  { id: 4, formate: ".bmp", label: "BMP" },
  { id: 5, formate: ".tiff", label: "TIFF" },
  { id: 6, formate: ".webp", label: "WebP" },
  { id: 7, formate: ".svg", label: "SVG" },
  { id: 8, formate: ".heic", label: "HEIC" },
  { id: 9, formate: ".ico", label: "ICO" },
];

export default function FormateOptions({
  setImageFormate,
}: {
  setImageFormate: (format: string) => void;
}) {
  return (
    <Select onValueChange={(value) => setImageFormate(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="JPEG" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Image Formats</SelectLabel>
          {imageFormate.map((e) => (
            <SelectItem key={e.id} value={e.formate}>
              {e.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
