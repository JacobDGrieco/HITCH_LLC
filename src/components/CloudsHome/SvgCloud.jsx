export default function SvgCloud({ width = 220, height = 130, uid = 'c0' }) {
  return (
    <svg
      viewBox="0 0 220 130"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id={`cloud-blur-base-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`cloud-blur-mid-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id={`cloud-blur-top-${uid}`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        <radialGradient id={`puff-main-${uid}`} cx="42%" cy="35%" r="58%" fx="38%" fy="28%">
          <stop offset="0%"   stopColor="rgba(255,252,254,1)" />
          <stop offset="30%"  stopColor="rgba(255,242,248,0.97)" />
          <stop offset="65%"  stopColor="rgba(248,225,238,0.93)" />
          <stop offset="100%" stopColor="rgba(235,200,220,0.85)" />
        </radialGradient>

        <radialGradient id={`puff-shadow-${uid}`} cx="50%" cy="80%" r="55%">
          <stop offset="0%"   stopColor="rgba(210,165,195,0.55)" />
          <stop offset="60%"  stopColor="rgba(225,185,210,0.25)" />
          <stop offset="100%" stopColor="rgba(240,210,228,0)" />
        </radialGradient>

        <radialGradient id={`puff-highlight-${uid}`} cx="32%" cy="22%" r="45%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.95)" />
          <stop offset="50%"  stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* base shadow */}
      <ellipse cx="110" cy="118" rx="88" ry="14" fill="rgba(190,140,175,0.22)" filter={`url(#cloud-blur-base-${uid})`} />

      {/* bottom cluster */}
      <ellipse cx="58"  cy="95"  rx="48" ry="36" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-mid-${uid})`} />
      <ellipse cx="110" cy="98"  rx="58" ry="38" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-mid-${uid})`} />
      <ellipse cx="162" cy="95"  rx="48" ry="36" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-mid-${uid})`} />

      {/* mid puffs */}
      <ellipse cx="72"  cy="72"  rx="44" ry="34" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-mid-${uid})`} />
      <ellipse cx="148" cy="72"  rx="44" ry="34" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-mid-${uid})`} />
      <ellipse cx="110" cy="65"  rx="52" ry="38" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-mid-${uid})`} />

      {/* top puffs */}
      <ellipse cx="88"  cy="48"  rx="36" ry="30" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-top-${uid})`} />
      <ellipse cx="132" cy="48"  rx="36" ry="30" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-top-${uid})`} />
      <ellipse cx="110" cy="38"  rx="32" ry="26" fill={`url(#puff-main-${uid})`} filter={`url(#cloud-blur-top-${uid})`} />

      {/* underside shadow */}
      <ellipse cx="110" cy="105" rx="82" ry="22" fill={`url(#puff-shadow-${uid})`} />

      {/* highlight pass */}
      <ellipse cx="92"  cy="42"  rx="22" ry="16" fill={`url(#puff-highlight-${uid})`} filter={`url(#cloud-blur-top-${uid})`} />
      <ellipse cx="68"  cy="68"  rx="18" ry="13" fill={`url(#puff-highlight-${uid})`} filter={`url(#cloud-blur-top-${uid})`} />
      <ellipse cx="148" cy="68"  rx="18" ry="13" fill={`url(#puff-highlight-${uid})`} filter={`url(#cloud-blur-top-${uid})`} />
    </svg>
  );
}
