import './RewardOverlay.css'
import {
  useRewardOverlayLogic,
  type RewardOverlayProps,
} from './RewardOverlay.logic'

export function RewardOverlay({ visible, startSeconds }: RewardOverlayProps) {
  const {
    videoRef,
    sourcePath,
    showManualPlayButton,
    manualPlayButtonText,
    onManualPlay,
    onVideoLoaded,
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
          playsInline
          onLoadedMetadata={onVideoLoaded}
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
