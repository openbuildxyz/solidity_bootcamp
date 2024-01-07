var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "wantAddr": "0x4F1A18E83ABFB281Cc2af30BaFd513a3192AFA36",
    "nftAddr": "0x51f0c1938b0E67CaFC7a6fC8eB6EdD7FDBe002bC",
    "slogan": "Hello, MongoDB!"
});

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
};

fetch("https://api-want3.zeabur.app/v1/wants/want", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
