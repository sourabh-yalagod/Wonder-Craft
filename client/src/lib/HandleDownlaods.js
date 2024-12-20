import { saveAs } from "file-saver";
export const handledownload = async (url, name = "output") => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch the file");
    }
    const blodFormate = await response.blob();
    saveAs(blodFormate, name);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};
