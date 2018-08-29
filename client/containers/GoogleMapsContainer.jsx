import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import CustomMarker from '../components/CustomMarker.jsx';

// to get the google api
import { API } from '../../clientENV/api.js';

const mapStateToProps = (store, ownProps) => ({
  // provide pertinent state here
  allMarkers: store.map.allMarkers,
  selectedMarker: store.map.selectedMarker,
  google: ownProps.google,
  focus: store.map.focus
});

const mapDispatchToProps = dispatch => ({
  handleMarkerClick: markerId => dispatch(actions.selectMarker(markerId)),
  onMapClick: () => dispatch(actions.deselectMarker()),
  handleDragEnd: newFocus => dispatch(actions.setFocus(newFocus.toJSON()))
});

class GoogleMapsContainer extends React.Component {
  constructor(props) {
    super(props);
    this._map = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    let result = false;
    if (this._map.current) {
      this._map.current.panTo(nextProps.focus);
      if (JSON.stringify(this.props.allMarkers) !== JSON.stringify(nextProps.allMarkers)) {
        result = true;
      }
    } else {
      result = true;
    }
    return result;
  }

  render() {
    const style = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0
    };

    const GoogleMapComponent = withScriptjs(
      withGoogleMap(props => {
        //create an array of the Marker components
        const markers = props.allMarkers.map((marker, i) => (
          // We need to wrap Marker in Customer Marker to get access to id
          <CustomMarker
            key={marker.id}
            handleMarkerClick={props.handleMarkerClick}
            id={marker.id}
            position={marker.position}>
            {' '}
          </CustomMarker>
        ));

        let map = (
          <GoogleMap
            ref={this._map}
            defaultZoom={13}
            defaultCenter={props.focus}
            onDragEnd={() => props.handleDragEnd(this._map.current.getCenter())}>
            {markers}
          </GoogleMap>
        );

        return map;
      })
    );

    return (
      <div>
        <GoogleMapComponent
          allMarkers={this.props.allMarkers}
          handleMarkerClick={this.props.handleMarkerClick}
          handleMapClick={this.props.handleMapClick}
          handleDragEnd={this.props.handleDragEnd}
          focus={this.props.focus}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleMapsContainer);
