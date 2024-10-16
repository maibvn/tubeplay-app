# TubePlay

TubePlay is a web-based audio playlist app built with ReactJS, featuring seamless playback and user-friendly playlist management.

## Key Features

- **YouTube Playlist Integration**: Enter a YouTube playlist link to convert tracks to MP3 format and stream them directly from Dropbox.
- **Audio Playlist**: Play tracks with loop mode and random mode.
- **User Authentication**:
  - **Google Sign-In**: Secure login using your Google account.
  - **JWT Tokens**: Use token-based authentication for session management.
- **Temporary User Support**: Save playlists for non-authenticated users.
- **Loop Mode**: Toggle using FontAwesome's loop icon.

## Tech Stack

- **ReactJS**: Framework for building the user interface.
- **Node.js**: Backend runtime environment for handling server-side operations.
- **JWT** and **Google Sign-In**: Authentication methods.
- **YouTube**: Used to fetch playlist data and convert tracks to MP3.
- **Dropbox**: Temporary file storage for unauthenticated users.
- **FontAwesome**: Icons for user interface elements.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tubeplay-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd tubeplay
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open your browser and go to `http://localhost:3000` to see the app in action.

## Authentication Logic

- **Google Sign-In**: Integrates Google's OAuth2 for easy and secure user login.
- **JWT Tokens**: Authenticates users through token-based session management, enhancing security.

## Future Enhancements

- **Create and Manage Playlists**: Provide advanced features to create and manage custom playlists.
- **Offline Playback**: Enable downloads for offline listening.
- **Social Sharing**: Share playlists with others.

## Contributing

We welcome contributions! Feel free to submit issues or pull requests to enhance TubePlay.

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.
