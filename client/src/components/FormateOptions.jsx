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
  { id: 1, format: ".mp4", label: "MP4", description: "Widely used format with high compatibility (H.264/AAC codecs)." },
  { id: 2, format: ".mkv", label: "MKV", description: "Matroska format, supports high quality and multiple tracks." },
  { id: 3, format: ".avi", label: "AVI", description: "Older format with larger file sizes, Windows compatible." },
  { id: 4, format: ".mov", label: "MOV", description: "Apple QuickTime format, optimized for macOS." },
  { id: 5, format: ".wmv", label: "WMV", description: "Windows Media Video format, optimized for Windows playback." },
  { id: 6, format: ".flv", label: "FLV", description: "Flash Video format, older web streaming format." },
  { id: 7, format: ".webm", label: "WebM", description: "Open-source format optimized for web and HTML5." },
  { id: 8, format: ".mpg", label: "MPEG", description: "Standard format for digital video, often used for DVDs." },
  { id: 9, format: ".3gp", label: "3GP", description: "Format for mobile devices, smaller file sizes." },
  { id: 10, format: ".ts", label: "TS", description: "Transport Stream, used for broadcasting and streaming." },
  { id: 11, format: ".ogv", label: "OGV", description: "Open-source format with Theora/Vorbis codecs." },
  { id: 12, format: ".hevc", label: "HEVC", description: "H.265 codec for high compression and video quality." },
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
