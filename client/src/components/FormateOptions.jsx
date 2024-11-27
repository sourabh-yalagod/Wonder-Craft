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
  { id: 1, format: ".jpeg", label: "JPEG" },
  { id: 2, format: ".png", label: "PNG" },
  { id: 3, format: ".gif", label: "GIF" },
  { id: 4, format: ".bmp", label: "BMP" },
  { id: 5, format: ".tiff", label: "TIFF" },
  { id: 6, format: ".webp", label: "WebP" },
];
const videoFormate = [
  { id: 1, format: ".mp4", label: "MP4" },
  { id: 2, format: ".mkv", label: "MKV" },
  { id: 3, format: ".avi", label: "AVI" },
  { id: 4, format: ".mov", label: "MOV" },
  { id: 5, format: ".wmv", label: "WMV" },
  { id: 6, format: ".flv", label: "FLV" },
  { id: 7, format: ".webm", label: "WebM" },
  { id: 8, format: ".mpg", label: "MPEG" },
  { id: 9, format: ".3gp", label: "3GP" },
];

export default function FormateOptions({ setFormate, isVideoFormate = false }) {
  return (
    <Select onValueChange={(value) => setFormate(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`${isVideoFormate ? "MP4" : "JPEG"}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            {isVideoFormate ? "Video Formats" : "Image Formats"}
          </SelectLabel>
          {(isVideoFormate ? videoFormate : imageFormate).map((e) => (
            <SelectItem key={e.id} value={e.format}>
              {e.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
