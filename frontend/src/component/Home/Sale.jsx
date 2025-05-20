import { ArrowLeft, ArrowRight, Loyalty } from '@mui/icons-material';
import React from 'react'
import { Carousel } from 'react-bootstrap';
import CartItem from '../CartItem/CartItem';

function Sale({ products }) {
    const popularProducts = products.filter(product => product.discount > 0);
    const chunkSize = 5;
    const productChunks = [];

    for (let i = 0; i < popularProducts.length; i += chunkSize) {
        productChunks.push(popularProducts.slice(i, i + chunkSize));
    }
    return (
        <div className='p-3'>
            <h3 className='fw-bold text-white ms-5'>HOT SALE <Loyalty className="mb-1 fs-1 " /></h3>
            <div className='h-100 rounded-4' >
                <Carousel indicators={false} controls={true}
                    prevIcon={<ArrowLeft style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '10px' }} />}
                    nextIcon={<ArrowRight style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '10px' }} />}

                >
                    {productChunks.map((chunk, index) => (
                        <Carousel.Item >
                            <div className='row'>
                                {chunk.map(item => (
                                    <div className="col-6 col-md-3 my-3 col-12d5" key={index} style={{ minHeight: '400px' }}>
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