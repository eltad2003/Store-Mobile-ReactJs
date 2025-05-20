import { AccessTime, ArrowLeft, ArrowRight, Loyalty } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap';
import CartItem from '../CartItem/CartItem';

function Sale({ products }) {

    // Countdown timer logic
    const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); //  seconds

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time as HH:MM:SS
    const formatTime = (secs) => {
        const h = String(Math.floor(secs / 3600)).padStart(2, '0');
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
        const s = String(secs % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    const popularProducts = products.filter(product => product.discount > 0);
    const chunkSize = 5;
    const productChunks = [];

    for (let i = 0; i < popularProducts.length; i += chunkSize) {
        productChunks.push(popularProducts.slice(i, i + chunkSize));
    }
    return (
        <div className='p-3'>
            <div className="d-flex">
                <h3 className='fw-bold text-white ms-5 d-md-block d-none'>HOT SALE <Loyalty className="mb-1 fs-1 " /></h3>

                <div className="ms-auto d-flex align-items-center ms-5 mb-3">
                    <AccessTime style={{ color: '#FFD600', fontSize: '2rem', marginRight: '8px' }} />
                    <span className="me-2 text-warning fw-bold" style={{ fontSize: '1rem' }}>
                        Kết thúc sau
                    </span>
                    <span
                        style={{
                            background: 'linear-gradient(90deg, #ff9800 0%, #ff1744 100%)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            borderRadius: '8px',
                            padding: '6px 18px',
                            letterSpacing: '2px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        {formatTime(timeLeft)}
                    </span>

                </div>

            </div>
            <div className='h-100 rounded-4' >
                <Carousel indicators={false} controls={true}
                    prevIcon={<ArrowLeft style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '10px' }} />}
                    nextIcon={<ArrowRight style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '10px' }} />}

                >
                    {productChunks.map((chunk, index) => (
                        <Carousel.Item key={index} >
                            <div className='row'>
                                {chunk.map((item, i) => (
                                    <div className="col-6 col-md-3 my-3 col-12d5" key={i} style={{ minHeight: '400px' }}>
                                        <CartItem item={item} />
                                    </div>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>
    )
}

export default Sale