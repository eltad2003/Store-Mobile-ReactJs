import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Facebook, GitHub } from '@mui/icons-material';

const Footer = () => {
    return (
        <footer className="bg text-white mt-5">
            <div className="container py-5">
                <div className="row g-4">
                    {/* About Us Column */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="text-uppercase mb-4">Về chúng tôi</h5>
                        <p className="text-white">
                            Chúng tôi là đơn vị chuyên cung cấp các sản phẩm công nghệ chính hãng với giá cả cạnh tranh và dịch vụ chăm sóc khách hàng tốt nhất.
                        </p>
                        <div className="d-flex gap-3 mt-4">
                            <a href="https://web.facebook.com/hoang.dat1410/" className="text-white"><Facebook /></a>
                            <a href="https://github.com/eltad2003/Store-Mobile-ReactJs" className="text-white"><GitHub /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h5 className="text-uppercase mb-4">Liên kết nhanh</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="/" className="text-white text-decoration-none">Trang chủ</a></li>
                            <li className="mb-2"><a href="/" className="text-white text-decoration-none">Sản phẩm</a></li>
                            <li className="mb-2"><a href="/" className="text-white text-decoration-none">Khuyến mãi</a></li>
                            <li className="mb-2"><a href="/" className="text-white text-decoration-none">Tin tức</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="text-uppercase mb-4">Thông tin liên hệ</h5>
                        <ul className="list-unstyled text-white">
                            <li className="mb-2">Địa chỉ: Số 10, Nguyễn Trãi, Hà Đông</li>
                            <li className="mb-2">Email: eltad2003@gmail.com</li>
                            <li className="mb-2">Hotline: 0329732322</li>

                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="text-uppercase mb-4">Đăng ký nhận tin</h5>
                        <p className="text-white">Nhận thông tin khuyến mãi mới nhất</p>
                        <div className="input-group mb-3">
                            <input type="email" className="form-control" placeholder="Email của bạn" />
                            <button className="btn bg text-white" >Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center py-3 border-top border-secondary">
                <p className="mb-0">© 2025 Copyright: LE HOANG DAT-B21DCCN212</p>
            </div>
        </footer>
    )
};

export default Footer;
