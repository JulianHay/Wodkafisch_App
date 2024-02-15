import { Text } from "../../../components/text";

interface Coordinate {
  lat: number;
  lng: number;
}

interface Result {
  coordinate: Coordinate;
  rotation: number;
}

interface Arrow {
  size: number;
  color: string;
  index: number;
  rotation: number;
}

const Arrow = ({ size, color, index, rotation }: Arrow) => {
  return (
    // <div
    //   style={{
    //     // height: size + 2,
    //     // width: 2 * size,
    //     // marginLeft: size,
    //     transform: `rotate(${rotation}deg) translateX(-50%) translateY(-100%)`,
    //     // transformOrigin: "bottom center",
    //   }}
    // >
    <div
      style={{
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderTopWidth: 0,
        borderRightWidth: size / 2,
        borderBottomWidth: size,
        borderLeftWidth: size / 2,
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: color,
        borderLeftColor: "transparent",
        marginTop: -2,
        transform: ` translateX(-50%) rotate(${rotation}deg)`,
        transformOrigin: "top center",
      }}
    >
      <div
        style={{
          borderColor: "darkblue",
          width: (size * 2) / 3,
          height: size,
          position: "absolute",
          top: -size / 7,
          left: size / 3,
        }}
      >
        <Text
          fontSize={size - 2}
          fontWeight="bold"
          text={`${index}`}
          style={{ color: "#2121b4" }}
        ></Text>
      </div>
    </div>
  );
};

const calculateRotation = (
  loc: Coordinate,
  previousLoc: Coordinate,
  geodesic: boolean,
  heading: number
): Result | null => {
  if (!previousLoc) {
    return null;
  }
  const { lat: lat1, lng: lng1 } = loc;
  const { lat: lat2, lng: lng2 } = previousLoc;

  const rotationFunc = geodesic ? calculateBearing : calculateAngle;

  return {
    coordinate: loc,
    rotation: rotationFunc(lat1, lat2, lng1, lng2) - heading || 0,
  };
};

/*
    Bearing is a starting azimuth if traveling from point A to point B
    in the shortest distance on Earth ("Great Circle Distance"),
    as opposed to a straight line on a Mercator map projection.
  
    However, for the arrow, we need an ending azimuth, which most likely will be different.
    Therefore, the approach here is to find the bearing when traveling in the opposite direction,
    from B to A and then flip the marker upside down
  */
const calculateBearing = (
  lat1: number,
  lat2: number,
  lng1: number,
  lng2: number
): number => {
  const [latRad1, latRad2, lngRad1, lngRad2] = [lat1, lat2, lng1, lng2].map(
    (n) => n * (Math.PI / 180)
  );

  const y = Math.sin(lngRad2 - lngRad1) * Math.cos(latRad2);
  const x =
    Math.cos(latRad1) * Math.sin(latRad2) -
    Math.sin(latRad1) * Math.cos(latRad2) * Math.cos(lngRad2 - lngRad1);
  const θ = Math.atan2(y, x);
  return (((θ * 180) / Math.PI + 360) % 360) - 180;
};

/*
    If a direct line on a map is used, we need to simply calculate the angle
    between the direction vector and X axis
    However, this is not as simple, as the Y axis is significantly distorted
    on the Mercator map projection, therefore the angle will depend on the points latitudes
  */
const calculateAngle = (
  lat1: number,
  lat2: number,
  lng1: number,
  lng2: number
): number => {
  const [latRad1, latRad2, lngRad1, lngRad2] = [lat1, lat2, lng1, lng2].map(
    (n) => n * (Math.PI / 180)
  );

  let dLngRad = lngRad2 - lngRad1;

  const [logLatRad1, logLatRad2] = [latRad1, latRad2].map((lat) => {
    const tan = Math.tan(Math.PI / 4 + lat / 2);
    return Math.log(tan);
  });
  const x = logLatRad2 - logLatRad1;

  const result = Math.atan2(dLngRad, x);

  // Didn't want to change the order of arguments to this function, therefore we have to flip the marker here as well
  return (((result * 180) / Math.PI + 360) % 360) - 180;
};

export { calculateRotation, Arrow };
