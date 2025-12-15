const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const fileContent = fs.readFileSync('data.yaml', 'utf8');
const data = yaml.parse(fileContent) || { sites: [] };

if (!data.sites) data.sites = [];

data.sites.forEach(site => {
  const dir = path.join('public', site.name);
  fs.mkdirSync(dir, { recursive: true });
  
  let html;
  
  if (site.ip) {
    html = `<html>
<head>
  <title>Go</title>
  <meta charset="UTF-8">
  <script>
    async function run() {
      const res = await fetch("https://api.ipify.org?format=json");
      const { ip } = await res.json();

      await fetch("https://ip.navdeep.online/api/store-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, site: "${site.name}" })
      });

      window.location.href = "${site.url}";
    }
    run();
  </script>
</head>
<body>Redirecting…</body>
</html>`;
  } else {
    html = `<html>
<head>
  <title>Go</title>
  <meta charset="UTF-8">
  <script>
    window.location.href = "${site.url}";
  </script>
</head>
<body>Redirecting…</body>
</html>`;
  }
  
  fs.writeFileSync(path.join(dir, 'index.html'), html);
});