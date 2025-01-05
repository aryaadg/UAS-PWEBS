// Fetch blog data from API and display it
const apiUrl = "https://primdev.alwaysdata.net/api/blog";
let token = "2|HhnUrmaHAwSNUDf7Pz5IasQo4foBnU2KKr1gQLUW";
// Function to fetch and display blog data
async function fetchAndDisplayBlogs() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      const tbody = document.querySelector("#dataTable tbody");
      tbody.innerHTML = ""; // Clear existing rows

      data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.title}</td>
          <td>${item.content}</td>
          <td>
            <button class="btn edit" onclick="openModal('edit', { id: ${item.id}, title: '${item.title}', content: '${item.content}'})">Edit</button>
            <button class="btn delete" onclick="openModal('delete', { id: ${item.id}, title: '${item.title}' })">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    } else {
      console.error("Error fetching blogs:", data);
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}

// Filter table rows based on search input
function filterTable() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#dataTable tbody tr");

  rows.forEach((row) => {
    const titleCell = row.querySelector("td:nth-child(3)"); // Title is in the 3rd column
    if (titleCell && titleCell.textContent.toLowerCase().includes(searchInput)) {
      row.style.display = ""; // Show row
    } else {
      row.style.display = "none"; // Hide row
    }
  });
}

// Open modal for actions (Edit/Delete)
function openModal(action, data = {}) {
  console.log("Open modal action:", action, "Data:", data);
  // Implement modal logic based on `action` (edit/delete)
}

// Initialize the page by fetching blog data
fetchAndDisplayBlogs();


function openModal(mode, blogData = {}) {
    const modal = document.getElementById("modal");
    const modalContent = document.querySelector(".modal-content");
    const deleteAlert = document.querySelector(".delete-alert");

    modal.style.display = "flex";

    if (mode === "delete") {
        // Mode Delete
        modalContent.style.display = "none";
        deleteAlert.style.display = "flex";

        // Isi data konfirmasi delete
        document.getElementById("delBlogId").value = blogData.id || "";
        document.getElementById("delTitle").textContent = blogData.title || "";
    } else {
        // Mode Tambah/Edit
        modalContent.style.display = "block";
        deleteAlert.style.display = "none";

        // Reset form untuk tambah/edit
        const blogForm = document.getElementById("blogForm");
        blogForm.reset();

        if (mode === "edit") {
            document.getElementById("formTitle").textContent = "Edit Blog";
            document.getElementById("blogId").value = blogData.id || "";
            document.getElementById("title").value = blogData.title || "";
            document.getElementById("content").value = blogData.content || "";
        
            blogForm.onsubmit = (event) => handleFormSubmit(event, blogData.id);
        } else {
            document.getElementById("formTitle").textContent = "Tambah Blog";
            blogForm.onsubmit = (event) => handleFormSubmit(event);
        }
    }
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";

    // Reset semua tampilan modal
    document.querySelector(".modal-content").style.display = "none";
    document.querySelector(".delete-alert").style.display = "none";
    document.getElementById("blogForm").reset();
    document.getElementById("imagePreview").src = "";
}

// Fungsi untuk menangani submit form (Tambah/Edit Blog)
async function handleFormSubmit(event, blogId = null) {
    event.preventDefault(); // Hentikan perilaku default form

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const imageInput = document.getElementById("image");
    const image = imageInput?.files?.[0] || null;

    if (!title || !content || (!image && !blogId)) {
        alert("Semua field harus diisi!");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
        formData.append("image", image);
    }

    try {
        let response;

        if (blogId) {
            formData.append("_method", "PUT");
            response = await fetch(`https://primdev.alwaysdata.net/api/blog/${blogId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
        } else {
            response = await fetch("https://primdev.alwaysdata.net/api/blog/store", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const textResponse = await response.text();
        const result = textResponse ? JSON.parse(textResponse) : null;

        if (result) {
            alert(blogId ? "Blog berhasil diperbarui!" : "Blog berhasil ditambahkan!");
            closeModal();
            loadContent("blog.html"); // Muat ulang halaman blog
        } else {
            alert("Respons kosong dari server.");
        }
    } catch (error) {
        console.error("Request error:", error);
    }
}

  async function deleteBlog() {
    const blogId = document.getElementById("delBlogId").value;

    if (!blogId) {
      alert("ID blog tidak ditemukan.");
      return;
    }

    try {
      const response = await fetch(`https://primdev.alwaysdata.net/api/blog/${blogId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer 2|HhnUrmaHAwSNUDf7Pz5IasQo4foBnU2KKr1gQLUW`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Blog berhasil dihapus!");
      closeModal();
      loadContent('blog.html');
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Terjadi kesalahan saat menghapus blog.");
    }
  }
  