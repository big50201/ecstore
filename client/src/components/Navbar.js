import React from 'react';
import {Box,Text,Heading,Image} from 'gestalt';
import {NavLink} from 'react-router-dom';

const Navbar = () => {
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

export default Navbar;