import { React, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView } from 'react-native'
import Mapbox from '@rnmapbox/maps'
import CustomButton from '../../../components/customButton'
import { getCurrentDateTime } from '../../../common/getCurrentFormattedDateTime'
// import ConfirmModal from '../../../components/confirmModal'
import { createSession } from '../../../api/session'
import LottieView from 'lottie-react-native'
import { landmarkIcon } from '../../../assets/image'
import { getGeoJson } from '../../../common/getGeoJson'
import { confirmModal } from '../../../assets/image'
import CustomModal from '../../../components/customModal';

const landmarksData = [
  {
    landmark_name: 'asf',
    x_coordinates: '103.834800',
    y_coordinates: '1.280400',
    exercise: {
      exercise_id: 1,
      exercise_name: 'testExercise',
      audio_url: '',
      description: 'this is a test',
      landmarks: [
        {
          landmark_id: 173,
          landmark_name: 'vdsd223',
          landmark_image_url:
            'landmark/1/2024_08_31/mHEdBXCT_gDrQpbPP_mkNyAjmd_PPsQuqLB_image.jpeg',
          x_coordinates: '123.000000',
          y_coordinates: '123.000000',
        },
        {
          landmark_id: 172,
          landmark_name: 'asfewr3',
          landmark_image_url:
            'landmark/1/2024_08_31/sWfQuGLH_IANIbeMk_NjjHDdOD_AsiiIXiz_image.jpeg',
          x_coordinates: '232.300000',
          y_coordinates: '235.300000',
        },
        {
          landmark_id: 176,
          landmark_name: 'landmark 25',
          landmark_image_url: 'landmark/1/2024_09_01/mWrrfEof_image.jpeg',
          x_coordinates: '1.349500',
          y_coordinates: '240.930000',
        },
        {
          landmark_id: 175,
          landmark_name: 'asf',
          landmark_image_url: 'landmark/1/2024_08_31/cOjBqzAZ_image.jpeg',
          x_coordinates: '103.834800',
          y_coordinates: '1.280400',
        },
        {
          landmark_id: 171,
          landmark_name: 'efwewfddd',
          landmark_image_url:
            'landmark/1/2024_08_31/gHUkirEY_bCCrlBPp_OHQidJEL_image.jpeg',
          x_coordinates: '324.000000',
          y_coordinates: '324.000000',
        },
      ],
    },
    landmark_image_url: 'landmark/1/2024_08_31/cOjBqzAZ_image.jpeg',
  },
]
const Map = () => {
  Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_KEY);
  
  const [form, setForm] = useState({
    start_datetime: '',
    end_datetime: '',
    pss_before: 1,
    pss_after: 1,
    physical_tiredness_before: 1,
    physical_tiredness_after: 1,
    engagement_metrics: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const handleSessionStart = () => {
    const currentStartDateTime = getCurrentDateTime();
    setForm((prevForm) => ({
      ...prevForm,
      start_datetime: currentStartDateTime,
    }));
    setIsSessionStarted(true);
  };

  const handleSessionEnd = () => {
    setIsModalOpen(true); // Open the modal when ending the session
  };

  const handleSessionConfirmEnd = async () => {
    const currentEndDateTime = getCurrentDateTime();
    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        end_datetime: currentEndDateTime,
      };
      createSession(updatedForm)
        .then((response) => {
          setIsSessionStarted(false);
          setIsModalOpen(false); // Close the modal after confirming
          setForm({
            start_datetime: '',
            end_datetime: '',
            pss_before: 1,
            pss_after: 1,
            physical_tiredness_before: 1,
            physical_tiredness_after: 1,
            engagement_metrics: 1,
          });
        })
        .catch((error) => {
          console.error(error.response.data.error_description);
        });
      return updatedForm;
    });
  };

  const geoJSON = getGeoJson(landmarksData);

  return (
    <SafeAreaView className="h-full">
      <View className="flex-1 relative">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="h-screen w-full">
            <Mapbox.MapView
              className="flex-1"
              styleURL="mapbox://styles/mapbox/streets-v12"
              requestDisallowInterceptTouchEvent={true}
              rotateEnabled={true}
            >
              <Mapbox.Camera
                centerCoordinate={[103.8348, 1.2804]}
                zoomLevel={17}
                animationMode={'flyto'}
                animationDuration={1000}
                pitch={60}
              />
              {geoJSON.features.map((feature, index) => (
                <Mapbox.MarkerView
                  key={index}
                  id={`marker-${index}`}
                  coordinate={feature.geometry.coordinates}
                >
                  <View className="w-28 h-28 justify-center items-center">
                    <LottieView
                      source={landmarkIcon}
                      className="w-full h-full"
                      autoPlay
                    />
                  </View>
                </Mapbox.MarkerView>
              ))}
            </Mapbox.MapView>
          </View>
        </ScrollView>
        <CustomButton
          title={isSessionStarted ? 'End Session' : 'Start Session'}
          handlePress={isSessionStarted ? handleSessionEnd : handleSessionStart}
          buttonStyle={`w-11/12 z-10 absolute bottom-10 self-center ${isSessionStarted ? 'bg-red-500' : ''}`}
          textStyle="text-white"
          isLoading={false}
        />
      </View>
      {isModalOpen && ( // Use isModalOpen to conditionally render the modal
        <CustomModal
          isVisible={isModalOpen} // Pass the correct state variable
          onClose={() => setIsModalOpen(false)} // Update the state to close the modal
          isConfirmButton={true}
          isCancelButton={true}
          confirmButtonTitle="Yes"
          cancelButtonTitle="No"
          imageSource={confirmModal} // Your image source
          title="Confirm Action"
          subTitle="Are you sure you want to proceed?"
          handleConfirm={handleSessionConfirmEnd}
        />
      )}
    </SafeAreaView>
  );
};

export default Map;