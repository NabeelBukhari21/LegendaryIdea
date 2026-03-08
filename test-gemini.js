const http = require('http');

const data = JSON.stringify({
    studentId: "student-A",
    sessionTitle: "History 101: The Roman Empire",
    slideTopic: "Fall of the Western Empire",
    reasons: ["low engagement", "confusion spikes"]
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/backboard/student/insight',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(responseData);
            console.log("RESPONSE DATA:");
            console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.log("Raw Response:", responseData);
        }
    });
});

req.on('error', (error) => {
    console.error(`Problem with request: ${error.message}`);
});

req.write(data);
req.end();
