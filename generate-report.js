const fs = require('fs');

const lines = fs.readFileSync('result_performance.json', 'utf8').split('\n');
const results = [];

lines.forEach((line) => {
  if (line.trim() !== '') {
    try {
      results.push(JSON.parse(line));
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
    }
  }
});

// Custom logic to format the results in HTML
const htmlContent = `
<html>
<head>
  <title>k6 Performance Test Report</title>
</head>
<body>
  <h1>Performance Test Results</h1>
  <pre>${JSON.stringify(results, null, 2)}</pre>
</body>
</html>
`;

fs.writeFileSync('report.html', htmlContent, 'utf8');

console.log('HTML report generated successfully.');