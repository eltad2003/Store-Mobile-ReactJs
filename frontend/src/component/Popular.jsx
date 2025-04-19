import React from 'react'
import { Carousel } from 'react-bootstrap'
import CartItem from './CartItem/CartItem'
import { ArrowLeft, ArrowRight, Whatshot } from '@mui/icons-material';

function Popular({ products }) {
    const popularProducts = products.filter(product => product.popular);
    const chunkSize = 4;
    const productChunks = [];

    for (let i = 0; i < popularProducts.length; i += chunkSize) {
        productChunks.push(popularProducts.slice(i, i + chunkSize));
    }

    return (
        <div className='p-2'>
            <h3 className='ms-4 fw-bolder text-white'>SẢN PHẨM PHỔ BIẾN <Whatshot className="mb-1 fs-1 text-white" /></h3>
            <div className=' p-4 rounded-4'>
                <Carousel indicators={false} controls={true}
                    prevIcon={<ArrowLeft style={{ color: 'black', fontSize: '70px', marginLeft: '-200px' }} />}
                    nextIcon={<ArrowRight style={{ color: 'black', fontSize: '70px', marginRight: '-200px' }} />}

                >
                    {productChunks.map((chunk, index) => (
                        <Carousel.Item key={index}>
                            <div className='row'>
                                {chunk.map(item => (
                                    <div className='col-6 col-md-3 mb-3 d-flex justify-content-center'  >
                                        <CartItem item={item} />
                                    </div>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div >
    )
}

export default Popular