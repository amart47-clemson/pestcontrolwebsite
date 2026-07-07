"use client"

import { useMemo, useRef, type ReactNode } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion"

const VB_W = 1200
const VB_H = 700

const CX = 600
const CY = 480
const RX = 400
const RY = 115

const THETA0 = 110
const DEG = Math.PI / 180

const WALK_START = 0.05
const WALK_END = 0.9

const C = {
  bg: "rgb(253,251,247)",
  ink: "rgb(74,59,51)",
  amber: "rgb(180,83,9)",
  emerald: "#059669",
  emeraldSoft: "rgba(5,150,105,0.35)",
  wallA: "#f5ead9",
  wallB: "#efe0c8",
  roof: "#5b4638",
  lawn: "#d8e6cf",
  lawnDark: "#c3d8b6",
}

function pointOnPath(t: number) {
  const theta = (THETA0 + t * 360) * DEG
  return {
    x: CX + RX * Math.cos(theta),
    y: CY + RY * Math.sin(theta),
    sin: Math.sin(theta),
    facingLeft: Math.sin(theta) > 0,
  }
}

function barrierPath() {
  const a0 = THETA0 * DEG
  const a1 = (THETA0 + 180) * DEG
  const x0 = CX + RX * Math.cos(a0)
  const y0 = CY + RY * Math.sin(a0)
  const x1 = CX + RX * Math.cos(a1)
  const y1 = CY + RY * Math.sin(a1)
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${RX} ${RY} 0 1 1 ${x1.toFixed(
    1
  )} ${y1.toFixed(1)} A ${RX} ${RY} 0 1 1 ${x0.toFixed(1)} ${y0.toFixed(1)}`
}

const PESTS = [
  { angle: 200, kind: "ants" as const },
  { angle: 320, kind: "roach" as const },
  { angle: 455, kind: "ants" as const },
]

function pestPos(angleDeg: number) {
  const a = angleDeg * DEG
  return { x: CX + RX * 0.8 * Math.cos(a), y: CY + RY * 0.8 * Math.sin(a) }
}

function Technician({ spraying }: { spraying: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="22" ry="6" fill="rgba(74,59,51,0.18)" />
      <rect x="-9" y="-26" width="7" height="26" rx="3" fill="#3f5a4c" />
      <rect x="2" y="-26" width="7" height="26" rx="3" fill="#33493e" />
      <rect x="-24" y="-62" width="13" height="30" rx="5" fill={C.amber} />
      <rect x="-22" y="-66" width="9" height="6" rx="2" fill="#8a4207" />
      <path
        d="M -18 -34 C -18 -22, 6 -24, 16 -30"
        fill="none"
        stroke="#8a4207"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="-12" y="-58" width="24" height="34" rx="8" fill={C.emerald} />
      <path
        d="M 8 -50 L 22 -36"
        stroke={C.emerald}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M 16 -30 L 34 -12"
        stroke="#4b5563"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="0" cy="-68" r="9.5" fill="#e8b98d" />
      <path d="M -10 -70 A 10 10 0 0 1 10 -70 L 13 -68 L -10 -68 Z" fill="#047857" />
      {spraying && (
        <g className="pps-spray">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle
              key={i}
              cx={36 + (i % 4) * 5}
              cy={-10 + (i % 3) * 4}
              r={2 + (i % 3)}
              fill={C.emerald}
              opacity="0"
              style={{
                animation: `ppsPuff 0.9s ease-out ${(i * 0.11).toFixed(2)}s infinite`,
              }}
            />
          ))}
        </g>
      )}
    </g>
  )
}

function TechLayer({
  t,
  layer,
  spraying,
}: {
  t: MotionValue<number>
  layer: "front" | "back"
  spraying: MotionValue<number>
}) {
  const transform = useTransform(t, (v) => {
    const p = pointOnPath(v)
    const depth = (p.sin + 1) / 2
    const scale = 0.62 + 0.42 * depth
    const bob = Math.sin(v * Math.PI * 56) * 2.2
    const flip = p.facingLeft ? -1 : 1
    return `translate(${p.x}px, ${p.y + bob}px) scale(${scale * flip}, ${scale})`
  })

  const opacity = useTransform(t, (v) => {
    const behind = pointOnPath(v).sin < -0.12
    return layer === "back" ? (behind ? 1 : 0) : behind ? 0 : 1
  })

  const sprayOpacity = useTransform(spraying, (v) => v)

  return (
    <motion.g style={{ transform, opacity }}>
      <motion.g style={{ opacity: sprayOpacity }}>
        <Technician spraying />
      </motion.g>
      <Technician spraying={false} />
    </motion.g>
  )
}

function House() {
  return (
    <g>
      <ellipse cx="600" cy="472" rx="215" ry="26" fill="rgba(74,59,51,0.10)" />
      <rect x="450" y="290" width="300" height="180" rx="4" fill={C.wallA} stroke={C.ink} strokeWidth="3" />
      <rect x="750" y="345" width="130" height="125" rx="4" fill={C.wallB} stroke={C.ink} strokeWidth="3" />
      <rect x="768" y="378" width="94" height="92" rx="3" fill="#d9c7a8" stroke={C.ink} strokeWidth="2.5" />
      <line x1="768" y1="401" x2="862" y2="401" stroke={C.ink} strokeWidth="1.5" opacity="0.5" />
      <line x1="768" y1="424" x2="862" y2="424" stroke={C.ink} strokeWidth="1.5" opacity="0.5" />
      <line x1="768" y1="447" x2="862" y2="447" stroke={C.ink} strokeWidth="1.5" opacity="0.5" />
      <polygon points="740,345 815,300 890,345" fill={C.roof} stroke={C.ink} strokeWidth="3" />
      <polygon points="430,290 600,190 770,290" fill={C.roof} stroke={C.ink} strokeWidth="3" />
      <rect x="675" y="215" width="26" height="55" fill="#7a5c49" stroke={C.ink} strokeWidth="2.5" />
      <rect x="670" y="208" width="36" height="10" rx="2" fill={C.ink} />
      <rect x="572" y="388" width="56" height="82" rx="3" fill={C.amber} stroke={C.ink} strokeWidth="2.5" />
      <circle cx="616" cy="431" r="3" fill={C.ink} />
      <g stroke={C.ink} strokeWidth="2.5">
        <rect x="478" y="330" width="58" height="52" rx="3" fill="#fde9c8" />
        <line x1="507" y1="330" x2="507" y2="382" />
        <line x1="478" y1="356" x2="536" y2="356" />
        <rect x="664" y="330" width="58" height="52" rx="3" fill="#fde9c8" />
        <line x1="693" y1="330" x2="693" y2="382" />
        <line x1="664" y1="356" x2="722" y2="356" />
        <rect x="572" y="228" width="56" height="44" rx="3" fill="#fde9c8" />
        <line x1="600" y1="228" x2="600" y2="272" />
      </g>
      <path d="M 582 470 L 618 470 L 640 560 L 560 560 Z" fill="#e7dcc6" stroke={C.ink} strokeWidth="2" opacity="0.9" />
    </g>
  )
}

function Scenery() {
  return (
    <g>
      <ellipse cx="600" cy="500" rx="560" ry="185" fill={C.lawn} />
      <ellipse cx="600" cy="505" rx="470" ry="150" fill={C.lawnDark} opacity="0.45" />
      <g stroke={C.ink} strokeWidth="2" opacity="0.25">
        <line x1="180" y1="360" x2="1020" y2="360" />
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1={200 + i * 58} y1="340" x2={200 + i * 58} y2="378" />
        ))}
      </g>
      <g>
        <rect x="176" y="330" width="16" height="70" rx="6" fill="#7a5c49" />
        <circle cx="184" cy="300" r="52" fill="#8fbf7f" />
        <circle cx="152" cy="322" r="34" fill="#7fb26f" />
        <circle cx="218" cy="320" r="30" fill="#9cc98c" />
      </g>
      <g>
        <ellipse cx="418" cy="465" rx="34" ry="22" fill="#8fbf7f" />
        <ellipse cx="452" cy="470" rx="24" ry="16" fill="#7fb26f" />
        <ellipse cx="905" cy="480" rx="36" ry="22" fill="#8fbf7f" />
        <ellipse cx="940" cy="486" rx="24" ry="15" fill="#7fb26f" />
      </g>
    </g>
  )
}

function Pest({ kind }: { kind: "ants" | "roach" }) {
  if (kind === "roach") {
    return (
      <g fill={C.ink}>
        <ellipse cx="0" cy="0" rx="9" ry="5.5" />
        <circle cx="9" cy="0" r="3" />
        <path d="M 11 -1 L 17 -5 M 11 1 L 17 5" stroke={C.ink} strokeWidth="1.4" fill="none" />
      </g>
    )
  }

  return (
    <g fill={C.ink}>
      <circle cx="-8" cy="0" r="3.2" />
      <circle cx="0" cy="-3" r="3.2" />
      <circle cx="8" cy="1" r="3.2" />
    </g>
  )
}

function PestMarker({
  pest,
  t,
}: {
  pest: (typeof PESTS)[number]
  t: MotionValue<number>
}) {
  const passAt = (pest.angle - THETA0) / 360
  const opacity = useTransform(t, [passAt - 0.02, passAt + 0.04], [1, 0], {
    clamp: true,
  })
  const pos = pestPos(pest.angle)

  return (
    <motion.g
      style={{ opacity }}
      transform={`translate(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`}
    >
      <Pest kind={pest.kind} />
    </motion.g>
  )
}

function Overlay({
  progress,
  range,
  className,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number, number, number]
  className: string
  children: ReactNode
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0])
  const y = useTransform(progress, range, [18, 0, 0, -14])

  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function ScrollStorySection({
  onRequestQuote,
}: {
  onRequestQuote?: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  })

  const t = useTransform(scrollYProgress, [WALK_START, WALK_END], [0, 1], {
    clamp: true,
  })

  const barrierD = useMemo(barrierPath, [])
  const dashOffset = useTransform(t, (v) => 1 - v)

  const spraying = useTransform(scrollYProgress, (p): number =>
    p > WALK_START + 0.01 && p < WALK_END - 0.01 ? 1 : 0
  )

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.05], [0.4, 1])
  const sceneScale = useTransform(scrollYProgress, [0, 0.06], [0.96, 1])

  const pulseOpacity = useTransform(scrollYProgress, [0.9, 0.94, 1], [0, 0.8, 0.35])
  const pulseScale = useTransform(scrollYProgress, [0.9, 1], [1, 1.06])
  const houseGlow = useTransform(scrollYProgress, [0.88, 0.96], [0, 0.5])

  const finalOpacity = useTransform(scrollYProgress, [0.88, 0.95], [0, 1])
  const finalY = useTransform(scrollYProgress, [0.88, 0.95], [24, 0])

  const handleCta = () => {
    if (onRequestQuote) return onRequestQuote()
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
  }

  if (prefersReducedMotion) {
    return (
      <section className="relative overflow-hidden" style={{ background: C.bg }}>
        <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center gap-8 px-4 py-20">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full max-w-4xl"
            role="img"
            aria-label="Illustration of a home surrounded by a completed pest protection barrier"
          >
            <Scenery />
            <path
              d={barrierD}
              fill="none"
              stroke={C.emeraldSoft}
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d={barrierD}
              fill="none"
              stroke={C.emerald}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <House />
          </svg>
          <div className="text-center">
            <h2
              className="font-heading text-3xl font-bold sm:text-4xl"
              style={{ color: C.ink }}
            >
              Complete protection, all the way around.
            </h2>
            <p className="mt-2 text-base" style={{ color: "rgba(74,59,51,0.75)" }}>
              Free inspections. Same-day service.
            </p>
            <button
              type="button"
              onClick={handleCta}
              className="mt-6 rounded-full bg-emerald-600 px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-700"
            >
              Get your free estimate
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={wrapRef}
      className="relative h-[300vh] md:h-[400vh]"
      style={{ background: C.bg }}
    >
      <style>{`
        @keyframes ppsPuff {
          0%   { opacity: 0.9; transform: translate(0px, 0px) scale(0.6); }
          100% { opacity: 0;   transform: translate(22px, 14px) scale(1.7); }
        }
        .pps-spray circle { transform-box: fill-box; transform-origin: center; }
      `}</style>

      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: sceneOpacity, scale: sceneScale }}
          className="relative w-full max-w-6xl px-2 sm:px-6"
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="h-auto w-full"
            role="img"
            aria-label="A pest control technician walks around a home, spraying a glowing protection barrier that surrounds the house"
          >
            <defs>
              <filter id="ppsGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>

            <Scenery />
            <TechLayer t={t} layer="back" spraying={spraying} />

            <motion.path
              d={barrierD}
              fill="none"
              stroke={C.emeraldSoft}
              strokeWidth="16"
              strokeLinecap="round"
              filter="url(#ppsGlow)"
              pathLength={1}
              strokeDasharray="1 1"
              style={{ strokeDashoffset: dashOffset }}
            />
            <motion.path
              d={barrierD}
              fill="none"
              stroke={C.emerald}
              strokeWidth="5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              style={{ strokeDashoffset: dashOffset }}
            />

            <motion.ellipse
              cx={CX}
              cy={CY}
              rx={RX}
              ry={RY}
              fill="none"
              stroke={C.emerald}
              strokeWidth="10"
              filter="url(#ppsGlow)"
              style={{
                opacity: pulseOpacity,
                scale: pulseScale,
                transformOrigin: `${CX}px ${CY}px`,
              }}
            />

            {PESTS.map((pest, i) => (
              <PestMarker key={i} pest={pest} t={t} />
            ))}

            <House />

            <motion.rect
              x="430"
              y="180"
              width="470"
              height="300"
              rx="30"
              fill={C.emerald}
              filter="url(#ppsGlow)"
              style={{ opacity: houseGlow, mixBlendMode: "soft-light" }}
            />

            <TechLayer t={t} layer="front" spraying={spraying} />
          </svg>

          <Overlay
            progress={scrollYProgress}
            range={[0, 0.02, 0.09, 0.14]}
            className="left-1/2 top-4 w-full -translate-x-1/2 text-center sm:top-8"
          >
            <h2
              className="font-heading text-2xl font-bold sm:text-4xl"
              style={{ color: C.ink }}
            >
              Every home has weak points.
            </h2>
            <p className="mt-1 text-sm sm:text-base" style={{ color: "rgba(74,59,51,0.7)" }}>
              Keep scrolling to see how we seal them off.
            </p>
          </Overlay>

          <Overlay
            progress={scrollYProgress}
            range={[0.22, 0.28, 0.4, 0.46]}
            className="left-2 top-1/3 max-w-[46vw] sm:left-8 sm:max-w-xs"
          >
            <div className="rounded-2xl border border-emerald-600/20 bg-white/85 p-4 shadow-lg backdrop-blur-sm">
              <p className="font-heading text-sm font-bold text-emerald-700 sm:text-base">
                Barrier treatment around your entire foundation
              </p>
            </div>
          </Overlay>

          <Overlay
            progress={scrollYProgress}
            range={[0.5, 0.56, 0.68, 0.74]}
            className="right-2 top-1/3 max-w-[46vw] text-right sm:right-8 sm:max-w-xs"
          >
            <div className="rounded-2xl border border-emerald-600/20 bg-white/85 p-4 shadow-lg backdrop-blur-sm">
              <p className="font-heading text-sm font-bold text-emerald-700 sm:text-base">
                Entry points sealed and treated
              </p>
            </div>
          </Overlay>

          <motion.div
            style={{ opacity: finalOpacity, y: finalY }}
            className="absolute bottom-2 left-1/2 w-full -translate-x-1/2 text-center sm:bottom-6"
          >
            <h2
              className="font-heading text-2xl font-bold sm:text-4xl"
              style={{ color: C.ink }}
            >
              Complete protection, all the way around.
            </h2>
            <p className="mt-1 text-sm sm:text-base" style={{ color: "rgba(74,59,51,0.75)" }}>
              Free inspections. Same-day service.
            </p>
            <button
              type="button"
              onClick={handleCta}
              className="mt-4 rounded-full bg-emerald-600 px-7 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.03] hover:bg-emerald-700"
            >
              Get your free estimate
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
