import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

/**
 * Gets a 7 day forecast from weather.gov split into half day intervals (total of 14 array elements)
 *
 * @param {string} address
 * @param {string} city
 * @param {string} state
 * @param {string} zip
 * @return {*} 
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
const states =[
  {name: "Alabama", abbr: "AL" },
  {name: "Alaska", abbr: "AK" },
  {name: "Arizona", abbr: "AZ" },
  {name: "Arkansas", abbr: "AR" },
  {name: "California", abbr: "CA" },
  {name: "Colorado", abbr: "CO" },
  {name: "Connecticut", abbr: "CT" },
  {name: "Delaware", abbr: "DE" },
  {name: "D.C.", abbr: "DC" },
  {name: "Florida", abbr: "FL" },
  {name: "Georgia", abbr: "GA" },
  {name: "Hawaii", abbr: "HI" },
  {name: "Idaho", abbr: "ID" },
  {name: "Illinois", abbr: "IL" },
  {name: "Indiana", abbr: "IN" },
  {name: "Iowa", abbr: "IA" },
  {name: "Kansas", abbr: "KS" },
  {name: "Kentucky", abbr: "KY" },
  {name: "Louisiana", abbr: "LA" },
  {name: "Maine", abbr: "ME" },
  {name: "Maryland", abbr: "MD" },
  {name: "Massachusetts", abbr: "MA" },
  {name: "Michigan", abbr: "MI" },
  {name: "Minnesota", abbr: "MN" },
  {name: "Mississippi", abbr: "MS" },
  {name: "Missouri", abbr: "MO" },
  {name: "Montana", abbr: "MT" },
  {name: "Nebraska", abbr: "NE" },
  {name: "Nevada", abbr: "NV" },
  {name: "New Hampshire", abbr: "NH" },
  {name: "New Jersey", abbr: "NJ" },
  {name: "New Mexico", abbr: "NM" },
  {name: "New York", abbr: "NY" },
  {name: "North Carolina", abbr: "NC" },
  {name: "North Dakota", abbr: "ND" },
  {name: "Ohio", abbr: "OH" },
  {name: "Oklahoma", abbr: "OK" },
  {name: "Oregon", abbr: "OR" },
  {name: "Pennsylvania", abbr: "PA" },
  {name: "Rhode Island", abbr: "RI" },
  {name: "South Carolina", abbr: "SC" },
  {name: "South Dakota", abbr: "SD" },
  {name: "Tennessee", abbr: "TN" },
  {name: "Texas", abbr: "TX" },
  {name: "Utah", abbr: "UT" },
  {name: "Vermont", abbr: "VT" },
  {name: "Virginia", abbr: "VA" },
  {name: "Washington", abbr: "WA" },
  {name: "West Virginia", abbr: "WV" },
  {name: "Wisconsin", abbr: "WI" },
  {name: "Wyoming", abbr: "WY" }
]

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

  const forecastsDisplay = fullForecast.map( forecast => {
    return (
      <table>
        <thead>
          <tr>
            <td colSpan={2}>{forecast.name}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>{forecast.shortDesc}</td>
          </tr>
          <tr>
            <td>Precipitation</td>
            <td>{forecast.probOfPrecip} %</td>
          </tr>
          <tr>
            <td>Temperature</td>
            <td>{forecast.temperature} °F</td>
          </tr>
        </tbody>
      </table>
    )});

  return (
    <div className="App">
      <table>
        <tbody>
          <tr>
            <td>
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
                      <td>
                        <select name='state' id='state' onChange={(event => setState(event.currentTarget.value))}>
                          {states.map(item => (<option key={item.abbr} value={item.abbr}>{item.name}</option>))}
                        </select>
                      </td>
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
                                if(val !== undefined){
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
            </td>
            <td>
              <div className='forecast'>
                <h1>7-Day Forecast</h1>
                {forecastsDisplay}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
