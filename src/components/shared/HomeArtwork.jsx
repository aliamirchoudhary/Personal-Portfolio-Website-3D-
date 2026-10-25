import { lazy, Suspense } from 'react'
import { PERSONAL } from '../../data/portfolioData'
const Portrait = lazy(() => import('../animated/HomeProfilePicture'))

export default function HomeArtwork() {
  return (
    <div className="home-artwork">
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
    </div>
  )
}
