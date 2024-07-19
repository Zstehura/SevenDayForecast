import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class Forecast {
  public id: number = 0;
  public name: string = '';
	public shortDesc: string = '';
  public longDesc: string = '';
  public probOfPrecip: number = 0.0;
  public temperature: number = 0.0;
}

/**
 *  Gets a 7 day forecast from weather.gov split into half day intervals (total of 14 array elements)
 *
 * @param {WfoLocation} location
 * @return {Forecast[14]} 
 */
async function getForecast(address: string, city: string, state: string, zip: string) {
  var requestString: string = `https://localhost:7028/${address}/${city}/${state}/${zip}`;
  var f;
  try {
    const response = await axios.get(requestString);
    f = response.data;
  } catch (error: any) {
    console.error('Error fetching Forecast data: ' + error.message);
  }
  return f;
}


function App() {
  var initialForecast = [
    {id: 0, name: 'Type in an address to get a forecast!', shortDesc: "", longDesc: "", probOfPrecip: 0, temperature: 0}
  ]
  const [fullForecast, setFullForecast] = useState(initialForecast);
  const [currentAddressLine1, setCurrentAddressLine1] = useState('');
  const [currentAddressLine2, setCurrentAddressLine2] = useState('');

  const [streetAddress, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // id: number = 0;
  // public name: string = '';
	// public shortDesc: string = '';
  // public longDesc: string = '';
  // public probOfPrecip: number = 0.0;
  // public temperature: number = 0.0;
  const forecastsDisplay = fullForecast.map( forecast => (
      <table>
        <tbody>
          <tr>
            <td>{forecast.name}</td>
          </tr>
          <tr>
            <td>{forecast.shortDesc}</td>
          </tr>
          <tr>
            <td>Precipitation</td>
            <td>{forecast.probOfPrecip}%</td>
          </tr>
          <tr>
            <td>Temperature</td>
            <td>{forecast.temperature} °F</td>
          </tr>
        </tbody>
      </table>
    ))

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
      <div className='form'>
        <table>
          <tbody>
            <tr>
              <td><p>Address </p></td>
              <td><input name='address' id='address' onChange={(event) => setAddress(event.currentTarget.value)}/></td>
            </tr>
            <tr>
              <td><p>City </p></td>
              <td><input name='city' id='city' onChange={(event) => setCity(event.currentTarget.value)}/></td>
            </tr>
            <tr>
              <td><p>State </p></td>
              <td><input name='state' id='state' onChange={(event) => setState(event.currentTarget.value)}/></td>
            </tr>
            <tr>
              <td><p>ZIP Code </p></td>
              <td><input name='zip' id='zip' onChange={(event) => setZip(event.currentTarget.value)}/></td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button id="submit" onClick={(event) => {
                    event.preventDefault();
                    try {
                      getForecast(streetAddress, city, state, zip).then((val) => {
                        if(val !== null){
                          setFullForecast(val);
                          setCurrentAddressLine1(streetAddress);
                          setCurrentAddressLine2(city + ', ' + state + ' ' + zip);
                        }
                        else alert("Location not found");
                      });
                    }
                    catch (error: any) {
                      alert("Location not found");
                      console.log(error.message);
                    }
                  }}>
                  Set Location
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <br/><br/>
        <table>
          <tbody>
            <tr>
              <td><div className='top-align'><p>Current Address</p></div></td>
              <td>
                <p>{currentAddressLine1}</p>
                <p>{currentAddressLine2}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='forecast'>
        <h1>7-Day Forecast</h1>
        {forecastsDisplay}
      </div>
    </div>
  );
}

export default App;
