import './aboutPage.scss';
import {
  Briefcase,
  Users,
  UserCheck,
  Car,
  MapPin,
  Star,
  Calendar,
  Home
} from 'lucide-react';

const About = () => {
  const impactData = [
    {
      icon: <Briefcase className="icon" />,
      number: '200.000+',
      label: 'Lượt thuê phòng trọ thành công trên LHBP',
    },
    {
      icon: <Users className="icon" />,
      number: '100.000+',
      label: 'Người thuê đã trải nghiệm dịch vụ LHBP',
    },
    {
      icon: <UserCheck className="icon" />,
      number: '10.000+',
      label: 'Chủ trọ đang cho thuê qua nền tảng',
    },
    {
      icon: <Car className="icon" />,
      number: '100+',
      label: 'Loại hình chỗ ở được hỗ trợ (phòng trọ, nhà nguyên căn...)',
    },
    {
      icon: <MapPin className="icon" />,
      number: '20+',
      label: 'Tỉnh thành LHBP đã có mặt',
    },
    {
      icon: <Star className="icon" />,
      number: '4.95/5*',
      label: 'Điểm hài lòng trung bình từ người dùng',
    },
    {
      icon: <Calendar className="icon" />,
      number: '2.5 triệu+',
      label: 'Lượt đặt phòng trọ mỗi năm',
    },
    {
      icon: <Home className="icon" />,
      number: '15.000+',
      label: 'Chỗ ở hoạt động trên toàn quốc',
    },
  ];

  return (
    <div className="about">
      <div className="container">
        <section className="hero">
          <div className="hero-text">
            <h1>LHBP - Đồng hành cùng bạn trên mọi hành trình tìm kiếm chỗ ở</h1>
            <p>
              Mỗi căn phòng là một khởi đầu mới. LHBP không chỉ giúp bạn tìm nơi ở phù hợp mà còn đồng hành cùng bạn
              trên hành trình tạo dựng cuộc sống mơ ước. Với trải nghiệm người dùng là ưu tiên hàng đầu, chúng tôi cam
              kết mang đến sự tiện lợi, minh bạch và nhanh chóng.
            </p>
          </div>
          <div className="hero-images">
            <img
              src="https://image.tienphong.vn/Uploaded/2025/svjsplu/2021_09_21/thiet-ke-3-5941.gif"
              alt="Căn hộ tiện nghi"
            />
          </div>
        </section>

        <section className="slogan">
          <h2>Nơi mỗi hành trình tìm nơi ở trở thành một trải nghiệm gắn kết và đầy cảm hứng.</h2>
          <p>
            <strong>Cảm nhận sự kết nối</strong> và <strong>khám phá không gian sống</strong> của riêng bạn. LHBP hướng
            đến việc xây dựng cộng đồng văn minh, nơi mỗi người đều tìm thấy một nơi gọi là “nhà”.
          </p>
        </section>

        <section className="vision-mission">
          <div className="box">
            <h3>Tầm Nhìn</h3>
            <p>
              Trở thành nền tảng công nghệ hàng đầu trong lĩnh vực cho thuê chỗ ở tại Việt Nam, nơi mỗi người đều dễ
              dàng tiếp cận thông tin thuê trọ minh bạch và chất lượng.
            </p>
          </div>
          <div className="box">
            <h3>Sứ Mệnh</h3>
            <p>
              Giúp hàng triệu người thuê và cho thuê kết nối trực tiếp, an toàn và nhanh chóng thông qua công nghệ hiện
              đại, dịch vụ thân thiện và cộng đồng hỗ trợ.
            </p>
          </div>
        </section>

        <section className="impact-numbers">
          <h2 className="section-title">LHBP và những con số</h2>
          <div className="numbers-grid">
            {impactData.map((item, index) => (
              <div key={index} className="number-box">
                {item.icon}
                <p className="number">{item.number}</p>
                <p className="label">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="team">
  <h2 className="section-title">Đội ngũ của chúng tôi</h2>
  <div className="team-grid">
    {[
      {
        name: 'Trần Minh Lân',
        role: 'Nhà sáng lập & CEO',
        description:
          'Với hơn 10 năm kinh nghiệm trong lĩnh vực bất động sản, anh Lân đã xây dựng nền tảng này với mong muốn giúp mọi người dễ dàng tìm kiếm chỗ ở phù hợp.',
        img: '/public/Lan.jpg', // Thay bằng ảnh thật
      },
      {
        name: 'Nguyễn Thị Mộng Bình',
        role: 'Giám đốc Marketing',
        description:
          'Chị Bình có chuyên môn sâu về digital marketing và đam mê giúp đỡ cả người thuê và chủ nhà kết nối với nhau một cách hiệu quả.',
        img: '/public/Binh.jpg',
      },
      {
        name: 'Lê Minh Trung Hiếu',
        role: 'Trưởng phòng Công nghệ',
        description:
          'Anh Hiếu là chuyên gia công nghệ với sứ mệnh phát triển nền tảng dễ sử dụng, an toàn và hiệu quả cho cộng đồng người thuê và chủ nhà.',
        img: '/public/hieu.jpg',
      },
      {
        name: 'Nguyễn Đại Phong',
        role: 'Trưởng nhóm CSKH',
        description:
          'Anh Phong luôn tận tâm hỗ trợ người dùng, giúp giải đáp nhanh chóng các vấn đề và xây dựng trải nghiệm dịch vụ hài lòng nhất.',
        img: '/public/a.png',
      },
    ].map((member, index) => (
      <div key={index} className="team-member">
        <div className="avatar">
          <img src={member.img} alt={member.name} />
        </div>
        <h3>{member.name}</h3>
        <p className="role">{member.role}</p>
        <p className="description">{member.description}</p>
      </div>
    ))}
  </div>
</section>

      </div>
    </div>
  );
};

export default About;
