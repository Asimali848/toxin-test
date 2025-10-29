// export interface ThermometerProps {
//   value: number;
//   min?: number;
//   max?: number;
//   width?: number; // px
//   height?: number; // px
// }

// export default function Thermometer({ value, min = 0, max = 10, width = 220, height = 32 }: ThermometerProps) {
//   const clamped = Math.max(min, Math.min(max, value));
//   const ratio = (clamped - min) / (max - min);
//   const indicatorX = 8 + ratio * (width - 16); // padding
//   console.log({ clamped, ratio, indicatorX });

//   return (
//     <div className="relative flex flex-col items-center justify-center gap-2.5 w-full " style={{ width, height, position: "relative" }} aria-hidden>
//       <div
//         style={{
//           position: "absolute",
//           left: 0,
//           top: 0,
//           width: "100%",
//           height: "100%",
//           borderRadius: 9999,
//           background: "linear-gradient(90deg,#22c55e,#f59e0b,#ef4444)",
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           top: -4,
//           left: indicatorX - 4,
//           width: 8,
//           height: height + 8,
//           background: "#000",
//           borderRadius: 4,
//         }}
//         />
//         <div className="">{indicatorX}</div>
//     </div>
//   );
// }

export interface ThermometerProps {
  value: number;
  min?: number;
  max?: number;
  width?: number; // px
  height?: number; // px
}

export default function Thermometer({ value, min = 0, max = 10, width = 220, height = 32 }: ThermometerProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = (clamped - min) / (max - min);
  const indicatorX = 8 + ratio * (width - 16); // padding

  return (
    <div className="flex flex-col items-start justify-start gap-1" style={{ width }}>
      <div className="relative w-full overflow-hidden rounded-full" style={{ height }}>
        {/* gradient background */}
        <div
          className="absolute top-0 left-0 h-full w-full"
          style={{
            background: "linear-gradient(90deg, #22c55e, #f59e0b, #ef4444)",
            borderRadius: 9999,
          }}
        />

        {/* indicator */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: indicatorX - 4,
            width: 8,
            height: height,
            backgroundColor: "#000",
            borderRadius: 4,
          }}
        />
      </div>

      <div className="font-medium text-gray-500 text-sm">{indicatorX}</div>
    </div>
  );
}
