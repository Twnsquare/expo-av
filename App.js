import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { Audio } from "expo-av";

export default function App() {
  // Tracks we have
  const audioUrls = [
    {
      name: "Track 1",
      uri:
        "https://townsquare-audio-app-staging.s3.eu-west-2.amazonaws.com/audio_files/posts/50/1616067568097audio_1616067567161.caf",
    },
    {
      name: "Track 2",
      uri:
        "https://townsquare-audio-app-staging.s3.eu-west-2.amazonaws.com/audio_files/posts/49/1615923245158audio_1615923239730.caf",
    },
    {
      name: "Track 3",
      uri:
        "https://townsquare-audio-app-staging.s3.eu-west-2.amazonaws.com/audio_files/posts/48/1615920401504audio_1615920393508.caf",
    },
    {
      name: "Track 4",
      uri:
        "https://townsquare-audio-app-staging.s3.eu-west-2.amazonaws.com/audio_files/posts/47/1615804844998audio_1615804833700.caf",
    },
  ];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentSound, setCurrentSound] = useState(null);

  // Creates an "sound" instance for the current track and immediately plays iy
  const playTrack = async (trackIndex) => {
    const currentTrack = audioUrls[trackIndex];
    const { sound } = await Audio.Sound.createAsync(
      { uri: currentTrack.uri },
      undefined,
      null,
      false
    );

    setCurrentSound(sound);
    await sound.playAsync();
  };

  // When a track is finished this function runs
  const handlePlaybackStatusUpdate = (playbackObject) => {
    const { didJustFinish } = playbackObject;
    if (didJustFinish) handleOnTrackEnd();
  };

  // Determines the next function, if we are end of the audioUrls starts from 0, or just moves to the next track
  const handleOnTrackEnd = () => {
    const nextTrackIndex =
      currentTrackIndex === audioUrls.length - 1 ? 0 : currentTrackIndex + 1;
    setCurrentTrackIndex(nextTrackIndex);
    playTrack(nextTrackIndex);
  };

  useEffect(() => {
    if (currentSound) {
      currentSound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
    }
  }, [currentTrackIndex, currentSound]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => playTrack(0)}>
        <Text style={styles.paragraph}>Press to Play</Text>
      </TouchableOpacity>
      <Text style={styles.paragraph}>
        Current Track: {audioUrls[currentTrackIndex].name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
