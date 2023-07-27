# React Selfie App

This project is a simple React application that allows users to take selfies using their device's camera, mirror the captured image, and store the selfies locally. It utilizes the localforage library to store the selfie images in IndexedDB, providing a way to access and manage previous selfies.

## Getting Started

To run the React Selfie App, follow these steps:

1. Clone this repository to your local machine.

```bash
git clone <repository-url>
```

2. Install the dependencies using npm or yarn.

```bash
cd react-selfie-app
npm install
```

3. Start the development server.

```bash
npm run dev
```

4. Open your web browser and navigate to localhost:port to access the app(you'll see the port in your terminal).

## Features

- Take a selfie using the device's camera.
- Toggle the mirror effect to flip the image horizontally.
- Store the captured selfie locally using localforage and IndexedDB.
- View the captured selfie on the app interface.
- Delete previous selfies from the storage.

## Usage

1. Open the React Selfie App in your web browser.
2. Allow the app to access your device's camera.
3. Use the "Take Selfie" button to capture a selfie.
4. Toggle the "Enable Mirror" button to apply the mirror effect.
5. The captured selfie will be displayed on the app interface.
6. Previous selfies, if available, will be listed below the camera preview.
7. Use the "Delete" button next to each previous selfie to remove it from storage.

## Dependencies

The React Selfie App uses the following dependencies:

- React: A JavaScript library for building user interfaces.
- React DOM: Provides DOM-specific methods that can be used at the top level of your app.
- localforage: A library that provides a simple API to store data in IndexedDB.

## Note

This app uses the localforage library to store the selfies in the browser's IndexedDB, which means the selfies will persist even if you close the app or refresh the page. The app uses modern React hooks and functional components for its implementation.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

The original project's code and design remain unchanged. This modified content of the readme provides an overview of the React Selfie App and its features. For detailed information, the user can refer to the original documentation and code.