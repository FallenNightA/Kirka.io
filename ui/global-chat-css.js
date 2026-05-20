(function () {
    const cssUrl = "https://raw.githubusercontent.com/crumpledflowers/kirka-css/main/global_chat.css";

    fetch(cssUrl)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(cssText => {
            const style = document.createElement("style");
            style.textContent = cssText;
            document.head.appendChild(style);
            console.log("Global chat CSS applied from GitHub.");
        })
        .catch(error => {
            console.error("Failed to load global chat CSS:", error);
        });
})();