import './RewardOverlay.scss'
import { Button, Overlay, PlayIcon, Surface } from '../../ui'
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

  // Kept mounted while hidden so the video can buffer before the reward opens.
  return (
    <Overlay
      aria-live="polite"
      aria-hidden={!visible}
      className={visible ? undefined : 'reward-overlay--hidden'}
    >
      <Surface padding="md" className="reward-content">
        <div className="reward-video-wrap">
          <video
            ref={videoRef}
            className="reward-video"
            src={sourcePath}
            playsInline
            preload="auto"
            onLoadedMetadata={onVideoLoaded}
            onPlaying={onVideoPlaying}
          />
          {showManualPlayButton ? (
            <Button
              shape="circle"
              size="lg"
              className="reward-play-button"
              aria-label={manualPlayButtonLabel}
              onClick={onManualPlay}
            >
              <PlayIcon />
            </Button>
          ) : null}
        </div>
      </Surface>
    </Overlay>
  )
}
