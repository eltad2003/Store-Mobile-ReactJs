import { AccountCircle, Star } from '@mui/icons-material'
import { Rating } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { urlBE } from '../../baseUrl'

function Review({ productId }) {
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const token = JSON.parse(localStorage.getItem('user'))?.token

    const meanRating = (reviews) => {
        if (reviews.length === 0) return 0
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
        return (totalRating / reviews.length).toFixed(1)
    }
    const meanRatingValue = meanRating(reviews)

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${urlBE}/reviews/${productId}`)
            if (res.ok) {
                const data = await res.json()
                setReviews(data)
            }
            else {
                console.log("Error fetching reviews: ", res.status);
            }
        } catch (error) {
            console.log("Server Error: ", error);

        }
    }
    useEffect(() => {
        fetchReviews()
    }, [productId])

    const handleReviewSubmit = async () => {
        try {
            const res = await fetch(`${urlBE}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: productId,
                    rating: rating,
                    comment: comment,
                })
            })
            if (res.ok) {
                const data = await res.json()
                console.log(data);
                fetchReviews()
                setRating(0)
                setComment('')
                alert("Đánh giá thành công")
            }
            else {
                alert("Đánh giá thất bại ", res.text())
            }
        } catch (error) {
            console.log("Error submitting review: ", error);

        }
    }
    return (
        <div className='mt-5'>
            <div className='w-100 w-md-75 my-2 p-3'>
                <p className='fw-bold fs-4'>Đánh giá & nhận xét</p>

                <div className="row">
                    <div className="col-12 col-md-5 text-center p-3">
                        <p className='fw-bold'>{meanRatingValue}/5</p>
                        <Rating name="half-rating" readOnly value={meanRatingValue} precision={0.5} />
                        <p className='text-muted'>{reviews.length} đánh giá</p>

                    </div>
                    <div className="col-12 col-md-7 d-grid p-3">
                        {[5, 4, 3, 2, 1].map((rating, index) => (
                            <div className='d-flex' key={index}>
                                <p className='fw-bold'>{rating}</p>
                                <Star className="text-warning" />
                                <div className='ms-3 mt-1 progress w-50'>
                                    <div className={`progress-bar bg-danger w-${rating * 20}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='my-2 text-center'>
                    <p>Bạn nghĩ sao về sản phẩm này</p>
                    <button className='btn btn-danger' data-bs-toggle="modal" data-bs-target="#modal-review">Đánh giá ngay</button>
                </div>

                {/* Modal Review */}
                <div className="modal fade" id='modal-review' tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title bg-light fw-bold">Đánh giá và nhận xét</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className='my-3'>
                                    <p className='fw-bold'>Đánh giá chung</p>
                                    <Rating size='large' value={rating} onChange={(e) => setRating(e.target.value)} />
                                </div>
                                <div className='my-3'>
                                    <textarea className="form-control" placeholder='Cảm nhận về sản phẩm' value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleReviewSubmit} data-bs-dismiss="modal">
                                    Gửi đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='my-2'>
                    <p className='fw-bold fs-4'>Nhận xét</p>
                    {reviews.length > 0 ? reviews.map((review, index) => (
                        <div className='my-2' key={index}>
                            <div className='ms-4 d-flex'>
                                <img src={review.avatarUrl} alt="avatar" className='img-fluid rounded-pill' width={40} height={30} />
                                <p className='fw-bold mx-2 mb-0'>{review.username}</p>
                                <p className='text-muted mt-1' style={{ fontSize: 12 }}>{new Date(review.createdAt).toLocaleString()}</p>
                            </div>

                            <div className='mt-2 ms-4 d-flex'>
                                <div className='mb-0'>
                                    <Rating defaultValue={review.rating} size='small' readOnly />
                                    <p>{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className='my-2'>
                            <p className='fw-bold'>Chưa có đánh giá nào</p>
                            <p>Hãy là người đầu tiên <Link data-bs-toggle='modal' data-bs-target='#modal-review' >đánh giá</Link> sản phẩm này</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Review