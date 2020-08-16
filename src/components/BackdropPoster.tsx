import React from "react";
import { View, FlatList, Dimensions, Animated, Image } from "react-native";
import MaskedView from "@react-native-community/masked-view";
import Svg, { Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Movie } from "../entities";
import { TmdbService } from "../services";
const { width, height } = Dimensions.get("window");

const BACKDROP_HEIGHT = height;
const ITEM_SIZE = width * 0.72;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface IBackdropPoster {
  movies: Movie[];
  scrollX: Animated.Value;
}
export const BackdropPoster: React.FC<IBackdropPoster> = ({
  movies,
  scrollX,
}) => {
  return (
    <View style={{ position: "absolute", width, height: BACKDROP_HEIGHT }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          if (!item.backdropPath) {
            return null;
          }

          const inputRange = [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE];

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-width, 0],
          });
          return (
            <MaskedView
              style={{ position: "absolute" }}
              maskElement={
                <AnimatedSvg
                  width={width}
                  height={height}
                  viewBox={`0 0 ${width} ${height}`}
                  style={{ transform: [{ translateX }] }}
                >
                  <Rect x="0" y="0" width={width} height={height} fill="red" />
                </AnimatedSvg>
              }
            >
              <Image
                source={{ uri: TmdbService.getMovieBackdropPath(item) }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  resizeMode: "cover",
                }}
              />
            </MaskedView>
          );
        }}
      />
      <LinearGradient
        colors={["transparent", "white"]}
        style={{
          width,
          height: BACKDROP_HEIGHT,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};
