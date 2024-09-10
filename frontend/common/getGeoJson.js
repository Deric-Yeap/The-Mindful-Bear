export const getGeoJson = (landmarks) => {
  const features = landmarks.map((marker) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        parseFloat(marker.x_coordinates),
        parseFloat(marker.y_coordinates),
      ],
    },
    properties: {
      landmark_id: marker.landmark_id,
      landmark_name: marker.landmark_name,
      landmark_image_url: marker.landmark_image_url,
      image_file_url: marker.image_file_url,
      exercise_id: marker.exercise.exercise_id,
      exercise_name: marker.exercise.exercise_name,
      audio_url: marker.exercise.audio_url,
      description: marker.exercise.description,
    },
  }))

  return {
    type: 'FeatureCollection',
    features: features,
  }
}
