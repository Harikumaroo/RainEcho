const backgrounds = {
  clear: '/backgrounds/sunny.jpg',
  clouds: '/backgrounds/mountain-cloud.jpg',
  rain: '/backgrounds/rainy.jpg',
  drizzle: '/backgrounds/rainy.jpg',
  thunderstorm: '/backgrounds/storm.jpg',
  snow: '/backgrounds/snow-fall.jpg',
  mist: '/backgrounds/tree-fog.jpg',
  smoke: '/backgrounds/tree-fog.jpg',
  haze: '/backgrounds/tree-fog.jpg',
  dust: '/backgrounds/tree-fog.jpg',
  fog: '/backgrounds/tree-fog.jpg',
  sand: '/backgrounds/tree-fog.jpg',
  ash: '/backgrounds/tree-fog.jpg',
  squall: '/backgrounds/ocen-waves.jpg',
  tornado: '/backgrounds/storm.jpg',
  wind: '/backgrounds/ocen-waves.jpg',
  night: '/backgrounds/night-star.jpg',
  default: '/backgrounds/green-form.jpg',
}

export const getWeatherBackground = (condition, isNight) => {
  if (isNight) {
    return backgrounds.night
  }

  const key = condition?.toLowerCase() || ''
  if (backgrounds[key]) {
    return backgrounds[key]
  }

  if (key.includes('cloud')) {
    return backgrounds.clouds
  }
  if (key.includes('rain') || key.includes('drizzle')) {
    return backgrounds.rain
  }
  if (key.includes('storm') || key.includes('thunder')) {
    return backgrounds.thunderstorm
  }
  if (key.includes('snow')) {
    return backgrounds.snow
  }
  if (key.includes('fog') || key.includes('mist') || key.includes('haze')) {
    return backgrounds.mist
  }
  if (key.includes('wind')) {
    return backgrounds.wind
  }

  return backgrounds.default
}
