import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import { useState } from "react";
import { FaBloggerB } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function contacts() {
  // pagination
  const [currentPage, setCurrentPage] = useState(1); // for page 1
  const [perPage] = useState(7);

  // search
  const [searchQuery, setSearchQuery] = useState("");

  //fetch blog data
  const { alldata, loading } = useFetchData("/api/contacts");

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
  const publishedBlogs = currentBlogs;
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(allblog / perPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              All <span>Contacts</span>
            </h2>
          </div>
          <div className="breadcrumb">
            <FaBloggerB />
            <span>/</span> <span>Contacts</span>
          </div>
        </div>
        <div className="blogstable">
          <div className="flex gap-2 mb-1">
            <h2>Search Contacts</h2>
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
                <th>First Name</th>
                <th>Email</th>
                <th>Phone no</th>
                <th>Project</th>
                <th>Open Contact</th>
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
                      <td colSpan={6} className="text-center">
                        No Contacts Found
                      </td>
                    </tr>
                  ) : (
                    publishedBlogs.map((blog, index) => (
                      <tr key={blog._id}>
                        <td>{indexOfFirstBlog + index + 1}</td>
                        <td>
                          <h3>{blog.name}</h3>
                        </td>
                        <td>
                          <h3>{blog.email}</h3>
                        </td>
                        <td>
                          <h3>{blog.phone}</h3>
                        </td>
                        <td>
                          <h3>{blog.project[0]}</h3>
                        </td>
                        <td>
                          <div className="flex gap-2 flex-center">
                            <Link href={"/contacts/view/" + blog._id}>
                              <button>
                                <FaRegEye />
                              </button>
                            </Link>
                            {/* <Link href={"/contacts/delete/" + blog._id}>
                              <button>
                                <RiDeleteBin6Fill />
                              </button>
                            </Link> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
          {publishedBlogs.length === 0 ? (
            ""
          ) : (
            <div className="blogpagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {pageNumbers
                .slice(
                  Math.max(currentPage - 3, 0),
                  Math.min(currentPage + 2, pageNumbers.length)
                )
                .map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`${currentPage === number ? "active" : ""}`}
                  >
                    {number}
                  </button>
                ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentBlogs.length < perPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
