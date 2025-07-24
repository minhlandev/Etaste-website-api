import './list.scss';
import Card from "../card/Card";

function List({ posts, showStatus = false }) {
  return (
    <div className='list'>
      {posts.map(item => (
        <div key={item.id} className="list-item">
          <Card item={item} />
          {showStatus && ( // Chỉ hiển thị trạng thái nếu showStatus = true
            <span
              className="post-status"
              style={{
                padding: "5px 10px",
                borderRadius: "5px",
                color: "#fff",
                backgroundColor: item.isApproved ? "#28a745" : "#ffc107", // Màu xanh lá nếu Approved, màu vàng nếu Pending
                marginTop: "10px",
                display: "inline-block",
              }}
            >
              {item.isApproved ? "Approved" : "Pending"} {/* Hiển thị trạng thái */}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default List;