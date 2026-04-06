// 初始化
const app = cloudbase.init({
  env: window.APP_CONFIG.envId,
  region: "ap-shanghai",
  accessKey: window.APP_CONFIG.accessKey
});

const db = app.database();

// 登录
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await db.collection("users")
    .where({
      username: username,
      password: password
    })
    .get();

  if (res.data.length === 0) {
    document.getElementById("msg").innerText = "登录失败";
    return;
  }

  const user = res.data[0];

  localStorage.setItem("user", JSON.stringify(user));

  if (user.role === "admin") {
    location.href = "/admin.html";
  } else {
    location.href = "/user.html";
  }
}

// 用户页加载商品
async function loadProducts() {
  const res = await db.collection("products").get();

  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = res.data.map(p => `
    <div>
      <img src="${p.image_url}" width="150"><br>
      ${p.name} - ￥${p.price}
    </div>
  `).join("");
}

// 自动执行
loadProducts();
