import { EmojiEvents, LocalOffer, Shield, ShoppingCart } from '@mui/icons-material'
export const services = [
    {
        icon: <ShoppingCart className="text-danger fs-2" />,
        title: "Giao Hàng Nhanh",
        description: "Chúng tôi đảm bảo giao hàng nhanh chóng và đúng thời gian.",

    },
    {
        icon: <EmojiEvents className="text-danger fs-2" />,
        title: "Đảm Bảo Chất Lượng",
        description: "Cam kết sản phẩm đạt tiêu chuẩn và chất lượng cao nhất.",
    },
    {
        icon: <LocalOffer className="text-danger fs-2" />,
        title: "Ưu Đãi Hàng Ngày",
        description: "Mua sắm với nhiều ưu đãi hấp dẫn mỗi ngày.",
    },
    {
        icon: <Shield className="text-danger fs-2" />,
        title: "Thanh Toán Online",
        description: "An toàn, nhanh chóng với nhiều hình thức thanh toán tiện lợi.",
    },
];


const currentDate = new Date()

export const blogs = [
    {
        image: "https://cdn-media.sforum.vn/storage/app/media/chibao/chi-bao-2025/Xiaomi/Xiaomi-15-Series/Xiaomi-15-ultra/tren-tay-xiaomi-15-ultra-4.jpg", // Thay bằng link ảnh thật
        date: currentDate.toLocaleString(),
        title: "Trên tay Xiaomi 15 Ultra: Thiết kế như máy ảnh Leica, camera tele 200MP, giá 34.99 triệu đồng",
        description:
            "Dive into the world of cutting-edge technology with our latest blog post, where we highlight five essential gadge.",
        link: "#",

    },
    {
        image: "https://cdn-media.sforum.vn/storage/app/media/trannghia/Xiaomi-15-Series-ra-mat-VN-cover.jpg", // Thay bằng link ảnh thật
        date: currentDate.toLocaleString(),
        title: "Xiaomi 15 Series ra mắt tại VN: Tuyệt đỉnh nhiếp ảnh với thấu kính Leica Summilux và trải nghiệm Xiaomi HyperAI tiên tiến",
        description:
            "Dive into the world of cutting-edge technology with our latest blog post, where we highlight five essential gadge.",
        link: "#",
    },
    {
        image: "https://cdn-media.sforum.vn/storage/app/media/chibao/chi-bao-2025/Xiaomi/Xiaomi-15-Series/Xiaomi-15/tren-tay-xiaomi-15-cover.jpg", // Thay bằng link ảnh thật
        date: currentDate.toLocaleString(),
        title: "Trên tay Xiaomi 15 chính hãng: 3 camera 50MP kết hợp cùng Leica, Snapdragon 8 Elite, giá 24.99 triệu đồng",
        description:
            "Dive into the world of cutting-edge technology with our latest blog post, where we highlight five essential gadge.",
        link: "#",
    },
    {
        image: "https://cdn-media.sforum.vn/storage/app/media/trannghia/Galaxy-A56-ra-mat-2.jpg", // Thay bằng link ảnh thật
        date: currentDate.toLocaleString(),
        title: "Galaxy A56, A36 và A26 chính thức ra mắt với thiết kế mới, nhiều tính năng AI, giá từ 7.97 triệu đồng",
        description:
            "Dive into the world of cutting-edge technology with our latest blog post, where we highlight five essential gadge.",
        link: "#",
    },
]

