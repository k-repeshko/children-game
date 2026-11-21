import './RewardOverlay.scss'
import {
  useRewardOverlayLogic,
  type RewardOverlayProps,
} from './RewardOverlay.logic'

export function RewardOverlay({
  visible,
  startSeconds,
  onPlaybackStarted,
}: RewardOverlayProps) {
  const {
    videoRef,
    sourcePath,
    showManualPlayButton,
    manualPlayButtonLabel,
    onManualPlay,
    onVideoLoaded,
    onVideoPlaying,
  } = useRewardOverlayLogic({
    visible,
    startSeconds,
    onPlaybackStarted,
  })

  if (!visible) {
    return null
  }

  return (
    <section className="reward-overlay" aria-live="polite">
      <div className="reward-content">
        <div className="reward-video-wrap">
          <video
            ref={videoRef}
            className="reward-video"
            src={sourcePath}
            playsInline
            onLoadedMetadata={onVideoLoaded}
            onPlaying={onVideoPlaying}
          />
          {showManualPlayButton ? (
            <button
              type="button"
              className="reward-play-button"
              aria-label={manualPlayButtonLabel}
              onClick={onManualPlay}
            >
              <span className="reward-play-icon" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
