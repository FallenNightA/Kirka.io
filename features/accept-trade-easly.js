(function () {
    function findChatInput() {
        return document.querySelector("input[type='text']");
    }

    let lastTradeCode = null;

    const observer = new MutationObserver(() => {
        const tradeMessages = document.getElementsByClassName("message trade");

        for (const msg of tradeMessages) {
            for (const child of msg.children) {
                if (child.innerText.includes("/trade accept ")) {
                    child.style.backgroundColor = "#692c8c";
                    child.style.cursor = "pointer";

                    if (!child._clickAttached) {
                        child._clickAttached = true;

                        child.addEventListener("click", () => {
                            const match = child.innerText.match(/\/trade accept (\d+)/);
                            if (!match) return;

                            const code = match[1];
                            const input = findChatInput();
                            if (!input) return alert("Input field not found");

                            lastTradeCode = code;
                            input.value = `/trade accept ${code}a`;
                            input.focus();
                        });
                    }
                }
            }
        }
    });

    observer.observe(document, { subtree: true, childList: true });

    // Watch the input field for changes (after sending accept)
    const inputWatcher = setInterval(() => {
        const input = findChatInput();
        if (!input || !lastTradeCode) return;

        // If input is empty (accept was sent), fill in confirm
        if (input.value === '') {
            input.value = `/trade confirm ${lastTradeCode}q`;
            input.focus();
            lastTradeCode = null; // reset so it doesn't keep overwriting
        }
    }, 50); // check every 50ms
})();