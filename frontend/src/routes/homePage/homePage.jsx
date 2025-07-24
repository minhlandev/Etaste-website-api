import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Tìm Phòng Trọ Dễ Dàng – Ở Ngay Hôm Nay!</h1>
          <p>
            Bạn đang tìm phòng trọ, căn hộ cho thuê phù hợp? Hệ thống của chúng
            tôi cập nhật liên tục hàng ngàn tin rao với đầy đủ thông tin về giá
            cả, tiện ích, vị trí. Dễ dàng tìm kiếm, liên hệ trực tiếp với chủ
            trọ, không lo môi giới. Hãy chọn ngay chỗ ở lý tưởng và bắt đầu cuộc
            sống mới một cách thuận tiện nhất!
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
      
    </div>
  );
}

export default HomePage;
