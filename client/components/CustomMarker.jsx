import React from 'react';
import { Marker } from 'react-google-maps';

const CustomMarker = props => {
  return <Marker onClick={() => props.handleMarkerClick(props.id)} {...props} />;
};

export default CustomMarker;
