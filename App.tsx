import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { useMovies } from "./src/frameworks";
import { MovieSlider } from "./src/components/MovieSlider";
import { BackdropPoster } from "./src/components/BackdropPoster";
import { Movie } from "./src/entities";

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { data, isLoading, error } = useMovies();

  if (error) {
    return <Text>{JSON.stringify(error)}</Text>;
  }

  if (isLoading || !data) {
    return <Text>Loading...</Text>;
  }

  const moviesList = [
    { id: -1 }, // left-spacer
    ...data,
    { id: -2 }, // right-spacer
  ] as Movie[];

  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />
      <BackdropPoster movies={moviesList} scrollX={scrollX} />
      <MovieSlider
        movies={moviesList}
        scrollX={scrollX}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// These components were taken from https://github.com/catalinmiron/react-native-movie-2.0-carousel
