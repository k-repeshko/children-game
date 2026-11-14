import './RewardOverlay.css'
import {
  useRewardOverlayLogic,
  type RewardOverlayProps,
} from './RewardOverlay.logic'

export function RewardOverlay({ visible, startSeconds }: RewardOverlayProps) {
  const { videoRef, sourcePath, onVideoLoaded } = useRewardOverlayLogic({
    visible,
    startSeconds,
  })

  if (!visible) {
    return null
  }

  return (
    <section className="reward-overlay" aria-live="polite">
      <div className="reward-content">
        <video
          ref={videoRef}
          className="reward-video"
          src={sourcePath}
          autoPlay
          playsInline
          onLoadedMetadata={onVideoLoaded}
        />
      </div>
    </section>
  )
}
