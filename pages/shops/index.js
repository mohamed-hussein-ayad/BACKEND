import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import { useState } from "react";
import { FaBloggerB } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function shops() {
  // pagination
  const [currentPage, setCurrentPage] = useState(1); // for page 1
  const [perPage] = useState(7);

  // search
  const [searchQuery, setSearchQuery] = useState("");

  //fetch blog data
  const { alldata, loading } = useFetchData("/api/shops");

  //function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // total number of blogs
  const allblog = alldata.length;

  // filter all data based on search query
  const filteredBlogs =
    searchQuery.trim() === ""
      ? alldata
      : alldata.filter((blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // calculate index of the first blog displayed onthe currend page
  const indexOfFirstBlog = (currentPage - 1) * perPage;
  const indexofLastBlog = currentPage * perPage;

  // get the current page's blogs
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexofLastBlog);
  const publishedBlogs = currentBlogs.filter((ab) => ab.status === "publish");
  const pageNumber = [];

  for (let i = 1; i < -Math.ceil(allblog / perPage); i++) {
    pageNumber.push(i);
  }

  return (
    <>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              All Published <span>products</span>
            </h2>
          </div>
          <div className="breadcrumb">
            <FaBloggerB />
            <span>/</span> <span>Products</span>
          </div>
        </div>
        <div className="blogstable">
          <div className="flex gap-2 mb-1">
            <h2>Search Products</h2>
            <input
              value={searchQuery}
              onChange={(ev) => setSearchQuery(ev.target.value)}
              type="text"
              placeholder="Search by title..."
            />
          </div>
          <table className="table table-styling">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Edit / Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <tr>
                    <td>
                      <Dataloading />
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {publishedBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No Products Found
                      </td>
                    </tr>
                  ) : (
                    publishedBlogs.map((blog, index) => (
                      <tr key={blog._id}>
                        <td>{indexOfFirstBlog + index + 1}</td>
                        <td>
                          <img src={blog.images[0]} width={100} alt="image" />
                        </td>
                        <td>
                          <h3>{blog.title}</h3>
                        </td>
                        <td>
                          <div className="flex gap-2 flex-center">
                            <Link href={"/shops/edit/" + blog._id}>
                              <button>
                                <FaEdit />
                              </button>
                            </Link>
                            <Link href={"/shops/delete/" + blog._id}>
                              <button>
                                <RiDeleteBin6Fill />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
