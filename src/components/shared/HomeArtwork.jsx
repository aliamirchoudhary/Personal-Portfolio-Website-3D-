import { lazy, Suspense, useEffect, useState } from 'react'
import { PERSONAL } from '../../data/portfolioData'
import { useMotion } from '../../context/motion'
import LoadingProfileFrame from '../loading/LoadingProfileFrame'
import LoadingNameTrace from '../loading/LoadingNameTrace'
const Portrait = lazy(() => import('../animated/HomeProfilePicture'))

export default function HomeArtwork() {
  const { animate, lowPower } = useMotion()
  const [intro, setIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('portfolio-intro')
    } catch {
      return false
    }
  })
  useEffect(() => {
    if (!intro) return
    try {
      sessionStorage.setItem('portfolio-intro', 'seen')
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
    const timer = setTimeout(() => setIntro(false), 1800)
    return () => clearTimeout(timer)
  }, [intro])
  return (
    <div className="home-artwork">
      {intro && animate && !lowPower ? (
        <div className="inline-intro">
          <LoadingProfileFrame imageSrc={PERSONAL.profileImage} />
          <div className="intro-name">
            <LoadingNameTrace name={PERSONAL.name.toUpperCase()} duration={1500} />
          </div>
        </div>
      ) : (
        <Suspense
          fallback={
            <img
              className="artwork-fallback"
              src="/profile-320.webp"
              width="200"
              height="200"
              alt=""
            />
          }
        >
          <Portrait imageSrc={PERSONAL.profileImage} size={320} />
        </Suspense>
      )}
    </div>
  )
}
