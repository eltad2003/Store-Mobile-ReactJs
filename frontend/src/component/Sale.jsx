import { ArrowLeft, ArrowRight, Loyalty } from '@mui/icons-material';
import React from 'react'
import { Carousel } from 'react-bootstrap';
import CartItem from './CartItem/CartItem';

function Sale({ products }) {
    const popularProducts = products.filter(product => product.onSale);
    const chunkSize = 4;
    const productChunks = [];

    for (let i = 0; i < popularProducts.length; i += chunkSize) {
        productChunks.push(popularProducts.slice(i, i + chunkSize));
    }
    return (
        <div>
            <h3 className='fw-bold'>HOT SALE <Loyalty className="mb-1 fs-1 text-danger" /></h3>
            <div className='mt-3 p-4 rounded-4'>
                <Carousel indicators={false} controls={true}
                    prevIcon={<ArrowLeft style={{ color: 'black', fontSize: '70px', marginLeft: '-200px' }} />}
                    nextIcon={<ArrowRight style={{ color: 'black', fontSize: '70px', marginRight: '-200px' }} />}

                >
                    {productChunks.map((chunk, index) => (
                        <Carousel.Item key={index}>
                            <div className='row'>
                                {chunk.map(item => (
                                    <div className='col-md-3 mb-3 d-flex justify-content-center'  >
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