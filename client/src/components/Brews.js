import React, { Component } from 'react';
import {Box,Heading,Image,Text,Card,Button,Mask} from 'gestalt';
import {Link} from 'react-router-dom';

import strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strApi = new strapi(apiUrl);
class Brews extends Component {
    state ={
        brews:[],
        brand:'',
        cartItems:[]
    }
    async componentDidMount(){
        try{
            const response = await strApi.request("POST","/graphql",{
                data:{
                    query:`query{
                        brand(id:"${this.props.match.params.brandId}"){
                          _id
                          name
                          description
                          brews{
                            _id
                            name
                            description
                            image{
                              url
                            },
                            price
                          }
                        }
                      }`
                }
            });
            this.setState({brews:response.data.brand.brews,brand:response.data.brand.name})
        }catch(e){
            console.error("Strapi Brews",e);
        }
        
    }

    render() {
        const {brand,brews,cartItems} = this.state;
        return (
            <Box
                marginTop={4}
                display="flex"
                justifyContent="center"
                alignItems="start"
                dangerouslySetInlineStyle={{
                    __style:{
                        flexWrap:"wrap-reverse"
                    }
                }}
            >
                <Box
                 display="flex"
                 direction="column"
                 alignItems="center"
                >
                    <Box margin={2}>
                        <Heading color="orchid">{brand}</Heading>
                    </Box>
                    <Box
                     dangerouslySetInlineStyle={{
                        __style:{
                            backgroundColor:'#bdcdd9'
                        }
                     }}
                     wrap
                     shape="rounded"
                     display="flex"
                     justifyContent="center"
                     padding={4}
                    >
                        {brews.map(brew=>(
                        <Box
                            key={brew._id}
                            margin={2}
                            width={210}
                            paddingY={4}
                        >
                            <Card
                             image={
                               <Box height={250} width={200}>
                                 <Image
                                  fit="cover"
                                  alt="brand"
                                  naturalHeight={1}
                                  naturalWidth={1}
                                  src={`${apiUrl}${brew.image.url}`}
                                  />
                               </Box>
                             }
                            >
                            <Box
                              display="flex"
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                            >
                            <Box marginBottom={2}>
                                <Text size="xl">{brew.name}</Text>
                            </Box>
                              <Text>{brew.description}</Text>
                              <Text color="orchid">${brew.price}</Text>
                            <Box marginTop={2}>
                                <Text size="xl">
                                  <Button onClick={this.addToCart(brew)} color="blue" text="add to cart">See Brews</Button>
                              </Text>
                            </Box>
                             
                            </Box>
                            </Card>
                          </Box>)
                        )}
                    </Box>
                </Box>

                <Box alignSelf="end" marginTop={2} marginLeft={8}>
                    <Mask shape="rounded" wash>
                        <Box display="flex" direction="column" alignItems="center" padding={2}>
                            <Heading align="center" size="md">Your Cart</Heading>
                            <Text color="gray" italic>
                            {cartItems.length} item selected
                            </Text>

                            <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                                <Box margin={2}>
                                {cartItems.length === 0 && (<Text color="red"> Please select some items</Text>)}
                                </Box>
                                <Text size="lg">Total: $3.99 </Text>
                                <Text>
                                    <Link to="/checkout">Checkout</Link>
                                </Text>
                            </Box>
                        </Box>
                    </Mask>
                </Box>
            </Box>
        );
    }
}

export default Brews;