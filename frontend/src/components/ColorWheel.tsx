interface ColorWheelProps {
  baseColor?: string
  highlightAngles?: number[]
  size?: number
}

export default function ColorWheel({ baseColor = '#3366ff', highlightAngles = [], size = 240 }: ColorWheelProps) {
  const center = size / 2
  const radius = size / 2 - 20
  const innerRadius = radius * 0.55

  const segments = 360
  const segmentAngle = 360 / segments

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
      {Array.from({ length: segments }, (_, i) => {
        const angle1 = (i * segmentAngle - 90) * (Math.PI / 180)
        const angle2 = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)

        const x1Outer = center + radius * Math.cos(angle1)
        const y1Outer = center + radius * Math.sin(angle1)
        const x2Outer = center + radius * Math.cos(angle2)
        const y2Outer = center + radius * Math.sin(angle2)
        const x1Inner = center + innerRadius * Math.cos(angle1)
        const y1Inner = center + innerRadius * Math.sin(angle1)
        const x2Inner = center + innerRadius * Math.cos(angle2)
        const y2Inner = center + innerRadius * Math.sin(angle2)

        return (
          <path
            key={i}
            d={`M ${x1Inner} ${y1Inner} L ${x1Outer} ${y1Outer} A ${radius} ${radius} 0 0 1 ${x2Outer} ${y2Outer} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 0 0 ${x1Inner} ${y1Inner}`}
            fill={`hsl(${i * segmentAngle}, 80%, 55%)`}
          />
        )
      })}

      <circle cx={center} cy={center} r={innerRadius - 2} fill="white" />

      <circle cx={center} cy={center} r={innerRadius * 0.6} fill={baseColor} className="drop-shadow-md" />

      {highlightAngles.map((angle, i) => {
        const rad = (angle - 90) * (Math.PI / 180)
        const dotRadius = (radius + innerRadius) / 2
        const x = center + dotRadius * Math.cos(rad)
        const y = center + dotRadius * Math.sin(rad)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={10} fill="white" stroke="white" strokeWidth={3} className="drop-shadow" />
            <circle cx={x} cy={y} r={7} fill={`hsl(${angle}, 80%, 55%)`} />
          </g>
        )
      })}
    </svg>
  )
}
