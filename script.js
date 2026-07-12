const firebaseConfig = {
  apiKey: "AIzaSyCqfKoF0x5dkdsj83_lczbsm8tLQN3hzyQ",
  authDomain: "owners-login.firebaseapp.com",
  projectId: "owners-login",
  storageBucket: "owners-login.firebasestorage.app",
  messagingSenderId: "860477366916",
  appId: "1:860477366916:web:5a92f334a5b3a22c2e98d1",
  measurementId: "G-MP2N6KGMPT"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function backHome() {
  showPage("home");
}

const properties = {
  "ルミナス・スターズ": {
    image:
      "https://mypage02345.github.io/OwnersPortal/images/construction/cards/luminous-stars.JPG",
    address: "長野県 塩尻市広丘原新田 ２０６番地１３",
    owner: "小松 宗夫",

    contract: "フルパッケージ",
    office: "松本",
    staff: "鈴木  康治",
    inspectionDate: "2026/06/17",
    cleaningDate: "2026/07/08",
    contractDate: "2025/02/20",
    completion: "2026/01/31",
    totalBuildings: "",
    totalUnits: "8戸",
    occupiedUnits: "7戸",
    moveOut: "1戸",
    futureOccupied: "7戸",
    futureRate: "87.5%"
  },

  小松住宅: {
    image:
      "https://mypage02345.github.io/OwnersPortal/images/construction/cards/komatsu.JPG",
    address: "長野県 塩尻市広丘原新田 ２０６番地１",
    owner: "小松 宗夫",

    contract: "自主管理/一部不動産仲介",
    office: "-",
    staff: "小松　泰輝",
    salesstaff: "-",
    inspectionDate: "2026/07/11",
    cleaningDate: "2026/06/30",
    contractDate: "-",
    completion: "1982/10/11",
    totalBuildings: "4棟",
    totalUnits: "4棟",
    occupiedUnits: "3棟",
    moveOut: "1棟",
    futureOccupied: "3棟",
    futureRate: "87.5%"
  }
};

function getBuildingAge(completionDate) {
  const built = new Date(completionDate);
  if (Number.isNaN(built.getTime())) {
    return "-";
  }

  const today = new Date();
  let years = today.getFullYear() - built.getFullYear();
  let months = today.getMonth() - built.getMonth();

  if (today.getDate() < built.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `築${years}年${months}か月`;
}

function showDetail(name) {
  const item = properties[name];

  if (!item) return;

  hideAllPages();

  document.getElementById("detail").classList.add("active");

  document.getElementById("buildingName").textContent = name;
  document.getElementById("contract").textContent = item.contract;
  document.getElementById("office").textContent = item.office;
  document.getElementById("staff").textContent = item.staff;

  document.getElementById("inspectionDate").textContent =
    item.inspectionDate || "未登録";
  document.getElementById("cleaningDate").textContent =
    item.cleaningDate || "未登録";
  document.getElementById("contractDate").textContent = item.contractDate;
  document.getElementById("completion").textContent = item.completion;
  document.getElementById("age").textContent = getBuildingAge(item.completion);

  document.getElementById("totalBuildings").textContent = item.totalBuildings;
  document.getElementById("occupiedUnits").textContent = item.occupiedUnits;

  const occupancyRate = item.occupancyRate
    ? item.occupancyRate
    : calcOccupancyRate(
        item.totalBuildings || item.totalUnits,
        item.occupiedUnits
      );
  document.getElementById("occupancyRate").textContent = occupancyRate;
  document.getElementById("moveOut").textContent = item.moveOut;
  document.getElementById("futureOccupied").textContent = item.futureOccupied;
  document.getElementById("futureRate").textContent = item.futureRate;

  const totalBuildingsRow = document.getElementById("totalBuildingsRow");

  if (name === "ルミナス・スターズ") {
    totalBuildingsRow.style.display = "none";
  } else {
    totalBuildingsRow.style.display = "";
  }

  const historyButton = document.getElementById("historyButton");

  if (name === "ルミナス・スターズ") {
    historyButton.style.display = "";
  } else {
    historyButton.style.display = "none";
  }
}

function login() {
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  auth
    .signInWithEmailAndPassword(email, password)

    .then(() => {
      localStorage.setItem("loggedIn", "true");
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("portal").style.display = "block";

      backHome();

      resetLogoutTimer();
    })

    .catch((error) => {
      alert("ログイン失敗\n" + error.message);
    });
}

function logout() {
  const result = confirm("ログアウトしてもよろしいですか？");

  if (!result) {
    return;
  }

  auth.signOut();

  document.getElementById("portal").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
}

function resetLogoutTimer() {
  // 現在はタイマーを使わないので、空の実装です。
}

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  document.querySelectorAll(".auto-date").forEach((box) => {
    box.textContent = `${month}月${day}日現在の最新情報を表示しています。`;
  });

  createHomeCards();

  loadHistory();

  if (localStorage.getItem("loggedIn") === "true") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("portal").style.display = "block";

    backHome();
  } else {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("portal").style.display = "none";

    loadNotices();
  }

  normalizeNoticeButton();
});

function togglePassword() {
  const password = document.getElementById("password");

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

// 下部のお知らせボタンを他のボタンと同じスタイル／挙動に揃える
function normalizeNoticeButton() {
  const selectors = [
    "#noticeButton",
    "#noticeBtn",
    ".notice-button",
    "#bottomNotice",
    "#bottomNoticeBtn",
    "#openNoticeButton"
  ];

  selectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;

    el.classList.add("recruit-btn");

    el.onclick = (e) => {
      e.stopPropagation();
      showPage("noticeListPage");
    };

    if (!el.textContent.trim()) el.textContent = "お知らせ";
  });
}

function loadUserProfile(user) {
  const candidateCollections = ["kk-4365 User", "tk-0814 User"];

  candidateCollections.forEach((collectionName) => {
    db.collection(collectionName)
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (!doc.exists) return;

        const data = doc.data();
        if (!data) return;

        document.getElementById("ownerName").textContent = data.Name + " 様";
        document.getElementById("ownerRole").textContent = data.Role;
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  console.log("UID:", user.uid);
  loadUserProfile(user);
});

function createHomeCards() {
  const container = document.getElementById("propertyContainer");
  if (!container) return;

  container.innerHTML = "";

  Object.keys(properties).forEach((name) => {
    const item = properties[name];

    const card = document.createElement("div");
    card.className = "property-card";

    card.innerHTML = `

      <h3 class="card-title">${name}</h3>

      <div class="card-content">

        <div class="card-image">
          <img src="${item.image}">
        </div>

        <div class="card-info">

          <div class="card-button-area">

            <button class="recruit-btn"
              onclick="event.stopPropagation();
              ${
                name === "ルミナス・スターズ"
                  ? "showPage('building-status')"
                  : "showPage('komatsu-status')"
              }">
              入居募集状況
            </button>

            ${
              name === "ルミナス・スターズ"
                ? `
                <button class="history-btn"
                onclick="event.stopPropagation();showPage('photo-menu')">
                建物に関する写真
                </button>
                `
                : ""
            }

            ${
              name === "小松住宅"
                ? `
                <button class="repair-btn"
               onclick="event.stopPropagation();
showPage('repair-status');
loadRepair();">
修繕工事の状況
</button>
                `
                : ""
            }

          </div>

          <table class="card-table">

            <tr>
              <th>所在地</th>
              <td>${item.address}</td>
            </tr>

            <tr>
              <th>ご契約者様</th>
              <td>${item.owner}</td>
            </tr>

            <tr>
              <th>契約形態</th>
              <td>${item.contract}</td>
            </tr>

            <tr>
              <th>管理営業所</th>
              <td>${item.office}</td>
            </tr>

            <tr>
              <th>担当者</th>
              <td>${item.staff}</td>
            </tr>

            <tr>
              <th>点検実施日</th>
              <td>${item.inspectionDate || "-"}</td>
            </tr>

            <tr>
              <th>清掃実施日</th>
              <td>${item.cleaningDate || "-"}</td>
            </tr>

          </table>

        </div>

      </div>

      <div class="summary-table">

        <div class="summary-head">契約日</div>
        <div class="summary-head">完工日</div>
        <div class="summary-head">築年数</div>

        <div class="summary-value">${item.contractDate}</div>
        <div class="summary-value">${item.completion}</div>
        <div class="summary-value">${getBuildingAge(item.completion)}</div>

        <div class="summary-head">
          ${name === "小松住宅" ? "総棟数" : "戸数"}
        </div>

        <div class="summary-head">
          ${name === "小松住宅" ? "入居棟数" : "入居戸数"}
        </div>

        <div class="summary-head">入居率</div>

        <div class="summary-value">
          ${item.totalBuildings || item.totalUnits}
        </div>

        <div class="summary-value">
          ${item.occupiedUnits}
        </div>

        <div class="summary-value">
          ${calcOccupancyRate(
            item.totalBuildings || item.totalUnits,
            item.occupiedUnits
          )}
        </div>

      </div>

    `;

    container.appendChild(card);
  });
}

//https://docs.google.com/spreadsheets/d/e/2PACX-1vT9P-7ACLUYEm4nSO5C41hW1uCC90zcJ72KsxWWmL8qNkXmBY_sgFPe3QS9ht6TEQizOhJ1CZvkhZ0L/pub?output=csv

function showPage(pageId) {
  document.getElementById("loadingOverlay").style.display = "flex";

  setTimeout(async () => {
    await loadNotices();

    hideAllPages();

    const page = document.getElementById(pageId);

    if (page) {
      page.classList.add("active");
    }

    // ★追加
    if (pageId === "buildingInfo") {
      createHomeCards();
    }

    document.getElementById("loadingOverlay").style.display = "none";
  }, 500);
}

// ===== 建物完成までの歩み =====

// 画像一覧
const historyImages = [];

for (let i = 113; i <= 130; i++) {
  historyImages.push(
    `https://mypage02345.github.io/OwnersPortal/images/construction/IMG_0${i}.jpg`
  );
}

let historyIndex = 0;
let slideTimer = null;

// 初期表示
function loadHistory() {
  const main = document.getElementById("mainHistoryImage");
  const list = document.getElementById("historyList");

  if (!main || !list) return;

  historyIndex = 0;
  main.src = historyImages[0];

  list.innerHTML = "";

  historyImages.forEach((img, index) => {
    list.innerHTML += `
      <div class="history-thumb" onclick="showHistory(${index})">
        <div style="width:30px;text-align:center;">${index + 1}</div>
        <img src="${img}" alt="工事写真 ${index + 1}">
      </div>
    `;
  });
}

function showHistory(index) {
  historyIndex = index;
  document.getElementById("mainHistoryImage").src = historyImages[index];
}

function nextHistory() {
  historyIndex++;

  if (historyIndex >= historyImages.length) {
    historyIndex = 0;
  }

  showHistory(historyIndex);
}

function prevHistory() {
  historyIndex--;

  if (historyIndex < 0) {
    historyIndex = historyImages.length - 1;
  }

  showHistory(historyIndex);
}

function openHistoryImage() {
  document.getElementById("imageModal").style.display = "block";

  document.getElementById("modalImage").src = historyImages[historyIndex];
}

function toggleSlide() {
  if (slideTimer) {
    clearInterval(slideTimer);
    slideTimer = null;
    return;
  }

  slideTimer = setInterval(nextHistory, 3000);
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function nextModal() {
  nextHistory();

  document.getElementById("modalImage").src = historyImages[historyIndex];
}

function prevModal() {
  prevHistory();
  document.getElementById("modalImage").src = historyImages[historyIndex];
}

function hideAllPages() {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
    page.scrollTop = 0;
  });

  window.scrollTo(0, 0);
}

function openNotice(title, date, body) {
  showPage("noticeDetailPage");

  document.getElementById("detailTitle").textContent = title;
  document.getElementById("detailDate").textContent = date;
  document.getElementById("detailBody").innerHTML = body;
}

function backNoticeList() {
  showPage("noticeListPage");
}

function loadNoticeCount(count) {
  const badge = document.getElementById("noticeCount");
  if (!badge) return;

  if (count > 0) {
    badge.style.display = "flex";
    badge.textContent = count;
  } else {
    badge.style.display = "none";
  }
}

function calcOccupancyRate(total, occupied) {
  const totalNum = parseInt(total);
  const occupiedNum = parseInt(occupied);

  if (isNaN(totalNum) || totalNum === 0) {
    return "0%";
  }

  return ((occupiedNum / totalNum) * 100).toFixed(1).replace(".0", "") + "%";
}

async function loadNotices() {
  const list = document.getElementById("noticeList");
  if (!list) return;

  list.innerHTML = "読み込み中...";

  try {
    const url =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9P-7ACLUYEm4nSO5C41hW1uCC90zcJ72KsxWWmL8qNkXmBY_sgFPe3QS9ht6TEQizOhJ1CZvkhZ0L/pub?output=csv";

    const res = await fetch(url);
    const text = await res.text();

    const rows = text.trim().split("\n").slice(1).reverse();

    list.innerHTML = "";

    loadNoticeCount(rows.length);

    rows.forEach((row) => {
      const cols = row.split(",");

      const date = cols[4] || "";
      const title = cols[1] || "";
      const body = cols[2] || "";
      const file = cols[5] || ""; // 添付ファイル列

      const pdfIcon = file ? "📄" : "";

      const item = document.createElement("div");
      item.className = "notice-item";

      item.innerHTML = `
    <div class="notice-date">
      ${date} ${pdfIcon}
    </div>

    <div class="notice-title">
      ${title}
    </div>
  `;

      item.onclick = () => openNotice(title, date, body, file);

      list.appendChild(item);
    });
  } catch (e) {
    console.error(e);
    list.innerHTML = "読み込みに失敗しました。";
  }
}

function openPhotoMenu() {
  document.getElementById("photo-menu").style.display = "flex";
}

function closePhotoMenu() {
  document.getElementById("photo-menu").style.display = "none";
}

async function loadRepair() {
  const tbody = document.getElementById("repairTable");
  tbody.innerHTML = "";

  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLlA4QT08WxplwL7WcuiJ9RRO2YA-_dcw-h1UDYvMBKolzNzUE0RG5ia1SvhF9H5R_phnIgOHhE8ik/pub?output=csv";

  const res = await fetch(url);
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1);

  rows.reverse().forEach((row) => {
    const c = row.split(",");

    tbody.innerHTML += `
      <tr>
        <td>${c[2]}</td>
        <td>${c[3]}</td>
        <td>${c[4]}</td>
        <td>${c[5]}</td>
        <td>${c[6]}</td>
        <td>${c[7]}</td>
        <td>${c[8]}</td>
      </tr>
    `;
  });
}