import './RewardOverlay.css'
import {
  useRewardOverlayLogic,
  type RewardOverlayProps,
} from './RewardOverlay.logic'

export function RewardOverlay({ visible, startSeconds }: RewardOverlayProps) {
  const {
    videoRef,
    sourcePath,
    showNativeControls,
    showManualPlayButton,
    manualPlayButtonText,
    onManualPlay,
    onVideoLoaded,
    onVideoCanPlay,
    onVideoPlaying,
  } = useRewardOverlayLogic({
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
          autoPlay={!showNativeControls}
          controls={showNativeControls}
          playsInline
          onLoadedMetadata={onVideoLoaded}
          onCanPlay={onVideoCanPlay}
          onPlaying={onVideoPlaying}
        />
        {showManualPlayButton ? (
          <button type="button" className="reward-play-button" onClick={onManualPlay}>
            {manualPlayButtonText}
          </button>
        ) : null}
      </div>
    </section>
  )
}
