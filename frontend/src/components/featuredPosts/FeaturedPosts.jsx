import { useEffect, useState } from "react";
import "./featuredPosts.scss";
import Card from "../card/Card";
import apiRequest from "../../lib/apiRequest";
// Import Font Awesome icons
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function FeaturedPosts() {
  const [posts, setPosts] = useState([]);
  const [hcmPosts, setHcmPosts] = useState([]);
  const [hnPosts, setHnPosts] = useState([]);
  const [visibleHcmPostsCount, setVisibleHcmPostsCount] = useState(6); // Số bài đăng TP.HCM hiển thị ban đầu
  const [visibleHnPostsCount, setVisibleHnPostsCount] = useState(6); // Số bài đăng Hà Nội hiển thị ban đầu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const recentRes = await apiRequest.get("/posts");
        setPosts(recentRes.data);

        const hcmRes = await apiRequest.get("/posts?city=TP.HCM");
        setHcmPosts(hcmRes.data);

        const hnRes = await apiRequest.get("/posts?city=Hà Nội");
        setHnPosts(hnRes.data);
      } catch (err) {
        setError("Không thể tải bài đăng.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p className="loading">Đang tải...</p>;
  if (error) return <p className="error">{error}</p>;

  const renderPosts = (posts, visibleCount, setVisibleCount) => (
    <>
      <div className="list">
        {posts.slice(0, visibleCount).map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
      {posts.length > 6 && (
        <div className="show-more-container">
          <button
            className="show-more"
            onClick={() =>
              setVisibleCount(visibleCount === 6 ? posts.length : 6) // Chuyển đổi giữa 6 bài và tất cả bài
            }
          >
            {visibleCount === 6 ? (
              <>
                Xem thêm <FaChevronDown /> {/* Icon mũi tên xuống */}
              </>
            ) : (
              <>
                Thu hồi <FaChevronUp /> {/* Icon mũi tên lên */}
              </>
            )}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="featuredPosts">
      <h1>Bài đăng gần đây</h1><br />
      <div className="list">
        {posts.slice(0, 6).map((item) => (
          <div className="card-container" key={item.id}>
            <Card item={item} />
            <span className="new-badge">New</span> {/* Luôn hiển thị chữ "New" */}
          </div>
        ))}
      </div>
      <br /><br /><br />
      <hr />
      <h1>Bài đăng ở TP.HCM</h1>
      {renderPosts(hcmPosts, visibleHcmPostsCount, setVisibleHcmPostsCount)}
       <br /><br /><br />
       <hr /> 
      <h1>Bài đăng ở Hà Nội</h1>
      {renderPosts(hnPosts, visibleHnPostsCount, setVisibleHnPostsCount)}
    </div>
  );
}

export default FeaturedPosts;