"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import OvalLoader from "@/components/utility/OvalLoader";
import { useSession } from "next-auth/react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ImageGallery = () => {
  const { data: session, status } = useSession();
  const store_name = session?.user.storeName;

  const [files, setFiles] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [fetchingLoading, setFetchingLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(1000);

  const onFileSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    if (!files || files.length === 0) return;

    try {
      const data = new FormData();

      // Append each file to the FormData
      for (const file of files) {
        data.append("file", file);
      }

      const res = await fetch(
        `/api/aws/upload/images?store_name=${store_name}`,
        {
          method: "POST",
          body: data,
        }
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(await res.text());
      }

      console.log("json" + JSON.stringify(json));

      const fileLocations = json.locations;
      console.log(fileLocations);
      toast.success("Images uploaded successfully");

      setFiles([]);
    } catch (error) {
      console.error(error);
      toast.error("Error uploading images");
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    if (store_name) {
      setFetchingLoading(true);
      try {
        (async () => {
          const { data } = await axios.post("/api/aws/get-files", {
            store_name,
            folder_name: "images",
            page: currentPage,
            limit,
          });

          if (data.success) {
            setFetchedImages(
              data.files.map(
                (fileName) =>
                  `${process.env.NEXT_PUBLIC_AWS_IMAGE_BUCKET_BASE_URI}/${fileName}`
              )
            );
            setTotalPages(data.totalPages);
          }
          setFetchingLoading(false);
        })();
      } catch (err) {
        console.log(err);
        setFetchingLoading(true);
      }
    }
  }, [store_name, currentPage, limit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleDelete = async (imagePath) => {
    try {
      await axios.delete(
        `/api/aws/delete-image?imagePath=${encodeURIComponent(imagePath)}`
      );

      setFetchedImages((prevImages) =>
        prevImages.filter((img) => img !== imagePath)
      );

      toast.success("Image deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting image");
    }
  };
  return (
    <div className="relative  mx-auto p-4 bg-white">
      <h1 className="font-bold text-xl my-4">Upload Images</h1>

      <div>
        <div className="flex gap-2">
          <Input
            id="file"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />

          {uploadLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </Button>
          ) : (
            <Button
              onClick={(e) => onFileSubmit(e)}
              disabled={!files || uploadLoading}
            >
              Upload
            </Button>
          )}
        </div>
      </div>

      <h1 className="font-bold text-xl mt-12">Your Product Images</h1>

      {fetchingLoading ? (
        <OvalLoader />
      ) : (
        <div>
          {fetchedImages.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.No</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>URI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fetchedImages.map((imagePath, index) => {
                    let fileName = imagePath.split("/");
                    fileName = fileName[fileName.length - 1];
                    let timeStamp = fileName.split("_");
                    timeStamp = timeStamp[0];
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {/* {new Date(timeStamp)
                          .toISOString()
                          .replace("T", " ")
                          .replace(/\.\d+Z$/, " UTC")} */}
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <img
                            className="w-16 md:w-36 aspect-square object-contain"
                            src={imagePath}
                            alt="image"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-3 items-center">
                            <Button
                              className="scale-75"
                              variant="destructive"
                              onClick={() => handleDelete(imagePath)} // Add a function to handle delete
                            >
                              Delete
                            </Button>

                            <Button
                              className="scale-75"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(imagePath);
                                toast.info("Copied to clipboard");
                              }}
                            >
                              Copy
                            </Button>
                            <span className="block">{imagePath}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="flex gap-1 justify-center mt-5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button variant="outline">{currentPage}</Button>
                <Button
                  variant="secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <span className="text-gray-500">No images uploaded</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
