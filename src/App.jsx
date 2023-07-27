import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import classNames from 'classnames';
import localforage from 'localforage';
import SelfieItem from './SelfieItem';
import PermissionScreen from './PermissionScreen';

function App() {
  const [selfieImage, setSelfieImage] = useState(null);
  const [mirror, setMirror] = useState(false);
  const [previousSelfies, setPreviousSelfies] = useState([]);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    if (cameraPermissionGranted) {
      startCamera(selectedCamera?.deviceId);
      loadPreviousSelfies();
    }
  }, [cameraPermissionGranted, selectedCamera]);

  useEffect(() => {
    if (cameraPermissionGranted) {
      getAvailableCameras();
    }
  }, [cameraPermissionGranted]);

  const handlePermissionGranted = () => {
    setCameraPermissionGranted(true);
  };

  async function startCamera(deviceId) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
        },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play(); // Start playing the video
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  }

  async function getAvailableCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setCameras(videoDevices);
      setSelectedCamera(videoDevices[0]); // Select the first camera by default
    } catch (error) {
      console.error('Error enumerating devices:', error);
    }
  }

  function takeSelfie() {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Get the selfie image data as a blob
    canvas.toBlob(async (blob) => {
      const imageURL = URL.createObjectURL(blob);
      setSelfieImage(imageURL);

      // Store the image URL in IndexedDB using localforage
      // Generate a unique key using Date.now()
      const key = `selfie_${Date.now()}`;
      await localforage.setItem(key, imageURL);

      // Load previous selfies from IndexedDB and update the state
      loadPreviousSelfies();
    }, 'image/png');
  }

  function toggleMirror() {
    setMirror(!mirror);
  }

  async function deleteSelfie(key) {
    // Remove the image URL from IndexedDB using localforage
    await localforage.removeItem(key);

    // Load previous selfies from IndexedDB and update the state
    loadPreviousSelfies();
  }

  async function loadPreviousSelfies() {
    const selfieFiles = [];
    const keys = await localforage.keys();

    // Filter the keys to get selfie image keys
    const selfieKeys = keys.filter((key) => key.startsWith('selfie_'));

    // Retrieve the image URLs based on the selfie image keys
    for (const key of selfieKeys) {
      const imageURL = await localforage.getItem(key);
      selfieFiles.push({ key, imageURL }); // Store the image URLs along with their keys
    }

    setPreviousSelfies(selfieFiles);
  }

  return (
    <div>
      {!cameraPermissionGranted ? (
        <PermissionScreen onPermissionGranted={handlePermissionGranted} />
      ) : (
        <div>
          <h1>React Selfie App</h1>
          <div className="selfie-container">
            <div className="controls">
              <button onClick={takeSelfie}>Take Selfie</button>
              <button onClick={toggleMirror}>{mirror ? 'Disable Mirror' : 'Enable Mirror'}</button>
              {/* Dropdown menu to select the camera */}
              <select
                value={selectedCamera?.deviceId || ''}
                onChange={(e) => {
                  const deviceId = e.target.value;
                  const selectedCam = cameras.find((cam) => cam.deviceId === deviceId);
                  setSelectedCamera(selectedCam);
                }}
              >
                {cameras.map((camera) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <video ref={videoRef} id="video-preview" autoPlay className={classNames({ 'mirror': mirror })} />
          {/* Display the captured selfie */}
          {selfieImage && <img src={selfieImage} id="selfi-preview" alt="Selfie" />}

          {/* List previous selfies */}
          {previousSelfies.length > 0 && (
            <div>
              <h2>Previous Selfies</h2>
              <div className="previous-selfies">
                {previousSelfies.map((selfie, index) => (
                  <SelfieItem key={index} selfie={selfie} onDelete={deleteSelfie} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
