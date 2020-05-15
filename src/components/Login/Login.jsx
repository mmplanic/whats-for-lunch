import React from 'react'
import {Form,Button, Container, Card} from 'react-bootstrap';
import {authService} from '../../services/auth.service';


let username = "";
let password = "";

export default function LogIn({history}){
    
    if(authService.isLoged()) history.push('/home');

    const handleLogin = (e)=>{
        e.preventDefault();
        authService.LogIn(username,2);        

        history.push("/home");
    }

    const handleInput = (e)=>{
        const {name,value} = e.target;
        switch(name){
            case "username":username = value;break;
            case "password":password = value;break;
            default:;
        }
    }

    return(
        <Container id="login" className="container-lg p-0 d-flex h-100vh justify-content-center align-items-center align-middle">
            <Card style={{minWidth:"300px",width:"50%"}}>
                <Card.Header>Log In</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleLogin} >
                        
                        <Form.Group controlId="formUser">
                            <Form.Label>User name</Form.Label>
                            <Form.Control type="username" name="username" placeholder="User name" onChange={handleInput} required />

                            {/* <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text> */}
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Password" required />
                        </Form.Group>


                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}