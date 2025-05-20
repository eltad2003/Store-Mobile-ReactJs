import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import { Carousel } from 'react-bootstrap'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { urlBE } from '../../baseUrl'

function Banner() {
    const [banners, setBanners] = useState([])
    const [index, setIndex] = useState(0);

    const fetchBanner = async () => {
        try {
            const response = await fetch(`${urlBE}/banners`)
            const data = await response.json()
            setBanners(data)
        } catch (error) {
            console.log("Loi ket noi API: ", error);
        }
    }

    useEffect(() => {
        fetchBanner()
    }, [])
    return (
        <div className="container p-5">
            <div className="">

                {/* Carousel - Show on all screens */}
                <div className="col-12 mt-3 h-100">
                    <div className="card border-0 shadow-sm rounded-4" >
                        <Carousel
                            activeIndex={index}
                            onSelect={(selectedIndex) => setIndex(selectedIndex)}
                            prevIcon={<ArrowLeft style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '10px' }} />}
                            nextIcon={<ArrowRight style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '10px' }} />}
                        >
                            {banners.map((banner, idx) => (
                                <Carousel.Item key={idx} className="h-100">
                                    <Link to={banner.link}>
                                        <img

                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            className='w-100 rounded-4 d-block'
                                            style={{ height: "400px", objectFit: 'cover' }}
                                        />
                                    </Link>
                                </Carousel.Item>
                            ))}
                        </Carousel>

                    </div>
                    <div className="mt-3 rounded-4 shadow overflow-hidden d-none d-md-flex" >
                        {banners.map((banner, idx) => (
                            <div
                                key={idx}
                                className='gap-2 p-2 border-3'
                                onClick={() => setIndex(idx)}
                                style={{ cursor: 'pointer', background: '#fff', minWidth: '20%', boxSizing: 'border-box' }}
                            >
                                <p className=" text-center flex-wrap w-100" style={{ maxWidth: '150px' }}>{banner.title}</p>
                                {idx === index ? <hr className='flex-wrap m-0' style={{ border: '2px solid red', width: '100%' }} /> : null}
                            </div>
                        ))}

                    </div>
                </div>

                <div>

                </div>
            </div>
        </div>


    )
}

export default Banner