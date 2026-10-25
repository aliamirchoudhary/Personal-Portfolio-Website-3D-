import './loading-profile.css'
export default function LoadingProfileFrame({ imageSrc }) {
  return (
    <div className="lpf-scene">
      <div className="lpf-root" role="img" aria-label="Loading profile">
        {/* Inner breathing radial glow */}
        <div className="lpf-inner-wave" aria-hidden="true" />

        {/* Photo */}
        <div className="lpf-photo-wrap">
          {imageSrc ? (
            <img
              className="lpf-photo"
              src={imageSrc === '/profile.jpg' ? '/profile-640.webp' : imageSrc}
              srcSet={
                imageSrc === '/profile.jpg'
                  ? '/profile-320.webp 320w, /profile-640.webp 640w'
                  : undefined
              }
              sizes="(max-width: 1024px) 180px, 320px"
              width="640"
              height="960"
              alt=""
              crossOrigin="anonymous"
            />
          ) : (
            <div className="lpf-photo-placeholder" aria-hidden="true" />
          )}
        </div>

        {/* Glowing pulsing + rotating ring */}
        <div className="lpf-ring" aria-hidden="true">
          <div className="lpf-ring-inner" />
          {/* N/S/E/W markers ride along with the rotating ring */}
          <span className="lpf-dot n" />
          <span className="lpf-dot s" />
          <span className="lpf-dot e" />
          <span className="lpf-dot w" />
        </div>

        {/* Radar light sweep */}
        <div className="lpf-sweep" aria-hidden="true" />
      </div>

      {/* Name text below the frame — commented out, picture only */}
      {/*
      <div style={{ textAlign: "center" }}>
        <div className="lpf-name">{name}</div>
        <div className="lpf-label">Loading Portfolio</div>
      </div>
      */}
    </div>
  )
}
