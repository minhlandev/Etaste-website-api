import "./updatePostPage.scss";
import apiRequest from "../../lib/apiRequest";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/card/Card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdatePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    desc: "",
    utilities: "",
    pet: "",
    income: "",
    address: "",
    bedroom: 0,
    bathroom: 0,
    images: [], // Ensure images are included for the Card component
    latitude: 0, // Giá trị mặc định cho vĩ độ
    longitude: 0, // Giá trị mặc định cho kinh độ
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        const post = res.data;

        // Loại bỏ các thẻ HTML trong phần mô tả
        const sanitizedDesc = post.postDetail?.desc
          ? post.postDetail.desc.replace(/<\/?[^>]+(>|$)/g, "")
          : "";

        setFormData({
          id: post.id || "", // Thêm id của bài viết
          title: post.title || "",
          price: post.price || "",
          desc: sanitizedDesc,
          utilities: post.postDetail?.utilities || "",
          pet: post.postDetail?.pet || "",
          income: post.postDetail?.income || "",
          address: post.address || "",
          bedroom: post.bedroom || 0,
          bathroom: post.bathroom || 0,
          images: post.images || [], // Include images for the Card
          latitude: post.address?.latitude || 0, // Thêm vĩ độ
          longitude: post.address?.longitude || 0, // Thêm kinh độ
          nearbyPlaces: post.nearbyPlaces || [], // Thêm danh sách địa điểm gần đó
          postDetail: {
            ...post.postDetail,
            school: post.postDetail?.school || 0,
            bus: post.postDetail?.bus || 0,
            restaurant: post.postDetail?.restaurant || 0,
          },
        });
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post data.");
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        postDetail: {
          desc: formData.desc,
          utilities: formData.utilities,
          pet: formData.pet,
          income: formData.income,
        },
      };

      const response = await apiRequest.put(`/posts/${id}`, payload);

      if (response.status === 200) {
        toast.success("Post updated successfully!");
        setTimeout(() => {
          navigate(`/${id}`);
        }, 3000);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error("Failed to update post:", err);

      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error("Failed to update post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updatePostPage">
      <ToastContainer />
      <div className="details">
        <div className="wrapper">
          {/* Form Section */}
          <div className="formContainer">
            <form onSubmit={handleSubmit}>
              <h1>Update Post</h1>
              {error && <p className="error">{error}</p>}
              <div className="item">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="item">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="item">
                <label htmlFor="desc">Description</label>
                <textarea
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="item row">
                <div className="half">
                  <label htmlFor="utilities">Utilities Policy</label>
                  <select
                    id="utilities"
                    name="utilities"
                    value={formData.utilities}
                    onChange={handleChange}
                  >
                    <option value="owner">Owner is responsible</option>
                    <option value="tenant">Tenant is responsible</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div className="divider"></div>
                <div className="half">
                  <label htmlFor="pet">Pet Policy</label>
                  <select
                    id="pet"
                    name="pet"
                    value={formData.pet}
                    onChange={handleChange}
                  >
                    <option value="allowed">Allowed</option>
                    <option value="not-allowed">Not Allowed</option>
                  </select>
                </div>
              </div>
              <div className="item">
                <label htmlFor="income">Income</label>
                <input
                  id="income"
                  name="income"
                  type="text"
                  value={formData.income}
                  onChange={handleChange}
                />
              </div>
              {/* Các trường khác */}
              <div className="button-group">
                <button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate(-1)} // Quay lại trang trước
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right">
        <Card item={formData} />
        {/* Display Images */}
        <div className="image-gallery">
          {formData.images.slice(2, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              className="image-item"
            />
          ))}
          <div className="post-detail">
            <p>
              <strong>Description:</strong> {formData.desc}
            </p>
            <p>
              <strong>Utilities Policy:</strong> {formData.utilities}
            </p>
            <p>
              <strong>Pet Policy:</strong> {formData.pet}
            </p>
            <p>
              <strong>Income:</strong> {formData.income}
            </p>
          </div>
        </div>

        <div className="nearby-places">
          <h3>Nearby Places</h3>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="School" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {formData.postDetail?.school > 999
                    ? (formData.postDetail.school / 1000).toFixed(1) + "km"
                    : formData.postDetail?.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="Bus Stop" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{formData.postDetail?.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/restaurant.png" alt="Restaurant" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{formData.postDetail?.restaurant}m away</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePostPage;
