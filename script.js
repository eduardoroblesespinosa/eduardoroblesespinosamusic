document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for nav links
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const volumeSlider = document.getElementById('volume-slider');

    const progressContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    const titleEl = document.getElementById('song-title');
    const artistEl = document.getElementById('song-artist');
    const albumArtEl = document.getElementById('album-art');
    const playlistEl = document.getElementById('playlist');

    const songs = [
        {
            title: 'Noche Estrellada',
            artist: 'Leo Rivera',
            src: 'song_1.mp3',
            albumArt: 'album_art_1.png'
        },
        {
            title: 'Ritmo Urbano',
            artist: 'Leo Rivera',
            src: 'song_2.mp3',
            albumArt: 'album_art_2.png'
        },
        {
            title: 'Amanecer Eléctrico',
            artist: 'Leo Rivera',
            src: 'song_3.mp3',
            albumArt: 'album_art_3.png'
        }
    ];

    let songIndex = 0;
    let isPlaying = false;

    function loadSong(song) {
        titleEl.textContent = song.title;
        artistEl.textContent = song.artist;
        audio.src = song.src;
        albumArtEl.src = song.albumArt;
        updatePlaylistUI();
    }

    function playSong() {
        isPlaying = true;
        playBtn.querySelector('i.fas').classList.remove('fa-play');
        playBtn.querySelector('i.fas').classList.add('fa-pause');
        audio.play();
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.querySelector('i.fas').classList.remove('fa-pause');
        playBtn.querySelector('i.fas').classList.add('fa-play');
        audio.pause();
    }

    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        playSong();
    }
    
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Update time display
        if (duration) {
            durationEl.textContent = formatTime(duration);
        }
        currentTimeEl.textContent = formatTime(currentTime);
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function setVolume() {
        audio.volume = volumeSlider.value;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return isNaN(seconds) ? "0:00" : `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function createPlaylist() {
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.dataset.index = index;
            
            const tempAudio = new Audio(song.src);
            tempAudio.addEventListener('loadedmetadata', () => {
                 li.querySelector('.song-duration').textContent = formatTime(tempAudio.duration);
            });

            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${song.albumArt}" class="playlist-album-art me-3" alt="${song.title}">
                    <div>
                        <span class="fw-bold">${song.title}</span>
                        <br>
                        <small class="text-muted">${song.artist}</small>
                    </div>
                </div>
                <span class="song-duration text-muted">--:--</span>
            `;
            li.addEventListener('click', () => {
                songIndex = index;
                loadSong(songs[songIndex]);
                playSong();
            });
            playlistEl.appendChild(li);
        });
    }

    function updatePlaylistUI() {
        const items = playlistEl.querySelectorAll('li');
        items.forEach((item, index) => {
            if (index === songIndex) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);

    // Initial load
    createPlaylist();
    loadSong(songs[songIndex]);
});