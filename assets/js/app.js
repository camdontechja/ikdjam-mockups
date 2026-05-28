(function () {
  const mockups = window.IKD_MOCKUPS || [];
  const commentPrefix = "ikdjam-comments:";

  const byId = (id) => document.getElementById(id);
  const query = new URLSearchParams(window.location.search);
  const selectedId = query.get("id");

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getComments(mockupId) {
    try {
      return JSON.parse(localStorage.getItem(commentPrefix + mockupId) || "[]");
    } catch (_) {
      return [];
    }
  }

  function saveComments(mockupId, comments) {
    localStorage.setItem(commentPrefix + mockupId, JSON.stringify(comments));
  }

  function commentCount(mockupId) {
    return getComments(mockupId).length;
  }

  function renderGallery() {
    const grid = byId("mockupGrid");
    if (!grid) return;

    const total = byId("mockupTotal");
    if (total) total.textContent = `${mockups.length} mockups`;

    grid.innerHTML = mockups
      .map((mockup, index) => {
        const comments = commentCount(mockup.id);
        return `
          <article class="mockup-card" style="--delay:${index * 70}ms">
            <a class="mockup-thumb" href="viewer.html?id=${encodeURIComponent(mockup.id)}" aria-label="Open ${escapeHtml(mockup.title)}">
              <iframe src="${escapeHtml(mockup.file)}" title="${escapeHtml(mockup.title)} preview" tabindex="-1" loading="lazy"></iframe>
              <span class="mockup-tag">${escapeHtml(mockup.tag)}</span>
            </a>
            <div class="mockup-card-body">
              <div>
                <h2>${escapeHtml(mockup.title)}</h2>
                <p>${escapeHtml(mockup.description)}</p>
              </div>
              <div class="card-actions">
                <span>${comments} ${comments === 1 ? "comment" : "comments"}</span>
                <a href="viewer.html?id=${encodeURIComponent(mockup.id)}">Review</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderViewer() {
    const frame = byId("mockupFrame");
    if (!frame) return;

    const current = mockups.find((mockup) => mockup.id === selectedId) || mockups[0];
    if (!current) {
      document.body.innerHTML = "<main class=\"empty-state\"><h1>No mockups found</h1><p>Add mockups in assets/js/mockups.js.</p></main>";
      return;
    }

    document.title = `${current.title} | IKD Jamaica Mockups`;
    byId("viewerTitle").textContent = current.title;
    byId("viewerDescription").textContent = current.description;
    byId("viewerTag").textContent = current.tag;
    byId("openDirect").href = current.file;
    frame.src = current.file;
    frame.title = current.title;

    const selector = byId("mockupSelector");
    selector.innerHTML = mockups
      .map((mockup) => `<option value="${escapeHtml(mockup.id)}"${mockup.id === current.id ? " selected" : ""}>${escapeHtml(mockup.title)}</option>`)
      .join("");
    selector.addEventListener("change", () => {
      window.location.href = `viewer.html?id=${encodeURIComponent(selector.value)}`;
    });

    renderComments(current.id);
    const form = byId("commentForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = byId("commentName").value.trim() || "Reviewer";
      const message = byId("commentMessage").value.trim();
      if (!message) return;

      const comments = getComments(current.id);
      comments.unshift({
        id: Date.now(),
        name,
        message,
        createdAt: new Date().toISOString()
      });
      saveComments(current.id, comments);
      byId("commentMessage").value = "";
      renderComments(current.id);
    });
  }

  function renderComments(mockupId) {
    const list = byId("commentList");
    const count = byId("commentCount");
    if (!list) return;

    const comments = getComments(mockupId);
    count.textContent = `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`;

    if (!comments.length) {
      list.innerHTML = "<p class=\"comment-empty\">No comments yet.</p>";
      return;
    }

    list.innerHTML = comments
      .map((comment) => {
        const date = new Date(comment.createdAt);
        return `
          <article class="comment">
            <div>
              <strong>${escapeHtml(comment.name)}</strong>
              <time datetime="${escapeHtml(comment.createdAt)}">${date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</time>
            </div>
            <p>${escapeHtml(comment.message)}</p>
            <button type="button" data-delete-comment="${comment.id}">Delete</button>
          </article>
        `;
      })
      .join("");

    list.querySelectorAll("[data-delete-comment]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = getComments(mockupId).filter((comment) => String(comment.id) !== button.dataset.deleteComment);
        saveComments(mockupId, next);
        renderComments(mockupId);
      });
    });
  }

  renderGallery();
  renderViewer();
})();
