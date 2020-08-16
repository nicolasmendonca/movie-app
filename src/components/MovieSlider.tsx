import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { Movie } from "../entities";
import { TmdbService } from "../services";
const { width, height } = Dimensions.get("window");

const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

interface IMovieSliderProps {
  movies: Movie[];
  scrollX: Animated.Value;
  onScroll: Animated.WithAnimatedValue<any>;
}
export const MovieSlider: React.FC<IMovieSliderProps> = ({
  movies,
  scrollX,
  onScroll,
}) => {
  return (
    <Animated.FlatList
      showsHorizontalScrollIndicator={false}
      data={movies}
      keyExtractor={(movie: Movie) => movie.id.toString()}
      horizontal
      contentContainerStyle={{
        alignItems: "center",
      }}
      snapToInterval={ITEM_SIZE}
      decelerationRate={0}
      bounces={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      renderItem={(element: { index: number; item: Movie }) => {
        if (!element.item.posterPath) {
          return (
            <View
              style={{
                width: SPACER_ITEM_SIZE,
              }}
            />
          );
        }
        const inputRange = [
          (element.index - 2) * ITEM_SIZE,
          (element.index - 1) * ITEM_SIZE,
          element.index * ITEM_SIZE,
        ];
        const translateY = scrollX.interpolate({
          inputRange,
          outputRange: [100, 50, 100],
        });
        return (
          <View style={{ width: ITEM_SIZE }}>
            <Animated.View
              style={{
                marginHorizontal: SPACING,
                padding: SPACING * 2,
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 34,
                transform: [{ translateY }],
              }}
            >
              <Image
                source={{ uri: TmdbService.getMoviePosterPath(element.item) }}
                style={styles.posterImage}
              />
              <Text style={{ fontSize: 24 }} numberOfLines={1}>
                {element.item.title}
              </Text>
              <Text style={{ fontSize: 12 }} numberOfLines={3}>
                {element.item.overview}
              </Text>
            </Animated.View>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
