import React,{Component} from 'react';
import {Container,Box,Button,Heading,Text,TextField,Modal,Spinner} from 'gestalt';
import ToastMessage from './ToastMessage';
import {getCart,caculatePrice,clearCart,caculateAmount} from '../utils';
import {Elements,StripeProvider,CardElement,injectStripe} from 'react-stripe-elements';
import strapi from 'strapi-sdk-javascript/build/main';
import {withRouter} from 'react-router-dom';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strApi = new strapi(apiUrl);

class _CheckoutForm extends Component{
    state = {
        cartItems:[],
        toast:false,
        toastMessage:'',
        address:'',
        postcode:'',
        city:'',
        confirmationEmailAddress:'',
        orderProcessing:false,
        modal:false
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
        this.setState({modal:true});

    }

    handleSubmitOrder = async()=>{
        const {cartItems,city,address,postcode} = this.state;
        const amount = caculateAmount(cartItems);
        this.setState({orderProcessing:true});
        let token;
        try{
            const response = await this.props.stripe.createToken();
            token = response.token.id;
            await strApi.createEntry('orders',{
                amount,
                brews:cartItems,
                city,
                address,
                postcode,
                token
            });
            this.setState({orderProcessing:false,modal:false});
            clearCart();
            this.showToast('Your order has been sucessfully submitted!',true);

        }catch(err){
            this.setState({orderProcessing:false,modal:false});
            this.showToast(err.message,false);
        }
    }

    closeModal = ()=>this.setState({modal:false});

    isFormEmpty = ({address,postcode,city,confirmationEmailAddress})=>{
        return !address || !postcode || !city || !confirmationEmailAddress;
    }

    showToast = (message,redirect=false)=>{
        this.setState({toast:true,toastMessage:message});
        setTimeout(()=>this.setState({toast:false,toastMessage:''},
        ()=>redirect && this.props.history.push("/")),
        5000);
    }

    componentDidMount(){
        this.setState({cartItems:getCart()});
    }
    render(){
        const {toast,toastMessage,cartItems,modal,orderProcessing} = this.state;
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
                            type="text"
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
                        <CardElement id="stripe__input" onReady= {input=>input.focus()} />
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
            {modal && (
            <ConfirmationModal 
            orderProcessing={orderProcessing} 
            cartItems={cartItems} 
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}/>)}
            <ToastMessage show={toast} message={toastMessage}/>
        </Container>)
    }
}

const ConfirmationModal = ({orderProcessing,cartItems,closeModal,handleSubmitOrder})=>(
<Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm your order"
    heading="Confirm your order"
    onDismiss={closeModal}
    footer={
    <Box
        display="flex"
        marginRight={-1}
        marginLeft={-1}
        justifyContent="center"
    >
        <Box padding={1}>
            <Button
                size="lg"
                color="red"
                text="Submit"
                disabled={orderProcessing}
                onClick={handleSubmitOrder}
            ></Button>            
        </Box>
        <Box padding={1}>
            <Button
                size="lg"
                text="Cancel"
                disabled={orderProcessing}
                onClick={closeModal}
            ></Button>
        </Box>
    </Box>}
    role="alertdialog"
    size="sm"
>
    {!orderProcessing &&(
    <Box alignItems="center" justifyContent="center" display="flex" direction="column" padding={1} color="lightWash">
        {cartItems.map(item=>(
        <Box key={item._id} padding={1}>
            <Text size="lg" color="red">
            {item.name} X {item.quantity} - ${item.quantity * item.price}
            </Text>
        </Box>
        ))}
        <Box padding={2}>
            <Text size="lg" bold>
                Total:{caculatePrice(cartItems)}
            </Text>
        </Box>
    </Box>)}
    <Spinner show={orderProcessing} accessibilityLabel="order processing spinner"/>
    {orderProcessing && (<Text align="center" italic>Submitting order....</Text>)}

</Modal>)

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));
const Checkout = ()=>(
    <StripeProvider apiKey="pk_test_48gfNFR4LmXzUVZW6bQlXw2d">
        <Elements>
            <CheckoutForm/>
        </Elements>
    </StripeProvider>
)
export default (Checkout);