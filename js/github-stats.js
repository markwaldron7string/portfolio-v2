const githubStatsRoot = document.querySelector('[data-github-user]');
if(githubStatsRoot){
  const username = githubStatsRoot.dataset.githubUser;
  const apiBase = 'https://api.github.com';
  const cacheKey = `portfolio-github-stats:${username}`;
  const cacheMs = 10 * 60 * 1000;
  const refreshMs = 30 * 60 * 1000;

  const githubHeaders = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  const readCache = () => {
    try{
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      if(cached && Date.now() - cached.timestamp < cacheMs) return cached.stats;
    }catch(error){}
    return null;
  };

  const writeCache = (stats) => {
    try{
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), stats }));
    }catch(error){}
  };

  const fetchGithubJson = async (url) => {
    const response = await fetch(url, { headers: githubHeaders });
    if(!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
    return response.json();
  };

  const fetchPublicRepos = async () => {
    const repos = [];
    let page = 1;

    while(page < 10){
      const url = `${apiBase}/users/${username}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
      const pageRepos = await fetchGithubJson(url);
      if(!Array.isArray(pageRepos)) break;
      repos.push(...pageRepos);
      if(pageRepos.length < 100) break;
      page += 1;
    }

    return repos;
  };

  const fetchCommitCountThisYear = async () => {
    const year = new Date().getFullYear();
    const params = new URLSearchParams({
      q: `author:${username} author-date:${year}-01-01..${year}-12-31`
    });
    const commits = await fetchGithubJson(`${apiBase}/search/commits?${params}`);
    return commits.total_count || 0;
  };

  const fetchGithubStats = async () => {
    const [profileResult, reposResult, commitsResult] = await Promise.allSettled([
      fetchGithubJson(`${apiBase}/users/${username}`),
      fetchPublicRepos(),
      fetchCommitCountThisYear()
    ]);

    const profile = profileResult.status === 'fulfilled' ? profileResult.value : {};
    const repos = reposResult.status === 'fulfilled' ? reposResult.value : [];
    const commitsThisYear = commitsResult.status === 'fulfilled' ? commitsResult.value : undefined;
    const shippedProjects = repos.filter((repo) =>
      !repo.fork &&
      !repo.archived &&
      typeof repo.homepage === 'string' &&
      /^https?:\/\//.test(repo.homepage.trim())
    ).length;

    return {
      publicRepos: Number.isFinite(profile.public_repos) ? profile.public_repos : repos.length,
      shippedProjects: repos.length ? shippedProjects : undefined,
      commitsThisYear,
      syncedAt: new Date().toISOString()
    };
  };

  const formatStat = (value) => new Intl.NumberFormat('en-US').format(value);

  const applyGithubStats = (stats) => {
    Object.entries(stats).forEach(([key, value]) => {
      if(!Number.isFinite(value)) return;
      document.querySelectorAll(`[data-github-stat="${key}"]`).forEach((target) => {
        target.textContent = formatStat(value);
      });
    });

    if(stats.syncedAt){
      githubStatsRoot.title = `GitHub stats synced ${new Date(stats.syncedAt).toLocaleString()}`;
    }
  };

  const refreshGithubStats = async ({ useCache = true } = {}) => {
    const cachedStats = useCache ? readCache() : null;
    if(cachedStats){
      applyGithubStats(cachedStats);
      return;
    }

    try{
      const stats = await fetchGithubStats();
      writeCache(stats);
      applyGithubStats(stats);
    }catch(error){
      const staleStats = readCache();
      if(staleStats) applyGithubStats(staleStats);
    }
  };

  refreshGithubStats();
  setInterval(() => refreshGithubStats({ useCache: false }), refreshMs);
}
