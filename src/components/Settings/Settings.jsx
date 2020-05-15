import React from 'react'
import { Container, Card, Button } from 'react-bootstrap';
import logo from './img/logo-placeholder.png';
import ImageUploader from './ImageUploader/ImageUploader';
import NavBar from '../../customControls/NavBar/NavBar';

export default function Settings({history}){


    return(<Container>
                <NavBar history={history} />

                <Card>
                    <Card.Header>Settings</Card.Header>
                    <Card.Body>
                    <Card.Img variant="top" src={logo} style={{maxHeight:"300px", maxWidth:'300px'}} />
                    <Button>Upload Image</Button>
                    </Card.Body>
                </Card>
                <form encType="multipart/form-data" action="/upload/image" method="post">
                    <input id="image-file" type="file" />
                </form>

                <ImageUploader/>

    </Container>);
}