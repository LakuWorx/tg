async function getFingerprint() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const timezone = new Date().getTimezoneOffset();
    const fingerprint = `${userAgent}-${platform}-${language}-${timezone}`;
    return btoa(fingerprint);  // Кодируем в Base64.
}

async function checkLogin(password = null) {
    const fingerprint = await getFingerprint();
    const payload = { fingerprint };
    if (password) payload.password = password;

    fetch("http://194.87.161.180/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(response => response.json()).then(data => {
        console.log("Ответ сервера:", data);
        if (data.status === "logout") {
            localStorage.removeItem("session_token");
            if (window.location.pathname.split("/").pop() !== "login.html") {
                window.location.href = "login.html";  // Перенаправление на страницу логина.
            }
        } else if (data.status === "login") {
            localStorage.setItem("session_token", fingerprint);
            if (window.location.pathname.split("/").pop() !== "view.html") {
                window.location.href = "view.html";  // Перенаправление на страницу просмотра.
            }
            document.getElementById("result").textContent = JSON.stringify(data, null, 4);
        } else if (data.status === "incorrect-password") {
            document.getElementById("result").textContent = "Incorrect password!"; 
        }
    })
    .catch(error => console.error("Ошибка запроса:", error));
}
