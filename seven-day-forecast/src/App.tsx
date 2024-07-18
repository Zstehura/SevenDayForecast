import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

//#region API Callouts

class Forecast {
  public id: number = 0;
  public name: string = '';
	public shortDesc: string = '';
  public longDesc: string = '';
  public probOfPrecip: number = 0.0;
  public temperature: number = 0.0;
}

class WfoLocation {
  public gridID: string = '';
  public gridX: number = 0;
  public gridY: number = 0;
  public toURLparams(): string {
    return `${this.gridID}/${this.gridX},${this.gridY}`
  }
}

type coordinates = { x: number, y: number; }
type GeocodeLocation = { coords: coordinates; }
type wfoPointResponse = { properties: WfoLocation; }
type forecastProbOfPrec = { value: number; }
type halfDayForecast = { number: number; name: string; probabilityOfPrecipitation: forecastProbOfPrec; 
  shortForecast: string; detailedForecast: string; temperature: number; }
type forecastProperties = { periods: halfDayForecast[]; }
type forecastResponse = { properties: forecastProperties; }
function isCoordinates(o: any): o is coordinates {
  return 'x' in o && 'y' in o;
}
function isGeocodeLocation(o: any): o is GeocodeLocation {
  return 'coordinates' in o && isCoordinates(o.coordinates);
}
function isWfoPointResponse(o: any) : o is wfoPointResponse {
  return 'properties' in o && isWfoLocation(o.properties);
}
function isWfoLocation(o: any): o is WfoLocation {
  return 'gridID' in o && 'gridX' in o && 'gridY' in o;
}
function isForecastProbOfPrec(o:any): o is forecastProbOfPrec {
  return 'value' in o;
}
function isHalfDayForecast(o: any): o is halfDayForecast {
  return 'number' in o && 'name' in o && 'shortForecast' in o && 'probabilityOfPrecipitation' in o && isForecastProbOfPrec(o.probabilityOfPrecipitation) &&
    'detailedForecast' in o && 'temperature' in o;
}
function isForecastProperties(o: any): o is forecastProperties {
  return 'periods' in o && isHalfDayForecast(o.periods[0]);
}
function isForecastResponse(o: any): o is forecastResponse {
  return 'properties' in o && isForecastProperties(o.properties);
}


/**
 * @summary Gets Geocoding data from census.gov and returns a set of coordinates 
 *
 * @param {string} streetAddress 
 * @param {string} city 
 * @param {string} state
 * @param {string} zip
 * @return {*} 
 */
async function getLocationCoordinates(streetAddress: string, city: string, state: string, zip: string) {
  var requestString: string = `https://geocoding.geo.census.gov/geocoder/locations/address?street=${streetAddress}`;
  if(city !== '') {
    requestString += `&city=${city}&state=${state}`;
  }
  if(zip !== '') {
    requestString += `&zip=${zip}`;
  }
  requestString += '&benchmark=Public_AR_Current&format=json';

  try {
    const response = await axios.get(requestString);
    const resObj = JSON.parse(response.data);
    if(isGeocodeLocation(resObj)) {
      return `${resObj.coords.y}%2C${resObj.coords.x}`
    }
    else {
      console.log('Error in geocoding response: response=' + resObj);
    }
  } catch (error: any) {
    console.log('Error fetching Location coordinates: ' + error.message);
  }

  return '0%2C0';
}

/**
 * Makes a callout to weather.gov to find information about a specific location so that we can get 
 * weather forecast there later
 *
 * @param {string} coordinates 
 * @return {WfoLocation} 
 */
async function getWfoLocation(coordinates: string) {
  var requestString: string = `https://api.weather.gov/points/${coordinates}`;
  var loc: WfoLocation = new WfoLocation();
  try {
    const response = await axios.get(requestString);
    const resObj = JSON.parse(response.data);
    if(isWfoPointResponse(resObj)) {
      loc.gridX = resObj.properties.gridX;
      loc.gridY = resObj.properties.gridY;
      loc.gridID = resObj.properties.gridID;
    }
    else {
      console.log('Error in WfoLocation response: response=' + resObj);
    }
  } catch (error: any) {
    console.log('Error fetching WfoLocation data: ' + error.message);
  }
  return loc;
}

/**
 *  Gets a 7 day forecast from weather.gov split into half day intervals (total of 14 array elements)
 *
 * @param {WfoLocation} location
 * @return {Forecast[14]} 
 */
async function getForecast(location: WfoLocation) {
  var requestString: string = `https://api.weather.gov/gridpoints/${location.toURLparams()}/forecast`;
  var f: Forecast[] = new Array<Forecast>();
  try {
    const response = await axios.get(requestString);
    const resObj = JSON.parse(response.data);
    if(isForecastResponse(resObj)) {
      for(var i: number = 0; i++; i < 14) {
        var temp: Forecast = new Forecast();
        temp.id = i;
        temp.longDesc = resObj.properties.periods[i].detailedForecast;
        temp.name = resObj.properties.periods[i].name;
        temp.probOfPrecip = resObj.properties.periods[i].probabilityOfPrecipitation.value;
        temp.shortDesc = resObj.properties.periods[i].shortForecast;
        temp.temperature = resObj.properties.periods[i].temperature;
        f.push(temp);
      }
    }
    else {
      console.log('Error in Forecast response: response=' + resObj);
    }
  } catch (error: any) {
    console.log('Error fetching Forecast data: ' + error.message);
  }

  return f;
}

//#endregion API Callouts



function App() {
  var currentCoordinates: string = '';
  var currentWfoLoc: WfoLocation = new WfoLocation();
  var fullForecast: Forecast[] = new Array<Forecast>();
  
  const [fullAddress, setFullAddress] = useState('');
  const [coordinateX, setCoordinateX] = useState('');
  const [coordinateY, setCoordinateY] = useState('');

  const [streetAddress, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  for(var i: number = 0; i++; i < 14) {
    fullForecast[i] = new Forecast();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
        </a>
      </header>
      <div className='form'>
        <table>
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
        </table>
        <button id="submit" onClick={(event) => {
            event.preventDefault();
            setFullAddress(streetAddress + '\n' + city + '\n' + state + '\n' + zip);
          }}>
          Set Location
        </button>

        <p>Here's some nerd stuff if you felt like you wanted to know that</p>
        <table>
          <tr>
            <div className='top-align'><td><p>Current Address</p></td></div>
            <td>
              <p>{streetAddress}</p>
              <p>{city}, {state} {zip}</p>
            </td>
          </tr>
        </table>
        <p>Current Address: {fullAddress}</p>
      </div>
    </div>
  );
}

export default App;
