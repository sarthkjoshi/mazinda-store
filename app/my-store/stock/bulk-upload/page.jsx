"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

const BulkUpload = () => {
  const store = useSelector((state) => state.store.store);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filePath, setFilePath] = useState("");

  const handleDownload = () => {
    // Template data
    const templateData = [
      {
        productName: "",
        mrp: "",
        costPrice: "",
        salesPrice: "",
        category: "",
        subcategory: "",
        descriptionHeading: "",
        description: "",
        tags: "",
        imagePaths: "",
      },
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(templateData[0])
        .map((key) => key)
        .join(",") +
      "\n" +
      templateData
        .map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(",")
        )
        .join("\n");

    // Create a temporary link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_template.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("storeName", store.storeName);

      // Send file to backend for processing and uploading to S3
      const { data } = await axios.post("/api/upload/upload-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setFilePath(data.location);
        toast.success("File uploaded successfully");
      } else {
        toast.error("Oops, something went wrong");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateRequest = async () => {
    try {
      const { data } = await axios.post("/api/bulk-upload/create-request", {
        storeId: store._id,
        storeName: store.storeName,
        filePath,
      });
      if (data.success) {
        toast.success("Your request for bulk upload is successfully submitted");
      } else {
        toast.error("Oops, something went wrong. Please try again later");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative h-[80vh] md:w-1/2 mx-auto">
      <h1 className="font-bold text-xl">Bulk Upload</h1>
      <div className="my-5">
        <p className="text-lg">
          Follow these instructions to download the template:
        </p>
        <ul className="text-gray-500">
          <li>Click the "Download Template" button below.</li>
          <li>Save the file to your computer.</li>
          <li>Open the CSV file in a spreadsheet program.</li>
          <li>Fill in the product information as instructed.</li>
          <li>Save the filled template to your computer.</li>
          <li>
            After the file is ready, click on "Upload", and upload the file
          </li>
        </ul>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleDownload}>Download Template</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Upload File</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Upload the filled template downloaded on the previous screen
                here. Click on Browse, choose the file and click on "Upload".
                After final verification click on "Send For Approval"
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                {uploading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                  >
                    Upload
                  </Button>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRequest} disabled={!filePath}>
                Send For Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Link href="/my-store/stock/bulk-upload/image-gallery">
          <Button variant="outline">Manage your product images</Button>
        </Link>
      </div>
    </div>
  );
};

export default BulkUpload;
