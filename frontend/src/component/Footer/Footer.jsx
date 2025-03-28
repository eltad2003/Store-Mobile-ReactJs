import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Facebook, GitHub, Google, Instagram, LinkedIn, Twitter } from '@mui/icons-material';

const Footer = () => {
    return (
        <footer className="text-center p-4 bg mt-5">
            <hr />
            <Container>
                {/* Social Media Buttons */}
                <section className="mb-4">
                    <Button variant="" className="m-1" href="#!">
                        <Facebook />
                    </Button>
                    <Button variant="" className="m-1" href="#!">
                        <Twitter />
                    </Button>
                    <Button variant="" className="m-1" href="#!">
                        <Google />
                    </Button>
                    <Button variant="" className="m-1" href="#!">
                        <Instagram />
                    </Button>
                    <Button variant="" className="m-1" href="#!">
                        <LinkedIn />
                    </Button>
                    <Button variant="" className="m-1" href="#!">
                        <GitHub />
                    </Button>
                </section>

                {/* Newsletter Subscription */}
                <section>
                    <Form>
                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <p className="pt-2"><strong>Sign up for our newsletter</strong></p>
                            </Col>
                            <Col md="5">
                                <Form.Control type="email" placeholder="Email address" className="mb-3" />
                            </Col>
                            <Col xs="auto">
                                <Button variant="" type="submit" className="btn btn-danger mb-3">Subscribe</Button>
                            </Col>
                        </Row>
                    </Form>
                </section>

                {/* Description */}
                <section className="mb-4">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt distinctio earum repellat quaerat
                        voluptatibus placeat nam, commodi optio pariatur est quia magnam eum harum corrupti dicta, aliquam
                        sequi voluptate quas.
                    </p>
                </section>

                {/* Links */}
                <section>
                    <Row>
                        {[...Array(4)].map((_, index) => (
                            <Col lg="3" md="6" className="mb-4" key={index}>
                                <h5 className="text-uppercase">Links</h5>
                                <ul className="list-unstyled">
                                    {[1, 2, 3, 4].map((num) => (
                                        <li key={num}>
                                            <a href="#!" className="text-black">Link {num}</a>
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                        ))}
                    </Row>
                </section>
            </Container>

            {/* Copyright */}
            <div className="text-center p-3 bg-secondary" >
                © 2025 Copyright: LE HOANG DAT-B21DCC212

            </div>
        </footer>
    );
};

export default Footer;
