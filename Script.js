// Basic interactions: search (front-end), theme toggle, quality switch, like/share/download mock
document.addEventListener('DOMContentLoaded', ()=>{
  // Theme toggle - stored in localStorage
  function applyTheme(theme){
    document.body.className = theme;
    document.querySelectorAll('#themeToggle, #themeToggle2').forEach(b=>{
      b.textContent = theme === 'light' ? 'Dark' : 'Light';
    });
  }
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  document.querySelectorAll('#themeToggle, #themeToggle2').forEach(btn=>{
    btn.onclick = ()=>{
      const newTheme = document.body.className === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    };
  });

  // Simple search filter (client side) — demo only
  const searchForm = document.getElementById('searchForm');
  if(searchForm){
    searchForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const q = document.getElementById('searchInput').value.toLowerCase().trim();
      const cards = document.querySelectorAll('.card');
      cards.forEach(c=>{
        const title = c.querySelector('.title')?.textContent.toLowerCase() || '';
        c.style.display = title.includes(q) ? '' : 'none';
      });
    });
  }

  // Player: quality switch (very simple: switches source by data-res)
  const player = document.getElementById('player');
  const quality = document.getElementById('quality');
  const downloadBtn = document.getElementById('downloadBtn');
  if(player && quality){
    function setQuality(res){
      // find matching source
      const sources = Array.from(player.querySelectorAll('source'));
      const chosen = sources.find(s=>s.dataset.res === String(res)) || sources[0];
      const currentTime = player.currentTime || 0;
      const isPlaying = !player.paused;
      player.src = chosen.src;
      player.load();
      player.currentTime = currentTime;
      if(isPlaying) player.play().catch(()=>{});
      downloadBtn.href = chosen.src;
    }
    // initial
    setQuality(quality.value);
    quality.addEventListener('change', ()=> setQuality(quality.value));
  }

  // Like/share simple handlers
  const likeBtn = document.getElementById('likeBtn');
  if(likeBtn){
    likeBtn.addEventListener('click', ()=>{
      likeBtn.textContent = likeBtn.textContent === 'Liked' ? 'Like' : 'Liked';
      likeBtn.classList.toggle('liked');
    });
  }
  const shareBtn = document.getElementById('shareBtn');
  if(shareBtn){
    shareBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      const url = location.href;
      if(navigator.share){
        navigator.share({title:document.title,url}).catch(()=>{});
      } else {
        prompt('Copy link', url);
      }
    });
  }
});
