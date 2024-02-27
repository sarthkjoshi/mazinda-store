"use client";

import { useState, useEffect } from "react";
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BulkUpload = () => {
  const store = useSelector((state) => state.store.store);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filePath, setFilePath] = useState("");

  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    (async () => {
      const { data } = await axios.post("/api/category/fetch-categories");
      console.log(data);
      if (data.success) {
        setCategories(data.categories);
      }
    })();
  }, []);

  return (
    <div className="relative h-[80vh] md:w-2/3 mx-auto p-4">
      <h1 className="font-bold text-xl">Bulk Upload</h1>

      <div className="flex gap-2 flex-col md:flex-row mt-5">
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
          <Button variant="outline" className="w-full">
            Manage your product images
          </Button>
        </Link>
      </div>

      <div className="my-5">
        <p className="text-lg">
          Follow these instructions to download and upload the template:
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

      <hr />

      <div className="my-5">
        <p className="text-lg">
          Follow these instructions to fill the information correctly
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field (mentioned in the template)</TableHead>
              <TableHead>Instructions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">productName</TableCell>
              <TableCell>Enter the name of the product</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">mrp</TableCell>
              <TableCell>Enter the MRP of the product</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">costPrice</TableCell>
              <TableCell>
                Enter the cost price of the product (the price at which you are
                offering the product to Mazinda)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">salesPrice</TableCell>
              <TableCell>
                Enter the sales price of the product(optional) (the price which
                will be shown to the users)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">salesPrice</TableCell>
              <TableCell>
                Enter the sales price of the product(optional) (the price which
                will be shown to the users)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">category</TableCell>
              <TableCell>
                Enter the category under which your product falls (refer to the
                list below)
                <br />
                <span className="text-yellow-500">
                  (The spellings and letter sensitivity should exactly match)
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">subcategory</TableCell>
              <TableCell>
                Enter the sub-category under which your product falls (refer to
                the list below)
                <br />
                <span className="text-yellow-500">
                  (The spellings and letter sensitivity should exactly match)
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">descriptionHeading</TableCell>
              <TableCell>
                Enter the heading of the description <br />
                <span className="text-yellow-500">
                  (Should be comma seperated in case you have multiple
                  descriptions. <br /> For eg - heading1, heading2, heading3
                  ...)
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-bold">description</TableCell>
              <TableCell>
                Enter the corresponding description related to each heading{" "}
                <br />
                <span className="text-yellow-500">
                  (Should be comma seperated in case you have multiple
                  descriptions. <br /> For eg - description1, description2,
                  description3 ...)
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-bold">tags</TableCell>
              <TableCell>
                Enter the tags related to your product <br />
                <span className="text-yellow-500">
                  (Should be comma seperated in case you have multiple tags.{" "}
                  <br /> For eg - tag1, tag2, tag3 ...)
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">imagePaths</TableCell>
              <TableCell>
                Click on "Manage your product images" button above <br />
                Upload the images of the products you want to upload <br />
                After successfully uploading the images, copy the url and paste
                in the cell under imagePaths <br />
                <span className="text-yellow-500">
                  (Should be comma seperated in case you have multiple images.{" "}
                  <br /> For eg - https://path1.xyz, https://path3.xyz,
                  https://path3.xyz ...)
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <hr />

      <div className="mt-5">
        <p className="text-lg">
          These are the available categories and corresponding subcategories
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell>
                  <ul>
                    {category.subcategories.map((subcategory) => (
                      <li>{subcategory}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default BulkUpload;
