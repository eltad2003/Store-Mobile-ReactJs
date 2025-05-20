import React, { useContext, useState } from 'react'
import { AuthContext } from '../AuthProvider'
import { Link, useNavigate } from 'react-router-dom'
import { urlBE } from '../../baseUrl'


function Payment() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const orderId = JSON.parse(localStorage.getItem('order')).id || ''
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [isLoading, setIsLoading] = useState(false)

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (selectedPayment === 'payos') {
        // Call payment API for PayOS
        const response = await fetch(`${urlBE}/orders/${orderId}/payment`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.status === 'PENDING' && data.checkoutUrl) {
            // Redirect to PayOS checkout page
            console.log('Redirecting to:', data.checkoutUrl)
            window.location.href = data.checkoutUrl //cửa sổ popup thanh toán
          }
        } else {
          throw new Error('Payment request failed')
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {user || orderId ? (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow">
                <div className="card-header bg text-white">
                  <h3 className="mb-0">Xác minh phương thức thanh toán</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="payos"
                          value="payos"
                          checked={selectedPayment === 'payos'}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="payos">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-credit-card me-2"></i>
                            <div>
                              <h5 className="mb-1">PayOS</h5>
                              <p className="text-muted mb-0">Tiếp tục thanh toán với PayOS</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn bg text-white btn-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xử lý...
                          </>
                        ) : (
                          'Tiếp tục'
                        )}
                      </button>
                      <Link to="/cart" className="btn btn-outline-secondary">
                        Hủy
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="position-absolute top-50 start-50 translate-middle">
          <h1 className='bg text-white rounded-pill fw-bolder'>Error 404</h1>
        </div>
      )}
    </>
  )
}

export default Payment