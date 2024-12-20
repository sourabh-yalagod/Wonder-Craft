import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SrcollMenu({ setFormat, data }) {
  return (
    <Select onValueChange={(value) => setFormat(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={data?.[0]?.type || "Select Option"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select {data[0].type}</SelectLabel>
          {data?.map((item) => (
            <SelectItem key={item?.id} value={item?.value}>
              {item?.value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
