
// Start of friends_ui_features.js content
(function () {
  "use strict";

  const interval = setInterval(() => {
    if (!window.location.href.includes("friends")) return;

    const friendsCont = document.querySelector(".friends > .content > .allo");
    const limit = document.querySelector(".friends > .content > .tabs > .limit");
    const addFriends = document.querySelector(".friends > .add-friends");

    if (!friendsCont || !limit || !addFriends) return;

    const friendsList = friendsCont.querySelector(".list");
    const requestsList = friendsCont.querySelector(".requests");

    // Friend Search Bar
    function createSearch() {
      if (addFriends.querySelector(".search-friends")) return;

      const searchFriends = document.createElement("div");
      searchFriends.className = "search-friends";
      searchFriends.style = `display: flex; flex-direction: column; align-items: flex-start; margin-top: 1.5rem; padding: 0 1rem;`;
      searchFriends.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: .5rem; width: 100%;">
          <span class="search-text">Search</span>
          <span>Press Enter to search</span>
        </div>
        <input type="text" placeholder="ENTER USERNAME OR ID" class="search-input" style="border: .125rem solid #202639; outline: none; background: #2f3957; width: 100%; height: 2.875rem; padding-left: .5rem; box-sizing: border-box; font-weight: 600; font-size: 1rem; color: #f2f2f2; box-shadow: 0 1px 2px rgba(0,0,0,.4), inset 0 0 8px rgba(0,0,0,.4); border-radius: .25rem;"/>
      `;
      addFriends.appendChild(searchFriends);

      searchFriends.querySelector(".search-input").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll(".friend").forEach((friend) => {
          const nickname = friend.querySelector(".nickname")?.innerText.toLowerCase() || "";
          const shortId = friend.querySelector(".friend-id")?.innerText.toLowerCase() || "";
          friend.style.display = nickname.includes(query) || shortId.includes(query) ? "flex" : "none";
        });
      });
    }

    // Deny All Requests Button
    function createDenyButton() {
      if (addFriends.querySelector(".deny-requests")) return;

      const denyRequests = document.createElement("div");
      denyRequests.className = "deny-requests";
      denyRequests.style = `display: flex; flex-direction: column; align-items: flex-start; margin-top: 1.5rem; padding: 0 1rem;`;
      denyRequests.innerHTML = `
        <span style="margin-bottom: .5rem; font-size: 1rem; font-weight: 600; color: #f2f2f2;">Deny Requests</span>
        <div style="display: flex; gap: 0.25rem; width: 100%;">
          <button class="deny-button" style="cursor: pointer; background: #e73131; color: white; width: 100%; height: 2.875rem; font-weight: bold;">DENY ALL REQUESTS</button>
          <button class="deny-reset" style="display: none; cursor: pointer; background: #ffb914; color: black; width: 100%; height: 2.875rem; font-weight: bold;">BACK</button>
        </div>`;

      addFriends.appendChild(denyRequests);

      const denyButton = denyRequests.querySelector(".deny-button");
      const denyReset = denyRequests.querySelector(".deny-reset");
      let confirm = true;
      let updating = false;
      let denyInterval;

      const resetButtonState = () => {
        denyButton.innerText = "DENY ALL REQUESTS";
        denyReset.style.display = "none";
        confirm = true;
        updating = false;
        clearInterval(denyInterval);
      };

      denyReset.addEventListener("click", resetButtonState);

      denyButton.addEventListener("click", () => {
        if (!document.querySelector(".allo > .requests")) return resetButtonState();

        if (confirm) {
          denyButton.innerText = "ARE YOU SURE?";
          denyReset.style.display = "flex";
          confirm = false;
          return;
        }

        updating = true;
        denyButton.innerText = "CANCEL";
        denyReset.style.display = "none";

        const requests = document.querySelectorAll(".requests .friend");
        let index = 0;

        denyInterval = setInterval(() => {
          if (!updating || index >= requests.length) return resetButtonState();
          const request = requests[index];
          request?.querySelector(".delete")?.click();
          index++;
        }, 500);
      });
    }

    // Format Numbers (Exp, Stats, etc)
    function formatNumbers() {
      document.querySelectorAll(".stat-value, .exp-values, .amount, .count").forEach((el) => {
        if (el && !el.dataset.formatted) {
          el.innerText = el.innerText.replace(/\d+/g, (num) => parseInt(num).toLocaleString());
          el.dataset.formatted = true;
        }
      });
    }

    createSearch();
    createDenyButton();
    formatNumbers();

    clearInterval(interval);
  }, 500);
})();
// End of friends_ui_features.js content