import React, { Component } from 'react';
import { Form, Radio, Segment } from 'semantic-ui-react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet'
import axios from 'axios';

class App extends Component {
  constructor() {
   super();
   this.state = {
     stations:[],
     alerts:[],
     zoom: 13,
     value:'',
     is_active:true
   };
 }

 handleChange = (e, { value }) => this.setState({ value })

 componentDidMount(){
   const getData = async () => {
      const response = await axios.get('http://www.qlue.co.id/vacancy/svc/getDataExample.php')
      this.setState({stations:response.data})
  }
  getData() 
}

 componentWillUpdate(){
   const getData = async () => {
      const response = await axios.get('http://waze.qlue.id/jakarta/update/0atxn84I3hx2WmNm5ifPDZkJaLERZD9A.json')
      this.setState({alerts:response.data.alerts})
  }
  getData()   
 }

  renderStationMarker (){
    const {stations} = this.state
    const iconTerminal = L.icon({iconUrl:'http://www.qlue.co.id/vacancy/svc/icon-marker.png'})
    return ( stations.map((station,i) =>
      (<Marker key={station.placemark_id} position={[+station.lat,+station.lng]} icon={iconTerminal}>
        <Popup>
          <span>{station.name} <br/> {station.address}</span>
        </Popup>
      </Marker>)
     ))
  }


  renderAlertMarker (){
    const {alerts,value} = this.state
    var image =''
    if(value==="ROAD_CLOSED")
      image ='https://maps.telenium.ca/images/legend2014/closed.png'
    else if(value==="JAM")
      image ='https://png.icons8.com/traffic-jam/ultraviolet/1600'
    else if(value==="WEATHERHAZARD")
    image='http://maps.telenium.ca/images/weather/warns/39_wch.padded.png'

    const iconAlert = L.icon({iconUrl:image,iconSize: [30, 30],})
    const filtered = alerts.filter(d => d.type===value)
    return ( filtered.map(road =>
      (<Marker key={road.uuid} position={[road.location.y,road.location.x]} icon={iconAlert}>
        <Popup>
          <span>{road.street} <br/> {road.reportDescription}</span>
        </Popup>
      </Marker>)
     ))
  }

  renderAllMarkers(){
    this.renderAlertMarker()
    this.renderStationMarker()
  }

  renderOption (){
    const {is_active } = this.state
    const options = [{text:'Traffic Jam',value:'JAM'},{text:'Road Closed',value:'ROAD_CLOSED'},{text:'Weather Hazard',value:"WEATHERHAZARD"}]

    return (
      <div style={{position:'fixed',zIndex:99999999, marginLeft:80,marginTop:10}}>
      <Segment >
        <Radio toggle defaultChecked value={is_active} onChange={() => this.setState({is_active:!is_active,value:''})} />
          <Form raised style={{marginTop:10}}>
            {
              options.map((data,index) =>
                <Form.Field disabled={!is_active} key={index}>
                  <Radio
                    label={data.text}
                    name='radioGroup'
                    value={data.value}
                    checked={this.state.value === data.value}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              )
            }
          </Form>
        </Segment>
      </div>
    )
  }

   render() {
     const {stations,is_active} = this.state
     const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
     const url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

     if(stations.length>0)
     return (
       <div>
       {this.renderOption()}
         <Map center={[+stations[0].lat, +stations[0].lng]} zoom={this.state.zoom}>
           <TileLayer
             attribution={attribution}
             url={url}
           />
           {(is_active) ? (this.renderAlertMarker()):null}
           {(is_active) ? (this.renderStationMarker()):null}
         </Map>
      </div>
       );
    else return <div></div>
   }
}

export default App;
