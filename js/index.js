// ============================================
// GLOBAL STATE
// ============================================
let globalIsLoggedIn = false;
let allRecipes = []; 
let currentPage = 1; 
let currentUserId = null;
let currentEditId = null;
let selectedRecipeForManagement = null; 
const recipesPerPage = 3;

// ============================================
// AUTH CHECK
// ============================================
async function checkAuthStatus() {
  try {
    const response = await fetch("api/check_auth.php");
    const data = await response.json();

    globalIsLoggedIn = data.logged_in;
    currentUserId = data.user_id; 

    const authSection = document.getElementById("authSection");
    const dashboardSection = document.getElementById("dashboardSection");
    const profileBox = document.querySelector(".profile-info-box");
    const profileHeader = document.getElementById("profileHeaderTitle");
    const managementBox = document.getElementById("recipeManagementBox");

    if (globalIsLoggedIn) {
      if (authSection) authSection.style.display = "none";
      if (dashboardSection) dashboardSection.style.display = "block";
      if (profileBox) profileBox.style.display = "block"; 
      if (profileHeader) profileHeader.style.display = "block"; 
      
      loadUserProfile();
    } else {
      if (authSection) authSection.style.display = "block";
      if (dashboardSection) dashboardSection.style.display = "none";
      if (profileBox) profileBox.style.display = "none";
      if (profileHeader) profileHeader.style.display = "none";
      if (managementBox) managementBox.style.display = "none";
      selectedRecipeForManagement = null;
    }
  } catch (error) {
    console.error("Σφάλμα κατά τον έλεγχο ταυτοποίησης:", error);
  }

  loadRecipes(); 
}

async function loadUserProfile() {
  try {
    const response = await fetch("api/get_profile.php");
    const data = await response.json();
    
    if (data.success) {
      const usernameEl = document.getElementById("profileUsername");
      const emailEl = document.getElementById("profileEmail");
      const bioEl = document.getElementById("profileBio");

      if (usernameEl) usernameEl.innerText = data.username || "Δεν βρέθηκε όνομα";
      if (emailEl) emailEl.innerText = data.email || "Δεν βρέθηκε email";
      if (bioEl) bioEl.innerText = data.bio || "Δεν έχει προστεθεί βιογραφικό ακόμα.";
    }
  } catch (error) {
    console.error("Σφάλμα κατά τη φόρτωση του προφίλ:", error);
  }
}

// ============================================
// LOAD & DISPLAY LOGIC
// ============================================
async function loadRecipes() {
  try {
    const response = await fetch("api/add_recipes.php");
    allRecipes = await response.json();
    updateDisplay(); 
  } catch (error) {
    console.error("Σφάλμα κατά τη φόρτωση των συνταγών:", error);
  }
}

function updateDisplay() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (!searchInput || !categoryFilter) return;

  const query = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value; 

  const filteredRecipes = allRecipes.filter((r) => {
    const matchesSearch = (r.title && r.title.toLowerCase().includes(query)) || 
                          (r.description && r.description.toLowerCase().includes(query)) || 
                          (r.ingredients && r.ingredients.toLowerCase().includes(query));
    
    const matchesCategory = selectedCategory === "Όλες" || r.category === selectedCategory;

    return matchesSearch && matchesCategory; 
  });

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
  const start = (currentPage - 1) * recipesPerPage;
  const recipesToRender = filteredRecipes.slice(start, start + recipesPerPage);

  const pageIndicator = document.getElementById("pageIndicator");
  if (pageIndicator) pageIndicator.innerText = `Σελίδα ${currentPage} από ${totalPages || 1}`;
  
  const prevBtn = document.getElementById("prevPageBtn");
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  
  const nextBtn = document.getElementById("nextPageBtn");
  if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  renderRecipes(recipesToRender);
}

// ============================================
// RENDER RECIPES
// ============================================
function renderRecipes(recipes) {
  const list = document.getElementById("recipeList");
  if (!list) return;
  list.innerHTML = "";

  if (recipes.length === 0) {
    list.innerHTML = "<p class='no-comments' style='text-align:center; margin-top:20px;'>Δεν βρέθηκαν συνταγές.</p>";
    return;
  }

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const isOwner = globalIsLoggedIn && parseInt(recipe.user_id) === parseInt(currentUserId);
    if (isOwner) {
        card.style.cursor = "pointer";
        card.title = "Κάντε κλικ για διαχείριση αυτής της συνταγής στο δεξί sidebar";
        card.addEventListener("click", (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
            selectRecipeForManagement(recipe);
        });
    }

    card.innerHTML = `
      <div class="recipe-header">
          ${recipe.image_path ? `<img src="uploads/${recipe.image_path}" alt="Εικόνα">` : ""}
      </div>
      <h4>${recipe.title} ${isOwner ? " <small style='font-size:12px; color:#15803d;'>(Κάντε κλικ για επεξεργασία)</small>" : ""}</h4>
      <h3 style="color:#888; font-size:14px; margin-bottom:10px;">από <strong><i>${recipe.username}</i></strong></h3>
      <p style="margin-bottom:15px;">${recipe.description}</p>
      <p><span class="section-label">Υλικά</span><br>${recipe.ingredients}</p>
      <p><span class="section-label">Οδηγίες</span><br>${recipe.instructions}</p>
      
      <div class="comments-box">
        ${recipe.comments && recipe.comments.length > 0 
            ? recipe.comments.map(c => `<p class="comment-text"><strong><i>${c.username}:</i></strong> ${c.comment_text}</p>`).join('')
            : "<p class='no-comments'>Δεν υπάρχουν σχόλια ακόμα.</p>"}
      </div>

      ${globalIsLoggedIn 
        ? `<div style="display:flex; gap:10px; margin-top:15px;">
             <input type="text" id="commentInput_${recipe.id}" class="recipe-comment-input" placeholder="Γράψε ένα σχόλιο...">
             <button onclick="sendComment(${recipe.id})" class="btn-success">Αποστολή</button>
           </div>
           <button onclick="sendLike(${recipe.id})" class="like-btn" style="margin-top:10px; width:100%;">Like (${recipe.likes || 0})</button>`
        : `<p class="guest-banner" style="margin-top:15px; color:#888;"><em>Συνδεθείτε για να κάνετε Like και να σχολιάσετε.</em></p>`
      }
    `;
    list.appendChild(card);
  });
}

// ============================================
// SIDEBAR MANAGEMENT LOGIC
// ============================================
function selectRecipeForManagement(recipe) {
    selectedRecipeForManagement = recipe;
    
    const managementBox = document.getElementById("recipeManagementBox");
    const titleText = document.getElementById("managedRecipeTitle");
    
    if (managementBox && titleText) {
        titleText.innerText = ` ${recipe.title}`;
        managementBox.style.display = "block";
        managementBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

document.getElementById("sidebarEditBtn").addEventListener("click", () => {
    if (selectedRecipeForManagement) {
        enterEditMode(selectedRecipeForManagement);
    }
});

document.getElementById("sidebarDeleteBtn").addEventListener("click", () => {
    if (selectedRecipeForManagement) {
        deleteRecipe(selectedRecipeForManagement.id);
    }
});

// ============================================
// EDIT & DELETE ACTIONS
// ============================================
function enterEditMode(recipe) {
    currentEditId = recipe.id;
    document.getElementById("titleInput").value = recipe.title;
    document.getElementById("descInput").value = recipe.description;
    document.getElementById("categoryInput").value = recipe.category || "Κυρίως Πιάτα";
    document.getElementById("ingredientsInput").value = recipe.ingredients;
    document.getElementById("instructionsInput").value = recipe.instructions;
    
    const btn = document.getElementById("addRecipeBtn");
    btn.innerText = "Αποθήκευση Αλλαγών";
    btn.style.backgroundColor = "#f39c12"; 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteRecipe(id) {
    const result = await Swal.fire({
        title: 'Είστε σίγουροι;',
        text: "Η διαγραφή της συνταγής είναι μόνιμη!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ναι, διαγραφή!',
        cancelButtonText: 'Άκυρο'
    });

    if (!result.isConfirmed) return;

    try {
        const res = await fetch("api/delete_recipe.php", { 
            method: "POST", 
            body: JSON.stringify({ recipe_id: id }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await res.json();

        if (data.success) {
            document.getElementById("recipeManagementBox").style.display = "none";
            selectedRecipeForManagement = null;
            
            Swal.fire('Επιτυχία!', 'Η συνταγή διαγράφηκε.', 'success');
            
            loadRecipes();
        } else {
            Swal.fire('Σφάλμα', data.message || 'Κάτι πήγε στραβά.', 'error');
        }
    } catch (error) {
        Swal.fire('Σφάλμα', 'Δεν ήταν δυνατή η επικοινωνία με τον server.', 'error');
    }
}

// ============================================
// FORM SUBMISSION (ADD OR UPDATE)
// ============================================
const addRecipeBtn = document.getElementById("addRecipeBtn");
if (addRecipeBtn) {
  addRecipeBtn.addEventListener("click", async () => {
      const title = document.getElementById("titleInput").value;
      const desc = document.getElementById("descInput").value;
      const category = document.getElementById("categoryInput").value;
      const ingredients = document.getElementById("ingredientsInput").value;
      const instructions = document.getElementById("instructionsInput").value;
      
      if (!title || !desc || !ingredients || !instructions) {
          Swal.fire("Προσοχή", "Συμπληρώστε όλα τα πεδία!", "warning");
          return;
      }

      if (currentEditId) {
          const response = await fetch("api/edit_recipe.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ recipe_id: currentEditId, title, description: desc, category, ingredients, instructions })
          });
          const data = await response.json();
          if(data.success) {
              Swal.fire("Επιτυχία!", "Η συνταγή ενημερώθηκε.", "success");
              currentEditId = null;
              
              const btn = document.getElementById("addRecipeBtn");
              btn.innerText = "Ανέβασμα Συνταγής";
              btn.style.backgroundColor = ""; 
              
              document.getElementById("recipeManagementBox").style.display = "none";
              selectedRecipeForManagement = null;
              
              clearForm();
              loadRecipes();
          }
      } else {
          let formData = new FormData();
          formData.append("title", title);
          formData.append("description", desc);
          formData.append("category", category);
          formData.append("ingredients", ingredients);
          formData.append("instructions", instructions);
          const img = document.getElementById("imageInput").files[0];
          if (img) formData.append("image", img);

          const response = await fetch("api/add_recipes.php", { method: "POST", body: formData });
          const data = await response.json();
          if(data.success) {
              Swal.fire("Τέλεια!", "Η συνταγή ανέβηκε!", "success");
              clearForm();
              loadRecipes();
          }
      }
  });
}

function clearForm() {
    if(document.getElementById("titleInput")) document.getElementById("titleInput").value = "";
    if(document.getElementById("descInput")) document.getElementById("descInput").value = "";
    if(document.getElementById("categoryInput")) document.getElementById("categoryInput").value = "Κυρίως Πιάτα";
    if(document.getElementById("ingredientsInput")) document.getElementById("ingredientsInput").value = "";
    if(document.getElementById("instructionsInput")) document.getElementById("instructionsInput").value = "";
    if(document.getElementById("imageInput")) document.getElementById("imageInput").value = "";
}

// ============================================
// OTHER ACTIONS (Like, Comment, Auth)
// ============================================
async function sendLike(id) {
    const res = await fetch("api/like.php", { method: "POST", body: JSON.stringify({ recipe_id: id }) });
    const data = await res.json();
    if (data.success) loadRecipes(); else Swal.fire("Προσοχή", data.message, "warning");
}

async function sendComment(id) {
    const text = document.getElementById(`commentInput_${id}`).value;
    if (!text) return;
    const res = await fetch("api/add_comment.php", { method: "POST", body: JSON.stringify({ recipe_id: id, comment_text: text }) });
    if ((await res.json()).success) loadRecipes();
}

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
      const user = document.getElementById("usernameInput").value;
      const pass = document.getElementById("passwordInput").value;
      const res = await fetch("api/login.php", { method: "POST", body: JSON.stringify({ username: user, password: pass }) });
      const data = await res.json();
      if (data.success) { checkAuthStatus(); } else { Swal.fire("Σφάλμα", data.message, "error"); }
  });
}

const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
      const user = document.getElementById("usernameInput").value;
      const email = document.getElementById("emailInput").value;
      const pass = document.getElementById("passwordInput").value;
      const bio = document.getElementById("bioInput").value; 

      if (!user || !email || !pass) {
          Swal.fire("Προσοχή", "Παρακαλώ συμπληρώστε Username, Email και Κωδικό!", "warning");
          return;
      }

      const res = await fetch("api/register.php", { 
          method: "POST", 
          body: JSON.stringify({ username: user, email, password: pass, bio: bio }) 
      });
      
      const data = await res.json();
      if (data.success) {
          Swal.fire("Επιτυχία", "Εγγραήκατε επιτυχώς! Τώρα μπορείτε να συνδεθείτε.", "success");
          document.getElementById("usernameInput").value = "";
          document.getElementById("emailInput").value = "";
          document.getElementById("passwordInput").value = "";
          document.getElementById("bioInput").value = "";
      } else {
          Swal.fire("Σφάλμα", data.message, "error");
      }
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
      await fetch("api/logout.php");
      checkAuthStatus();
  });
}

if (document.getElementById("searchInput")) document.getElementById("searchInput").addEventListener("input", updateDisplay);
if (document.getElementById("categoryFilter")) {
  document.getElementById("categoryFilter").addEventListener("change", () => {
      currentPage = 1; 
      updateDisplay();
  });
}
if (document.getElementById("prevPageBtn")) document.getElementById("prevPageBtn").addEventListener("click", () => { currentPage--; updateDisplay(); });
if (document.getElementById("nextPageBtn")) document.getElementById("nextPageBtn").addEventListener("click", () => { currentPage++; updateDisplay(); });

checkAuthStatus();