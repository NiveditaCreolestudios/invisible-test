import React, { Component } from 'react'
import _ from 'lodash'
import 'semantic-ui-css/semantic.min.css'
import { Container, Header, Grid, Form, Button } from 'semantic-ui-react'

export default class App extends Component { 
  //state initialization
  state = {
    formData:    {},
    errors:      {},
    weatherData: {},
  }

  //get text from form and assign to state
  inputChanged = (e, { name, value }) =>{
    let {formData, errors} = this.state
    formData[name]         = value

    if (value !== null && value !== '') {
      errors[name] = false
    }

    this.setState({formData,errors})
  }

  //for validation : blank/undefine
  isValid = () =>{
    let requires            = ['locationName']
    let {formData}          = this.state
    let errors              = {}
    let keys                = Object.keys(formData)

    //checking require field validation
    requires.forEach((each) =>{
      if (keys.indexOf(each) === -1 || formData[each] === null || typeof formData[each] === 'undefined' || formData[each] === '') {
        errors[each] = true
      }
    })
    return errors
  }

  // handle form submittion.
  handleSubmit = async (data) =>{
    let {formData} = this.state
    let errors = this.isValid()
    if (_.isEmpty(errors)) {
      try{
        //prepare URL for fetching weather information using location name / postal code
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${formData.locationName}&appid=27d606e2c763a884782c933dbbf9f15e`
        
        let data = await fetch(url)

        //json convertion
        let jsonRecord = await data.json()
        console.log(jsonRecord)

        //assign data to state for accesing in form
        this.setState({ weatherData: jsonRecord })
        
      }catch(error){
        return
      }
    }
    this.setState({errors})
  }

  render() {
    const {formData, errors, weatherData} = this.state
    return (
       <Container>
        <Form onSubmit={this.handleSubmit}>
           <Header as="h1">
            <Header.Content>Find Weather Information</Header.Content>
          </Header>
           <Grid>
            <Grid.Column>
              <Form.Group widths="five">
                <Form.Input
                  fluid
                  value={(formData.locationName || '')}
                  name="locationName"
                  label="Location."
                  onChange={this.inputChanged}
                  placeholder="Enter city / pincode."
                  error ={errors.locationName}
                  size='small'
                />
              </Form.Group>
              <Button>Submit</Button>
            </Grid.Column>
          </Grid>
        </Form>
        {
          //city not fetch
          (weatherData.cod === "404") && <div style={{ color:'red' }}>{weatherData.message}</div>
        }

        { 
          weatherData.name && <div>
            <span>
              <div>
                <h2>Weather in {weatherData.name}, {weatherData.sys.country} : { /*kelvin to celsius formula*/ Math.round(weatherData.main.temp -273.15) } °C  <img src="https://openweathermap.org/img/w/02d.png" alt="weather" style={{ fontSize: '17px'}} /> </h2>
                
                <h3>
                  <p>Cloudiness : {weatherData.weather[0].description}</p>
                </h3>
              </div>
            </span>
          </div>
        }

      </Container>
    );
  }
}
