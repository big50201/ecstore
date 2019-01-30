import React,{Component} from 'react';
import {Box,Text,Heading,Image,Button} from 'gestalt';
import {NavLink,withRouter} from 'react-router-dom';
import {getTokenKey,clearToken,clearCart} from '../utils';

class Navbar extends Component{
    handleSignout = ()=>{
        clearToken();
        clearCart();
        this.props.history.push("/");
    }

    render(){
        return getTokenKey() !== null ? <AuthNav handleSignout={this.handleSignout}/>:<UnAuthNav/>;

    }
}

const AuthNav = ({handleSignout})=>{
    return (
        <Box height={70}
             color="midnight"
             padding={1}
             shape="roundedBottom"
             display="flex"
             alignItems="center"
             justifyContent="around"
        >
            <NavLink activeClassName="active" to="/checkout">
             <Text size="xl" color="white">
                 Checkout
             </Text>
            </NavLink>
            <NavLink activeClassName="active" exact to="/">
                <Box display="flex" alignItems="center">
                    <Box height={50} width={50} margin={2}>
                        <Image
                            alt="BreHaha logo"
                            naturalHeight={1}
                            naturalWidth={1}
                            src="./icons/logo.svg"
                        />
                    </Box>
                
                    <Heading size="xs" color="orange">
                    BreHaha
                    </Heading>
                </Box>
            </NavLink>
            <Button 
                color="transparent"
                text="Sign out"
                inline
                size="md"
                onClick={handleSignout}
            />
        </Box>
    );
}
const UnAuthNav = () => {
    return (
        <Box height={70}
             color="midnight"
             padding={1}
             shape="roundedBottom"
             display="flex"
             alignItems="center"
             justifyContent="around"
        >
            <NavLink activeClassName="active" to="/signin">
             <Text size="xl" color="white">
                 SignIn
             </Text>
            </NavLink>
            <NavLink activeClassName="active" exact to="/">
                <Box display="flex" alignItems="center">
                    <Box height={50} width={50} margin={2}>
                        <Image
                            alt="BreHaha logo"
                            naturalHeight={1}
                            naturalWidth={1}
                            src="./icons/logo.svg"
                        />
                    </Box>
                
                    <Heading size="xs" color="orange">
                    BreHaha
                    </Heading>
                </Box>
            </NavLink>
            <NavLink activeClassName="active" to="/signup">
             <Text size="xl" color="white">
                 SignUp
             </Text>
            </NavLink>
        </Box>
    );
};

export default withRouter(Navbar);