import Photo from "@/components/photo";
import { FaBloggerB } from "react-icons/fa";

export default function addphoto() {
  return (
    <>
      <div className="addblogspage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Add <span>Photo</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <FaBloggerB />
            <span>/</span> <span>Add Photos</span>
          </div>
        </div>
        <div className="blogsadd">
          <Photo />
        </div>
      </div>
    </>
  );
}
