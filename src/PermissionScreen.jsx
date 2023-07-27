import React, { useState, useEffect } from 'react';

const PermissionScreen = ({ onPermissionGranted }) => {
  const [permissionStatus, setPermissionStatus] = useState('undetermined');

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      //ask the permissions api whether we have camera permissions
      const res = await navigator.permissions.query({ name: 'camera' });
      if (res.state === 'granted') {
          setPermissionStatus('granted');
          onPermissionGranted();
      } else if (res.state === 'prompt') {
          // doesnt have permission
          setPermissionStatus('undetermined');
      }
    } catch (error) {
        console.error('Error checking camera permission:', error);
        setPermissionStatus('undetermined');
      }
  };

  const requestPermission = async () => {
    try {
      // Request camera permission by accessing the camera
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionStatus('granted');
      onPermissionGranted();
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setPermissionStatus('denied');
    }
  };

  return (
    <div className="permission-screen">
      {permissionStatus === 'undetermined' ? (
        <div>
          <p>Please grant permission to access your camera to use this app.</p>
          <button onClick={requestPermission}>Grant Camera Permission</button>
        </div>
      ) : permissionStatus === 'denied' ? (
        <div>
          <p>Camera access is denied. Please grant permission to access your camera.</p>
          <button onClick={requestPermission}>Grant Camera Permission</button>
        </div>
      ) : null}
    </div>
  );
};

export default PermissionScreen;
