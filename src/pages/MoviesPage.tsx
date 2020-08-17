import React from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { useMovies } from "../frameworks";
import { Movie } from "../entities";
import { StatusBar } from "expo-status-bar";
import { BackdropPoster } from "../components/BackdropPoster";
import { MovieSlider } from "../components/MovieSlider";

export const MoviesPage = () => {
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
