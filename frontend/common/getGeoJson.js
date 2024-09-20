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
      landmark_image_url: marker.image_file_url,
      landmark_description: marker.landmark_description,
      exercise_id: marker.exercise.exercise_id,
      exercise_name: marker.exercise.exercise_name,
      exercise_audio_url: marker.exercise.file_url,
      exercise_description: marker.exercise.description,
    },
  }))

  return {
    type: 'FeatureCollection',
    features: features,
  }
}
