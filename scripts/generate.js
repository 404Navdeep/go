const fs = require('fs');
const yaml = require('yaml');

const data = yaml.parse(fs.readFileSync('data.yaml', 'utf8'));

data.sites.forEach(site => {
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

      await fetch("/api/store-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
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
  
  fs.writeFileSync(`public/${site.name}/index.html`, html, { recursive: true });
});