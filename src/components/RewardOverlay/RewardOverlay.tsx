import './RewardOverlay.css'
import {
  useRewardOverlayLogic,
  type RewardOverlayProps,
} from './RewardOverlay.logic'

export function RewardOverlay({ visible, startSeconds }: RewardOverlayProps) {
  const {
    videoRef,
    sourcePath,
    requiresManualStart,
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

  return (
    <section
      className={`reward-overlay${visible ? '' : ' reward-overlay--hidden'}`}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className="reward-content">
        <video
          ref={videoRef}
          className="reward-video"
          src={sourcePath}
          autoPlay={!requiresManualStart}
          playsInline
          onLoadedMetadata={onVideoLoaded}
          onCanPlay={onVideoCanPlay}
          onPlaying={onVideoPlaying}
        />
        {visible && showManualPlayButton ? (
          <button type="button" className="reward-play-button" onClick={onManualPlay}>
            {manualPlayButtonText}
          </button>
        ) : null}
      </div>
    </section>
  )
}
