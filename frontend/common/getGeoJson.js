export const getGeoJson = (landmarks, favouriteLandmarks) => {
  const favouriteLandmarkIds = favouriteLandmarks.map((fav) => fav.landmark_id)
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
      landmark_user_count: marker.user_count,
      exercise_id: marker.exercise ? marker.exercise.exercise_id : null,
      exercise_name: marker.exercise ? marker.exercise.exercise_name : null,
      exercise_audio_url: marker.exercise ? marker.exercise.file_url : null,
      exercise_description: marker.exercise
        ? marker.exercise.description
        : null,
      is_favorite: favouriteLandmarkIds.includes(marker.landmark_id),
    },
  }))

  return {
    type: 'FeatureCollection',
    features: features,
  }
}
