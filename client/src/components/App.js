import React, { Component } from 'react';
import {Container,Box,Heading,Card,Image,Text,SearchField,Icon,Spinner} from 'gestalt';
import './App.css';
import {Link} from 'react-router-dom';
import Loader from './Loader';
import strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strApi = new strapi(apiUrl);

class App extends Component {
  state= {
    brands:[],
    searchTerm:'',
    loadingBrands:true
  }

  handleChange= ({value})=>{
    this.setState({searchTerm:value});
  }

  filterBrands = ({searchTerm,brands})=>{
    return (brands.filter(brand=>{
      return brand.name.toLowerCase().includes(searchTerm.toLowerCase())||
             brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    }));
  }
  async componentDidMount(){
    try{
      const response = await strApi.request('POST','/graphql',{
        data:{
          query:`query{
            brands{
              _id,
              name,
              description,
              image{
                name,
                url
              }
            }
          }`
        }
      })
      this.setState({brands:response.data.brands,loadingBrands:false});
    }catch(e){
      console.error('Strapi Error',e);
      this.setState({loadingBrands:false});
    }
    
  }
  render() {
    const {brands,searchTerm,loadingBrands}= this.state;
    return (
      <Container>
        <Box
         display="flex"
         justifyContent="center"
         marginTop={4}
        >
          <SearchField
           id="searchField"
           accessibilityLabel="Brands Search Field"
           onChange={this.handleChange}
           value={searchTerm}
           placeholder="Search brands"
          />
          <Box margin={3}>
            <Icon icon="filter" color={searchTerm ?"orange":"gray"} accessibilityLabel="Brands Icon"/>
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        <Box
         display="flex"
         justifyContent="around"
         wrap
         dangerouslySetInlineStyle={{
           __style:{
             backgroundColor:"#d6c8ec"
           }
         }}
         shape="rounded"
        >
          {this.filterBrands(this.state).map(brand=>(
          <Box
            key={brand._id}
            margin={2}
            width={200}
            paddingY={4}
          >
            <Card
             image={
               <Box height={200} width={200}>
                 <Image
                  fit="cover"
                  alt="brand"
                  naturalHeight={1}
                  naturalWidth={1}
                  src={`${apiUrl}${brand.image.url}`}
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
              <Text size="xl">{brand.name}</Text>
              <Text>{brand.description}</Text>
              <Text size="xl">
                  <Link to={`/${brand._id}`}>See Brews</Link>
              </Text>
            </Box>
            </Card>
          </Box>))}
        </Box>
        <Loader show={loadingBrands}/>
     </Container>
    );
  }
}

export default App;
