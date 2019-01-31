import React,{Component} from 'react';
import {Container,Box,Button,Heading,Text,TextField} from 'gestalt';
import ToastMessage from './ToastMessage';
import {getCart,caculatePrice} from '../utils';
class Checkout extends Component{
    state = {
        cartItems:[],
        toast:false,
        toastMessage:'',
        address:'',
        postcode:'',
        city:'',
        confirmationEmailAddress:'',
    }
    handleChange = ({event,value})=>{
        event.persist();
        this.setState({[event.target.name]:value});
    }

    handleConfirmOrder = async (e)=>{
        e.preventDefault();
        if(this.isFormEmpty(this.state)){
            this.showToast("Fill in all filed");
            return;
        }
        try{
            this.setState({loading:true});
            // const response = await strApi.register(username,email,password);
            this.setState({loading:false});
            // setTokenKey(response.jwt);
            // this.redirectUser("/");


        }catch(err){
            this.setState({loading:false});
            this.showToast(err.message);
        }
    }
    isFormEmpty = ({address,postcode,city,confirmationEmailAddress})=>{
        return !address || !postcode || !city || !confirmationEmailAddress;
    }

    showToast = message=>{
        this.setState({toast:true,toastMessage:message});
        setTimeout(()=>this.setState({toast:false,toastMessage:''}),5000);
    }

    componentDidMount(){
        this.setState({cartItems:getCart()});
    }
    render(){
        const {toast,toastMessage,cartItems} = this.state;
        return (
            <Container>
            <Box
                dangerouslySetInlineStyle={{
                    __style:{
                        backgroundColor:"#ebe2da"
                    }
                }}
                margin={4}
                padding={4}
                shape="rounded"
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"

            >
                <Heading color="midnight">Checkout</Heading>
                {cartItems.length > 0 ?
                (<React.Fragment>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        marginTop={2}
                        marginBottom={6}
                    >
                        <Text color="darkGray" italic>{cartItems.length} for checkout</Text>
                        <Box alignSelf="center" padding={2}>
                            {cartItems.map(item=>(
                            <Box key={item._id} padding={1}>
                                <Text color="midnight">{item.name} x {item.quantity} - ${item.quantity*item.price}</Text>
                            </Box>))}
                        </Box>
                        <Text>Total Amount:${caculatePrice(cartItems)}</Text>
                    </Box>
                    <form 
                    style={{display:"inlineBlock",textAlign:"center",maxWidth:450}}
                    onSubmit = {this.handleConfirmOrder}
                    >
                        <TextField
                            id="address"
                            type="text"
                            name="address"
                            placeholder="Shipping Address"
                            onChange={this.handleChange}
                        />
                        <TextField
                            id="postcode"
                            type="number"
                            name="postcode"
                            placeholder="Postal Code"
                            onChange={this.handleChange}
                        />
                        <TextField
                            id="city"
                            type="text"
                            name="city"
                            placeholder="City of Residence"
                            onChange={this.handleChange}
                        />
                        <TextField
                            id="confirmationEmailAddress"
                            type="email"
                            name="confirmationEmailAddress"
                            placeholder="Confirmation Email Address"
                            onChange={this.handleChange}
                        />
                        <button type="submit" id="stripe__button">Submit</button>
                    </form>
            </React.Fragment>):(
                <Box color="darkWash" shape="rounded" padding={4} >
                    <Heading align="center" color="watermelon" size="xs">Your Cart is Empty</Heading>
                    <Text italic align="center" color="green">Add Some brews</Text>
                </Box>
            )
            }
                
            </Box>
            <ToastMessage show={toast} message={toastMessage}/>
        </Container>)
    }
}

export default Checkout;