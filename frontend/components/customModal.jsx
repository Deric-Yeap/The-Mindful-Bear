import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import ConfirmModal from './confirmModal';

const CustomModal = ({
    isVisible,
    onClose,
    ...modalProps
  }) => {
    return (
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <ConfirmModal
            {...modalProps}
            handleCancel={onClose} 
          />
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default CustomModal;