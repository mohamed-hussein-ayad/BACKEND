import { MdDeleteForever } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Spinner from "./Spinner";
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";

export default function Blog({
  _id,
  title: existingTitle,
  slug: existingSlug,
  images: existingImages,
  description: existingDescription,
  blogcategory: existingBlogcategory,
  tags: existingTags,
  status: existingStatus,
}) {
  const [redirect, setRedirect] = useState(false);

  const router = useRouter();

  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [blogcategory, setBlogcategory] = useState(existingBlogcategory || []);
  const [tags, setTags] = useState(existingTags || []);
  const [status, setStatus] = useState(existingStatus || "");

  // for images uploading
  const [isUploading, setIsUploading] = useState(false);
  const uploadImagesQueue = [];
  async function createBlog(ev) {
    ev.preventDefault();

    if (isUploading) {
      await Promise.all(uploadImagesQueue);
    }
    const data = {
      title,
      slug,
      images,
      description,
      blogcategory,
      tags,
      status,
    };
    if (_id) {
      await axios.put("/api/blogs", { ...data, _id });
      toast.success("Data Uploaded");
    } else {
      await axios.post("/api/blogs", data);
      toast.success("Blog Created");
    }
    setRedirect(true);
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);

        // use the aixos.post method and push the promise to the queue

        uploadImagesQueue.push(
          axios.post("/api/upload", data).then((res) => {
            setImages((oldImages) => [...oldImages, ...res.data.links]);
          })
        );
      }
      //wait for all images to finish uploading

      await Promise.all(uploadImagesQueue);

      setIsUploading(false);
      toast.success("Images Uploaded");
    } else {
      toast.error("An error occurred!");
    }
  }

  if (redirect) {
    router.push("/blogs");
    return null;
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function handleDeleteImage(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    toast.success("Image Deleted Successfully");
  }

  // for slug url

  const handleSlugChange = (ev) => {
    const inputValue = ev.target.value;
    const newSlug = inputValue.replace(/\s+/g, "-"); // replace spaces with hyphens
    setSlug(newSlug);
  };
  return (
    <>
      <form className="addWebsiteform" onSubmit={createBlog}>
        {/* blog title */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter small title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </div>
        {/* blog slug url */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="slug">Slug (seo friendly url)</label>
          <input
            type="text"
            id="slug"
            placeholder="Enter Slug url"
            value={slug}
            onChange={handleSlugChange}
          />
        </div>
        {/* blog category */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="category">
            Select Category (for multi select press ctr + left click)
          </label>
          <select
            onChange={(e) =>
              setBlogcategory(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            value={blogcategory}
            name="Category"
            id="Category"
            multiple
          >
            <option value="Web Development">Web Development</option>
            <option value="UI-UX Design">UI/UX Design</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="AI technology">AI technology</option>
          </select>
        </div>
        {/* blog images */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <div className="w-100">
            <label htmlFor="images">
              Images (first image will be show as thumbnail, you can drag)
            </label>
            <input
              type="file"
              id="fileInput"
              className="mt-1"
              accept="image/*"
              multiple
              onChange={uploadImages}
            />
          </div>
          <div className="w-100 flex flex-left mt-1">
            {isUploading && <Spinner />}
          </div>
        </div>
        {/* image preview and image sortable with delete image */}
        {!isUploading && (
          <div className="flex">
            <ReactSortable
              list={Array.isArray(images) ? images : []}
              setList={updateImagesOrder}
              animation={200}
              className="flex gap-1 "
            >
              {images?.map((link, index) => (
                <div key={link} className="uploadedimg">
                  <img src={link} alt="image" className="object-cover" />
                  <div className="deleteimg">
                    <button onClick={() => handleDeleteImage(index)}>
                      <MdDeleteForever />
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        )}
        {/* markdown description */}
        <div className="description w-100 flex flex-col flex-left mb-2">
          <label htmlFor="description">
            Blog Content (for image: first upload and copy link and paste in
            ![alt text][link])
          </label>
          <MarkdownEditor
            value={description}
            onChange={(ev) => setDescription(ev.text)}
            style={{ width: "100%", height: "400px" }}
            renderHTML={(text) => (
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    if (inline) {
                      return <code>{children}</code>;
                    } else if (match) {
                      return (
                        <div style={{ position: "relative" }}>
                          <pre
                            style={{
                              padding: "0",
                              borderRadius: " 5px",
                              overflow: "auto",
                              whiteSpace: "pre-wrap",
                            }}
                            {...props}
                          >
                            <code>{children}</code>
                          </pre>
                          <button
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              zIndex: "1",
                            }}
                            onClick={() =>
                              navigator.clipboard.writeText(children)
                            }
                          >
                            copy code
                          </button>
                        </div>
                      );
                    } else {
                      return <code {...props}>{children}</code>;
                    }
                  },
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          />
        </div>
        {/* tags */}
        <div className="description w-100 flex flex-col flex-left mb-2">
          <label htmlFor="tags">Tags</label>
          <select
            onChange={(e) =>
              setTags(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            value={tags}
            name="tags"
            id="tags"
            multiple
          >
            <option value="" disabled>
              Web Development Tags:
            </option>
            <option value="Web Development">Web Development</option>
            <option value="Front-End Development">Front-End Development</option>
            <option value="Back-End Development">Back-End Development</option>
            <option value="Full-Stack Development">
              Full-Stack Development
            </option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Web Design">Web Design</option>
            <option value="Responsive Design">Responsive Design</option>
            <option value="" disabled>
              UI/UX Design Tags:
            </option>
            <option value="UI Design">UI Design</option>
            <option value="UX Design">UX Design</option>
            <option value="User Experience">User Experience</option>
            <option value="User Interface">User Interface</option>
            <option value="Wireframing">Wireframing</option>
            <option value="Prototyping">Prototyping</option>
            <option value="Figma">Figma</option>
            <option value="Adobe XD">Adobe XD</option>
            <option value="Design Trends">Design Trends</option>
            <option value="" disabled>
              Graphic Design Tags:
            </option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Branding">Branding</option>
            <option value="Logo Design">Logo Design</option>
            <option value="Typography">Typography</option>
            <option value="Adobe Photoshop">Adobe Photoshop</option>
            <option value="Adobe Illustrator">Adobe Illustrator</option>
            <option value="Visual Identity">Visual Identity</option>
            <option value="Creative Design">Creative Design</option>
            <option value="" disabled>
              AI & Tech Tags:
            </option>
            <option value="Artificial Intelligence">
              Artificial Intelligence
            </option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="AI in Web Development">AI in Web Development</option>
            <option value="Automation">Automation</option>
            <option value="Future of AI">Future of AI</option>
            <option value="Tech Trends">Tech Trends</option>
            <option value="Neural Networks">Neural Networks</option>
            <option value="AI Design">AI Design</option>
          </select>
        </div>
        {/* blog status */}
        <div className="description w-100 flex flex-col flex-left mb-2">
          <label htmlFor="status">Status</label>
          <select
            onChange={(ev) => setStatus(ev.target.value)}
            value={status}
            name="status"
            id="status"
          >
            <option value="">No select</option>
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
        </div>
        <div className="w-100 mb-1">
          <button type="submit" className="w-100 addwebbtn flex-center">
            SAVE BLOG
          </button>
        </div>
      </form>
    </>
  );
}
