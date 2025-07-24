import "./contactPage.scss";
"use client"

import { useState } from "react"
import "./contactPage.scss"
// Giả sử bạn đã cài đặt react-icons
import {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaPaperPlane,
    FaUserAlt,
    FaHome,
    FaHandshake,
} from "react-icons/fa"

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        contactType: "renter", // Mặc định là người thuê
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const validateForm = () => {
        const errors = {}
        if (!formData.name.trim() || formData.name.length < 2) {
            errors.name = "Tên phải có ít nhất 2 ký tự."
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email không hợp lệ."
        }
        if (!formData.phone.trim() || formData.phone.length < 10) {
            errors.phone = "Số điện thoại phải có ít nhất 10 số."
        }
        if (!formData.subject.trim() || formData.subject.length < 5) {
            errors.subject = "Tiêu đề phải có ít nhất 5 ký tự."
        }
        if (!formData.message.trim() || formData.message.length < 10) {
            errors.message = "Tin nhắn phải có ít nhất 10 ký tự."
        }
        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = validateForm()

        if (Object.keys(errors).length === 0) {
            setIsSubmitting(true)
            setFormErrors({})

            try {
                // Giả lập gửi dữ liệu đến API
                // Trong ứng dụng thực tế, bạn sẽ gọi API endpoint ở đây
                // Ví dụ: await axios.post('/api/contact', formData);

                console.log("Gửi tin nhắn đến admin:", {
                    type:
                        formData.contactType === "renter"
                            ? "Người thuê phòng"
                            : formData.contactType === "owner"
                                ? "Chủ nhà"
                                : "Đối tác",
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                    timestamp: new Date().toISOString(),
                })

                // Giả lập thời gian gửi
                await new Promise((resolve) => setTimeout(resolve, 1500))

                // Hiển thị thông báo thành công
                setSubmitSuccess(true)

                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                    contactType: "renter",
                })

                // Ẩn thông báo thành công sau 5 giây
                setTimeout(() => {
                    setSubmitSuccess(false)
                }, 5000)
            } catch (error) {
                // Xử lý lỗi
                console.error("Lỗi khi gửi tin nhắn:", error)
                alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.")
            } finally {
                setIsSubmitting(false)
            }
        } else {
            setFormErrors(errors)
        }
    }

    // Lấy placeholder và tiêu đề dựa trên loại liên hệ
    const getPlaceholders = () => {
        switch (formData.contactType) {
            case "owner":
                return {
                    subject: "Đăng tin cho thuê phòng trọ tại...",
                    message:
                        "Tôi muốn đăng tin cho thuê phòng trọ tại địa chỉ... Phòng có diện tích... m², giá... VNĐ/tháng. Vui lòng liên hệ lại với tôi để biết thêm chi tiết.",
                }
            case "partner":
                return {
                    subject: "Đề xuất hợp tác về...",
                    message:
                        "Tôi đại diện cho công ty... muốn đề xuất hợp tác về... Vui lòng liên hệ lại với tôi để trao đổi thêm.",
                }
            default: // renter
                return {
                    subject: "Hỗ trợ tìm phòng trọ tại...",
                    message:
                        "Tôi đang tìm phòng trọ ở khu vực... với giá khoảng... VNĐ/tháng. Tôi cần phòng có... Vui lòng hỗ trợ tôi tìm phòng phù hợp.",
                }
        }
    }

    const placeholders = getPlaceholders()

    return (
        <div className="contactPage">
            <div className="container">
                <h1 className="pageTitle">Liên Hệ Với Chúng Tôi</h1>
                <p className="pageDescription">
                    Bạn có thắc mắc về việc tìm phòng trọ? Muốn đăng tin cho thuê? Hoặc đề xuất hợp tác?
                    <br />
                    Hãy liên hệ với chúng tôi, đội ngũ hỗ trợ sẽ phản hồi trong thời gian sớm nhất!
                </p>

                <div className="contactContent">
                    {/* Thông tin liên hệ */}
                    <div className="contactInfo">
                        <h2>Thông Tin Liên Hệ</h2>

                        <div className="infoItem">
                            <div className="iconWrapper mapIcon">
                                <FaMapMarkerAlt />
                            </div>
                            <div className="infoContent">
                                <h3>Văn phòng</h3>
                                <p>Số 12 Nguyễn Văn Bảo, Phường 1, Quận Gò Vấp, Thành phố Hồ Chí Minh</p>
                            </div>
                        </div>

                        <div className="infoItem">
                            <div className="iconWrapper phoneIcon">
                                <FaPhone />
                            </div>
                            <div className="infoContent">
                                <h3>Hotline hỗ trợ</h3>
                                <p>
                                    <a href="tel:0912345678">0912 345 678</a> (Tìm phòng)
                                    <br />
                                    <a href="tel:0987654321">0987 654 321</a> (Đăng tin)
                                </p>
                            </div>
                        </div>

                        <div className="infoItem">
                            <div className="iconWrapper emailIcon">
                                <FaEnvelope />
                            </div>
                            <div className="infoContent">
                                <h3>Email</h3>
                                <p>
                                    <a href="mailto:hotro@phongtro.com">hotro@phongtro.com</a> (Hỗ trợ chung)
                                    <br />
                                    <a href="mailto:dangtin@phongtro.com">dangtin@phongtro.com</a> (Đăng tin)
                                </p>
                            </div>
                        </div>

                        <div className="infoItem">
                            <div className="iconWrapper clockIcon">
                                <FaClock />
                            </div>
                            <div className="infoContent">
                                <h3>Giờ làm việc</h3>
                                <p>
                                    Thứ Hai - Thứ Sáu: 8:00 - 17:30
                                    <br />
                                    Thứ Bảy: 8:00 - 12:00
                                    <br />
                                    Chủ Nhật: Nghỉ
                                </p>
                            </div>
                        </div>

                        <div className="supportInfo">
                            <h3>Chúng tôi có thể giúp gì cho bạn?</h3>
                            <ul>
                                <li>Tìm kiếm phòng trọ phù hợp với nhu cầu</li>
                                <li>Đăng tin cho thuê phòng trọ, nhà nguyên căn</li>
                                <li>Tư vấn về giá cả, hợp đồng thuê phòng</li>
                                <li>Giải quyết các vấn đề phát sinh khi thuê phòng</li>
                                <li>Hợp tác kinh doanh, quảng cáo</li>
                            </ul>
                        </div>

                        <div className="socialLinks">
                            <h3>Kết nối với chúng tôi</h3>
                            <div className="socialIcons">
                                <a href="#" aria-label="Facebook">
                                    <FaFacebook />
                                </a>
                                <a href="#" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                                <a href="#" aria-label="Youtube">
                                    <FaYoutube />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form liên hệ */}
                    <div className="contactForm">
                        <h2>Gửi Tin Nhắn</h2>

                        {submitSuccess && (
                            <div className="successMessage">
                                <svg xmlns="http://www.w3.org/2000/svg" className="checkIcon" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Tin nhắn của bạn đã được gửi thành công đến admin! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                            </div>
                        )}

                        <div className="contactTypeSelector">
                            <h3>Bạn là:</h3>
                            <div className="contactTypeOptions">
                                <label className={`contactTypeOption ${formData.contactType === "renter" ? "active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="contactType"
                                        value="renter"
                                        checked={formData.contactType === "renter"}
                                        onChange={handleChange}
                                    />
                                    <FaUserAlt />
                                    <span>Người thuê phòng</span>
                                </label>
                                <label className={`contactTypeOption ${formData.contactType === "owner" ? "active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="contactType"
                                        value="owner"
                                        checked={formData.contactType === "owner"}
                                        onChange={handleChange}
                                    />
                                    <FaHome />
                                    <span>Chủ nhà</span>
                                </label>
                                <label className={`contactTypeOption ${formData.contactType === "partner" ? "active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="contactType"
                                        value="partner"
                                        checked={formData.contactType === "partner"}
                                        onChange={handleChange}
                                    />
                                    <FaHandshake />
                                    <span>Đối tác</span>
                                </label>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label>Họ và tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nguyễn Văn A"
                                    />
                                    {formErrors.name && <span className="errorMessage">{formErrors.name}</span>}
                                </div>

                                <div className="formGroup">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@gmail.com"
                                    />
                                    {formErrors.email && <span className="errorMessage">{formErrors.email}</span>}
                                </div>
                            </div>

                            <div className="formRow">
                                <div className="formGroup">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0912345678"
                                    />
                                    {formErrors.phone && <span className="errorMessage">{formErrors.phone}</span>}
                                </div>

                                <div className="formGroup">
                                    <label>Tiêu đề</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder={placeholders.subject}
                                    />
                                    {formErrors.subject && <span className="errorMessage">{formErrors.subject}</span>}
                                </div>
                            </div>

                            <div className="formGroup">
                                <label>Tin nhắn</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder={placeholders.message}
                                />
                                {formErrors.message && <span className="errorMessage">{formErrors.message}</span>}
                            </div>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span className="loadingButton">
                                        <span className="spinner"></span>
                                        Đang gửi...
                                    </span>
                                ) : (
                                    <span className="buttonContent">
                                        <FaPaperPlane />
                                        Gửi tin nhắn
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bản đồ */}
                <div className="mapSection">
                    <h2>Vị Trí Văn Phòng</h2>
                    <div className="mapWrapper">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.858238342386!2d106.68197447961666!3d10.822158861815995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2sIndustrial%20University%20of%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1745076382753!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Vị trí văn phòng cho thuê phòng trọ"
                        ></iframe>
                    </div>
                    <div className="mapInfo">
                        <h3>Ghé thăm văn phòng của chúng tôi</h3>
                        <p>
                            Nếu bạn cần tư vấn trực tiếp về việc tìm phòng trọ hoặc đăng tin cho thuê, hãy ghé thăm văn phòng của
                            chúng tôi. Đội ngũ nhân viên thân thiện và chuyên nghiệp sẽ hỗ trợ bạn tận tình.
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="faqSection">
                    <h2>Câu Hỏi Thường Gặp</h2>

                    <div className="faqItem">
                        <h3>Làm thế nào để tìm phòng trọ trên website?</h3>
                        <p>
                            Bạn có thể sử dụng công cụ tìm kiếm trên trang chủ, lọc theo khu vực, mức giá, diện tích và các tiện ích
                            khác để tìm phòng trọ phù hợp với nhu cầu của bạn.
                        </p>
                    </div>

                    <div className="faqItem">
                        <h3>Làm thế nào để đăng tin cho thuê phòng trọ?</h3>
                        <p>
                            Để đăng tin cho thuê, bạn cần đăng ký tài khoản, xác thực thông tin và sử dụng chức năng Đăng tin trên
                            website. Bạn cũng có thể liên hệ với chúng tôi qua form liên hệ này để được hỗ trợ.
                        </p>
                    </div>

                    <div className="faqItem">
                        <h3>Phí đăng tin cho thuê phòng trọ là bao nhiêu?</h3>
                        <p>
                            Chúng tôi có nhiều gói đăng tin khác nhau phù hợp với nhu cầu của bạn. Vui lòng liên hệ với chúng tôi để
                            biết thêm chi tiết về giá cả và các gói dịch vụ.
                        </p>
                    </div>

                    <div className="faqItem">
                        <h3>Làm thế nào để liên hệ với người cho thuê phòng?</h3>
                        <p>
                            Thông tin liên hệ của người cho thuê sẽ được hiển thị trong mỗi tin đăng. Bạn có thể liên hệ trực tiếp qua
                            số điện thoại hoặc sử dụng chức năng nhắn tin trên website.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage



///////////////////////////////////////////////////////////
// import React from "react";
// import "./contactPage.scss";
// "use client"

// import { useState } from "react"
// import "./contactPage.scss"
// // Giả sử bạn đã cài đặt react-icons
// import {
//     FaMapMarkerAlt,
//     FaPhone,
//     FaEnvelope,
//     FaClock,
//     FaFacebook,
//     FaInstagram,
//     FaYoutube,
//     FaPaperPlane,
// } from "react-icons/fa"

// const ContactPage = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         message: "",
//     })
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [formErrors, setFormErrors] = useState({})
//     const [submitSuccess, setSubmitSuccess] = useState(false)

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }))
//     }

//     const validateForm = () => {
//         const errors = {}
//         if (!formData.name.trim() || formData.name.length < 2) {
//             errors.name = "Tên phải có ít nhất 2 ký tự."
//         }
//         if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
//             errors.email = "Email không hợp lệ."
//         }
//         if (!formData.phone.trim() || formData.phone.length < 10) {
//             errors.phone = "Số điện thoại phải có ít nhất 10 số."
//         }
//         if (!formData.subject.trim() || formData.subject.length < 5) {
//             errors.subject = "Tiêu đề phải có ít nhất 5 ký tự."
//         }
//         if (!formData.message.trim() || formData.message.length < 10) {
//             errors.message = "Tin nhắn phải có ít nhất 10 ký tự."
//         }
//         return errors
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         const errors = validateForm()

//         if (Object.keys(errors).length === 0) {
//             setIsSubmitting(true)
//             setFormErrors({})

//             // Giả lập gửi form
//             setTimeout(() => {
//                 setIsSubmitting(false)
//                 setSubmitSuccess(true)
//                 setFormData({
//                     name: "",
//                     email: "",
//                     phone: "",
//                     subject: "",
//                     message: "",
//                 })

//                 // Ẩn thông báo thành công sau 5 giây
//                 setTimeout(() => {
//                     setSubmitSuccess(false)
//                 }, 5000)
//             }, 1500)
//         } else {
//             setFormErrors(errors)
//         }
//     }

//     return (
//         <div className="contactPage">
//             <div className="container">
//                 <h1 className="pageTitle">Liên Hệ Với Chúng Tôi</h1>

//                 <div className="contactContent">
//                     {/* Thông tin liên hệ */}
//                     <div className="contactInfo">
//                         <h2>Thông Tin Liên Hệ</h2>

//                         <div className="infoItem">
//                             <div className="iconWrapper mapIcon">
//                                 <FaMapMarkerAlt />
//                             </div>
//                             <div className="infoContent">
//                                 <h3>Địa chỉ</h3>
//                                 <p>Số 12 Nguyễn Văn Bảo, Phường 1, Quận Gò Vấp, Thành phố Hồ Chí Minh</p>
//                             </div>
//                         </div>

//                         <div className="infoItem">
//                             <div className="iconWrapper phoneIcon">
//                                 <FaPhone />
//                             </div>
//                             <div className="infoContent">
//                                 <h3>Điện thoại</h3>
//                                 <p>
//                                     <a href="tel:0912345678">0912 345 678</a>
//                                     <br />
//                                     <a href="tel:0987654321">0987 654 321</a>
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="infoItem">
//                             <div className="iconWrapper emailIcon">
//                                 <FaEnvelope />
//                             </div>
//                             <div className="infoContent">
//                                 <h3>Email</h3>
//                                 <p>
//                                     <a href="mailto:info@phongtro.com">info@phongtro.com</a>
//                                     <br />
//                                     <a href="mailto:support@phongtro.com">support@phongtro.com</a>
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="infoItem">
//                             <div className="iconWrapper clockIcon">
//                                 <FaClock />
//                             </div>
//                             <div className="infoContent">
//                                 <h3>Giờ làm việc</h3>
//                                 <p>
//                                     Thứ Hai - Thứ Sáu: 8:00 - 17:30
//                                     <br />
//                                     Thứ Bảy: 8:00 - 12:00
//                                     <br />
//                                     Chủ Nhật: Nghỉ
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="socialLinks">
//                             <h3>Kết nối với chúng tôi</h3>
//                             <div className="socialIcons">
//                                 <a href="https://www.facebook.com/le.minh.trung.hieu.120203" aria-label="Facebook">
//                                     <FaFacebook />
//                                 </a>
//                                 <a href="#" aria-label="Instagram">
//                                     <FaInstagram />
//                                 </a>
//                                 <a href="#" aria-label="Youtube">
//                                     <FaYoutube />
//                                 </a>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Form liên hệ */}
//                     <div className="contactForm">
//                         <h2>Gửi Tin Nhắn</h2>

//                         {submitSuccess && (
//                             <div className="successMessage">
//                                 Gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
//                             </div>
//                         )}

//                         <form onSubmit={handleSubmit}>
//                             <div className="formRow">
//                                 <div className="formGroup">
//                                     <label>Họ và tên</label>
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         placeholder="Nguyễn Văn A"
//                                     />
//                                     {formErrors.name && <span className="errorMessage">{formErrors.name}</span>}
//                                 </div>

//                                 <div className="formGroup">
//                                     <label>Email</label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         placeholder="example@gmail.com"
//                                     />
//                                     {formErrors.email && <span className="errorMessage">{formErrors.email}</span>}
//                                 </div>
//                             </div>

//                             <div className="formRow">
//                                 <div className="formGroup">
//                                     <label>Số điện thoại</label>
//                                     <input
//                                         type="text"
//                                         name="phone"
//                                         value={formData.phone}
//                                         onChange={handleChange}
//                                         placeholder="0912345678"
//                                     />
//                                     {formErrors.phone && <span className="errorMessage">{formErrors.phone}</span>}
//                                 </div>

//                                 <div className="formGroup">
//                                     <label>Tiêu đề</label>
//                                     <input
//                                         type="text"
//                                         name="subject"
//                                         value={formData.subject}
//                                         onChange={handleChange}
//                                         placeholder="Tìm phòng trọ khu vực..."
//                                     />
//                                     {formErrors.subject && <span className="errorMessage">{formErrors.subject}</span>}
//                                 </div>
//                             </div>

//                             <div className="formGroup">
//                                 <label>Tin nhắn</label>
//                                 <textarea
//                                     name="message"
//                                     value={formData.message}
//                                     onChange={handleChange}
//                                     rows="6"
//                                     placeholder="Tôi đang tìm phòng trọ ở khu vực... với giá khoảng... Vui lòng liên hệ lại với tôi."
//                                 />
//                                 {formErrors.message && <span className="errorMessage">{formErrors.message}</span>}
//                             </div>

//                             <button type="submit" disabled={isSubmitting}>
//                                 {isSubmitting ? (
//                                     <span className="loadingButton">
//                                         <span className="spinner"></span>
//                                         Đang gửi...
//                                     </span>
//                                 ) : (
//                                     <span className="buttonContent">
//                                         <FaPaperPlane />
//                                         Gửi tin nhắn
//                                     </span>
//                                 )}
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* Bản đồ */}
//                 <div className="mapSection">
//                     <h2>Vị Trí Của Chúng Tôi</h2>
//                     <div className="mapWrapper">
//                         <iframe
//                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.858238342386!2d106.68197447961666!3d10.822158861815995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2sIndustrial%20University%20of%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1745076382753!5m2!1sen!2s"
//                             width="100%"
//                             height="100%"
//                             style={{ border: 0 }}
//                             allowFullScreen
//                             loading="lazy"
//                             referrerPolicy="no-referrer-when-downgrade"
//                             title="Vị trí văn phòng cho thuê phòng trọ"
//                         ></iframe>
//                     </div>
//                     <div className="mapInfo">
//                         <h3>Tìm phòng trọ dễ dàng</h3>
//                         <p>
//                             Ghé thăm văn phòng của chúng tôi để được tư vấn trực tiếp về các phòng trọ phù hợp với nhu cầu của bạn.
//                             Đội ngũ nhân viên thân thiện và chuyên nghiệp sẽ hỗ trợ bạn tìm được nơi ở lý tưởng.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ContactPage
