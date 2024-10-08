import Axios from "./Axios";
const downloadFile = async (filename: string) => {
  try {
    filename = filename.split("/").pop() as string;
    console.log("Filename:", filename);
    const response = await Axios.get(`download/${filename}`, {
      responseType: "blob", // Important for file downloads
    });

    // Create a URL for the file
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // Specify the file name to download

    // Append to the body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

export default downloadFile;
