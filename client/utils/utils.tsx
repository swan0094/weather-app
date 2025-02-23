export const kindToImageMap: { [key: string]: string } = {
  CLOUDY: "/assets/overcast.png",
  FOG: "/assets/fog.png",
  HEAVY_RAIN: "/assets/raining.png",
  HEAVY_SHOWERS: "/assets/raining.png",
  HEAVY_SNOW: "/assets/snow.png",
  HEAVY_SNOW_SHOWERS: "/assets/snow.png",
  LIGHT_RAIN: "/assets/raining.png",
  LIGHT_SHOWERS: "/assets/raining.png",
  LIGHT_SLEET: "/assets/raining.png",
  LIGHT_SLEET_SHOWERS: "/assets/raining.png",
  LIGHT_SNOW: "/assets/snow.png",
  LIGHT_SNOW_SHOWERS: "/assets/snow.png",
  PARTLY_CLOUDY: "/assets/overcast.png",
  SUNNY: "/assets/sunny.png",
  THUNDERY_HEAVY_RAIN: "/assets/lightning.png",
  THUNDERY_SHOWERS: "/assets/lightning.png",
  THUNDERY_SNOW_SHOWERS: "/assets/lightning.png",
  VERY_CLOUDY: "/assets/overcast.png",
};

export const getDayName = (date: Date) => {
  return new Date(date).toLocaleDateString("en-AU", { weekday: "long" });
};
