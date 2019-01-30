import React,{Component} from 'react';
import {Container,Box,Button,Heading,Text,TextField} from 'gestalt';
import ToastMessage from './ToastMessage';
import {setTokenKey} from '../utils';
import strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strApi = new strapi(apiUrl);
class Signin extends Component{
    state = {
        username:'',
        password:'',
        toast:false,
        toastMessage:'',
        loading:false,
    }

    handleChange = ({event,value})=>{
        event.persist();
        this.setState({[event.target.name]:value});
    }

    handleSubmit = async (e)=>{
        e.preventDefault();
        const {username,password} = this.state;
        if(this.isFormEmpty(this.state)){
            this.showToast("Fill in all filed");
            return;
        }
        try{
            this.setState({loading:true});
            const response = await strApi.login(username,password);
            this.setState({loading:false});
            setTokenKey(response.jwt);
            this.redirectUser("/");


        }catch(err){
            this.setState({loading:false});
            this.showToast(err.message);
        }
    }

    redirectUser = path =>{
        return this.props.history.push(path);
    }
    isFormEmpty = ({username,password})=>{
        return !username || !password;
    }

    showToast = message=>{
        this.setState({toast:true,toastMessage:message});
        setTimeout(()=>this.setState({toast:false,toastMessage:''}),5000);
    }

    render(){
        const {toastMessage,toast,loading} = this.state;
        return (
        <Container>
            <Box
                dangerouslySetInlineStyle={{
                    __style:{
                        backgroundColor:"#d6a3b1"
                    }
                }}
                margin={4}
                padding={4}
                shape="rounded"
                display="flex"
                justifyContent="center"
            >
                <form 
                style={{display:"inlineBlock",textAlign:"center",maxWidth:450}}
                onSubmit = {this.handleSubmit}
                >
                    <Box 
                        marginBottom={2}
                        display="flex"
                        direction="column"
                        alignItems="center">
                        <Heading color="midnight">Ｗelcome back!</Heading>
                    </Box>
                    <TextField
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={this.handleChange}
                    />
                    <TextField
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.handleChange}
                    />
                    
                    <Button
                     color="blue"
                     text="Submit"
                     type="submit"
                     inline
                     disabled={loading}
                    />
                </form>
            </Box>
            <ToastMessage show={toast} message={toastMessage}/>
        </Container>)
    }

}

export default Signin;