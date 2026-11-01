/* Edit this file */

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// 1. Play and Pause
function togglePlay() {
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }
}

// Set initial button text
toggle.textContent = '►';

toggle.addEventListener('click', togglePlay);

// Synchronize button with video state
video.addEventListener('play', () => {
    toggle.textContent = '❚ ❚';
});

video.addEventListener('pause', () => {
    toggle.textContent = '►';
});

video.addEventListener('ended', () => {
    toggle.textContent = '►';
});

// 2. Update Progress Bar
function handleProgress() {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
        progressBar.style.width = '0%';
        return;
    }

    const percentage = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percentage}%`;
}

video.addEventListener('timeupdate', handleProgress);
video.addEventListener('loadedmetadata', handleProgress);
video.addEventListener('durationchange', handleProgress);

// 3. Volume Control
function handleRangeUpdate() {
    video.volume = Number(ranges[0].value);
}

ranges[0].addEventListener('input', handleRangeUpdate);

// 4. Playback Speed Control
function handleSpeedUpdate() {
    video.playbackRate = Number(ranges[1].value);
}

ranges[1].addEventListener('input', handleSpeedUpdate);

// 5. Skip Forward and Backward
function handleSkip() {
    const skipAmount = Number(this.dataset.skip);
    video.currentTime += skipAmount;
}

skipButtons.forEach((item) => {
    item.addEventListener('click', handleSkip);
});

// 6. Click and Drag to Seek
function scrub(event) {
    const rect = progress.getBoundingClientRect();

    if (
        !rect.width ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
    ) {
        return;
    }

    const clickPosition = event.clientX - rect.left;
    const percentage = Math.max(
        0,
        Math.min(1, clickPosition / rect.width)
    );

    video.currentTime = percentage * video.duration;
}

let isScrubbing = false;

// Click to seek
progress.addEventListener('click', scrub);

// Start dragging
progress.addEventListener('mousedown', (event) => {
    isScrubbing = true;
    scrub(event);
});

// Update playback position while dragging
document.addEventListener('mousemove', (event) => {
    if (isScrubbing) {
        scrub(event);
    }
});

// Stop dragging
document.addEventListener('mouseup', () => {
    isScrubbing = false;
});